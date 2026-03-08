import { NextRequest, NextResponse } from 'next/server'
import { getMobileUser } from '@/lib/mobile-auth'
import { createServiceSupabase } from '@/lib/supabase/server'

// ── Mock fallback ──────────────────────────────────────────────────────────────

function mockHistory() {
  return {
    appointments: [
      {
        id: 'mock-h-1',
        date: '2025-09-15',
        time: '10:00 AM',
        serviceName: 'Cleaning & Exam',
        status: 'completed' as const,
        price: 15000,
        providerName: 'Dr. Alex Kovalenko',
        notes: null,
      },
      {
        id: 'mock-h-2',
        date: '2025-03-12',
        time: '2:00 PM',
        serviceName: 'Cleaning & Exam',
        status: 'completed' as const,
        price: 15000,
        providerName: 'Dr. Alex Kovalenko',
        notes: null,
      },
      {
        id: 'mock-h-3',
        date: '2026-04-20',
        time: '9:30 AM',
        serviceName: 'Composite Filling',
        status: 'upcoming' as const,
        price: 28000,
        providerName: 'Dr. Alex Kovalenko',
        notes: null,
      },
    ],
    total: 3,
  }
}

function mapStatus(dbStatus: string): 'upcoming' | 'completed' | 'cancelled' | 'no_show' {
  switch (dbStatus) {
    case 'scheduled':
    case 'confirmed':
    case 'checked_in':
    case 'in_progress':
      return 'upcoming'
    case 'completed':
      return 'completed'
    case 'no_show':
      return 'no_show'
    case 'cancelled':
    case 'rescheduled':
      return 'cancelled'
    default:
      return 'upcoming'
  }
}

function formatTime12h(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function dollarsToCents(val: number | null | undefined): number {
  if (val == null) return 0
  return Math.round(val * 100)
}

// ── GET /api/mobile/history ────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const user = await getMobileUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(mockHistory())
  }

  const supabase = createServiceSupabase()

  const { data: patient } = await supabase
    .from('oe_patients')
    .select('id')
    .eq('clerk_user_id', user.userId)
    .limit(1)
    .maybeSingle()

  if (!patient) {
    return NextResponse.json({ appointments: [], total: 0 })
  }

  const { data: appts } = await supabase
    .from('oe_appointments')
    .select(`
      id, appointment_date, appointment_time, type, status, price, notes,
      oe_providers!provider_id(first_name, last_name)
    `)
    .eq('patient_id', patient.id)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false })
    .limit(50)

  type ProviderRow = { first_name: string; last_name: string }

  const appointments = (appts ?? []).map((a) => {
    const providerRow = (a as Record<string, unknown>).oe_providers as ProviderRow | null
    return {
      id: a.id,
      date: a.appointment_date,
      time: formatTime12h(String(a.appointment_time)),
      serviceName: a.type,
      status: mapStatus(a.status),
      price: dollarsToCents(a.price),
      providerName: providerRow ? `Dr. ${providerRow.first_name} ${providerRow.last_name}` : undefined,
      notes: a.notes ?? undefined,
    }
  })

  return NextResponse.json({ appointments, total: appointments.length })
}

import { NextRequest, NextResponse } from 'next/server'
import { getMobileUser } from '@/lib/mobile-auth'
import { createServiceSupabase } from '@/lib/supabase/server'
import { addMonths, format } from 'date-fns'

// ── Mock data fallback ─────────────────────────────────────────────────────────

function mockDashboard() {
  const today = new Date()
  return {
    greeting: `Good ${getTimeOfDay()}, Patient`,
    nextAppointment: {
      id: 'mock-appt-1',
      date: format(addMonths(today, 0), 'yyyy-MM-dd'),
      time: '10:30 AM',
      type: 'Cleaning & Exam',
      providerName: 'Dr. Alex Kovalenko',
      durationMinutes: 50,
      isToday: false,
    },
    treatmentPlan: {
      id: 'mock-plan-1',
      title: 'Recommended Treatment Plan',
      status: 'presented',
      aiSummary: 'Your treatment plan includes a comprehensive cleaning, two composite fillings, and a crown consultation. Total out-of-pocket estimated at $400 after insurance.',
      totalCost: 124000,
      insuranceEstimate: 84000,
      patientEstimate: 40000,
      procedureCount: 3,
      procedures: [
        { code: 'D0150', description: 'Comprehensive Oral Evaluation', patientCost: 0, status: 'included' },
        { code: 'D2391', description: 'Composite Filling, 1 Surface', patientCost: 18000, status: 'pending' },
        { code: 'D2750', description: 'Crown – Porcelain Fused to Metal', patientCost: 22000, status: 'pending' },
      ],
    },
    stats: {
      totalVisits: 4,
      lastVisit: format(addMonths(today, -6), 'yyyy-MM-dd'),
      nextRecall: format(addMonths(today, 6), 'yyyy-MM-dd'),
    },
  }
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function dollarsToCents(val: number | null | undefined): number {
  if (val == null) return 0
  return Math.round(val * 100)
}

function formatTime12h(timeStr: string): string {
  // timeStr is HH:MM:SS or HH:MM
  const [hStr, mStr] = timeStr.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

// ── GET /api/mobile/dashboard ──────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const user = await getMobileUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(mockDashboard())
  }

  const supabase = createServiceSupabase()

  // Look up patient by Clerk user ID (we store the user's email via Clerk)
  // First get email from Clerk token sub — we'll query by matching email
  // Patients are matched by user email stored in oe_patients.email
  // We need to get the user email. Since we only have userId from token,
  // we query patients by clerk_user_id if column exists, else by email from Clerk API.
  // Pattern: store clerk_user_id on patient record. Fall back to email match.
  const { data: patient } = await supabase
    .from('oe_patients')
    .select('id, first_name, last_name, email, created_at, last_visit')
    .or(`clerk_user_id.eq.${user.userId}`)
    .limit(1)
    .maybeSingle()

  if (!patient) {
    // Return greeting without patient data
    return NextResponse.json({
      greeting: `Good ${getTimeOfDay()}`,
      nextAppointment: null,
      treatmentPlan: null,
      stats: { totalVisits: 0, lastVisit: null, nextRecall: null },
    })
  }

  const today = new Date().toISOString().split('T')[0]

  // Next upcoming appointment
  const { data: nextAppt } = await supabase
    .from('oe_appointments')
    .select(`
      id, appointment_date, appointment_time, duration_minutes, type, provider_name,
      oe_providers!provider_id(first_name, last_name)
    `)
    .eq('patient_id', patient.id)
    .in('status', ['scheduled', 'confirmed'])
    .gte('appointment_date', today)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })
    .limit(1)
    .maybeSingle()

  // Active treatment plan
  const { data: plan } = await supabase
    .from('oe_treatment_plans')
    .select('id, title, status, ai_summary, total_cost, insurance_estimate, patient_estimate, procedures, created_at')
    .eq('patient_id', patient.id)
    .not('status', 'in', '("completed","declined")')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Mark plan viewed as side-effect
  if (plan) {
    await supabase
      .from('oe_treatment_plans')
      .update({ patient_viewed: true, patient_viewed_at: new Date().toISOString() })
      .eq('id', plan.id)
  }

  // Stats — completed appointments
  const { data: completedAppts } = await supabase
    .from('oe_appointments')
    .select('appointment_date, type')
    .eq('patient_id', patient.id)
    .eq('status', 'completed')
    .order('appointment_date', { ascending: false })

  const totalVisits = completedAppts?.length ?? 0
  const lastVisitDate = completedAppts?.[0]?.appointment_date ?? null

  // Recall: 6 months from last cleaning-type appointment
  const lastCleaning = completedAppts?.find(a =>
    /clean|exam|prophylaxis|prophy|recall/i.test(a.type ?? '')
  )
  const nextRecall = lastCleaning
    ? format(addMonths(new Date(lastCleaning.appointment_date), 6), 'yyyy-MM-dd')
    : null

  // Build provider name
  type ProviderRow = { first_name: string; last_name: string }
  const providerRow = nextAppt
    ? ((nextAppt as Record<string, unknown>).oe_providers as ProviderRow | null)
    : null
  const providerName = providerRow
    ? `Dr. ${providerRow.first_name} ${providerRow.last_name}`
    : (nextAppt?.provider_name ?? 'Your Provider')

  // Build procedures from JSONB
  type ProcedureRow = {
    code?: string
    description?: string
    patient_cost?: number
    patientCost?: number
    status?: string
  }
  const procedures: ProcedureRow[] = Array.isArray(plan?.procedures) ? plan.procedures : []
  const mappedProcedures = procedures.map((p) => ({
    code: p.code ?? '',
    description: p.description ?? '',
    patientCost: dollarsToCents(p.patient_cost ?? p.patientCost),
    status: p.status ?? 'pending',
  }))

  return NextResponse.json({
    greeting: `Good ${getTimeOfDay()}, ${patient.first_name}`,
    nextAppointment: nextAppt
      ? {
          id: nextAppt.id,
          date: nextAppt.appointment_date,
          time: formatTime12h(String(nextAppt.appointment_time)),
          type: nextAppt.type,
          providerName,
          durationMinutes: nextAppt.duration_minutes ?? 60,
          isToday: nextAppt.appointment_date === today,
        }
      : null,
    treatmentPlan: plan
      ? {
          id: plan.id,
          title: plan.title ?? 'Treatment Plan',
          status: plan.status,
          aiSummary: plan.ai_summary ?? '',
          totalCost: dollarsToCents(plan.total_cost),
          insuranceEstimate: dollarsToCents(plan.insurance_estimate),
          patientEstimate: dollarsToCents(plan.patient_estimate),
          procedureCount: mappedProcedures.length,
          procedures: mappedProcedures,
        }
      : null,
    stats: {
      totalVisits,
      lastVisit: lastVisitDate ?? null,
      nextRecall,
    },
  })
}

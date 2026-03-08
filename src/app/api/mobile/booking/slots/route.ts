import { NextRequest, NextResponse } from 'next/server'
import { getMobileUser } from '@/lib/mobile-auth'
import { createServiceSupabase } from '@/lib/supabase/server'
import { generateSlots } from '@/lib/scheduling/slots'
import { removeConflictingSlots } from '@/lib/scheduling/conflicts'
import { format, parse } from 'date-fns'

// ── Fallback slots (every 30 min, 8 AM–5 PM) ──────────────────────────────────

function buildFallbackSlots(date: string) {
  const slots = []
  for (let mins = 480; mins < 1020; mins += 30) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 === 0 ? 12 : h % 12
    const time = `${h12}:${String(m).padStart(2, '0')} ${ampm}`
    slots.push({ date, time, available: true })
  }
  return slots
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

// ── GET /api/mobile/booking/slots ─────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const user = await getMobileUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') ?? format(new Date(), 'yyyy-MM-dd')

  // Mock fallback
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({
      services: [
        { id: 'mock-1', name: 'Cleaning & Exam', description: 'Routine cleaning and comprehensive exam', duration: 50, price: 15000 },
        { id: 'mock-2', name: 'Composite Filling', description: 'Tooth-colored composite resin filling', duration: 60, price: 28000 },
        { id: 'mock-3', name: 'Crown Consultation', description: 'Consultation for dental crown', duration: 30, price: 0 },
      ],
      slots: buildFallbackSlots(date),
    })
  }

  const supabase = createServiceSupabase()

  // Services
  const { data: apptTypes } = await supabase
    .from('oe_appointment_types')
    .select('id, name, description, duration_minutes, default_fee')
    .eq('online_bookable', true)
    .eq('active', true)
    .order('sort_order', { ascending: true })

  const services = (apptTypes ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description ?? undefined,
    duration: t.duration_minutes,
    price: dollarsToCents(t.default_fee),
  }))

  // Slots — try scheduling lib with providers
  try {
    const { data: providers } = await supabase
      .from('oe_providers')
      .select('id, first_name, last_name')
      .eq('is_active', true)
      .limit(10)

    if (!providers?.length) throw new Error('no providers')

    // Get availability for this day of week
    const dayOfWeek = new Date(date + 'T12:00:00').getDay()
    const { data: availability } = await supabase
      .from('oe_provider_availability')
      .select('provider_id, start_time, end_time')
      .in('provider_id', providers.map((p) => p.id))
      .eq('day_of_week', dayOfWeek)
      .eq('is_available', true)

    if (!availability?.length) throw new Error('no availability')

    // Existing bookings for conflict check
    const { data: existingBookings } = await supabase
      .from('oe_appointments')
      .select('start_time, end_time, provider_id')
      .eq('appointment_date', date)
      .in('status', ['scheduled', 'confirmed', 'checked_in', 'in_progress'])
      .not('start_time', 'is', null)

    // Use first appointment type duration for slot generation (or 60 min default)
    const duration = apptTypes?.[0]?.duration_minutes ?? 60

    const allSlots: ReturnType<typeof generateSlots> = []
    for (const avail of availability) {
      const provider = providers.find((p) => p.id === avail.provider_id)
      if (!provider) continue
      const generated = generateSlots({
        date,
        startTime: avail.start_time.slice(0, 5),
        endTime: avail.end_time.slice(0, 5),
        duration,
        buffer: 0,
        increment: 30,
        providerId: avail.provider_id,
        providerName: `Dr. ${provider.first_name} ${provider.last_name}`,
      })
      allSlots.push(...generated)
    }

    type Booking = { start: string; end: string; provider_id: string }
    const bookings: Booking[] = (existingBookings ?? [])
      .filter((b) => b.start_time && b.end_time)
      .map((b) => ({ start: b.start_time as string, end: b.end_time as string, provider_id: b.provider_id as string }))

    const finalSlots = removeConflictingSlots(allSlots, bookings)

    // De-duplicate by time — if multiple providers have the same slot, keep first available
    const seen = new Set<string>()
    const dedupedSlots = finalSlots
      .filter((s) => {
        const key = s.start
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .map((s) => ({
        date,
        time: formatTime12h(format(new Date(s.start), 'HH:mm')),
        available: s.available,
        providerId: s.provider_id ?? undefined,
        providerName: s.provider_name ?? undefined,
      }))

    return NextResponse.json({ services, slots: dedupedSlots })
  } catch {
    // Fallback to every 30 min
    return NextResponse.json({ services, slots: buildFallbackSlots(date) })
  }
}

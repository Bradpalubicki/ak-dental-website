import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getMobileUser } from '@/lib/mobile-auth'
import { createServiceSupabase } from '@/lib/supabase/server'
import { checkConflicts } from '@/lib/scheduling/conflicts'
import { sendSms } from '@/lib/services/twilio'
import { normalizePhone } from '@/lib/phone'
import { format } from 'date-fns'
import type { TimeSlot } from '@/types/database'

const BodySchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  providerId: z.string().uuid().optional(),
  notes: z.string().max(500).optional(),
})

// Parse "10:30 AM" → "10:30"
function parse12hTo24h(timeStr: string): string {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return '09:00'
  let h = parseInt(match[1], 10)
  const m = parseInt(match[2], 10)
  const ampm = match[3].toUpperCase()
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// POST /api/mobile/booking/confirm
export async function POST(req: NextRequest) {
  const user = await getMobileUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
  }
  const { serviceId, date, time, providerId, notes } = parsed.data

  const supabase = createServiceSupabase()

  // Find or create patient by Clerk user ID
  let patient = await supabase
    .from('oe_patients')
    .select('id, first_name, last_name, email, phone')
    .eq('clerk_user_id', user.userId)
    .limit(1)
    .maybeSingle()
    .then((r) => r.data)

  if (!patient) {
    return NextResponse.json({ success: false, error: 'Patient profile not found. Please complete your profile.' }, { status: 404 })
  }

  // Lookup appointment type
  const { data: apptType } = await supabase
    .from('oe_appointment_types')
    .select('id, name, duration_minutes, default_fee')
    .eq('id', serviceId)
    .maybeSingle()

  if (!apptType) {
    return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 })
  }

  const time24 = parse12hTo24h(time)
  const duration = apptType.duration_minutes ?? 60
  const startISO = `${date}T${time24}:00`
  const endISO = new Date(new Date(startISO).getTime() + duration * 60 * 1000).toISOString()

  // Conflict check — query existing bookings for the slot
  const { data: existingBookings } = await supabase
    .from('oe_appointments')
    .select('start_time, end_time, provider_id')
    .eq('appointment_date', date)
    .in('status', ['scheduled', 'confirmed', 'checked_in', 'in_progress'])
    .not('start_time', 'is', null)
    .eq('provider_id', providerId ?? '00000000-0000-0000-0000-000000000000')

  const slot: TimeSlot = {
    start: startISO,
    end: endISO,
    provider_id: providerId ?? '',
    provider_name: '',
    available: true,
  }

  type Booking = { start: string; end: string; provider_id: string }
  const bookings: Booking[] = (existingBookings ?? [])
    .filter((b) => b.start_time && b.end_time)
    .map((b) => ({ start: b.start_time as string, end: b.end_time as string, provider_id: b.provider_id as string }))

  if (providerId && checkConflicts(slot, bookings)) {
    return NextResponse.json({ success: false, error: 'That time is no longer available' }, { status: 409 })
  }

  // Insert appointment
  const { data: newAppt, error: insertErr } = await supabase
    .from('oe_appointments')
    .insert({
      patient_id: patient.id,
      appointment_date: date,
      appointment_time: time24,
      duration_minutes: duration,
      type: apptType.name,
      appointment_type_id: apptType.id,
      provider_id: providerId ?? null,
      status: 'scheduled',
      price: apptType.default_fee,
      start_time: startISO,
      end_time: endISO,
      notes: notes ?? null,
      booking_source: 'mobile',
    })
    .select('id')
    .single()

  if (insertErr || !newAppt) {
    console.error('[booking/confirm] insert error:', insertErr)
    return NextResponse.json({ success: false, error: 'Failed to create appointment' }, { status: 500 })
  }

  // Twilio confirmation SMS (graceful skip if not configured)
  if (patient.phone) {
    const normalized = normalizePhone(patient.phone)
    if (normalized) {
      const friendlyDate = format(new Date(date + 'T12:00:00'), 'MMMM d, yyyy')
      await sendSms({
        to: normalized,
        body: `Your appointment at AK Ultimate Dental is confirmed for ${friendlyDate} at ${time}. Reply CANCEL to cancel.`,
        patientId: patient.id,
        skipComplianceCheck: false,
      })
    }
  }

  return NextResponse.json({ success: true, appointmentId: newAppt.id })
}

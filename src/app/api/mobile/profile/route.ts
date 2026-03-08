import { NextRequest, NextResponse } from 'next/server'
import { getMobileUser } from '@/lib/mobile-auth'
import { createServiceSupabase } from '@/lib/supabase/server'
import { clerkClient } from '@clerk/nextjs/server'

// ── GET /api/mobile/profile ────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const user = await getMobileUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({
      userId: user.userId,
      name: 'Demo Patient',
      email: 'patient@example.com',
      phone: undefined,
      dateOfBirth: undefined,
      memberSince: '2024-01-01',
      insuranceProvider: 'Delta Dental',
      insuranceMemberId: 'DD-123456',
      upcomingCount: 1,
      completedCount: 4,
      lastVisit: '2025-09-15',
    })
  }

  const supabase = createServiceSupabase()

  // Get Clerk user for email/name
  const clerk = await clerkClient()
  const clerkUser = await clerk.users.getUser(user.userId).catch(() => null)

  const { data: patient } = await supabase
    .from('oe_patients')
    .select('id, first_name, last_name, email, phone, date_of_birth, created_at, insurance_provider, insurance_member_id')
    .eq('clerk_user_id', user.userId)
    .limit(1)
    .maybeSingle()

  const email =
    patient?.email ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    ''

  const name = patient
    ? `${patient.first_name} ${patient.last_name}`.trim()
    : clerkUser
    ? `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim()
    : 'Patient'

  if (!patient) {
    return NextResponse.json({
      userId: user.userId,
      name,
      email,
      phone: undefined,
      dateOfBirth: undefined,
      memberSince: new Date().toISOString().split('T')[0],
      insuranceProvider: undefined,
      insuranceMemberId: undefined,
      upcomingCount: 0,
      completedCount: 0,
      lastVisit: null,
    })
  }

  // Appointment counts
  const { data: appts } = await supabase
    .from('oe_appointments')
    .select('status, appointment_date')
    .eq('patient_id', patient.id)

  const upcomingCount = (appts ?? []).filter((a) =>
    ['scheduled', 'confirmed', 'checked_in', 'in_progress'].includes(a.status)
  ).length

  const completedAppts = (appts ?? []).filter((a) => a.status === 'completed')
  const completedCount = completedAppts.length

  const lastVisit = completedAppts.length
    ? completedAppts.sort((a, b) => b.appointment_date.localeCompare(a.appointment_date))[0].appointment_date
    : null

  return NextResponse.json({
    userId: user.userId,
    name,
    email,
    phone: patient.phone ?? undefined,
    dateOfBirth: patient.date_of_birth ?? undefined,
    memberSince: patient.created_at?.split('T')[0] ?? new Date().toISOString().split('T')[0],
    insuranceProvider: patient.insurance_provider ?? undefined,
    insuranceMemberId: patient.insurance_member_id ?? undefined,
    upcomingCount,
    completedCount,
    lastVisit,
  })
}

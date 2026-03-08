import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getMobileUser } from '@/lib/mobile-auth'
import { createServiceSupabase } from '@/lib/supabase/server'

const BodySchema = z.object({
  planId: z.string().uuid(),
  response: z.enum(['accepted', 'declined']),
  notes: z.string().max(1000).optional(),
})

// POST /api/mobile/treatment-plan/respond
export async function POST(req: NextRequest) {
  const user = await getMobileUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
  }
  const { planId, response, notes } = parsed.data

  const supabase = createServiceSupabase()

  // Find patient by Clerk user ID
  const { data: patient } = await supabase
    .from('oe_patients')
    .select('id')
    .eq('clerk_user_id', user.userId)
    .limit(1)
    .maybeSingle()

  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
  }

  // Verify plan belongs to this patient
  const { data: plan } = await supabase
    .from('oe_treatment_plans')
    .select('id, patient_id')
    .eq('id', planId)
    .maybeSingle()

  if (!plan || plan.patient_id !== patient.id) {
    return NextResponse.json({ error: 'Treatment plan not found' }, { status: 404 })
  }

  const update: Record<string, unknown> = {
    status: response,
    updated_at: new Date().toISOString(),
  }

  if (response === 'accepted') {
    update.accepted_at = new Date().toISOString()
  } else {
    update.decline_reason = notes ?? null
  }

  const { error: updateErr } = await supabase
    .from('oe_treatment_plans')
    .update(update)
    .eq('id', planId)

  if (updateErr) {
    console.error('[treatment-plan/respond] update error:', updateErr)
    return NextResponse.json({ error: 'Failed to update treatment plan' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

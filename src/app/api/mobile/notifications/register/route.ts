import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getMobileUser } from '@/lib/mobile-auth'
import { createServiceSupabase } from '@/lib/supabase/server'

const BodySchema = z.object({
  token: z.string().min(1),
  platform: z.enum(['ios', 'android']),
  userId: z.string().min(1),
  orgId: z.string().min(1),
})

// POST /api/mobile/notifications/register
export async function POST(req: NextRequest) {
  const user = await getMobileUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
  }
  const { token, platform, userId, orgId } = parsed.data

  const supabase = createServiceSupabase()

  const { error } = await supabase
    .from('mobile_push_tokens')
    .upsert(
      { user_id: userId, org_id: orgId, push_token: token, platform, updated_at: new Date().toISOString() },
      { onConflict: 'push_token' }
    )

  if (error) {
    console.error('[notifications/register] upsert error:', error)
    return NextResponse.json({ error: 'Failed to register token' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

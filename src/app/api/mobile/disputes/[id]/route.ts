import { NextRequest, NextResponse } from 'next/server'
import { SquareClient, SquareEnvironment } from 'square'
import type { DisputeEvidence } from 'square'

async function verifyClerkJWT(token: string): Promise<boolean> {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    if (!publishableKey || publishableKey === 'pk_test_placeholder') return false
    const encoded = publishableKey.replace(/^pk_(test|live)_/, '').replace(/\$$/, '')
    let instance: string
    try { instance = atob(encoded).replace(/\$$/, '') } catch { return false }
    const jwksRes = await fetch(`https://${instance}/.well-known/jwks.json`, { next: { revalidate: 3600 } })
    if (!jwksRes.ok) return false
    const { keys } = await jwksRes.json() as { keys: (JsonWebKey & { kid?: string })[] }
    if (!keys?.length) return false
    const [headerB64] = token.split('.')
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString()) as { kid?: string }
    const jwk = keys.find(k => k.kid === header.kid) ?? keys[0]
    const cryptoKey = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    const [, payloadB64, sigB64] = token.split('.')
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, Buffer.from(sigB64, 'base64url'), new TextEncoder().encode(`${headerB64}.${payloadB64}`))
    if (!valid) return false
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as { exp?: number }
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch { return false }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const valid = await verifyClerkJWT(auth.slice(7))
  if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!process.env.SQUARE_ACCESS_TOKEN) return NextResponse.json({ error: 'Disputes not configured' }, { status: 503 })

  const { id } = await params

  try {
    const client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN!,
      environment: process.env.SQUARE_ENVIRONMENT === 'production'
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
    })

    const [disputeRes, evidencePage] = await Promise.all([
      client.disputes.get({ disputeId: id }),
      client.disputes.evidence.list({ disputeId: id }),
    ])

    const d = disputeRes.dispute
    if (!d) return NextResponse.json({ error: 'Dispute not found' }, { status: 404 })

    const evidence: DisputeEvidence[] = []
    for await (const ev of evidencePage) {
      evidence.push(ev)
    }

    return NextResponse.json({
      id: d.id,
      state: d.state,
      reason: d.reason,
      amountCents: Number(d.amountMoney?.amount ?? 0),
      currency: d.amountMoney?.currency ?? 'USD',
      dueAt: d.dueAt ?? null,
      reportedAt: d.reportedAt ?? d.createdAt ?? '',
      paymentId: d.disputedPayment?.paymentId ?? '',
      cardBrand: d.cardBrand ?? null,
      evidence: evidence.map(ev => ({
        id: ev.id ?? '',
        evidenceType: ev.evidenceType ?? 'GENERIC_EVIDENCE',
        uploadedAt: ev.uploadedAt ?? '',
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load dispute' }, { status: 500 })
  }
}

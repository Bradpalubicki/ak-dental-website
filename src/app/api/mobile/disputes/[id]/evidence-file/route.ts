import { NextRequest, NextResponse } from 'next/server'
import { SquareClient, SquareEnvironment } from 'square'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/tiff', 'image/heic', 'image/heif', 'application/pdf']
const MAX_BYTES = 10 * 1024 * 1024

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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const valid = await verifyClerkJWT(auth.slice(7))
  if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!process.env.SQUARE_ACCESS_TOKEN) return NextResponse.json({ error: 'Disputes not configured' }, { status: 503 })

  const { id } = await params

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed. Use JPEG, PNG, PDF, or TIFF.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
    }

    const client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN!,
      environment: process.env.SQUARE_ENVIRONMENT === 'production'
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
    })

    await client.disputes.createEvidenceFile({
      disputeId: id,
      imageFile: new Blob([await file.arrayBuffer()], { type: file.type }),
    })

    return NextResponse.json({ success: true, disputeId: id })
  } catch {
    return NextResponse.json({ error: 'Failed to upload evidence file' }, { status: 500 })
  }
}

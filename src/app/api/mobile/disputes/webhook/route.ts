import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Square webhook signature verification
function verifySquareSignature(body: string, signature: string, key: string, url: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', key)
    hmac.update(url + body)
    const expected = hmac.digest('base64')
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-square-hmacsha256-signature') ?? ''
  const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY

  if (sigKey) {
    const url = req.url
    const valid = verifySquareSignature(body, signature, sigKey, url)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  try {
    const event = JSON.parse(body) as {
      type: string
      data?: { object?: { dispute?: { id?: string; state?: string } } }
    }

    // Handle relevant dispute events
    switch (event.type) {
      case 'dispute.created':
      case 'dispute.state.updated': {
        const dispute = event.data?.object?.dispute
        if (dispute?.id) {
          // Future: trigger push notification to mobile app operators
          // For now: log and acknowledge
        }
        break
      }
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch {
    // Always return 200 to Square so it doesn't retry
    return NextResponse.json({ received: true })
  }
}

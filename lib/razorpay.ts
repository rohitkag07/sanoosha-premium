import crypto from 'crypto'

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'

export async function createRazorpayOrder(amount: number, currency = 'INR'): Promise<any> {
  const keyId = process.env.RAZORPAY_KEY_ID
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !secret) {
    throw new Error('Razorpay credentials are not configured.')
  }

  const response = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
      payment_capture: 1,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Razorpay order creation failed: ${text}`)
  }

  return response.json()
}

export function verifyRazorpaySignature(payload: string, signature: string, secret: string) {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex') === signature
}

import { NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'Razorpay secret not configured' }, { status: 500 })
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`
    const isValid = verifyRazorpaySignature(payload, razorpay_signature, secret)

    return NextResponse.json({ valid: isValid })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

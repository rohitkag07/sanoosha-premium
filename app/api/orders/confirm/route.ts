import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shipping_address,
      total_amount,
    } = body

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !Array.isArray(items) ||
      !shipping_address ||
      typeof total_amount !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'Razorpay secret missing' }, { status: 500 })
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`
    const validSignature = verifyRazorpaySignature(payload, razorpay_signature, secret)
    if (!validSignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: userResult, error: userError } = await supabase.auth.getUser()
    if (userError || !userResult?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const computedTotal = items.reduce((sum: number, item: any) => {
      const unitPrice = Number(item.price_at_purchase || 0)
      const quantity = Number(item.quantity || 0)
      return sum + unitPrice * quantity
    }, 0)

    if (computedTotal !== total_amount) {
      return NextResponse.json({ error: 'Order total mismatch' }, { status: 400 })
    }

    const orderNumber = `ORD-${Date.now()}`
    const { data: createdOrder, error: orderError } = await supabase.from('orders').insert({
      user_id: userResult.user.id,
      order_number: orderNumber,
      status: 'paid',
      total_amount,
      razorpay_order_id,
      razorpay_payment_id,
      shipping_address,
    }).select().single()

    if (orderError || !createdOrder) {
      return NextResponse.json({ error: orderError?.message || 'Unable to create order' }, { status: 500 })
    }

    const orderItems = items.map((item: any) => ({
      order_id: createdOrder.id,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order_number: orderNumber })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

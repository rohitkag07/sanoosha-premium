'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

const initialShippingAddress = {
  full_name: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
  state: '',
}

export default function CheckoutPage() {
  const items = useCartStore(s => s.items)
  const totalPrice = useCartStore(s => s.totalPrice())
  const clearCart = useCartStore(s => s.clearCart)
  const [shippingAddress, setShippingAddress] = useState(initialShippingAddress)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)

  const formattedTotal = useMemo(() => formatPrice(totalPrice), [totalPrice])
  const shippingValid = Object.values(shippingAddress).every(value => value.trim().length > 0)

  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      const browserSupabase = createClient()
      if (mounted) setSupabase(browserSupabase)

      const { data } = await browserSupabase.auth.getSession()
      if (!data.session?.user) {
        router.push('/login?redirect=/checkout')
        return
      }
      if (mounted) setAuthChecked(true)
    }

    checkAuth()
    return () => {
      mounted = false
    }
  }, [router])

  if (!authChecked) {
    return (
      <section className="container mx-auto px-4 max-w-[1240px] py-14">
        <div className="rounded-[32px] border border-gray-100 bg-white p-10 text-center text-gray-brand shadow-sm">
          Checking your session...
        </div>
      </section>
    )
  }

  function updateAddress(field: keyof typeof initialShippingAddress, value: string) {
    setShippingAddress(prev => ({ ...prev, [field]: value }))
  }

  async function handleCheckout() {
    if (items.length === 0) return
    if (!shippingValid) {
      setError('Please complete all shipping fields before checkout.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const createResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice }),
      })
      const order = await createResponse.json()
      if (!createResponse.ok) throw new Error(order.error || 'Unable to create order')

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: order.currency,
        name: 'Sanoosha Premium',
        description: 'Complete your spiritual jewellery order',
        order_id: order.id,
        handler: async function (response: any) {
          setLoading(true)
          setError(null)

          const confirmResponse = await fetch('/api/orders/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: items.map(item => ({
                product_id: item.product.id,
                variant_id: item.variant?.id ?? null,
                quantity: item.quantity,
                price_at_purchase: item.product.price + (item.variant?.price_modifier ?? 0),
              })),
              shipping_address: shippingAddress,
              total_amount: totalPrice,
            }),
          })

          const confirmation = await confirmResponse.json()

          if (!confirmResponse.ok) {
            setError(confirmation.error || 'Could not save order to your account.')
            return
          }

          clearCart()
          router.push('/orders')
        },
        prefill: {
          name: shippingAddress.full_name,
          email: '',
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#2d6a4f',
        },
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      setError(err.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container mx-auto px-4 max-w-[1240px] py-14">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-gold font-semibold">Checkout</p>
            <h1 className="mt-3 text-4xl font-serif font-semibold text-charcoal">Secure payment & shipping details</h1>
          </div>

          <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal">Shipping details</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-charcoal">Full name</span>
                <input
                  type="text"
                  value={shippingAddress.full_name}
                  onChange={e => updateAddress('full_name', e.target.value)}
                  className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-terra focus:ring-2 focus:ring-terra/10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-charcoal">Phone</span>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={e => updateAddress('phone', e.target.value)}
                  className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-terra focus:ring-2 focus:ring-terra/10"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-charcoal">Address</span>
                <textarea
                  value={shippingAddress.address}
                  onChange={e => updateAddress('address', e.target.value)}
                  rows={4}
                  className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-terra focus:ring-2 focus:ring-terra/10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-charcoal">City</span>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={e => updateAddress('city', e.target.value)}
                  className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-terra focus:ring-2 focus:ring-terra/10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-charcoal">State</span>
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={e => updateAddress('state', e.target.value)}
                  className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-terra focus:ring-2 focus:ring-terra/10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-charcoal">Pincode</span>
                <input
                  type="text"
                  value={shippingAddress.pincode}
                  onChange={e => updateAddress('pincode', e.target.value)}
                  className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-terra focus:ring-2 focus:ring-terra/10"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal">Order summary</h2>
            <div className="mt-6 space-y-4">
              {items.map(item => (
                <div key={`${item.product.id}-${item.variant?.id ?? 'default'}`} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <p className="font-semibold text-charcoal">{item.product.name}</p>
                    <p className="text-sm text-gray-brand">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-charcoal">{formatPrice((item.product.price + (item.variant?.price_modifier ?? 0)) * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5 text-sm text-gray-brand">
              <span>Total</span>
              <span className="font-semibold text-charcoal">{formattedTotal}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || items.length === 0}
            className="inline-flex w-full items-center justify-center rounded-full bg-terra px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Processing…' : 'Pay with Razorpay'}
          </button>

          {error && <p className="text-sm text-terra">{error}</p>}
        </div>

        <aside className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-charcoal">Shipping</h2>
          <p className="mt-4 text-sm leading-7 text-gray-brand">
            Shipping is free on all orders. Delivery times may vary by location. After payment, you will receive order confirmation and tracking updates.
          </p>
        </aside>
      </div>
    </section>
  )
}

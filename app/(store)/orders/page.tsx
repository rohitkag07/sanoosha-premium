import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Failed to resolve authenticated user for orders', userError)
    return (
      <section className="container mx-auto px-4 max-w-[1240px] py-14">
        <div className="rounded-[32px] border border-gray-100 bg-white p-10 text-center text-gray-brand shadow-sm">
          Please sign in to view your orders.
        </div>
      </section>
    )
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('order_number, status, total_amount, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load orders', error)
  }

  return (
    <section className="container mx-auto px-4 max-w-[1240px] py-14">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.28em] text-gold font-semibold">My orders</p>
        <h1 className="mt-3 text-4xl font-serif font-semibold text-charcoal">Track your purchase history</h1>
      </div>

      <div className="grid gap-6">
        {orders?.length ? (
          orders.map(order => (
            <Link
              key={order.order_number}
              href={`/orders/${order.order_number}`}
              className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-gold font-semibold">{order.order_number}</p>
                  <p className="mt-2 text-lg font-semibold text-charcoal">{formatPrice(order.total_amount)}</p>
                </div>
                <div className="text-sm text-gray-brand">
                  <p>{new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="mt-2 uppercase tracking-[0.18em] text-terra font-semibold">{order.status}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-[32px] border border-gray-100 bg-white p-16 text-center text-gray-brand">
            No orders found. Complete a purchase to see it here.
          </div>
        )}
      </div>
    </section>
  )
}

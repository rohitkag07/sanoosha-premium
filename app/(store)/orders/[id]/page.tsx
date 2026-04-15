import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

interface PageProps {
  params: { id: string }
}

export default async function OrderDetailPage({ params }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    notFound()
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select('order_number, status, total_amount, created_at, shipping_address, order_items(product_id(*), variant_id(*), quantity, price_at_purchase)')
    .eq('order_number', params.id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error || !order) {
    notFound()
  }

  return (
    <section className="container mx-auto px-4 max-w-[1240px] py-14">
      <div className="rounded-[32px] border border-gray-100 bg-white p-10 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-gold font-semibold">Order details</p>
            <h1 className="mt-3 text-4xl font-serif font-semibold text-charcoal">{order.order_number}</h1>
          </div>
          <div className="rounded-full bg-emerald-100 px-5 py-3 text-sm font-semibold text-emerald-800 uppercase tracking-[0.18em]">
            {order.status}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.65fr]">
          <div>
            <div className="space-y-4 rounded-[24px] border border-gray-100 bg-[#fbfaf8] p-6">
              <p className="text-sm text-gray-brand">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <p className="text-lg font-semibold text-charcoal">Total paid {formatPrice(order.total_amount)}</p>
            </div>

            <div className="mt-8 space-y-4">
              {(order.order_items as any[] | undefined)?.map((item, index) => (
                <div key={`${params.id}-${index}`} className="rounded-[24px] border border-gray-100 bg-white p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-charcoal">
                        {item.product_id?.name ?? item.product_id}
                      </h2>
                      <p className="text-sm text-gray-brand">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-charcoal">{formatPrice(item.price_at_purchase)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-gray-100 bg-[#f8f5f0] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-gold font-semibold">Shipping</p>
            <div className="mt-3 text-sm text-gray-brand space-y-2">
              <p>{order.shipping_address?.full_name}</p>
              <p>{order.shipping_address?.address}</p>
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pincode}</p>
              <p>{order.shipping_address?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

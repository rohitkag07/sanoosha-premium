export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import StatusUpdater from './StatusUpdater'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*), product_variants(*))')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/orders" className="text-white/50 text-sm hover:text-white">
            ← Back to orders
          </Link>
          <h1 className="text-3xl font-semibold text-white mt-3">{order.order_number}</h1>
          <p className="text-white/50 mt-2">Order placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <StatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6">
          <h2 className="text-white font-semibold mb-4">Order items</h2>
          <div className="space-y-4">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="h-16 w-16 overflow-hidden rounded-3xl bg-white/10">
                  <img src={item.products?.images?.[0] ?? ''} alt={item.products?.name ?? ''} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.products?.name ?? 'Product'}</p>
                  {item.product_variants && <p className="text-white/50 text-sm">{item.product_variants.name}</p>}
                  <p className="text-white/50 text-sm">Qty {item.quantity}</p>
                </div>
                <p className="text-gold font-semibold">{formatPrice(item.price_at_purchase * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-white/90">
            <span className="font-medium">Total</span>
            <span className="text-gold font-semibold text-lg">{formatPrice(order.total_amount)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6">
            <h2 className="text-white font-semibold mb-4">Shipping address</h2>
            <div className="space-y-2 text-white/70 text-sm">
              <p className="text-white font-medium">{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.phone}</p>
              <p>{order.shipping_address.address}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6">
            <h2 className="text-white font-semibold mb-4">Payment</h2>
            <p className="text-white/70 text-sm">Razorpay Order ID</p>
            <p className="text-white font-medium break-all">{order.razorpay_order_id ?? 'N/A'}</p>
            <p className="text-white/70 text-sm mt-4">Payment ID</p>
            <p className="text-white font-medium break-all">{order.razorpay_payment_id ?? 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

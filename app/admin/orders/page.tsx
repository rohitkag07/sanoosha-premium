export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  paid: 'bg-blue-500/20 text-blue-300',
  processing: 'bg-purple-500/20 text-purple-300',
  shipped: 'bg-indigo-500/20 text-indigo-300',
  delivered: 'bg-emerald-500/20 text-emerald-300',
  cancelled: 'bg-red-500/20 text-red-300',
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (params.status) {
    query = query.eq('status', params.status)
  }

  const { data: orders } = await query

  const statuses = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Orders</h1>
          <p className="text-white/50 mt-2">View and manage order status for your store.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <Link
              key={status}
              href={status === 'all' ? '/admin/orders' : `/admin/orders?status=${status}`}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                params.status === status || (!params.status && status === 'all')
                  ? 'bg-gold text-charcoal'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {status}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0f172a]">
        <table className="min-w-full text-left text-sm text-white/70">
          <thead className="border-b border-white/10 bg-white/5 text-white/50 uppercase tracking-[0.2em] text-xs">
            <tr>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map(order => (
              <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{order.order_number}</td>
                <td className="px-6 py-4 text-white/60">{order.shipping_address?.full_name ?? '—'}</td>
                <td className="px-6 py-4 text-gold font-semibold">{formatPrice(order.total_amount)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/40 text-xs">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-gold text-sm font-semibold hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

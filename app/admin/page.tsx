export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import StatsCard from '@/components/admin/StatsCard'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  paid: 'bg-blue-500/20 text-blue-300',
  processing: 'bg-purple-500/20 text-purple-300',
  shipped: 'bg-indigo-500/20 text-indigo-300',
  delivered: 'bg-emerald-500/20 text-emerald-300',
  cancelled: 'bg-red-500/20 text-red-300',
}

async function getStats() {
  const supabase = await createClient()

  const [ordersRes, revenueRes, customersRes, pendingRes] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact' }),
    supabase.from('orders').select('total_amount').in('status', ['paid', 'delivered', 'shipped', 'processing']),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('is_admin', false),
    supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending'),
  ])

  const totalRevenue = (revenueRes.data ?? []).reduce((sum, order) => sum + (order.total_amount ?? 0), 0)

  return {
    totalOrders: ordersRes.count ?? 0,
    totalRevenue,
    totalCustomers: customersRes.count ?? 0,
    pendingOrders: pendingRes.count ?? 0,
  }
}

async function getRecentOrders() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('id, order_number, status, total_amount, created_at, shipping_address')
    .order('created_at', { ascending: false })
    .limit(8)
  return data ?? []
}

export default async function AdminOverview() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()])

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-sm text-white/50 uppercase tracking-[0.3em] mb-2">Admin</p>
        <h1 className="text-3xl font-semibold">Overview</h1>
        <p className="text-white/50 mt-2 max-w-2xl">
          High-level performance metrics for your store, updated live from Supabase.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatsCard label="Total Revenue" value={formatPrice(stats.totalRevenue)} />
        <StatsCard label="Total Orders" value={stats.totalOrders.toString()} />
        <StatsCard
          label="Pending Orders"
          value={stats.pendingOrders.toString()}
          sub={stats.pendingOrders > 0 ? 'Needs action' : 'All caught up'}
          positive={stats.pendingOrders === 0}
        />
        <StatsCard label="Customers" value={stats.totalCustomers.toString()} />
      </div>

      <div className="bg-[#0f172a] rounded-3xl border border-white/10 overflow-hidden">
        <div className="flex flex-col gap-3 px-6 py-5 border-b border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <p className="text-white/50 text-sm mt-1">Latest activity from your store</p>
          </div>
          <Link href="/admin/orders" className="text-gold text-sm font-semibold hover:underline">
            View all orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-white/50 uppercase text-xs tracking-[0.2em]">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-gold">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-white/60">{order.shipping_address?.full_name ?? '—'}</td>
                  <td className="px-6 py-4 text-gold font-semibold">{formatPrice(order.total_amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusColors[order.status]}`}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

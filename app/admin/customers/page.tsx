export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export default async function AdminCustomersPage() {
  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, phone, created_at, orders(id, total_amount, status)')
    .eq('is_admin', false)
    .order('created_at', { ascending: false })

  const customers = (profiles ?? []).map((profile: any) => {
    const orderCount = profile.orders?.length ?? 0
    const totalSpend = (profile.orders ?? [])
      .filter((order: any) => ['paid', 'delivered', 'shipped'].includes(order.status))
      .reduce((sum: number, order: any) => sum + (order.total_amount ?? 0), 0)

    return { ...profile, orderCount, totalSpend }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Customers</h1>
        <p className="text-white/50 mt-2">Customer activity, order history, and lifetime value.</p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0f172a]">
        <table className="min-w-full text-left text-sm text-white/70">
          <thead className="border-b border-white/10 bg-white/5 text-white/50 uppercase tracking-[0.2em] text-xs">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Orders</th>
              <th className="px-6 py-4">Lifetime value</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{customer.full_name ?? 'Customer'}</td>
                <td className="px-6 py-4 text-white/60">{customer.phone ?? '—'}</td>
                <td className="px-6 py-4 text-white/60">{customer.orderCount}</td>
                <td className="px-6 py-4 text-gold font-semibold">{formatPrice(customer.totalSpend)}</td>
                <td className="px-6 py-4 text-white/40 text-xs">
                  {new Date(customer.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

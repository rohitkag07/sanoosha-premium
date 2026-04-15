export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import AnalyticsCharts from './AnalyticsCharts'

async function getAnalyticsData() {
  const supabase = await createClient()

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)

  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount,status,created_at')
    .gte('created_at', sixMonthsAgo.toISOString())
    .in('status', ['paid', 'delivered', 'shipped', 'processing'])

  const monthlyRevenue: Record<string, number> = {}
  ;(orders ?? []).forEach(order => {
    const month = new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    monthlyRevenue[month] = (monthlyRevenue[month] ?? 0) + (order.total_amount ?? 0)
  })

  const revenueChart = Object.entries(monthlyRevenue)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([month, revenue]) => ({ month, revenue: revenue / 100 }))

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('quantity, products(name)')
    .limit(100)

  const productSales: Record<string, { name: string; quantity: number }> = {}
  ;(orderItems ?? []).forEach(item => {
    const itemAny = item as any
    const name = itemAny.products?.name ?? 'Unknown'
    if (!productSales[name]) productSales[name] = { name, quantity: 0 }
    productSales[name].quantity += itemAny.quantity ?? 0
  })

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  const { data: allOrders } = await supabase.from('orders').select('status')
  const statusBreakdown: Record<string, number> = {}
  ;(allOrders ?? []).forEach(order => {
    statusBreakdown[order.status] = (statusBreakdown[order.status] ?? 0) + 1
  })

  const statusChart = Object.entries(statusBreakdown).map(([status, count]) => ({ status, count }))

  return { revenueChart, topProducts, statusChart }
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData()
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Analytics</h1>
        <p className="text-white/50 mt-2">Store performance charts and revenue insights.</p>
      </div>
      <AnalyticsCharts {...data} />
    </div>
  )
}

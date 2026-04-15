'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const PIE_COLORS = ['#C8A84B', '#8B3A2A', '#22c55e', '#6366f1', '#a855f7', '#ef4444']

interface Props {
  revenueChart: { month: string; revenue: number }[]
  topProducts: { name: string; quantity: number }[]
  statusChart: { status: string; count: number }[]
}

export default function AnalyticsCharts({ revenueChart, topProducts, statusChart }: Props) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-[#0f172a] p-6">
        <h2 className="text-white font-semibold mb-5">Monthly revenue</h2>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }}
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#C8A84B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6">
        <h2 className="text-white font-semibold mb-5">Top products</h2>
        <div className="space-y-4">
          {topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-white/50 text-xs">{product.quantity} sold</p>
                </div>
                <div className="text-white/80 text-sm">#{index + 1}</div>
              </div>
            ))
          ) : (
            <p className="text-white/50">No sales data available yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-6">
        <h2 className="text-white font-semibold mb-5">Order status</h2>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusChart} dataKey="count" nameKey="status" innerRadius={70} outerRadius={100} paddingAngle={4}>
                {statusChart.map((entry, index) => (
                  <Cell key={entry.status} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                formatter={value => <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{value}</span>}
                wrapperStyle={{ top: 0, left: 0, color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

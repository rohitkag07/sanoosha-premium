'use client'

import { useTransition } from 'react'
import type { OrderStatus } from '@/types'
import { updateOrderStatus } from '../actions'

const statuses: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  paid: 'bg-blue-500/20 text-blue-300',
  processing: 'bg-purple-500/20 text-purple-300',
  shipped: 'bg-indigo-500/20 text-indigo-300',
  delivered: 'bg-emerald-500/20 text-emerald-300',
  cancelled: 'bg-red-500/20 text-red-300',
}

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusColors[currentStatus]}`}>
        {currentStatus}
      </span>
      <select
        defaultValue={currentStatus}
        onChange={e => startTransition(() => updateOrderStatus(orderId, e.target.value as OrderStatus))}
        disabled={isPending}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm outline-none focus:border-gold"
      >
        {statuses.map(status => (
          <option key={status} value={status} className="bg-[#0f172a] text-white">
            {status}
          </option>
        ))}
      </select>
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Coupon } from '@/types'
import { createCoupon, deleteCoupon, toggleCoupon } from './actions'

export default function CouponsClient({ coupons }: { coupons: Coupon[] }) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await createCoupon(formData)
      setShowForm(false)
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Coupons</h1>
          <p className="text-white/50 mt-2">Create and manage discount codes for your store.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold-light"
        >
          <Plus size={16} /> Create coupon
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0f172a]">
        <table className="min-w-full text-left text-sm text-white/70">
          <thead className="border-b border-white/10 bg-white/5 text-white/50 uppercase tracking-[0.2em] text-xs">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Min order</th>
              <th className="px-6 py-4">Uses</th>
              <th className="px-6 py-4">Expires</th>
              <th className="px-6 py-4">Active</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-gold font-semibold">{coupon.code}</td>
                <td className="px-6 py-4 text-white/60 capitalize">{coupon.discount_type}</td>
                <td className="px-6 py-4 text-white font-medium">
                  {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `₹${coupon.discount_value / 100}`}
                </td>
                <td className="px-6 py-4 text-white/60">
                  {coupon.min_order > 0 ? `₹${coupon.min_order / 100}` : '—'}
                </td>
                <td className="px-6 py-4 text-white/60">
                  {coupon.used_count}{coupon.max_uses ? `/${coupon.max_uses}` : ''}
                </td>
                <td className="px-6 py-4 text-white/60">{coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString('en-IN') : 'Never'}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => startTransition(() => toggleCoupon(coupon.id, coupon.is_active))}
                    className="inline-flex items-center"
                  >
                    {coupon.is_active ? (
                      <ToggleRight size={22} className="text-emerald-400" />
                    ) : (
                      <ToggleLeft size={22} className="text-white/30" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => startTransition(() => deleteCoupon(coupon.id))}
                    className="inline-flex items-center rounded-2xl p-2 text-white/60 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">New coupon</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-white/50 hover:text-white">
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-white/50">
                  Code
                  <input
                    name="code"
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                    required
                  />
                </label>
                <label className="block text-sm text-white/50">
                  Type
                  <select
                    name="discount_type"
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                    defaultValue="percent"
                  >
                    <option value="percent">Percent</option>
                    <option value="flat">Flat</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-sm text-white/50">
                  Value
                  <input
                    name="discount_value"
                    type="number"
                    min="0"
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                    required
                  />
                </label>
                <label className="block text-sm text-white/50">
                  Min order (₹)
                  <input
                    name="min_order"
                    type="number"
                    min="0"
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                  />
                </label>
                <label className="block text-sm text-white/50">
                  Max uses
                  <input
                    name="max_uses"
                    type="number"
                    min="0"
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                  />
                </label>
              </div>
              <label className="block text-sm text-white/50">
                Valid until
                <input
                  name="valid_until"
                  type="date"
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                />
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex justify-center rounded-3xl bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold-light disabled:opacity-60"
                >
                  Create coupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex justify-center rounded-3xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-gold hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

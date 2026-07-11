'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

export default function CartPage() {
  const items = useCartStore(s => s.items)
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const removeItem = useCartStore(s => s.removeItem)
  const totalPrice = useCartStore(s => s.totalPrice())

  const hasItems = items.length > 0
  const formattedTotal = useMemo(() => formatPrice(totalPrice), [totalPrice])

  return (
    <section className="container mx-auto px-4 max-w-[1240px] py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-gold font-semibold">Your cart</p>
          <h1 className="mt-3 text-4xl font-serif font-semibold text-charcoal">Review & complete your order</h1>
        </div>

        <div className="rounded-full border border-gray-200 bg-white px-5 py-4 text-sm text-gray-brand">
          {hasItems ? `${items.length} item${items.length > 1 ? 's' : ''}` : 'Your cart is empty'}
        </div>
      </div>

      {hasItems ? (
        <div className="mt-10 grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            {items.map(item => (
              <div key={`${item.product.id}-${item.variant?.id ?? 'default'}`} className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-5">
                    <img src={item.product.images[0]} alt={item.product.name} className="h-28 w-28 rounded-[24px] object-cover" />
                    <div>
                      <div className="text-sm uppercase tracking-[0.24em] text-gold font-semibold">{item.product.category}</div>
                      <h2 className="mt-2 text-xl font-semibold text-charcoal">{item.product.name}</h2>
                      <p className="mt-2 text-sm text-gray-brand">{item.variant?.name ?? 'Standard'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 text-right">
                    <div className="text-sm text-gray-brand">{formatPrice(item.product.price + (item.variant?.price_modifier ?? 0))} each</div>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.quantity - 1)} className="h-9 w-9 rounded-full border border-gray-200 text-lg font-bold text-charcoal transition hover:border-terra">
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold text-charcoal">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.quantity + 1)} className="h-9 w-9 rounded-full border border-gray-200 text-lg font-bold text-charcoal transition hover:border-terra">
                        +
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.product.id, item.variant?.id ?? null)} className="text-sm font-medium text-terra hover:text-charcoal transition">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <h2 className="text-sm uppercase tracking-[0.28em] text-charcoal font-semibold">Order summary</h2>
                <p className="mt-3 text-3xl font-bold text-charcoal">{formattedTotal}</p>
              </div>

              <div className="space-y-3 text-sm text-gray-brand">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span>Subtotal</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="flex items-center justify-between pb-3">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex items-center justify-between text-charcoal font-semibold pt-3">
                  <span>Total</span>
                  <span>{formattedTotal}</span>
                </div>
              </div>

              <Link href="/checkout" className="block rounded-full bg-terra px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-charcoal">
                Proceed to checkout
              </Link>
            </div>
          </aside>
        </div>
      ) : (
        <div className="mt-14 rounded-[32px] border border-dashed border-gray-200 bg-white p-16 text-center text-gray-brand">
          <h2 className="text-2xl font-semibold text-charcoal">Your cart is empty</h2>
          <p className="mt-4">Add products to your cart and continue to checkout.</p>
          <Link href="/shop" className="mt-8 inline-flex rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white hover:bg-terra transition">
            Browse products
          </Link>
        </div>
      )}
    </section>
  )
}

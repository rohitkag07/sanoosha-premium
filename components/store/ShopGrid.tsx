'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '@/components/store/ProductCard'
import type { Product } from '@/types'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'rudraksha', label: 'Rudraksha' },
  { key: 'crystal', label: 'Crystal' },
  { key: 'combo', label: 'Combo' },
] as const

interface ShopGridProps {
  products: Product[]
  initialCategory?: string
}

export default function ShopGrid({ products, initialCategory }: ShopGridProps) {
  const [active, setActive] = useState(initialCategory ?? 'all')

  const filtered = useMemo(() => {
    if (active === 'all') return products
    return products.filter(p => p.category === active)
  }, [active, products])

  return (
    <>
      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className="relative px-6 py-2.5 text-sm font-medium tracking-wide transition-colors duration-300 rounded-full"
            style={{ color: active === cat.key ? '#fff' : '#6B6B6B' }}
          >
            {active === cat.key && (
              <motion.span
                layoutId="activeCategoryPill"
                className="absolute inset-0 bg-charcoal rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-center text-sm text-gray-brand mt-4 mb-2">
        Showing <span className="font-semibold text-charcoal">{filtered.length}</span> {filtered.length === 1 ? 'product' : 'products'}
      </p>

      {/* Product Grid */}
      <div className="mt-8 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full rounded-2xl border border-gray-lt bg-white p-20 text-center"
            >
              <p className="font-serif text-xl text-gray-brand">No products found in this collection.</p>
              <button
                onClick={() => setActive('all')}
                className="mt-4 text-sm font-semibold text-terra hover:underline"
              >
                View all products →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

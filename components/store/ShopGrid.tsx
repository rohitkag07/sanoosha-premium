'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

const CATEGORY_TABS = [
  { key: 'all', label: 'All' },
  { key: 'rudraksha', label: 'Rudraksha' },
  { key: 'crystal', label: 'Crystals' },
  { key: 'combo', label: 'Combo Sets' },
] as const

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'bestselling', label: 'Bestselling' },
]

function extractMukhi(name: string): string | null {
  const m = name.match(/(\d+)\s*mukhi/i)
  return m ? `${m[1]} Mukhi` : null
}

interface Props {
  products: Product[]
  initialCategory?: string
}

export default function ShopGrid({ products, initialCategory }: Props) {
  const [category, setCategory] = useState(initialCategory ?? 'all')
  const [sort, setSort] = useState('newest')
  const [priceMax, setPriceMax] = useState<number>(0)
  const [selectedMukhi, setSelectedMukhi] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mukhiOpen, setMukhiOpen] = useState(true)

  // Derive price max from products (in rupees)
  const absoluteMax = useMemo(() => {
    const max = Math.max(...products.map(p => Math.round(p.price / 100)), 0)
    return max || 25000
  }, [products])

  const effectivePriceMax = priceMax === 0 ? absoluteMax : priceMax

  // Derive mukhi options from rudraksha products
  const mukhiOptions = useMemo(() => {
    const set = new Set<string>()
    products.filter(p => p.category === 'rudraksha').forEach(p => {
      const m = extractMukhi(p.name)
      if (m) set.add(m)
    })
    return Array.from(set).sort((a, b) => parseInt(a) - parseInt(b))
  }, [products])

  // Filter + sort
  const filtered = useMemo(() => {
    let list = products

    if (category !== 'all') list = list.filter(p => p.category === category)

    if (priceMax > 0) list = list.filter(p => Math.round(p.price / 100) <= priceMax)

    if (selectedMukhi.length > 0) {
      list = list.filter(p => {
        const m = extractMukhi(p.name)
        return m && selectedMukhi.includes(m)
      })
    }

    switch (sort) {
      case 'price_asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price_desc': return [...list].sort((a, b) => b.price - a.price)
      default: return list
    }
  }, [products, category, sort, priceMax, selectedMukhi])

  function toggleMukhi(m: string) {
    setSelectedMukhi(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }

  function clearAll() {
    setCategory('all')
    setPriceMax(0)
    setSelectedMukhi([])
    setSort('newest')
  }

  const hasFilters = category !== 'all' || priceMax > 0 || selectedMukhi.length > 0

  return (
    <>
      {/* ── Sticky Filter Bar ── */}
      <div className="sticky top-[68px] z-30 bg-cream border-b border-gray-lt">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="flex items-center justify-between gap-4 py-3 overflow-x-auto">

            {/* Category pills */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {CATEGORY_TABS.map(tab => {
                const count = tab.key === 'all' ? products.length : products.filter(p => p.category === tab.key).length
                return (
                  <button
                    key={tab.key}
                    onClick={() => setCategory(tab.key)}
                    className={`relative inline-flex items-center gap-1.5 text-[12px] font-medium tracking-[0.03em] px-4 py-2 rounded-full border-[1.5px] transition-all duration-200 whitespace-nowrap ${
                      category === tab.key
                        ? 'bg-charcoal text-ivory border-charcoal'
                        : 'bg-transparent text-gray-brand border-transparent hover:text-charcoal hover:border-gray-lt hover:bg-white'
                    }`}
                  >
                    {tab.label}
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      category === tab.key ? 'bg-white/15 text-white' : 'bg-gray-lt text-gray-brand'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
              <span className="text-[11.5px] text-gray-brand whitespace-nowrap hidden sm:block">
                {filtered.length} results
              </span>

              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="text-[12px] font-medium text-charcoal bg-white border-[1.5px] border-gray-lt rounded-sm px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:border-charcoal"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <button
                onClick={() => setSidebarOpen(o => !o)}
                className={`hidden lg:flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 border-[1.5px] rounded-sm transition-all ${
                  sidebarOpen ? 'bg-charcoal text-ivory border-charcoal' : 'border-gray-lt text-charcoal hover:border-charcoal'
                }`}
              >
                <SlidersHorizontal size={13} />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="container mx-auto px-4 max-w-[1240px] py-8 pb-20">
        <div className={`flex gap-8 items-start ${sidebarOpen ? 'lg:grid lg:grid-cols-[220px_1fr]' : ''}`}>

          {/* Sidebar */}
          {sidebarOpen && (
            <aside className="hidden lg:block sticky top-[120px]">
              <div className="space-y-0">

                {/* Clear filters */}
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-brand border-[1.5px] border-gray-lt rounded-sm py-2 mb-4 hover:border-charcoal hover:text-charcoal transition-all"
                  >
                    <X size={11} /> Clear Filters
                  </button>
                )}

                {/* Price Range */}
                <div className="pb-5 mb-5 border-b border-gray-lt">
                  <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-charcoal mb-4">
                    Price Range
                  </h4>
                  <input
                    type="range"
                    min={499}
                    max={absoluteMax}
                    step={500}
                    value={effectivePriceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    className="w-full h-1 bg-gray-lt rounded appearance-none cursor-pointer accent-charcoal"
                  />
                  <div className="flex justify-between text-[11px] text-gray-brand mt-2">
                    <span>₹499</span>
                    <span className="font-semibold text-charcoal">{formatPrice(effectivePriceMax * 100)}</span>
                  </div>
                </div>

                {/* Mukhi Faces — only for rudraksha */}
                {(category === 'all' || category === 'rudraksha') && mukhiOptions.length > 0 && (
                  <div className="pb-5 mb-5 border-b border-gray-lt">
                    <button
                      className="w-full flex items-center justify-between text-[11px] font-semibold tracking-[0.15em] uppercase text-charcoal mb-3"
                      onClick={() => setMukhiOpen(o => !o)}
                    >
                      Mukhi (Faces)
                      {mukhiOpen ? <ChevronUp size={13} className="text-gray-brand" /> : <ChevronDown size={13} className="text-gray-brand" />}
                    </button>
                    {mukhiOpen && (
                      <div className="space-y-2.5">
                        {mukhiOptions.map(m => {
                          const count = products.filter(p => extractMukhi(p.name) === m).length
                          const checked = selectedMukhi.includes(m)
                          return (
                            <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
                              <span className={`w-4 h-4 rounded-sm border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all ${
                                checked ? 'bg-charcoal border-charcoal' : 'border-gray-lt bg-white group-hover:border-charcoal'
                              }`}>
                                {checked && <span className="text-white text-[9px] font-bold leading-none">✓</span>}
                              </span>
                              <span
                                className="flex-1 text-[12.5px] text-charcoal"
                                onClick={() => toggleMukhi(m)}
                              >
                                {m}
                              </span>
                              <span className="text-[11px] text-gray-brand">{count}</span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Crystal Type */}
                {(category === 'all' || category === 'crystal') && (
                  <div className="pb-5">
                    <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-charcoal mb-3">
                      Crystal Type
                    </h4>
                    <div className="space-y-2.5">
                      {['Amethyst', 'Rose Quartz', 'Lapis Lazuli', 'Clear Quartz', 'Obsidian'].map(type => {
                        const count = products.filter(p =>
                          p.category === 'crystal' && p.name.toLowerCase().includes(type.toLowerCase())
                        ).length
                        if (count === 0) return null
                        return (
                          <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                            <span className="w-4 h-4 rounded-sm border-[1.5px] border-gray-lt bg-white group-hover:border-charcoal flex items-center justify-center flex-shrink-0 transition-all" />
                            <span className="flex-1 text-[12.5px] text-charcoal">{type}</span>
                            <span className="text-[11px] text-gray-brand">{count}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="rounded-sm border border-gray-lt bg-white p-20 text-center">
                <p className="font-serif text-xl text-gray-brand mb-3">No products found.</p>
                <button onClick={clearAll} className="text-sm font-semibold text-terra hover:underline">
                  Clear all filters →
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map(product => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

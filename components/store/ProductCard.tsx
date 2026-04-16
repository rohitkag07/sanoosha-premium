'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Plus } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice, discountPercent } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

interface Props {
  product: Product
}

const ORIGIN_LABELS: Record<string, string> = {
  rudraksha: 'RUDRAKSHA · NEPAL',
  crystal: 'CRYSTAL · NATURAL',
  combo: 'COMBO SET',
}

const BADGE: Record<string, { label: string; cls: string }> = {
  rudraksha: { label: 'Sacred', cls: 'bg-terra text-white' },
  crystal: { label: 'Healing', cls: 'bg-charcoal/85 text-gold' },
  combo: { label: 'Combo', cls: 'bg-gold text-charcoal' },
}

function Stars({ n = 4.8 }: { n?: number }) {
  const full = Math.floor(n)
  const half = n - full >= 0.5
  return (
    <span className="text-gold text-[11px] tracking-[-1px]">
      {Array.from({ length: full }).map((_, i) => <span key={i}>★</span>)}
      {half && <span style={{ opacity: 0.5 }}>★</span>}
    </span>
  )
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore(s => s.addItem)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, null, 1)
  }

  const discount = product.compare_price ? discountPercent(product.price, product.compare_price) : null
  const badge = BADGE[product.category]
  const origin = ORIGIN_LABELS[product.category]

  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <div className="bg-white rounded-sm overflow-hidden border border-gray-lt hover:border-gold/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(26,26,26,0.10)]">

        {/* Image */}
        <div className="relative aspect-square bg-ivory overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />

          {/* Badge top-left */}
          {discount ? (
            <span className={`absolute top-3 left-3 text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-1 rounded-sm z-10 bg-terra text-white`}>
              -{discount}%
            </span>
          ) : (
            <span className={`absolute top-3 left-3 text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-1 rounded-sm z-10 ${badge.cls}`}>
              {badge.label}
            </span>
          )}

          {/* Wishlist top-right */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation() }}
            className="absolute top-2.5 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-charcoal hover:text-terra transition-all duration-200 opacity-0 group-hover:opacity-100 z-10 shadow-sm"
          >
            <Heart size={14} />
          </button>

          {/* Quick Add bar — slides up on hover */}
          <div className="absolute bottom-0 inset-x-0 bg-charcoal/88 text-ivory text-[10px] font-semibold tracking-[0.14em] uppercase py-3 flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <Plus size={11} strokeWidth={2.5} />
            Quick Add
          </div>
        </div>

        {/* Card body */}
        <div className="px-4 py-3.5">
          {/* Origin label */}
          <p className="text-[10px] font-medium tracking-[0.16em] uppercase text-gold mb-1.5">
            {origin}
          </p>

          {/* Name */}
          <h3 className="font-serif text-[1.05rem] font-medium text-charcoal leading-snug line-clamp-2 group-hover:text-terra transition-colors duration-200 mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <Stars />
            <span className="text-[11px] font-semibold text-charcoal">4.8</span>
            <span className="text-[11px] text-gray-brand">(247)</span>
          </div>

          {/* Price + Add button */}
          <div className="flex items-center justify-between">
            <div>
              {product.price === 0 ? (
                <span className="font-serif text-base font-semibold text-terra">Enquire Now</span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-[1.1rem] font-semibold text-terra leading-none">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_price && (
                    <span className="text-[11px] text-gray-brand line-through">
                      {formatPrice(product.compare_price)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {product.price > 0 && (
              <button
                onClick={handleAdd}
                className="text-[10px] font-semibold tracking-[0.1em] uppercase bg-terra text-white px-3 py-1.5 rounded-sm hover:bg-terra-dark transition-colors duration-200"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

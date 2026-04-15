'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice, discountPercent } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore(s => s.addItem)

  function handleAddToCart() {
    addItem(product, null, 1)
  }

  const discount = product.compare_price
    ? discountPercent(product.price, product.compare_price)
    : null

  return (
    <div className="bg-white rounded-brand overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-ivory overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
          {discount ? (
            <span className="absolute top-4 left-4 bg-terra text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              {discount}% OFF
            </span>
          ) : (
            <span className="absolute top-4 left-4 bg-gold text-charcoal text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Certified
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-gold mb-1">
          {product.category === 'rudraksha' ? 'Rudraksha' : product.category === 'crystal' ? 'Crystal' : 'Combo'}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-[1.05rem] font-semibold text-charcoal leading-snug mb-2 hover:text-terra transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-xs text-gray-brand mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="font-serif text-xl font-bold text-charcoal">{formatPrice(product.price)}</span>
          {product.compare_price && (
            <span className="text-xs text-gray-brand line-through">{formatPrice(product.compare_price)}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-charcoal hover:bg-terra text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <ShoppingBag size={14} /> Add to Cart
        </button>
      </div>
    </div>
  )
}

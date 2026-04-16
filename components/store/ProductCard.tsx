'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { formatPrice, discountPercent } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore(s => s.addItem)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, null, 1)
  }

  const discount = product.compare_price
    ? discountPercent(product.price, product.compare_price)
    : null

  const categoryLabel = product.category === 'rudraksha'
    ? 'Rudraksha'
    : product.category === 'crystal'
      ? 'Crystal'
      : 'Combo'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={`/product/${product.slug}`} className="block group">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-lt/60 hover:border-gold/40 transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,168,75,0.12)]">

          {/* Image Container */}
          <div className="relative aspect-[4/5] bg-ivory overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badge */}
            {discount ? (
              <span className="absolute top-4 left-4 bg-terra text-white text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                {discount}% Off
              </span>
            ) : (
              <span className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-sm text-gold text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
                ✦ Certified
              </span>
            )}

            {/* Hover Actions */}
            <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-charcoal/90 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider py-3.5 rounded-xl hover:bg-terra transition-colors duration-300"
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
                <div
                  className="flex items-center justify-center bg-white/90 backdrop-blur-md text-charcoal w-12 rounded-xl hover:bg-gold hover:text-white transition-colors duration-300"
                >
                  <Eye size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-5 space-y-2">
            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="w-4 h-px bg-gold" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold">
                {categoryLabel}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-lg font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-terra transition-colors duration-300">
              {product.name}
            </h3>

            {/* Description */}
            {product.description && (
              <p className="text-[13px] text-gray-brand leading-relaxed line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2.5 pt-1">
              {product.price === 0 ? (
                <span className="font-serif text-lg font-bold text-terra tracking-wide">Enquire Now</span>
              ) : (
                <>
                  <span className="font-serif text-xl font-bold text-charcoal">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_price && (
                    <span className="text-sm text-gray-brand/70 line-through">
                      {formatPrice(product.compare_price)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

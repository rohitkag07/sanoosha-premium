'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingBag, Zap, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cart'

interface Props {
  product: Product
}

export default function AddToCartButton({ product }: Props) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const router = useRouter()

  function handleAdd() {
    addItem(product, null, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    addItem(product, null, qty)
    router.push('/checkout')
  }

  return (
    <div className="space-y-3">
      {/* Qty selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-charcoal/70">Quantity</span>
        <div className="flex items-center border border-gray-lt rounded-full overflow-hidden">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-ivory transition-colors text-charcoal"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-charcoal">{qty}</span>
          <button
            onClick={() => setQty(q => Math.min(10, q + 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-ivory transition-colors text-charcoal"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-charcoal text-white hover:bg-terra hover:shadow-[0_8px_24px_rgba(139,58,42,0.3)] hover:-translate-y-0.5'
          }`}
        >
          {added ? <><Check size={16} /> Added!</> : <><ShoppingBag size={16} /> Add to Cart</>}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold uppercase tracking-wider bg-gold text-charcoal hover:bg-gold-light hover:shadow-[0_8px_24px_rgba(200,168,75,0.35)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <Zap size={16} /> Buy Now
        </button>
      </div>

      {/* Stock indicator */}
      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        In stock — ships within 2 business days
      </div>
    </div>
  )
}

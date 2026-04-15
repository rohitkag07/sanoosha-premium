'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cart'

interface Props {
  product: Product
}

export default function AddToCartButton({ product }: Props) {
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const router = useRouter()

  async function handleAdd() {
    setIsAdding(true)
    addItem(product, null, 1)
    router.refresh()
    setIsAdding(false)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding}
      className="inline-flex w-full items-center justify-center rounded-full bg-charcoal px-6 py-4 text-sm font-semibold text-white transition hover:bg-terra disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isAdding ? 'Adding…' : 'Add to cart'}
    </button>
  )
}

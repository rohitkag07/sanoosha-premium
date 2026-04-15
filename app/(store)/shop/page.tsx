import Link from 'next/link'
import ProductCard from '@/components/store/ProductCard'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'

interface ShopPageProps {
  searchParams: { category?: string }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const supabase = await createClient()
  let query = supabase.from('products').select('*').order('created_at', { ascending: false })

  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  const { data: products, error } = await query
  if (error) {
    console.error('Failed to load products', error)
  }

  return (
    <section className="container mx-auto px-4 max-w-[1240px] py-14">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-gold font-semibold">Shop</p>
          <h1 className="mt-3 text-4xl font-serif font-semibold text-charcoal">Browse our collections</h1>
        </div>
        <Link href="/cart" className="inline-flex items-center justify-center rounded-full border border-charcoal bg-white px-5 py-3 text-sm font-semibold text-charcoal hover:border-terra hover:text-terra transition">
          View Cart
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products?.length ? (
          products.map(product => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-full rounded-[32px] border border-gray-100 bg-white p-16 text-center text-gray-brand">
            No products found for this collection.
          </div>
        )}
      </div>
    </section>
  )
}

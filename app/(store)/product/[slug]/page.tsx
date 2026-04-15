import { notFound } from 'next/navigation'
import AddToCartButton from './AddToCartButton'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, discountPercent } from '@/lib/utils'
import type { Product } from '@/types'

interface PageProps {
  params: { slug: string }
}

export default async function ProductPage({ params }: PageProps) {
  const supabase = await createClient()
  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('slug', params.slug)
    .maybeSingle()

  if (error || !product) {
    notFound()
  }

  const discount = product.compare_price ? discountPercent(product.price, product.compare_price) : null

  return (
    <section className="container mx-auto px-4 max-w-[1240px] py-14">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] overflow-hidden bg-white shadow-sm border border-gray-100">
          <img src={product.images[0]} alt={product.name} className="w-full object-cover h-[560px]" />
        </div>

        <div className="space-y-6">
          <div className="text-sm uppercase tracking-[0.3em] text-gold font-semibold">{product.category}</div>
          <h1 className="text-4xl font-serif font-semibold text-charcoal">{product.name}</h1>
          {product.description && <p className="text-base leading-8 text-gray-brand">{product.description}</p>}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-charcoal">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-sm line-through text-gray-brand">{formatPrice(product.compare_price)}</span>
            )}
            {discount && <span className="rounded-full bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-gold">{discount}% off</span>}
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-sm uppercase tracking-[0.24em] text-charcoal/70 font-semibold">Product details</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-brand">
                <li>Authentic Nepal-sourced materials</li>
                <li>Ready to ship with premium packaging</li>
                <li>Suitable for meditation, healing and gift-giving</li>
              </ul>
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </section>
  )
}

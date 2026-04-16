export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ShoppingBag, Sparkles } from 'lucide-react'
import ShopGrid from '@/components/store/ShopGrid'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load products', error)
  }

  return (
    <>
      {/* ─── Premium Hero Banner ─── */}
      <section className="relative overflow-hidden bg-charcoal">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #C8A84B 1px, transparent 1px), radial-gradient(circle at 80% 20%, #C8A84B 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent" />

        <div className="relative container mx-auto px-4 max-w-[1240px] py-20 md:py-28">
          <div className="flex flex-col items-center text-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-gold/60" />
              <Sparkles size={14} className="text-gold" />
              <span className="text-[11px] font-semibold tracking-[0.35em] uppercase text-gold/80">
                Sacred Collection
              </span>
              <Sparkles size={14} className="text-gold" />
              <span className="h-px w-8 bg-gold/60" />
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white leading-[1.1] max-w-2xl">
              Handpicked for
              <span className="block text-gold mt-1">Spiritual Growth</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base md:text-lg text-white/50 max-w-lg leading-relaxed">
              Nepal-origin Rudraksha beads and natural crystal bracelets. 
              Lab certified, ritually energised, shipped worldwide.
            </p>

            {/* CTA */}
            <Link
              href="/cart"
              className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-gold hover:border-gold hover:text-charcoal transition-all duration-300"
            >
              <ShoppingBag size={16} />
              View Cart
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#f8f5f0] to-transparent" />
      </section>

      {/* ─── Products Grid ─── */}
      <section className="container mx-auto px-4 max-w-[1240px] py-14">
        <ShopGrid
          products={(products as Product[]) ?? []}
          initialCategory={params.category}
        />
      </section>
    </>
  )
}

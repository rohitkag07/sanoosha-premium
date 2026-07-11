export const dynamic = 'force-dynamic'

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

  if (error) console.error('Failed to load products', error)

  const list = (products as Product[]) ?? []

  return (
    <>
      {/* ── Dark Hero ── */}
      <section className="relative bg-charcoal overflow-hidden">
        {/* Radial glows */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(139,58,42,0.28) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 50%, rgba(200,168,75,0.10) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 100%, rgba(200,168,75,0.06) 0%, transparent 40%)
            `,
          }}
        />
        {/* Concentric circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[600, 800, 1000].map(size => (
            <div
              key={size}
              className="absolute rounded-full border border-gold/[0.07]"
              style={{ width: size, height: size }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-[1240px] py-20 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-7 bg-gold/60" />
            <span className="text-[10.5px] font-medium tracking-[0.28em] uppercase text-gold">
              Nepal · Lab Certified · Pre-Energised
            </span>
            <span className="h-px w-7 bg-gold/60" />
          </div>

          {/* Headline */}
          <h1 className="font-serif font-light text-ivory leading-[1.1] tracking-[0.02em] mb-4"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)' }}
          >
            The <em className="not-italic italic text-gold-light font-normal">Sacred</em> Collection
          </h1>

          {/* Description */}
          <p className="text-[0.88rem] leading-[1.75] max-w-[480px] mx-auto mb-0"
            style={{ color: 'rgba(249,245,238,0.58)' }}
          >
            Each piece in our collection is hand-selected from Nepal&apos;s sacred mountains —
            authenticated, ritually energised, and delivered to your doorstep with intention.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-10 pt-7 mt-6 border-t border-white/8">
            {[
              { num: `${list.length}`, label: 'Products' },
              { num: '4.9★', label: 'Avg Rating' },
              { num: '12K+', label: 'Happy Seekers' },
              { num: '100%', label: 'Authentic' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <span className="font-serif text-[1.75rem] font-semibold text-gold-light block leading-none">
                  {s.num}
                </span>
                <span className="text-[0.65rem] tracking-[0.1em] uppercase mt-1 block"
                  style={{ color: 'rgba(249,245,238,0.42)' }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#f8f5f0] to-transparent" />
      </section>

      {/* ── Shop Grid with sidebar ── */}
      <ShopGrid products={list} initialCategory={params.category} />
    </>
  )
}

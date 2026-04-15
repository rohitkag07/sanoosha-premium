import Link from 'next/link'
import ProductCard from '@/components/store/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Failed to load featured products', error)
    return []
  }

  if (data?.length) {
    return data
  }

  const fallback = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  return fallback.data ?? []
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <section className="container mx-auto px-4 max-w-[1240px] pt-12 pb-20">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-gold/10 text-gold px-4 py-2 text-sm font-semibold uppercase tracking-[0.26em]">
            Spiritual jewellery from Nepal
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-semibold tracking-tight text-charcoal leading-tight">
            Authentic Rudraksha, crystals and energy jewellery curated for your wellbeing.
          </h1>
          <p className="max-w-2xl text-base text-gray-brand leading-8">
            Discover ritual-ready malas, healing stones, and premium spiritual gifts sourced with care.
            Shop certified pieces for meditation, manifestation, and protection.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/shop" className="inline-flex items-center justify-center rounded-full bg-charcoal px-8 py-4 text-sm font-semibold text-white hover:bg-terra transition">
              Shop all products
            </Link>
            <Link href="/shop?category=rudraksha" className="inline-flex items-center justify-center rounded-full border border-charcoal bg-white px-8 py-4 text-sm font-semibold text-charcoal hover:border-terra hover:text-terra transition">
              Explore Rudraksha
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {featuredProducts.map(product => (
            <article key={product.id} className="rounded-[32px] overflow-hidden border border-white shadow-[0_40px_90px_-48px_rgba(44,51,61,0.45)] bg-white">
              <img src={product.images[0]} alt={product.name} className="h-[360px] w-full object-cover" />
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-semibold">{product.category}</p>
                <h2 className="mt-4 text-2xl font-serif font-semibold text-charcoal">{product.name}</h2>
                <p className="mt-4 text-sm leading-7 text-gray-brand">{product.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xl font-bold text-charcoal">{formatPrice(product.price)}</span>
                  <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-terra hover:text-charcoal transition">
                    View product
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section id="story" className="mt-20 rounded-[40px] bg-white border border-gray-100 p-10 shadow-sm">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-serif font-semibold text-charcoal">Sanoosha premium craftsmanship</h2>
            <p className="mt-5 text-base leading-8 text-gray-brand">
              Every jasper, rudraksha bead and mala is selected for authenticity, energetic purity and premium finish.
              Our pieces are handcrafted and shipped from Nepal with love and ritual respect.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-gray-brand">
            <div className="rounded-3xl bg-[#f9f5ef] p-6">
              <h3 className="font-semibold text-charcoal">Certified stones</h3>
              <p className="mt-3">Gemstone quality checked and approved for spiritual practice.</p>
            </div>
            <div className="rounded-3xl bg-[#f9f5ef] p-6">
              <h3 className="font-semibold text-charcoal">Gift-ready packaging</h3>
              <p className="mt-3">Luxury packaging for gifting and premium unboxing experiences.</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

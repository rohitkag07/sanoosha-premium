export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from './AddToCartButton'
import ProductCard from '@/components/store/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, discountPercent } from '@/lib/utils'
import type { Product } from '@/types'
import { ShieldCheck, RotateCcw, Truck, Star, ChevronRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

const CATEGORY_BENEFITS: Record<string, string[]> = {
  rudraksha: ['Spiritual Protection', 'Stress Relief', 'Energy Balancing', 'Meditation Aid'],
  crystal: ['Healing Energy', 'Chakra Balancing', 'Protection', 'Positive Vibes'],
  combo: ['Complete Healing', 'Enhanced Energy', 'Gift Ready', 'Certified Authentic'],
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !product) notFound()

  // Related products
  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('slug', slug)
    .limit(3)

  const discount = product.compare_price ? discountPercent(product.price, product.compare_price) : null
  const benefits = CATEGORY_BENEFITS[product.category] ?? CATEGORY_BENEFITS.rudraksha
  const categoryLabel = product.category === 'rudraksha' ? 'Rudraksha' : product.category === 'crystal' ? 'Crystal' : 'Combo'

  return (
    <div className="bg-[#f8f5f0]">

      {/* ── Breadcrumb ── */}
      <div className="container mx-auto px-4 max-w-[1240px] py-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-brand">
          <Link href="/" className="hover:text-terra transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-terra transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop?category=${product.category}`} className="hover:text-terra transition-colors capitalize">{categoryLabel}</Link>
          <ChevronRight size={12} />
          <span className="text-charcoal font-medium line-clamp-1">{product.name}</span>
        </nav>
      </div>

      {/* ── Main product section ── */}
      <section className="container mx-auto px-4 max-w-[1240px] pb-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">

          {/* Left — Image */}
          <div className="space-y-3">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-lt/60 aspect-square shadow-sm">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                priority
              />
              {discount && (
                <span className="absolute top-5 left-5 bg-terra text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                  {discount}% Off
                </span>
              )}
            </div>
            {/* Thumbnail strip — show same image as placeholders if only one image */}
            <div className="flex gap-2">
              {(product.images.length > 1 ? product.images : [product.images[0], product.images[0], product.images[0]]).slice(0, 4).map((img: string, i: number) => (
                <div key={i} className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${i === 0 ? 'border-gold shadow-[0_0_0_3px_rgba(200,168,75,0.2)]' : 'border-gray-lt hover:border-gold/60'}`}>
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div className="bg-white rounded-3xl p-8 border border-gray-lt/60 shadow-sm space-y-5">

            {/* Category + Rating */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-gold">
                <span className="w-4 h-px bg-gold" /> {categoryLabel}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < 4 ? 'fill-gold text-gold' : 'fill-gold/30 text-gold/30'} />
                ))}
                <span className="text-xs text-gray-brand ml-1">(4.8)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl font-semibold text-charcoal leading-tight">{product.name}</h1>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-brand leading-7">{product.description}</p>
            )}

            {/* Benefit chips */}
            <div className="flex flex-wrap gap-2">
              {benefits.map(b => (
                <span key={b} className="text-[11px] font-semibold bg-gold/10 text-gold px-3 py-1.5 rounded-full uppercase tracking-wide">{b}</span>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-lt" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.price === 0 ? (
                <span className="font-serif text-2xl font-bold text-terra">Price on Request</span>
              ) : (
                <>
                  <span className="font-serif text-3xl font-bold text-charcoal">{formatPrice(product.price)}</span>
                  {product.compare_price && (
                    <>
                      <span className="text-base text-gray-brand/60 line-through">{formatPrice(product.compare_price)}</span>
                      {discount && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Save {discount}%</span>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Add to cart */}
            {product.price > 0 ? (
              <AddToCartButton product={product} />
            ) : (
              <a
                href="https://wa.me/919232154621"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full py-4 text-sm font-semibold uppercase tracking-wider bg-[#25D366] text-white hover:bg-[#1ebe5a] transition-all duration-300"
              >
                Enquire on WhatsApp
              </a>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { icon: ShieldCheck, label: '100% Authentic', sub: 'Certified' },
                { icon: RotateCcw, label: '7-Day Returns', sub: 'Easy process' },
                { icon: Truck, label: 'Free Shipping', sub: 'Orders ₹999+' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-ivory border border-gray-lt/60 text-center">
                  <Icon size={17} className="text-terra" />
                  <span className="text-[11px] font-semibold text-charcoal">{label}</span>
                  <span className="text-[10px] text-gray-brand">{sub}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Details Tabs ── */}
      <ProductTabs product={product} />

      {/* ── Related Products ── */}
      {related && related.length > 0 && (
        <section className="container mx-auto px-4 max-w-[1240px] pb-20">
          <div className="mb-8">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold">You May Also Like</span>
            <h2 className="font-serif text-3xl font-semibold text-charcoal mt-2">Related Products</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(related as Product[]).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

    </div>
  )
}

function ProductTabs({ product }: { product: Product }) {
  return (
    <section className="container mx-auto px-4 max-w-[1240px] pb-16">
      <div className="bg-white rounded-3xl border border-gray-lt/60 overflow-hidden shadow-sm">
        {/* Tab header */}
        <div className="flex border-b border-gray-lt overflow-x-auto">
          {['Description', 'Benefits', 'Shipping & Returns', 'Care'].map((tab, i) => (
            <div
              key={tab}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap cursor-default transition-colors ${i === 0 ? 'text-terra border-b-2 border-terra' : 'text-gray-brand hover:text-charcoal'}`}
            >
              {tab}
            </div>
          ))}
        </div>
        {/* Tab body — showing Description by default (static render) */}
        <div className="p-8 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-serif text-xl font-semibold text-charcoal mb-4">About this product</h3>
            <p className="text-sm text-gray-brand leading-7">{product.description}</p>
            <div className="mt-6 space-y-3">
              {[
                ['Origin', 'Nepal (Himalayan foothills)'],
                ['Energisation', 'Vedic mantra chanting, 108 repetitions'],
                ['Certificate', 'Included with every order'],
                ['Packaging', 'Premium gift-ready box'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3 text-sm">
                  <span className="w-28 flex-shrink-0 font-semibold text-charcoal">{k}</span>
                  <span className="text-gray-brand">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-charcoal mb-4">Spiritual Benefits</h3>
            <div className="space-y-3">
              {(CATEGORY_BENEFITS[product.category] ?? CATEGORY_BENEFITS.rudraksha).map(b => (
                <div key={b} className="flex items-center gap-3 text-sm text-gray-brand">
                  <span className="w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center text-xs">✦</span>
                  {b}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-ivory border border-gray-lt/60">
              <p className="text-xs text-gray-brand leading-6 italic">
                Spiritual and healing properties described are based on traditional Vedic beliefs. Individual experiences may vary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

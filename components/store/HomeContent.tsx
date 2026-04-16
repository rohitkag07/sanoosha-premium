'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Shield, Gem, Package, Truck, Star, ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'
import type { Product } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }
  })
}

const TRUST_ITEMS = [
  { icon: '🔬', text: 'Lab Certified' },
  { icon: '🕉️', text: 'Ritually Energised' },
  { icon: '🇳🇵', text: 'Nepal Origin' },
  { icon: '📦', text: 'Premium Packaging' },
  { icon: '🚚', text: 'Free Shipping ₹999+' },
]

const FEATURES = [
  { icon: Shield, title: 'Certified Authenticity', desc: 'Every stone is lab-tested and comes with a certificate of authenticity.' },
  { icon: Gem, title: 'Hand-selected Beads', desc: 'Our experts personally select each Rudraksha for quality and energetic purity.' },
  { icon: Package, title: 'Gift-ready Packaging', desc: 'Luxurious packaging that makes every order feel like a spiritual gift.' },
  { icon: Truck, title: 'Worldwide Shipping', desc: 'Safely shipped from Nepal to your doorstep with tracking.' },
]

const TESTIMONIALS = [
  { stars: 5, text: 'The 5 Mukhi Rudraksha has brought incredible peace into my daily meditation practice. The quality is unmatched.', name: 'Priya S.', label: 'Verified Buyer' },
  { stars: 5, text: 'I ordered the Black Obsidian bracelet and it arrived beautifully packaged. Feels premium and the energy is amazing.', name: 'Arjun M.', label: 'Verified Buyer' },
  { stars: 5, text: 'Finally found a trusted source for authentic Rudraksha. The certification gives me complete confidence.', name: 'Meera K.', label: 'Verified Buyer' },
]

const CATEGORIES = [
  {
    title: 'Rudraksha',
    subtitle: 'Sacred Seeds of Shiva',
    image: 'https://sanoosha.com/wp-content/uploads/2026/03/Gemini_Generated_Image_w7sdvuw7sdvuw7sd-600x600.png',
    href: '/shop?category=rudraksha',
  },
  {
    title: 'Crystal Bracelets',
    subtitle: 'Natural Healing Energy',
    image: 'https://sanoosha.com/wp-content/uploads/2026/03/DEF4C7C7-E0F3-4EA6-8656-F2009E742EA4-600x600.png',
    href: '/shop?category=crystal',
  },
  {
    title: 'Combo Sets',
    subtitle: 'Curated Collections',
    image: 'https://sanoosha.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-03-at-10.30.16-600x600.jpeg',
    href: '/shop?category=combo',
  },
]

interface HomeContentProps {
  featuredProducts: Product[]
}

export default function HomeContent({ featuredProducts }: HomeContentProps) {
  return (
    <>
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-ivory">
        {/* Subtle radial pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #C8A84B 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative container mx-auto px-4 max-w-[1240px] py-20">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left — Copy */}
            <div className="space-y-7">
              <motion.div
                className="flex items-center gap-3"
                variants={fadeUp} initial="hidden" animate="visible" custom={0}
              >
                <span className="h-[1.5px] w-10 bg-gold" />
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold">Spiritual Jewellery from Nepal</span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-[3.6rem] font-serif font-semibold leading-[1.08] text-charcoal"
                variants={fadeUp} initial="hidden" animate="visible" custom={1}
              >
                Authentic Rudraksha
                <br />
                <em className="text-terra not-italic">& Crystal Healing</em>
                <br />
                <span className="text-gold">Jewellery</span>
              </motion.h1>

              <motion.p
                className="text-base md:text-lg text-gray-brand leading-relaxed max-w-md"
                variants={fadeUp} initial="hidden" animate="visible" custom={2}
              >
                Discover ritual&#8209;ready malas, healing stones, and premium spiritual gifts.
                Each piece is hand&#8209;selected, lab certified, and energised before dispatch.
              </motion.p>

              <motion.div className="flex flex-wrap gap-4" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-terra hover:bg-terra-dark text-white text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-md transition-all duration-300 hover:shadow-[0_8px_24px_rgba(139,58,42,0.35)] hover:-translate-y-0.5"
                >
                  Shop All Products
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/shop?category=rudraksha"
                  className="inline-flex items-center gap-2 border-2 border-charcoal text-charcoal text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-md hover:border-terra hover:text-terra transition-all duration-300"
                >
                  Explore Rudraksha
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="flex gap-8 pt-6 border-t border-gray-lt"
                variants={fadeUp} initial="hidden" animate="visible" custom={4}
              >
                {[
                  { num: '5,000+', label: 'Happy Customers' },
                  { num: '100%', label: 'Certified Authentic' },
                  { num: '30+', label: 'Products' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="font-serif text-3xl font-bold text-terra">{stat.num}</div>
                    <div className="text-xs text-gray-brand mt-0.5 font-medium">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Visual Grid */}
            <motion.div
              className="relative grid grid-cols-2 gap-3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="row-span-2 rounded-2xl overflow-hidden aspect-[3/5]">
                <Image
                  src="https://sanoosha.com/wp-content/uploads/2026/03/Gemini_Generated_Image_w7sdvuw7sdvuw7sd-600x600.png"
                  alt="Premium 1 Mukhi Rudraksha"
                  width={400} height={667}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="https://sanoosha.com/wp-content/uploads/2026/03/1_26_f2dcd5ce-8865-4601-a04b-6be99e40c69b-600x600.webp"
                  alt="2 Mukhi Rudraksha"
                  width={400} height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="https://sanoosha.com/wp-content/uploads/2026/03/DEF4C7C7-E0F3-4EA6-8656-F2009E742EA4-600x600.png"
                  alt="Rudraksha Charm Bracelet"
                  width={400} height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-lg z-10">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-charcoal whitespace-nowrap">Orders shipping daily</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ TRUST BAR ════════════════ */}
      <section className="bg-charcoal py-4">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="flex items-center justify-center flex-wrap gap-0">
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 px-6 py-1 border-r border-white/10 last:border-r-0">
                <span className="text-base">{item.icon}</span>
                <span className="text-[13px] font-medium tracking-wide text-white/80">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CATEGORIES ════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold">Browse by Category</span>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-charcoal">Our Collections</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={cat.href} className="group block relative rounded-2xl overflow-hidden aspect-[4/5]">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent group-hover:from-terra/80 group-hover:via-charcoal/15 transition-all duration-500" />
                  <div className="absolute bottom-0 inset-x-0 p-7">
                    <p className="text-[11px] uppercase tracking-widest text-white/70 mb-1">{cat.subtitle}</p>
                    <h3 className="font-serif text-2xl font-semibold text-white mb-3">{cat.title}</h3>
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-semibold text-gold-light group-hover:gap-3 transition-all duration-300">
                      Explore <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ FEATURED PRODUCTS ════════════════ */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold">Handpicked</span>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-charcoal">Featured Products</h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-terra uppercase tracking-wider hover:gap-3 transition-all duration-300"
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-terra uppercase tracking-wider">
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════ BRAND STORY ════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            {/* Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                <Image
                  src="https://sanoosha.com/wp-content/uploads/2026/03/1_4_aa2b33b1-261c-4143-aa6e-e44c4d0159cd-600x600.webp"
                  alt="Sanoosha Craftsmanship"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
              {/* Floating certificate pill */}
              <div className="absolute top-6 -right-4 bg-white rounded-full px-5 py-3 flex items-center gap-3 shadow-lg">
                <span className="text-xl">🔬</span>
                <div>
                  <div className="text-xs text-gray-brand">Lab Tested</div>
                  <div className="text-sm font-bold text-charcoal">100% Certified</div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold">Our Story</span>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-charcoal leading-snug">
                Sanoosha Premium Craftsmanship
              </h2>
              <p className="mt-5 text-base text-gray-brand leading-relaxed max-w-lg">
                Every jasper, rudraksha bead and mala is selected for authenticity,
                energetic purity and premium finish. Our pieces are handcrafted and
                shipped from Nepal with love and ritual respect.
              </p>

              <div className="grid grid-cols-2 gap-5 mt-8">
                {FEATURES.map((f, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-lg bg-terra/8 flex items-center justify-center flex-shrink-0">
                      <f.icon size={18} className="text-terra" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-charcoal">{f.title}</h4>
                      <p className="text-xs text-gray-brand mt-0.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/shop"
                className="mt-10 inline-flex items-center gap-2 bg-terra hover:bg-terra-dark text-white text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-md transition-all duration-300"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section className="py-20 bg-charcoal">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold-light">The Process</span>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-white">How It Works</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '01', icon: '🔍', title: 'Choose Your Piece', desc: 'Browse our curated collection of authentic Rudraksha beads and healing crystal bracelets.' },
              { step: '02', icon: '🕉️', title: 'We Energise It', desc: 'Every piece is ritually energised with Vedic mantras by our trained practitioners before dispatch.' },
              { step: '03', icon: '📦', title: 'Delivered With Care', desc: 'Premium gift-ready packaging, shipped with tracking. Free delivery on orders above ₹999.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center p-8 bg-white/5 border border-white/8 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <div className="font-serif text-5xl font-bold text-gold/20 mb-4">{item.step}</div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold">Customer Love</span>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-charcoal">What Our Customers Say</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                className="bg-cream border border-gray-lt rounded-2xl p-7 hover:border-gold hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="flex gap-0.5 text-gold mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="font-serif text-lg italic text-charcoal leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-light flex items-center justify-center font-serif text-lg font-bold text-terra">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-charcoal">{t.name}</div>
                    <div className="text-xs text-gray-brand">{t.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CONTACT STRIP ════════════════ */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {[
              { icon: '📧', title: 'Email Us', value: 'sanooshatjewel@yahoo.com', href: 'mailto:sanooshatjewel@yahoo.com' },
              { icon: '📱', title: 'WhatsApp', value: '+91 9232154621', href: 'https://wa.me/919232154621' },
              { icon: '📍', title: 'Location', value: 'Noida, Uttar Pradesh', href: null },
            ].map((c, i) => (
              <div key={i} className="py-4">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h4 className="font-serif text-xl font-semibold text-charcoal mb-1">{c.title}</h4>
                {c.href ? (
                  <a href={c.href} className="text-sm font-medium text-terra hover:underline">{c.value}</a>
                ) : (
                  <p className="text-sm font-medium text-terra">{c.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

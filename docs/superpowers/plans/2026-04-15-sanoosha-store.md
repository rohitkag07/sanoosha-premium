# Sanoosha Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete customer-facing e-commerce store — Homepage, Shop, Product Detail, Cart, Checkout with Razorpay, and Order History.

**Architecture:** Next.js 14 App Router under `app/(store)/`. Server Components fetch data from Supabase. Cart state lives in Zustand (localStorage persisted). Razorpay checkout triggered from client, order created/verified via Next.js API routes. All prices stored in paise, displayed in rupees.

**Tech Stack:** Next.js 14, TypeScript, TailwindCSS 3.4, Zustand, Razorpay JS SDK, Supabase JS v2, Framer Motion, Lucide React

**Prerequisites:** Foundation plan complete — DB seeded, auth working, middleware active.

---

## File Map

| File | Purpose |
|---|---|
| `store/cart.ts` | Zustand cart store with localStorage persistence |
| `lib/utils.ts` | Price formatting, slug utils |
| `lib/razorpay.ts` | Server-side Razorpay order creation |
| `components/store/AnnouncementBar.tsx` | Top announcement strip |
| `components/store/Navbar.tsx` | Navigation with cart badge |
| `components/store/Footer.tsx` | Site footer |
| `components/store/ProductCard.tsx` | Reusable product card |
| `app/(store)/layout.tsx` | Store layout (Navbar + Footer) |
| `app/(store)/page.tsx` | Homepage |
| `app/(store)/shop/page.tsx` | Product listing with filters |
| `app/(store)/product/[slug]/page.tsx` | Product detail page |
| `app/(store)/cart/page.tsx` | Cart page |
| `app/(store)/checkout/page.tsx` | Checkout + Razorpay trigger |
| `app/api/razorpay/create-order/route.ts` | Create Razorpay order (server) |
| `app/api/razorpay/verify/route.ts` | Verify payment signature (server) |
| `app/(store)/orders/page.tsx` | Customer order history |
| `app/(store)/orders/[id]/page.tsx` | Order detail page |

---

## Task 1: Utilities & Cart Store

**Files:**
- Create: `lib/utils.ts`, `store/cart.ts`

- [ ] **Step 1: Create `lib/utils.ts`**

```typescript
// Format paise to rupee display string: 129900 → "₹1,299"
export function formatPrice(paise: number): string {
  if (paise === 0) return 'Contact Us'
  const rupees = paise / 100
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees)
}

// Calculate discount percentage
export function discountPercent(price: number, comparePrice: number): number {
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

// Calculate final price with variant modifier
export function variantPrice(basePrice: number, modifier: number): number {
  return basePrice + modifier
}

// Slugify a string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
```

- [ ] **Step 2: Create `store/cart.ts`**

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, ProductVariant } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, variant: ProductVariant | null, quantity?: number) => void
  removeItem: (productId: string, variantId: string | null) => void
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number // returns paise
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) => {
        set(state => {
          const existing = state.items.find(
            i => i.product.id === product.id && i.variant?.id === variant?.id
          )
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id && i.variant?.id === variant?.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, { product, variant, quantity }] }
        })
      },

      removeItem: (productId, variantId) => {
        set(state => ({
          items: state.items.filter(
            i => !(i.product.id === productId && (i.variant?.id ?? null) === variantId)
          ),
        }))
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.product.id === productId && (i.variant?.id ?? null) === variantId
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => {
          const price = i.product.price + (i.variant?.price_modifier ?? 0)
          return sum + price * i.quantity
        }, 0),
    }),
    { name: 'sanoosha-cart' }
  )
)
```

- [ ] **Step 3: Commit**

```bash
git add lib/utils.ts store/cart.ts
git commit -m "feat: add price utils and zustand cart store with persistence"
```

---

## Task 2: Shared Store Components

**Files:**
- Create: `components/store/AnnouncementBar.tsx`, `components/store/Navbar.tsx`, `components/store/Footer.tsx`, `components/store/ProductCard.tsx`

- [ ] **Step 1: Create `components/store/AnnouncementBar.tsx`**

```typescript
export default function AnnouncementBar() {
  return (
    <div className="bg-terra text-white text-center py-2 px-4 text-xs font-medium tracking-wide">
      🌿 Free Shipping on orders above ₹999 &nbsp;|&nbsp; All Rudraksha are{' '}
      <span className="text-gold-light font-semibold">100% Authenticated & Certified</span>{' '}
      &nbsp;|&nbsp; Energised before dispatch
    </div>
  )
}
```

- [ ] **Step 2: Create `components/store/Navbar.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { ShoppingBag, User, Search } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function Navbar() {
  const totalItems = useCartStore(s => s.totalItems())

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-lt">
      <nav className="container mx-auto px-4 max-w-[1240px] flex items-center justify-between h-[72px]">

        {/* Logo */}
        <Link href="/">
          <img
            src="https://sanoosha.com/wp-content/uploads/2024/04/Sanoo-Photoroom.png"
            alt="Sanoosha"
            className="h-11"
          />
        </Link>

        {/* Nav links */}
        <ul className="hidden md:flex gap-8 list-none">
          {[
            { label: 'Rudraksha', href: '/shop?category=rudraksha' },
            { label: 'Crystals', href: '/shop?category=crystal' },
            { label: 'Combos', href: '/shop?category=combo' },
            { label: 'About', href: '/#story' },
            { label: 'Contact', href: '/#contact' },
          ].map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-charcoal hover:text-terra transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <Link href="/shop" aria-label="Search">
            <Search size={20} className="text-charcoal hover:text-terra transition-colors" />
          </Link>

          <Link href="/login" aria-label="Account">
            <User size={20} className="text-charcoal hover:text-terra transition-colors" />
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingBag size={20} className="text-charcoal hover:text-terra transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-terra text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 3: Create `components/store/Footer.tsx`**

```typescript
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-12 pb-6">
      <div className="container mx-auto px-4 max-w-[1240px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <img
              src="https://sanoosha.com/wp-content/uploads/2024/04/Sanoo-Photoroom.png"
              alt="Sanoosha"
              className="h-10 mb-4 brightness-0 invert"
            />
            <p className="text-sm text-white/60 leading-relaxed">
              Authentic and energy-cleansed crystals crafted to heal, uplift, and empower your spiritual journey.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://wa.me/919232154621" target="_blank" rel="noreferrer"
                className="text-white/60 hover:text-gold transition-colors text-sm">WhatsApp</a>
              <a href="mailto:sanooshatjewel@yahoo.com"
                className="text-white/60 hover:text-gold transition-colors text-sm">Email</a>
            </div>
          </div>

          {/* Rudraksha */}
          <div>
            <h5 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Rudraksha</h5>
            <ul className="space-y-2">
              {['1 Mukhi', '2 Mukhi', '3 Mukhi', '5 Mukhi', '7 Mukhi'].map(m => (
                <li key={m}>
                  <Link href={`/product/${m.toLowerCase().replace(' ', '-')}-rudraksha`}
                    className="text-sm text-white/60 hover:text-gold transition-colors">{m}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bracelets */}
          <div>
            <h5 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Bracelets</h5>
            <ul className="space-y-2">
              {['Rudraksha Charm', 'Black Obsidian', 'Clear Quartz', 'Seven Chakra'].map(b => (
                <li key={b}>
                  <Link href="/shop?category=crystal"
                    className="text-sm text-white/60 hover:text-gold transition-colors">{b}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Contact</h5>
            <ul className="space-y-2 text-sm text-white/60">
              <li>sanooshatjewel@yahoo.com</li>
              <li>+91 9232154621</li>
              <li>B-65, Second Floor, Sector-56,<br />Noida – 201301</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Sanoosha. All rights reserved. | 100% Authentic Nepal-Origin Rudraksha
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Create `components/store/ProductCard.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice, discountPercent } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore(s => s.addItem)

  function handleAddToCart() {
    addItem(product, null, 1)
  }

  const discount = product.compare_price
    ? discountPercent(product.price, product.compare_price)
    : null

  return (
    <div className="bg-white rounded-brand overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-ivory overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount && (
            <span className="absolute top-3 left-3 bg-terra text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              {discount}% OFF
            </span>
          )}
          {!discount && (
            <span className="absolute top-3 left-3 bg-gold text-charcoal text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Certified
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-gold mb-1">
          {product.category === 'rudraksha' ? 'Rudraksha' : product.category === 'crystal' ? 'Crystal Healing' : 'Combo'}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-[1.05rem] font-semibold text-charcoal leading-snug mb-2 hover:text-terra transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-xs text-gray-brand mb-3 line-clamp-2 leading-relaxed">
            {product.description?.split('.')[0]}
          </p>
        )}

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-serif text-xl font-bold text-charcoal">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && product.compare_price > 0 && (
            <span className="text-xs text-gray-brand line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        {product.price > 0 ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-charcoal hover:bg-terra text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
        ) : (
          <Link href={`/product/${product.slug}`}
            className="w-full bg-charcoal hover:bg-terra text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            View Details
          </Link>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `app/(store)/layout.tsx`**

```typescript
import AnnouncementBar from '@/components/store/AnnouncementBar'
import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/ app/\(store\)/layout.tsx
git commit -m "feat: add store layout components - navbar, footer, product card"
```

---

## Task 3: Homepage

**Files:**
- Create: `app/(store)/page.tsx`

- [ ] **Step 1: Create `app/(store)/page.tsx`**

```typescript
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import type { Product } from '@/types'

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('in_stock', true)
    .limit(4)
  return data ?? []
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <>
      {/* HERO */}
      <section className="min-h-[90vh] grid grid-cols-1 md:grid-cols-2 bg-ivory overflow-hidden">
        {/* Content */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[1.5px] bg-gold" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold">
              Divine Energy
            </span>
          </div>

          <h1 className="font-serif text-[clamp(2.8rem,5vw,4.5rem)] font-semibold leading-[1.1] text-charcoal mb-5">
            Wear the Power of{' '}
            <em className="italic text-terra not-italic">Sacred Rudraksha</em>
          </h1>

          <p className="text-[1.05rem] text-gray-brand leading-[1.75] max-w-[440px] mb-8">
            100% authentic, Nepal-origin Rudraksha beads and energy-cleansed crystal bracelets.
            Certified, pre-energised, and delivered with divine intention.
          </p>

          <div className="flex gap-4 flex-wrap mb-10">
            <Link href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-terra hover:bg-terra-dark text-white text-sm font-semibold uppercase tracking-wide rounded transition-all hover:-translate-y-0.5 hover:shadow-lg">
              Shop Now →
            </Link>
            <Link href="/#story"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-[1.5px] border-terra text-terra text-sm font-semibold uppercase tracking-wide rounded hover:bg-terra hover:text-white transition-all">
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-6 border-t border-gray-lt">
            {[
              { num: '500+', label: 'Happy Customers' },
              { num: '100%', label: 'Nepal Authentic' },
              { num: '8+', label: 'Mukhi Varieties' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-serif text-3xl font-bold text-terra leading-none">{s.num}</div>
                <div className="text-xs text-gray-brand mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero images */}
        <div className="relative grid grid-cols-2 gap-3 p-8">
          <div className="col-span-1 row-span-2 rounded-l-2xl overflow-hidden">
            <img
              src="https://sanoosha.com/wp-content/uploads/2026/03/1_4_aa2b33b1-261c-4143-aa6e-e44c4d0159cd-600x600.webp"
              alt="Rudraksha Mala"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden">
            <img
              src="https://sanoosha.com/wp-content/uploads/2026/03/DEF4C7C7-E0F3-4EA6-8656-F2009E742EA4-600x600.png"
              alt="Crystal Bracelet"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden">
            <img
              src="https://sanoosha.com/wp-content/uploads/2026/03/7MukhiBead-600x600.webp"
              alt="Rudraksha Beads"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-charcoal py-4">
        <div className="container mx-auto px-4 max-w-[1240px] flex flex-wrap justify-center gap-0">
          {[
            { icon: '🌿', text: 'Nepal Origin Rudraksha' },
            { icon: '🏅', text: 'Lab Certified' },
            { icon: '⚡', text: 'Pre-Energised Dispatch' },
            { icon: '📦', text: 'Premium Packaging' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 px-8 py-2 ${i < 3 ? 'border-r border-white/15' : ''}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-white/80 font-medium tracking-wide">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="text-center mb-12">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold mb-3">Collections</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] font-semibold text-charcoal">
              Explore Our Sacred Collections
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Rudraksha Beads', sub: '8+ Mukhi varieties', img: 'https://sanoosha.com/wp-content/uploads/2026/03/7MukhiBead-600x600.webp', href: '/shop?category=rudraksha' },
              { title: 'Crystal Healing', sub: 'Energy bracelets', img: 'https://sanoosha.com/wp-content/uploads/2025/11/11-600x600.jpg', href: '/shop?category=crystal' },
              { title: 'Combo Sets', sub: 'Curated bundles', img: 'https://sanoosha.com/wp-content/uploads/2026/03/1_26_f2dcd5ce-8865-4601-a04b-6be99e40c69b-600x600.webp', href: '/shop?category=combo' },
            ].map(cat => (
              <Link key={cat.title} href={cat.href}
                className="relative aspect-[4/5] rounded-brand overflow-hidden group block">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 to-transparent group-hover:from-terra/80 transition-all" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-serif text-2xl font-semibold text-white mb-1">{cat.title}</h3>
                  <p className="text-[11px] text-white/75 uppercase tracking-widest mb-3">{cat.sub}</p>
                  <span className="text-[11px] font-semibold text-gold-light uppercase tracking-wide">Shop Now →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="py-20 bg-cream">
          <div className="container mx-auto px-4 max-w-[1240px]">
            <div className="flex justify-between items-end mb-12">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold mb-3">Featured</div>
                <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] font-semibold text-charcoal">
                  Most Loved Products
                </h2>
              </div>
              <Link href="/shop"
                className="text-sm font-semibold text-terra uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="text-center mb-12">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold mb-3">Process</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] font-semibold text-charcoal">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', icon: '🔍', title: 'Choose Your Bead', desc: 'Browse our certified collection and choose the Rudraksha or crystal that aligns with your spiritual goals.' },
              { num: '02', icon: '⚡', title: 'We Energise It', desc: 'Every piece is ritually cleansed and energised with Vedic mantras before dispatch.' },
              { num: '03', icon: '✨', title: 'Feel the Difference', desc: 'Wear daily and experience the positive shift in energy, clarity, and wellbeing.' },
            ].map(step => (
              <div key={step.num} className="text-center p-8 bg-ivory rounded-brand">
                <div className="font-serif text-5xl font-light text-gray-lt mb-4">{step.num}</div>
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-3">{step.title}</h3>
                <p className="text-sm text-gray-brand leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="text-center mb-12">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold mb-3">Customer Love</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] font-semibold text-charcoal">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Ranveer', label: 'Verified Buyer · Stone Bracelet', text: 'This bracelet exceeded my expectations. The craftsmanship is impressive and the material feels premium. Adds a bold yet classy touch to my everyday style.', avatar: 'R' },
              { name: 'Tanya', label: 'Verified Buyer · Crystal Bracelet', text: 'Whether you\'re looking for a trendy unisex bracelet or a thoughtful gift, this piece is fantastic. Absolutely love the quality and spiritual energy.', img: 'https://sanoosha.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-03-at-10.30.16-600x600.jpeg' },
              { name: 'Ankit Sharma', label: 'Verified Buyer · 5 Mukhi Rudraksha', text: 'My 5 Mukhi arrived beautifully packaged with a certificate of authenticity. I can feel the positive energy every day. Highly recommend Sanoosha!', avatar: 'A' },
            ].map(t => (
              <div key={t.name} className="bg-white p-8 rounded-brand shadow-sm">
                <div className="text-gold text-lg mb-4">★★★★★</div>
                <p className="text-sm text-gray-brand leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  {t.img ? (
                    <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-terra text-white flex items-center justify-center font-semibold text-sm">
                      {t.avatar}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-sm text-charcoal">{t.name}</div>
                    <div className="text-xs text-gray-brand">{t.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Test homepage**

```bash
npm run dev
```
Visit `http://localhost:3000` — hero, categories, featured products, how-it-works, testimonials should all render.

- [ ] **Step 3: Commit**

```bash
git add app/\(store\)/page.tsx
git commit -m "feat: add homepage with hero, categories, featured products, testimonials"
```

---

## Task 4: Shop Page

**Files:**
- Create: `app/(store)/shop/page.tsx`

- [ ] **Step 1: Create `app/(store)/shop/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import type { Product, ProductCategory } from '@/types'

interface Props {
  searchParams: Promise<{ category?: string }>
}

async function getProducts(category?: string): Promise<Product[]> {
  const supabase = await createClient()
  let query = supabase.from('products').select('*').eq('in_stock', true).order('created_at', { ascending: false })

  if (category && ['rudraksha', 'crystal', 'combo'].includes(category)) {
    query = query.eq('category', category as ProductCategory)
  }

  const { data } = await query
  return data ?? []
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams
  const category = params.category
  const products = await getProducts(category)

  const categories = [
    { value: undefined, label: 'All Products' },
    { value: 'rudraksha', label: 'Rudraksha' },
    { value: 'crystal', label: 'Crystal Healing' },
    { value: 'combo', label: 'Combo Sets' },
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-ivory py-12 text-center border-b border-gray-lt">
        <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold mb-3">Our Collection</div>
        <h1 className="font-serif text-4xl font-semibold text-charcoal">Sacred Products</h1>
        <p className="text-gray-brand mt-3 text-sm">100% Authentic · Nepal Origin · Lab Certified</p>
      </div>

      <div className="container mx-auto px-4 max-w-[1240px] py-10">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat => (
            <a
              key={cat.label}
              href={cat.value ? `/shop?category=${cat.value}` : '/shop'}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat.value || (!category && !cat.value)
                  ? 'bg-terra text-white'
                  : 'bg-white text-charcoal border border-gray-lt hover:border-terra hover:text-terra'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-brand">
            <p className="font-serif text-2xl mb-2">No products found</p>
            <a href="/shop" className="text-terra text-sm underline">View all products</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Test shop page**

Visit `http://localhost:3000/shop` — all products listed. Visit `http://localhost:3000/shop?category=rudraksha` — only Rudraksha shown.

- [ ] **Step 3: Commit**

```bash
git add app/\(store\)/shop/
git commit -m "feat: add shop page with category filter"
```

---

## Task 5: Product Detail Page

**Files:**
- Create: `app/(store)/product/[slug]/page.tsx`

- [ ] **Step 1: Create `app/(store)/product/[slug]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AddToCartButton from './AddToCartButton'
import type { Product } from '@/types'
import { formatPrice, discountPercent } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('slug', slug)
    .single()
  return data
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const discount = product.compare_price
    ? discountPercent(product.price, product.compare_price)
    : null

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 max-w-[1240px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Image */}
          <div className="relative aspect-square rounded-brand overflow-hidden bg-ivory">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-terra text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold mb-3">
              {product.category === 'rudraksha' ? '100% Nepal Rudraksha' : 'Crystal Healing'}
            </div>
            <h1 className="font-serif text-3xl font-semibold text-charcoal leading-snug mb-4">
              {product.name}
            </h1>
            <p className="text-gray-brand leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-serif text-3xl font-bold text-charcoal">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && product.compare_price > 0 && (
                <>
                  <span className="text-gray-brand line-through text-lg">
                    {formatPrice(product.compare_price)}
                  </span>
                  <span className="bg-terra/10 text-terra text-xs font-bold px-2 py-1 rounded">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Variants + Add to cart */}
            <AddToCartButton product={product} />

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-gray-lt">
              {[
                { icon: '🌿', text: 'Nepal Origin' },
                { icon: '🏅', text: 'Lab Certified' },
                { icon: '⚡', text: 'Pre-Energised' },
                { icon: '📦', text: 'Premium Packaging' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2">
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-sm text-gray-brand font-medium">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/(store)/product/[slug]/AddToCartButton.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import type { Product, ProductVariant } from '@/types'
import { useCartStore } from '@/store/cart'
import { formatPrice, variantPrice } from '@/lib/utils'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.product_variants?.[0] ?? null
  )
  const [added, setAdded] = useState(false)

  const variants = product.product_variants ?? []
  const finalPrice = selectedVariant
    ? variantPrice(product.price, selectedVariant.price_modifier)
    : product.price

  function handleAdd() {
    if (product.price === 0) return
    addItem(product, selectedVariant, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      {/* Variant selector */}
      {variants.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-semibold text-charcoal mb-3">Select Type:</p>
          <div className="flex flex-wrap gap-2">
            {variants.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedVariant?.id === v.id
                    ? 'border-terra bg-terra text-white'
                    : 'border-gray-lt text-charcoal hover:border-terra hover:text-terra'
                }`}
              >
                {v.name}
                {v.price_modifier !== 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    ({v.price_modifier > 0 ? '+' : ''}{formatPrice(v.price_modifier)})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.price > 0 ? (
        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-terra hover:bg-terra-dark text-white hover:-translate-y-0.5 hover:shadow-lg'
          }`}
        >
          {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          {added ? 'Added to Cart!' : `Add to Cart — ${formatPrice(finalPrice)}`}
        </button>
      ) : (
        <div className="w-full text-center py-4 bg-ivory rounded-lg text-sm text-gray-brand">
          Contact us for pricing: <a href="tel:9232154621" className="text-terra font-semibold">9232154621</a>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Test product detail**

Visit `http://localhost:3000/product/5-mukhi-rudraksha` — product details, price, add to cart should work.

- [ ] **Step 4: Commit**

```bash
git add app/\(store\)/product/
git commit -m "feat: add product detail page with variant selector and add to cart"
```

---

## Task 6: Cart Page

**Files:**
- Create: `app/(store)/cart/page.tsx`

- [ ] **Step 1: Create `app/(store)/cart/page.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, variantPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()
  const total = totalPrice()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-5xl text-gray-lt mb-4">🛍</div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-3">Your cart is empty</h2>
          <p className="text-gray-brand mb-6">Discover our sacred collection</p>
          <Link href="/shop"
            className="inline-block bg-terra hover:bg-terra-dark text-white px-8 py-3 rounded text-sm font-semibold uppercase tracking-wide transition">
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 max-w-[1240px] py-12">
        <h1 className="font-serif text-3xl font-semibold text-charcoal mb-8">
          Your Cart ({totalItems()} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const price = variantPrice(item.product.price, item.variant?.price_modifier ?? 0)
              return (
                <div key={`${item.product.id}-${item.variant?.id}`}
                  className="bg-white rounded-brand p-5 flex gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-ivory flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-charcoal truncate">{item.product.name}</h3>
                    {item.variant && (
                      <p className="text-xs text-gray-brand mt-0.5">{item.variant.name}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-gray-lt rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.quantity - 1)}
                          className="p-2 hover:text-terra transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.quantity + 1)}
                          className="p-2 hover:text-terra transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif font-bold text-charcoal">
                          {formatPrice(price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id, item.variant?.id ?? null)}
                          className="text-gray-brand hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-brand p-6 h-fit sticky top-24">
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm text-gray-brand mb-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-charcoal font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={total >= 99900 ? 'text-green-600 font-medium' : 'text-charcoal font-medium'}>
                  {total >= 99900 ? 'FREE' : formatPrice(4900)}
                </span>
              </div>
              {total < 99900 && (
                <p className="text-xs text-terra">Add {formatPrice(99900 - total)} more for free shipping</p>
              )}
            </div>
            <div className="border-t border-gray-lt pt-4 mb-5">
              <div className="flex justify-between font-semibold text-charcoal">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-lg">
                  {formatPrice(total + (total >= 99900 ? 0 : 4900))}
                </span>
              </div>
            </div>
            <Link href="/checkout"
              className="block w-full bg-terra hover:bg-terra-dark text-white text-center py-4 rounded-lg text-sm font-semibold uppercase tracking-wide transition">
              Proceed to Checkout →
            </Link>
            <Link href="/shop"
              className="block w-full text-center text-terra text-sm font-medium mt-3 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Test cart page**

Add a product → visit `http://localhost:3000/cart` — items should show with quantity controls.

- [ ] **Step 3: Commit**

```bash
git add app/\(store\)/cart/
git commit -m "feat: add cart page with quantity controls and order summary"
```

---

## Task 7: Razorpay API Routes

**Files:**
- Create: `lib/razorpay.ts`, `app/api/razorpay/create-order/route.ts`, `app/api/razorpay/verify/route.ts`

- [ ] **Step 1: Create `lib/razorpay.ts`**

```typescript
import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})
```

- [ ] **Step 2: Create `app/api/razorpay/create-order/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, currency = 'INR' } = await request.json()

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const order = await razorpay.orders.create({
      amount, // in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    })

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (error) {
    console.error('Razorpay create-order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Create `app/api/razorpay/verify/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import type { ShippingAddress, CartItem } from '@/types'

interface VerifyBody {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  cartItems: CartItem[]
  shippingAddress: ShippingAddress
  totalAmount: number
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyBody = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      shippingAddress,
      totalAmount,
    } = body

    // 1. Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // 2. Get logged-in user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 3. Generate order number
    const { data: orderNumberData } = await supabase
      .rpc('generate_order_number')
    const orderNumber = orderNumberData as string

    // 4. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'paid',
        total_amount: totalAmount,
        razorpay_order_id,
        razorpay_payment_id,
        shipping_address: shippingAddress,
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
    }

    // 5. Insert order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      variant_id: item.variant?.id ?? null,
      quantity: item.quantity,
      price_at_purchase: item.product.price + (item.variant?.price_modifier ?? 0),
    }))

    await supabase.from('order_items').insert(orderItems)

    return NextResponse.json({ orderId: order.id, orderNumber: order.order_number })
  } catch (error) {
    console.error('Payment verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/razorpay.ts app/api/
git commit -m "feat: add Razorpay create-order and verify API routes"
```

---

## Task 8: Checkout Page

**Files:**
- Create: `app/(store)/checkout/page.tsx`

- [ ] **Step 1: Add Razorpay script to `app/layout.tsx`**

Add `<Script>` to root layout so Razorpay loads on all pages:

```typescript
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sanoosha – Authentic Rudraksha & Crystal Jewellery',
  description: 'Sanoosha offers 100% authentic, certified Nepal-origin Rudraksha beads and energy-cleansed crystal bracelets.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create `app/(store)/checkout/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { formatPrice, variantPrice } from '@/lib/utils'
import type { ShippingAddress } from '@/types'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [address, setAddress] = useState<ShippingAddress>({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
  })

  const subtotal = totalPrice()
  const shipping = subtotal >= 99900 ? 0 : 4900
  const total = subtotal + shipping

  function handleChange(field: keyof ShippingAddress, value: string) {
    setAddress(prev => ({ ...prev, [field]: value }))
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError('')

    try {
      // 1. Create Razorpay order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })

      if (!res.ok) throw new Error('Failed to create order')
      const { orderId, amount, currency } = await res.json()

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Sanoosha',
        description: 'Sacred Rudraksha & Crystal Jewellery',
        image: 'https://sanoosha.com/wp-content/uploads/2024/04/Sanoo-Photoroom.png',
        order_id: orderId,
        prefill: {
          name: address.full_name,
          contact: address.phone,
        },
        theme: { color: '#8B3A2A' },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          // 3. Verify payment
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              cartItems: items,
              shippingAddress: address,
              totalAmount: total,
            }),
          })

          if (!verifyRes.ok) {
            setError('Payment verification failed. Please contact support.')
            setLoading(false)
            return
          }

          const { orderId: savedOrderId } = await verifyRes.json()
          clearCart()
          router.push(`/orders/${savedOrderId}`)
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-charcoal mb-4">No items in cart</p>
          <a href="/shop" className="text-terra underline text-sm">Go shopping</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 max-w-[1240px] py-12">
        <h1 className="font-serif text-3xl font-semibold text-charcoal mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Shipping form */}
          <form onSubmit={handlePayment} className="space-y-5">
            <h2 className="font-serif text-xl font-semibold text-charcoal">Shipping Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Full Name *</label>
                <input required value={address.full_name} onChange={e => handleChange('full_name', e.target.value)}
                  className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
                  placeholder="Priya Sharma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Phone *</label>
                <input required value={address.phone} onChange={e => handleChange('phone', e.target.value)}
                  className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
                  placeholder="9876543210" pattern="[0-9]{10}" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Address *</label>
              <input required value={address.address} onChange={e => handleChange('address', e.target.value)}
                className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
                placeholder="House no, Street, Area" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">City *</label>
                <input required value={address.city} onChange={e => handleChange('city', e.target.value)}
                  className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
                  placeholder="Noida" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Pincode *</label>
                <input required value={address.pincode} onChange={e => handleChange('pincode', e.target.value)}
                  className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
                  placeholder="201301" pattern="[0-9]{6}" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">State *</label>
                <input required value={address.state} onChange={e => handleChange('state', e.target.value)}
                  className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
                  placeholder="Uttar Pradesh" />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terra hover:bg-terra-dark text-white font-semibold py-4 rounded-lg text-sm uppercase tracking-wider transition disabled:opacity-60 mt-4"
            >
              {loading ? 'Processing...' : `Pay ${formatPrice(total)} →`}
            </button>

            <p className="text-xs text-gray-brand text-center">
              🔒 Secure payment via Razorpay · UPI · Cards · NetBanking
            </p>
          </form>

          {/* Order summary */}
          <div className="bg-white rounded-brand p-6 h-fit">
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-5">Order Summary</h2>
            <div className="space-y-4 mb-5">
              {items.map(item => {
                const price = variantPrice(item.product.price, item.variant?.price_modifier ?? 0)
                return (
                  <div key={`${item.product.id}-${item.variant?.id}`} className="flex gap-3">
                    <img src={item.product.images[0]} alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover bg-ivory flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{item.product.name}</p>
                      {item.variant && <p className="text-xs text-gray-brand">{item.variant.name}</p>}
                      <p className="text-xs text-gray-brand">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-charcoal flex-shrink-0">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-gray-lt pt-4 space-y-2 text-sm text-gray-brand">
              <div className="flex justify-between"><span>Subtotal</span><span className="text-charcoal">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-charcoal'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-charcoal text-base pt-2 border-t border-gray-lt">
                <span className="font-serif">Total</span>
                <span className="font-serif">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test checkout**

1. Add products to cart → go to checkout
2. Fill in shipping form
3. Click "Pay" → Razorpay modal should open (test mode)
4. Use Razorpay test credentials to complete payment
5. Should redirect to order detail page

- [ ] **Step 4: Commit**

```bash
git add app/\(store\)/checkout/ app/layout.tsx
git commit -m "feat: add checkout page with Razorpay payment integration"
```

---

## Task 9: Orders Pages

**Files:**
- Create: `app/(store)/orders/page.tsx`, `app/(store)/orders/[id]/page.tsx`

- [ ] **Step 1: Create `app/(store)/orders/page.tsx`**

```typescript
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

async function getOrders(): Promise<Order[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data ?? []
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 max-w-[1240px] py-12">
        <h1 className="font-serif text-3xl font-semibold text-charcoal mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-charcoal mb-4">No orders yet</p>
            <Link href="/shop" className="bg-terra text-white px-8 py-3 rounded text-sm font-semibold uppercase tracking-wide hover:bg-terra-dark transition inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order.id} href={`/orders/${order.id}`}
                className="bg-white rounded-brand p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow block">
                <div>
                  <div className="font-semibold text-charcoal">{order.order_number}</div>
                  <div className="text-sm text-gray-brand mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-serif font-bold text-charcoal text-lg">
                    {formatPrice(order.total_amount)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/(store)/orders/[id]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

async function getOrder(id: string): Promise<Order | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*), product_variants(*))')
    .eq('id', id)
    .single()
  return data
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 max-w-[800px] py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/orders" className="text-terra text-sm hover:underline">← My Orders</Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-brand p-6 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-charcoal">{order.order_number}</h1>
              <p className="text-sm text-gray-brand mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-brand p-6 mb-5">
          <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">Items</h2>
          <div className="space-y-4">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex gap-4">
                <img
                  src={item.products?.images[0] ?? ''}
                  alt={item.products?.name ?? ''}
                  className="w-16 h-16 object-cover rounded-lg bg-ivory flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="font-medium text-charcoal">{item.products?.name}</p>
                  {item.product_variants && <p className="text-xs text-gray-brand">{item.product_variants.name}</p>}
                  <p className="text-xs text-gray-brand">Qty: {item.quantity}</p>
                </div>
                <span className="font-serif font-semibold text-charcoal">
                  {formatPrice(item.price_at_purchase * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-lt mt-5 pt-4">
            <div className="flex justify-between font-serif font-bold text-charcoal text-lg">
              <span>Total</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-brand p-6">
          <h2 className="font-serif text-lg font-semibold text-charcoal mb-3">Shipping Address</h2>
          <div className="text-sm text-gray-brand leading-relaxed">
            <p className="font-medium text-charcoal">{order.shipping_address.full_name}</p>
            <p>{order.shipping_address.phone}</p>
            <p>{order.shipping_address.address}</p>
            <p>{order.shipping_address.city}, {order.shipping_address.state} – {order.shipping_address.pincode}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(store\)/orders/
git commit -m "feat: add orders list and order detail pages"
```

---

**Store complete.** Next: `2026-04-15-sanoosha-admin.md`

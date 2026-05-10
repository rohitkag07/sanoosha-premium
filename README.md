# Sanoosha Premium

Premium ecommerce redesign for Sanoosha, focused on authentic Rudraksha, crystal jewellery, store operations, checkout readiness, and an admin surface.

Live: https://sanoosha-premium.vercel.app

## What This Is

Sanoosha Premium is a production-style Next.js storefront with a polished customer-facing store and internal admin area. The project turns a spiritual jewellery brand into a modern ecommerce experience with product browsing, WhatsApp conversion, Supabase-backed infrastructure, and Razorpay integration paths.

## Product Surface

| Area | What it does |
| --- | --- |
| Storefront | Homepage, shop grid, product cards, announcement bar, navigation, footer |
| Commerce | Razorpay integration layer and conversion-ready product flow |
| Admin | Admin layout, stats cards, and management shell |
| Auth/data | Supabase client, server, and middleware setup |
| Brand | Store-specific visual system and brand guide |

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js, App Router |
| Language | TypeScript |
| Styling | TailwindCSS |
| Data/auth | Supabase SSR + Supabase JS |
| Payments | Razorpay |
| UI/motion | Framer Motion, Lucide React, Recharts |
| Deployment | Vercel |

## Local Development

```bash
npm install
npm run dev
```

Build and checks:

```bash
npm run lint
npm run build
```

## Key Files

```text
app/(store)/page.tsx                Store entry
components/store/                   Storefront components
app/admin/page.tsx                  Admin entry
components/admin/                   Admin UI primitives
lib/supabase/                       Supabase client/server/middleware
lib/razorpay.ts                     Razorpay integration
docs/brand-guide.md                 Brand direction
```

## Why It Matters

The repo shows end-to-end ecommerce execution: brand refresh, product browsing, conversion-focused UI, payment plumbing, admin foundation, and deployable Next.js architecture.

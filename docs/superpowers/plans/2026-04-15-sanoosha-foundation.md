# Sanoosha Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the Next.js 14 project with Supabase backend, database schema, TypeScript types, and auth system (login/signup + route protection middleware).

**Architecture:** Next.js 14 App Router with TypeScript. Supabase handles PostgreSQL DB, Auth (email/password), and Storage. Middleware protects `/admin/*` (requires `is_admin=true`) and `/orders`, `/checkout` (requires login). All DB access uses Supabase server client in Server Components / Route Handlers, browser client only for auth state.

**Tech Stack:** Next.js 14, TypeScript, TailwindCSS 3.4, Supabase JS v2, @supabase/ssr, Supabase CLI

---

## File Map

| File | Purpose |
|---|---|
| `package.json` | Dependencies |
| `tailwind.config.ts` | Brand colors + fonts |
| `app/globals.css` | Base styles + CSS variables |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server Supabase client (cookies) |
| `lib/supabase/middleware.ts` | Supabase session refresh helper |
| `middleware.ts` | Route protection (admin + auth) |
| `types/index.ts` | All TypeScript types |
| `supabase/migrations/001_initial_schema.sql` | DB schema |
| `app/(auth)/login/page.tsx` | Login page |
| `app/(auth)/signup/page.tsx` | Signup page |
| `app/(auth)/layout.tsx` | Auth layout |

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: Scaffold Next.js app in existing directory**

```bash
cd /Users/rohit/Projects/websites/sanoosha-premium
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```
When prompted about existing files (`index.html`, `README.md`), choose to proceed. Accept all defaults.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr zustand razorpay lucide-react framer-motion
npm install -D @types/node
```

- [ ] **Step 3: Update `tailwind.config.ts` with brand tokens**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terra: {
          DEFAULT: '#8B3A2A',
          dark: '#6E2D1F',
        },
        gold: {
          DEFAULT: '#C8A84B',
          light: '#E8D090',
        },
        ivory: '#F9F5EE',
        cream: '#FAF7F2',
        charcoal: '#1A1A1A',
        'gray-brand': '#6B6B6B',
        'gray-lt': '#E8E2D9',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        brand: '12px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Update `app/globals.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --terra: #8B3A2A;
  --gold: #C8A84B;
  --gold-lt: #E8D090;
  --ivory: #F9F5EE;
  --cream: #FAF7F2;
  --charcoal: #1A1A1A;
  --gray: #6B6B6B;
  --gray-lt: #E8E2D9;
  --radius: 12px;
  --transition: .35s cubic-bezier(.4,0,.2,1);
  --shadow: 0 8px 40px rgba(26,26,26,.10);
  --shadow-lg: 0 20px 60px rgba(26,26,26,.15);
}

html { scroll-behavior: smooth; }

body {
  font-family: 'DM Sans', sans-serif;
  color: var(--charcoal);
  background: #fff;
}

.font-serif { font-family: 'Cormorant Garamond', serif; }
```

- [ ] **Step 5: Update `app/layout.tsx` root layout**

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sanoosha – Authentic Rudraksha & Crystal Jewellery',
  description: 'Sanoosha offers 100% authentic, certified Nepal-origin Rudraksha beads and energy-cleansed crystal bracelets.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: Create `.env.local` (do NOT commit)**

```bash
# .env.local — add to .gitignore
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

```bash
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```
Expected: Server running at `http://localhost:3000` with no errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 project with brand tailwind config"
```

---

## Task 2: Supabase Project Setup

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`

- [ ] **Step 1: Create Supabase project manually**

1. Go to https://supabase.com/dashboard
2. New project → name: `sanoosha-premium` → region: `South Asia (Mumbai)` → create
3. Wait for project to provision (~2 min)
4. Settings → API → copy `Project URL` and `anon public` key → paste into `.env.local`
5. Settings → API → copy `service_role` key → paste into `.env.local`

- [ ] **Step 2: Create `lib/supabase/client.ts` (browser)**

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Create `lib/supabase/server.ts` (server)**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/
git commit -m "feat: add supabase browser and server clients"
```

---

## Task 3: Database Schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Install Supabase CLI**

```bash
npm install -g supabase
supabase --version
```
Expected: version number printed.

- [ ] **Step 2: Initialize Supabase locally**

```bash
supabase init
```
This creates `supabase/` folder with config.

- [ ] **Step 3: Create migration file**

```bash
mkdir -p supabase/migrations
```

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PRODUCTS
create type public.product_category as enum ('rudraksha', 'crystal', 'combo');

create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price integer not null, -- in paise (₹1299 = 129900)
  compare_price integer,  -- original price for strikethrough
  category product_category not null,
  images text[] default '{}',
  in_stock boolean default true,
  featured boolean default false,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "Anyone can view products"
  on public.products for select using (true);

create policy "Only admins can modify products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- PRODUCT VARIANTS
create table public.product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  name text not null,
  price_modifier integer default 0,
  stock_quantity integer default 0,
  created_at timestamptz default now()
);

alter table public.product_variants enable row level security;

create policy "Anyone can view variants"
  on public.product_variants for select using (true);

create policy "Only admins can modify variants"
  on public.product_variants for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ORDERS
create type public.order_status as enum (
  'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
);

create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  order_number text not null unique,
  status order_status default 'pending',
  total_amount integer not null, -- in paise
  razorpay_order_id text,
  razorpay_payment_id text,
  shipping_address jsonb not null,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Only admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Authenticated users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Only admins can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ORDER ITEMS
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity integer not null,
  price_at_purchase integer not null -- snapshot in paise
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Authenticated users can create order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );

-- COUPONS
create type public.discount_type as enum ('percent', 'flat');

create table public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  discount_type discount_type not null,
  discount_value integer not null,
  min_order integer default 0,
  max_uses integer,
  used_count integer default 0,
  valid_until timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.coupons enable row level security;

create policy "Anyone can view active coupons"
  on public.coupons for select using (is_active = true);

create policy "Only admins can manage coupons"
  on public.coupons for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ORDER NUMBER SEQUENCE
create sequence order_number_seq start 1001;

create or replace function generate_order_number()
returns text as $$
begin
  return 'SNS-' || nextval('order_number_seq')::text;
end;
$$ language plpgsql;

-- STORAGE BUCKET for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict do nothing;

create policy "Anyone can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Only admins can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
```

- [ ] **Step 4: Run migration on Supabase**

Go to Supabase Dashboard → SQL Editor → paste the entire SQL from `001_initial_schema.sql` → Run.

Expected: All tables created without errors.

- [ ] **Step 5: Verify tables in Supabase dashboard**

In Supabase → Table Editor, confirm these tables exist:
- `profiles`, `products`, `product_variants`, `orders`, `order_items`, `coupons`

- [ ] **Step 6: Commit migration**

```bash
git add supabase/
git commit -m "feat: add initial database schema with RLS policies"
```

---

## Task 4: TypeScript Types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Create `types/index.ts`**

```typescript
export type ProductCategory = 'rudraksha' | 'crystal' | 'combo'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type DiscountType = 'percent' | 'flat'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  is_admin: boolean
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  price_modifier: number
  stock_quantity: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number // paise
  compare_price: number | null // paise
  category: ProductCategory
  images: string[]
  in_stock: boolean
  featured: boolean
  created_at: string
  product_variants?: ProductVariant[]
}

export interface ShippingAddress {
  full_name: string
  phone: string
  address: string
  city: string
  pincode: string
  state: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: OrderStatus
  total_amount: number // paise
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  shipping_address: ShippingAddress
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  price_at_purchase: number // paise
  products?: Product
  product_variants?: ProductVariant
}

export interface Coupon {
  id: string
  code: string
  discount_type: DiscountType
  discount_value: number
  min_order: number
  max_uses: number | null
  used_count: number
  valid_until: string | null
  is_active: boolean
  created_at: string
}

export interface CartItem {
  product: Product
  variant: ProductVariant | null
  quantity: number
}
```

- [ ] **Step 2: Commit**

```bash
git add types/
git commit -m "feat: add TypeScript types for all DB entities"
```

---

## Task 5: Auth Pages

**Files:**
- Create: `app/(auth)/layout.tsx`, `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`

- [ ] **Step 1: Create `app/(auth)/layout.tsx`**

```typescript
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="https://sanoosha.com/wp-content/uploads/2024/04/Sanoo-Photoroom.png"
            alt="Sanoosha"
            className="h-12 mx-auto mb-2"
          />
        </div>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/(auth)/login/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-brand shadow-lg p-8">
      <h1 className="font-serif text-2xl font-semibold text-charcoal mb-6">Welcome back</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-terra hover:bg-terra-dark text-white font-semibold py-3 rounded-lg text-sm uppercase tracking-wide transition disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-brand mt-6">
        Don't have an account?{' '}
        <Link href="/signup" className="text-terra font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/(auth)/signup/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-brand shadow-lg p-8">
      <h1 className="font-serif text-2xl font-semibold text-charcoal mb-6">Create account</h1>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
            placeholder="Priya Sharma"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
            placeholder="Min 6 characters"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-terra hover:bg-terra-dark text-white font-semibold py-3 rounded-lg text-sm uppercase tracking-wide transition disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-brand mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-terra font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Test auth pages in browser**

```bash
npm run dev
```
Visit `http://localhost:3000/signup` — form should render. Visit `http://localhost:3000/login` — form should render. Try signing up with a test email — check Supabase dashboard → Authentication → Users for the new user.

- [ ] **Step 5: Commit**

```bash
git add app/\(auth\)/
git commit -m "feat: add login and signup pages with Supabase auth"
```

---

## Task 6: Route Protection Middleware

**Files:**
- Create: `middleware.ts`, `lib/supabase/middleware.ts`

- [ ] **Step 1: Create `lib/supabase/middleware.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return { supabaseResponse, supabase, user }
}
```

- [ ] **Step 2: Create `middleware.ts`**

```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, supabase, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // Protect /admin routes — require is_admin = true
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect /orders and /checkout — require login
  if (pathname.startsWith('/orders') || pathname.startsWith('/checkout')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 3: Set admin user in Supabase**

In Supabase Dashboard → SQL Editor:

```sql
-- Replace with your actual email
update public.profiles
set is_admin = true
where id = (
  select id from auth.users where email = 'kag07rohit@gmail.com'
);
```

Note: You must sign up once with `kag07rohit@gmail.com` first, then run this.

- [ ] **Step 4: Test middleware**

```bash
npm run dev
```
1. Without logging in, visit `http://localhost:3000/admin` → should redirect to `/login`
2. Without logging in, visit `http://localhost:3000/orders` → should redirect to `/login`
3. Log in as admin → visit `/admin` → should NOT redirect

- [ ] **Step 5: Commit**

```bash
git add middleware.ts lib/supabase/middleware.ts
git commit -m "feat: add route protection middleware for admin and auth routes"
```

---

## Task 7: Seed Initial Products

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: Create `supabase/seed.sql` with real product data from brand guide**

```sql
-- Seed Rudraksha products
insert into public.products (name, slug, description, price, compare_price, category, images, in_stock, featured) values

('Nepal Origin 1 Mukhi Rudraksha', '1-mukhi-rudraksha',
 'Supreme consciousness · Liberation · Divine Power. The rarest of all Rudraksha, directly linked to Lord Shiva. Hand-picked from Nepal, lab certified, and ritually energised.',
 2100000, 3000000, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/Gemini_Generated_Image_w7sdvuw7sdvuw7sd-600x600.png'],
 true, true),

('Nepal Origin 2 Mukhi Rudraksha', '2-mukhi-rudraksha',
 'Harmony · Relationships · Emotional balance. Represents the union of Shiva and Shakti. Brings harmony to relationships and emotional wellbeing.',
 1600000, 2400000, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_26_f2dcd5ce-8865-4601-a04b-6be99e40c69b-600x600.webp'],
 true, true),

('Nepal Origin 3 Mukhi Rudraksha', '3-mukhi-rudraksha',
 'Confidence · Self-Power · Agni energy. Ruled by Agni (fire), this bead instils confidence and inner strength.',
 699900, 1499900, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_4_aa2b33b1-261c-4143-aa6e-e44c4d0159cd-600x600.webp'],
 true, true),

('Nepal Origin 4 Mukhi Rudraksha', '4-mukhi-rudraksha',
 'Knowledge · Wisdom · Creative intelligence. Blessed by Brahma, the creator. Enhances memory, knowledge, and creative intelligence.',
 479900, 879900, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_5_c47c2ab4-a22e-40e6-8e7a-580a0b740b37-600x600.webp'],
 true, false),

('Nepal Origin 5 Mukhi Rudraksha', '5-mukhi-rudraksha',
 'Health · Peace · Spiritual awakening. The most common and powerful Rudraksha, ruled by Lord Shiva himself. Promotes health, peace, and spiritual growth.',
 219900, 439900, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_6-600x600.webp'],
 true, true),

('Nepal Origin 6 Mukhi Rudraksha', '6-mukhi-rudraksha',
 'Will power · Focus · Mental strength. Blessed by Kartikeya, the god of war. Builds will power, focus, and mental resilience.',
 599900, 899900, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_7-600x600.webp'],
 true, false),

('Nepal Origin 7 Mukhi Rudraksha', '7-mukhi-rudraksha',
 'Luck · Prosperity · Financial growth. Blessed by Mahalakshmi, the goddess of wealth. Attracts luck, prosperity, and financial abundance.',
 0, null, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/7MukhiBead-600x600.webp'],
 true, false),

('Nepal Origin 8 Mukhi Rudraksha', '8-mukhi-rudraksha',
 'Remove obstacles · Success · New beginnings. Blessed by Lord Ganesha. Removes all obstacles and opens the path to success.',
 0, null, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_9-600x600.webp'],
 true, false);

-- Seed Crystal Bracelets
insert into public.products (name, slug, description, price, compare_price, category, images, in_stock, featured) values

('Rudraksha Charm Bracelet', 'rudraksha-charm-bracelet',
 'Authentic Rudraksha beads strung together in a stylish bracelet. Combines spiritual energy with everyday wearability. Pre-energised with Vedic mantras.',
 149900, 209900, 'crystal',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/DEF4C7C7-E0F3-4EA6-8656-F2009E742EA4-600x600.png'],
 true, true),

('Black Obsidian Bracelet', 'black-obsidian-bracelet',
 'Natural Black Obsidian crystal bracelet for protection and grounding. Shields against negativity and promotes emotional healing.',
 89900, 129900, 'crystal',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-03-at-10.30.16-600x600.jpeg'],
 true, true),

('Clear Quartz Crystal Bracelet', 'clear-quartz-bracelet',
 'Master healer crystal bracelet. Amplifies energy and intention, promotes clarity of thought and spiritual connection.',
 64900, null, 'crystal',
 ARRAY['https://sanoosha.com/wp-content/uploads/2025/11/11-600x600.jpg'],
 true, false),

('Seven Chakra Bracelet', 'seven-chakra-bracelet',
 'Balance all seven chakras with this beautiful bracelet featuring 7 different natural healing crystals. Perfect for daily wear and meditation.',
 64900, null, 'crystal',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_9-600x600.webp'],
 true, true);
```

- [ ] **Step 2: Run seed in Supabase SQL Editor**

Paste `supabase/seed.sql` into Supabase Dashboard → SQL Editor → Run.

Expected: 12 rows inserted (8 Rudraksha + 4 bracelets).

- [ ] **Step 3: Verify in Supabase Table Editor**

Check `products` table — 12 rows should be visible with correct data.

- [ ] **Step 4: Commit**

```bash
git add supabase/seed.sql
git commit -m "feat: seed initial product catalog from brand guide"
```

---

**Foundation complete.** Next: `2026-04-15-sanoosha-store.md`

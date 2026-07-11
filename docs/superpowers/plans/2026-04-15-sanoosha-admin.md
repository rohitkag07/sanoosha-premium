# Sanoosha Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full admin dashboard at `/admin` — overview stats, products CRUD with image upload, order management, customer list, coupons, analytics charts, and Vercel deployment.

**Architecture:** All `/admin` routes are Server Components by default, with Client Components for forms/interactivity. Admin layout has a dark sidebar. Charts use `recharts`. Image uploads go to Supabase Storage. All data mutations use Server Actions. Middleware (already implemented in Foundation plan) blocks non-admin access.

**Tech Stack:** Next.js 14 App Router, TypeScript, TailwindCSS 3.4, Recharts (charts), Supabase JS v2, Lucide React

**Prerequisites:** Foundation + Store plans complete.

---

## File Map

| File | Purpose |
|---|---|
| `app/admin/layout.tsx` | Admin layout with dark sidebar |
| `app/admin/page.tsx` | Overview: stats cards + recent orders |
| `app/admin/products/page.tsx` | Product list + Add/Edit/Delete |
| `app/admin/products/actions.ts` | Server Actions for product CRUD |
| `app/admin/orders/page.tsx` | Orders list with status filter |
| `app/admin/orders/[id]/page.tsx` | Order detail + status update |
| `app/admin/orders/actions.ts` | Server Action: update order status |
| `app/admin/customers/page.tsx` | Customer list with stats |
| `app/admin/coupons/page.tsx` | Coupon management |
| `app/admin/coupons/actions.ts` | Server Actions for coupon CRUD |
| `app/admin/analytics/page.tsx` | Revenue chart + top products |
| `components/admin/AdminSidebar.tsx` | Sidebar nav (client, handles active state) |
| `components/admin/StatsCard.tsx` | Reusable stat card |

---

## Task 1: Admin Layout + Sidebar

**Files:**
- Create: `components/admin/AdminSidebar.tsx`, `app/admin/layout.tsx`

- [ ] **Step 1: Create `components/admin/AdminSidebar.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Tag, BarChart2, Settings, LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-64 min-h-screen bg-[#1e293b] flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="text-gold font-bold text-sm tracking-[0.15em] uppercase">SANOOSHA</div>
        <div className="text-white/40 text-xs mt-0.5">Admin Panel</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        {navItems.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gold/15 text-gold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create `app/admin/layout.tsx`**

```typescript
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Test admin layout**

```bash
npm run dev
```
Log in as admin → visit `http://localhost:3000/admin` → sidebar should be visible.

- [ ] **Step 4: Commit**

```bash
git add components/admin/ app/admin/layout.tsx
git commit -m "feat: add admin layout with dark sidebar navigation"
```

---

## Task 2: Overview Dashboard

**Files:**
- Create: `components/admin/StatsCard.tsx`, `app/admin/page.tsx`

- [ ] **Step 1: Create `components/admin/StatsCard.tsx`**

```typescript
interface Props {
  label: string
  value: string
  sub?: string
  positive?: boolean
}

export default function StatsCard({ label, value, sub, positive }: Props) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-5 border border-white/5">
      <div className="text-white/50 text-xs font-medium uppercase tracking-wide mb-2">{label}</div>
      <div className="text-white text-2xl font-bold leading-none mb-2">{value}</div>
      {sub && (
        <div className={`text-xs font-medium ${positive ? 'text-green-400' : 'text-white/40'}`}>
          {sub}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `app/admin/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import StatsCard from '@/components/admin/StatsCard'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  paid: 'bg-blue-500/20 text-blue-300',
  processing: 'bg-purple-500/20 text-purple-300',
  shipped: 'bg-indigo-500/20 text-indigo-300',
  delivered: 'bg-green-500/20 text-green-300',
  cancelled: 'bg-red-500/20 text-red-300',
}

async function getStats() {
  const supabase = await createClient()

  const [ordersRes, revenueRes, customersRes, pendingRes] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact' }),
    supabase.from('orders').select('total_amount').eq('status', 'paid'),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('is_admin', false),
    supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending'),
  ])

  const totalRevenue = (revenueRes.data ?? []).reduce((sum, o) => sum + o.total_amount, 0)

  return {
    totalOrders: ordersRes.count ?? 0,
    totalRevenue,
    totalCustomers: customersRes.count ?? 0,
    pendingOrders: pendingRes.count ?? 0,
  }
}

async function getRecentOrders() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('id, order_number, status, total_amount, created_at, shipping_address')
    .order('created_at', { ascending: false })
    .limit(8)
  return data ?? []
}

export default async function AdminOverview() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Overview</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back, Indresh</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Revenue" value={formatPrice(stats.totalRevenue)} />
        <StatsCard label="Total Orders" value={stats.totalOrders.toString()} />
        <StatsCard label="Pending Orders" value={stats.pendingOrders.toString()}
          sub={stats.pendingOrders > 0 ? 'Needs attention' : 'All clear'} positive={stats.pendingOrders === 0} />
        <StatsCard label="Customers" value={stats.totalCustomers.toString()} />
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1e293b] rounded-xl border border-white/5">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-gold text-xs hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 font-medium px-6 py-3">Order</th>
                <th className="text-left text-white/40 font-medium px-6 py-3">Customer</th>
                <th className="text-left text-white/40 font-medium px-6 py-3">Amount</th>
                <th className="text-left text-white/40 font-medium px-6 py-3">Status</th>
                <th className="text-left text-white/40 font-medium px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-white font-medium hover:text-gold transition-colors">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-white/60">{order.shipping_address?.full_name ?? '—'}</td>
                  <td className="px-6 py-3 text-gold font-medium">{formatPrice(order.total_amount)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-white/40">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/admin/StatsCard.tsx app/admin/page.tsx
git commit -m "feat: add admin overview page with stats and recent orders table"
```

---

## Task 3: Products Management

**Files:**
- Create: `app/admin/products/page.tsx`, `app/admin/products/actions.ts`

- [ ] **Step 1: Create `app/admin/products/actions.ts`**

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ProductCategory } from '@/types'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const price = Math.round(parseFloat(formData.get('price') as string) * 100)
  const comparePrice = formData.get('compare_price')
    ? Math.round(parseFloat(formData.get('compare_price') as string) * 100)
    : null
  const category = formData.get('category') as ProductCategory
  const imageUrl = formData.get('image_url') as string
  const inStock = formData.get('in_stock') === 'true'
  const featured = formData.get('featured') === 'true'

  const { error } = await supabase.from('products').insert({
    name, slug, description, price,
    compare_price: comparePrice,
    category,
    images: imageUrl ? [imageUrl] : [],
    in_stock: inStock,
    featured,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/shop')
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const price = Math.round(parseFloat(formData.get('price') as string) * 100)
  const comparePrice = formData.get('compare_price')
    ? Math.round(parseFloat(formData.get('compare_price') as string) * 100)
    : null
  const imageUrl = formData.get('image_url') as string

  const { error } = await supabase.from('products').update({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price,
    compare_price: comparePrice,
    category: formData.get('category') as ProductCategory,
    images: imageUrl ? [imageUrl] : [],
    in_stock: formData.get('in_stock') === 'true',
    featured: formData.get('featured') === 'true',
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/shop')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/shop')
}

export async function toggleStock(id: string, inStock: boolean) {
  const supabase = await createClient()
  await supabase.from('products').update({ in_stock: inStock }).eq('id', id)
  revalidatePath('/admin/products')
}
```

- [ ] **Step 2: Create `app/admin/products/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import ProductsClient from './ProductsClient'

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminProductsPage() {
  const products = await getProducts()
  return <ProductsClient products={products} />
}
```

- [ ] **Step 3: Create `app/admin/products/ProductsClient.tsx`**

```typescript
'use client'

import { useState, useTransition } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Product, ProductCategory } from '@/types'
import { formatPrice } from '@/lib/utils'
import { createProduct, updateProduct, deleteProduct, toggleStock } from './actions'

const categories: ProductCategory[] = ['rudraksha', 'crystal', 'combo']

interface ProductFormData {
  name: string; slug: string; description: string
  price: string; compare_price: string; category: ProductCategory
  image_url: string; in_stock: boolean; featured: boolean
}

const emptyForm: ProductFormData = {
  name: '', slug: '', description: '', price: '',
  compare_price: '', category: 'rudraksha', image_url: '',
  in_stock: true, featured: false
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductFormData>(emptyForm)
  const [isPending, startTransition] = useTransition()

  function openAdd() {
    setEditProduct(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(p: Product) {
    setEditProduct(p)
    setForm({
      name: p.name, slug: p.slug, description: p.description ?? '',
      price: (p.price / 100).toString(),
      compare_price: p.compare_price ? (p.compare_price / 100).toString() : '',
      category: p.category, image_url: p.images[0] ?? '',
      in_stock: p.in_stock, featured: p.featured
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.set(k, String(v)))

    startTransition(async () => {
      if (editProduct) {
        await updateProduct(editProduct.id, fd)
      } else {
        await createProduct(fd)
      }
      setShowModal(false)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    startTransition(() => deleteProduct(id))
  }

  function handleToggleStock(id: string, current: boolean) {
    startTransition(() => toggleStock(id, !current))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Products</h1>
          <p className="text-white/40 text-sm mt-1">{products.length} products total</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gold text-charcoal px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-white/40 font-medium px-6 py-3">Product</th>
              <th className="text-left text-white/40 font-medium px-6 py-3">Category</th>
              <th className="text-left text-white/40 font-medium px-6 py-3">Price</th>
              <th className="text-left text-white/40 font-medium px-6 py-3">Stock</th>
              <th className="text-left text-white/40 font-medium px-6 py-3">Featured</th>
              <th className="text-left text-white/40 font-medium px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-white/10" />
                    <span className="text-white font-medium text-xs leading-snug max-w-[200px] truncate">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-white/60 capitalize">{p.category}</td>
                <td className="px-6 py-3 text-gold font-medium">{formatPrice(p.price)}</td>
                <td className="px-6 py-3">
                  <button onClick={() => handleToggleStock(p.id, p.in_stock)} disabled={isPending}>
                    {p.in_stock
                      ? <ToggleRight size={22} className="text-green-400" />
                      : <ToggleLeft size={22} className="text-white/30" />
                    }
                  </button>
                </td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-medium ${p.featured ? 'text-gold' : 'text-white/30'}`}>
                    {p.featured ? '★ Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-white/40 hover:text-white transition">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-white/40 hover:text-red-400 transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-white font-bold text-lg mb-5">
              {editProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Name', key: 'name', type: 'text', placeholder: 'Nepal Origin 5 Mukhi Rudraksha' },
                { label: 'Slug', key: 'slug', type: 'text', placeholder: '5-mukhi-rudraksha' },
                { label: 'Image URL', key: 'image_url', type: 'text', placeholder: 'https://...' },
                { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '2199' },
                { label: 'Compare Price (₹)', key: 'compare_price', type: 'number', placeholder: '4399 (optional)' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-white/60 text-xs font-medium mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof ProductFormData] as string}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold transition"
                    required={field.key !== 'compare_price' && field.key !== 'image_url'}
                  />
                </div>
              ))}

              <div>
                <label className="block text-white/60 text-xs font-medium mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold transition resize-none"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as ProductCategory }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold transition"
                >
                  {categories.map(c => <option key={c} value={c} className="bg-[#1e293b]">{c}</option>)}
                </select>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.in_stock}
                    onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))}
                    className="accent-gold" />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.featured}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="accent-gold" />
                  Featured
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-gold hover:bg-gold-light text-charcoal font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60">
                  {isPending ? 'Saving...' : editProduct ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 rounded-lg text-sm transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/products/
git commit -m "feat: add admin products page with CRUD modal and stock toggle"
```

---

## Task 4: Orders Management

**Files:**
- Create: `app/admin/orders/page.tsx`, `app/admin/orders/[id]/page.tsx`, `app/admin/orders/actions.ts`

- [ ] **Step 1: Create `app/admin/orders/actions.ts`**

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { OrderStatus } from '@/types'

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
}
```

- [ ] **Step 2: Create `app/admin/orders/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  paid: 'bg-blue-500/20 text-blue-300',
  processing: 'bg-purple-500/20 text-purple-300',
  shipped: 'bg-indigo-500/20 text-indigo-300',
  delivered: 'bg-green-500/20 text-green-300',
  cancelled: 'bg-red-500/20 text-red-300',
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (params.status) {
    query = query.eq('status', params.status)
  }

  const { data: orders } = await query

  const statuses = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Orders</h1>
        <p className="text-white/40 text-sm mt-1">{orders?.length ?? 0} orders</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map(s => (
          <a key={s}
            href={s === 'all' ? '/admin/orders' : `/admin/orders?status=${s}`}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition ${
              (params.status === s) || (!params.status && s === 'all')
                ? 'bg-gold text-charcoal'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}>
            {s}
          </a>
        ))}
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Order', 'Customer', 'Amount', 'Status', 'Date', ''].map(h => (
                <th key={h} className="text-left text-white/40 font-medium px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order: any) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-6 py-3 text-white font-medium">{order.order_number}</td>
                <td className="px-6 py-3 text-white/60">
                  {order.shipping_address?.full_name ?? '—'}
                </td>
                <td className="px-6 py-3 text-gold font-medium">{formatPrice(order.total_amount)}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-white/40 text-xs">
                  {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                </td>
                <td className="px-6 py-3">
                  <Link href={`/admin/orders/${order.id}`}
                    className="text-gold text-xs hover:underline">View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/admin/orders/[id]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import StatusUpdater from './StatusUpdater'

interface Props {
  params: Promise<{ id: string }>
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  paid: 'bg-blue-500/20 text-blue-300',
  processing: 'bg-purple-500/20 text-purple-300',
  shipped: 'bg-indigo-500/20 text-indigo-300',
  delivered: 'bg-green-500/20 text-green-300',
  cancelled: 'bg-red-500/20 text-red-300',
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*), product_variants(*))')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin/orders" className="text-white/40 hover:text-white text-sm transition">← Orders</a>
        <span className="text-white/20">/</span>
        <span className="text-white font-semibold">{order.order_number}</span>
      </div>

      <div className="grid gap-5">
        {/* Header */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-white text-xl font-bold">{order.order_number}</h1>
            <p className="text-white/40 text-sm mt-1">
              {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {order.razorpay_payment_id && (
              <p className="text-white/30 text-xs mt-1">Payment ID: {order.razorpay_payment_id}</p>
            )}
          </div>
          <StatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>

        {/* Items */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
          <h2 className="text-white font-semibold mb-4">Items</h2>
          <div className="space-y-4">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex gap-4">
                <img src={item.products?.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-white/10 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{item.products?.name}</p>
                  {item.product_variants && <p className="text-white/40 text-xs">{item.product_variants.name}</p>}
                  <p className="text-white/40 text-xs">Qty: {item.quantity}</p>
                </div>
                <span className="text-gold font-semibold text-sm">{formatPrice(item.price_at_purchase * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 mt-4 flex justify-between">
            <span className="text-white font-semibold">Total</span>
            <span className="text-gold font-bold text-lg">{formatPrice(order.total_amount)}</span>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
          <h2 className="text-white font-semibold mb-3">Shipping Address</h2>
          <div className="text-sm text-white/60 leading-relaxed space-y-0.5">
            <p className="text-white font-medium">{order.shipping_address.full_name}</p>
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

- [ ] **Step 4: Create `app/admin/orders/[id]/StatusUpdater.tsx`**

```typescript
'use client'

import { useTransition } from 'react'
import type { OrderStatus } from '@/types'
import { updateOrderStatus } from '../actions'

const statuses: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  paid: 'bg-blue-500/20 text-blue-300',
  processing: 'bg-purple-500/20 text-purple-300',
  shipped: 'bg-indigo-500/20 text-indigo-300',
  delivered: 'bg-green-500/20 text-green-300',
  cancelled: 'bg-red-500/20 text-red-300',
}

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-3">
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColors[currentStatus]}`}>
        {currentStatus}
      </span>
      <select
        defaultValue={currentStatus}
        onChange={e => startTransition(() => updateOrderStatus(orderId, e.target.value as OrderStatus))}
        disabled={isPending}
        className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gold transition disabled:opacity-50"
      >
        {statuses.map(s => <option key={s} value={s} className="bg-[#1e293b] capitalize">{s}</option>)}
      </select>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add app/admin/orders/
git commit -m "feat: add admin orders list and order detail with status update"
```

---

## Task 5: Customers & Coupons

**Files:**
- Create: `app/admin/customers/page.tsx`, `app/admin/coupons/page.tsx`, `app/admin/coupons/actions.ts`

- [ ] **Step 1: Create `app/admin/customers/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, orders(id, total_amount, status)')
    .eq('is_admin', false)
    .order('created_at', { ascending: false })

  const customers = (profiles ?? []).map((p: any) => ({
    ...p,
    orderCount: p.orders?.length ?? 0,
    totalSpend: (p.orders ?? [])
      .filter((o: any) => o.status === 'paid' || o.status === 'delivered')
      .reduce((sum: number, o: any) => sum + o.total_amount, 0),
  }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Customers</h1>
        <p className="text-white/40 text-sm mt-1">{customers.length} registered customers</p>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Name', 'Phone', 'Orders', 'Total Spend', 'Joined'].map(h => (
                <th key={h} className="text-left text-white/40 font-medium px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c: any) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-6 py-3 text-white font-medium">{c.full_name ?? 'Unknown'}</td>
                <td className="px-6 py-3 text-white/60">{c.phone ?? '—'}</td>
                <td className="px-6 py-3 text-white/60">{c.orderCount}</td>
                <td className="px-6 py-3 text-gold font-medium">{formatPrice(c.totalSpend)}</td>
                <td className="px-6 py-3 text-white/40 text-xs">
                  {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/admin/coupons/actions.ts`**

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { DiscountType } from '@/types'

export async function createCoupon(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('coupons').insert({
    code: (formData.get('code') as string).toUpperCase().trim(),
    discount_type: formData.get('discount_type') as DiscountType,
    discount_value: parseInt(formData.get('discount_value') as string),
    min_order: formData.get('min_order')
      ? Math.round(parseFloat(formData.get('min_order') as string) * 100)
      : 0,
    max_uses: formData.get('max_uses') ? parseInt(formData.get('max_uses') as string) : null,
    valid_until: formData.get('valid_until') || null,
    is_active: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/coupons')
}

export async function toggleCoupon(id: string, isActive: boolean) {
  const supabase = await createClient()
  await supabase.from('coupons').update({ is_active: !isActive }).eq('id', id)
  revalidatePath('/admin/coupons')
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient()
  await supabase.from('coupons').delete().eq('id', id)
  revalidatePath('/admin/coupons')
}
```

- [ ] **Step 3: Create `app/admin/coupons/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import CouponsClient from './CouponsClient'

export default async function AdminCouponsPage() {
  const supabase = await createClient()
  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  return <CouponsClient coupons={coupons ?? []} />
}
```

- [ ] **Step 4: Create `app/admin/coupons/CouponsClient.tsx`**

```typescript
'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Coupon } from '@/types'
import { createCoupon, toggleCoupon, deleteCoupon } from './actions'

export default function CouponsClient({ coupons }: { coupons: Coupon[] }) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      await createCoupon(fd)
      setShowForm(false)
    })
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Coupons</h1>
          <p className="text-white/40 text-sm mt-1">{coupons.length} coupons</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gold text-charcoal px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Expires', 'Active', ''].map(h => (
                <th key={h} className="text-left text-white/40 font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-5 py-3 text-gold font-mono font-semibold">{c.code}</td>
                <td className="px-5 py-3 text-white/60 capitalize">{c.discount_type}</td>
                <td className="px-5 py-3 text-white font-medium">
                  {c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value / 100}`}
                </td>
                <td className="px-5 py-3 text-white/60">
                  {c.min_order > 0 ? `₹${c.min_order / 100}` : '—'}
                </td>
                <td className="px-5 py-3 text-white/60">
                  {c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}
                </td>
                <td className="px-5 py-3 text-white/40 text-xs">
                  {c.valid_until ? new Date(c.valid_until).toLocaleDateString('en-IN') : 'Never'}
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => startTransition(() => toggleCoupon(c.id, c.is_active))} disabled={isPending}>
                    {c.is_active
                      ? <ToggleRight size={22} className="text-green-400" />
                      : <ToggleLeft size={22} className="text-white/30" />
                    }
                  </button>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => startTransition(() => deleteCoupon(c.id))} disabled={isPending}
                    className="text-white/30 hover:text-red-400 transition p-1">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] rounded-xl w-full max-w-md p-6">
            <h2 className="text-white font-bold text-lg mb-5">Create Coupon</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { label: 'Coupon Code', name: 'code', type: 'text', placeholder: 'SAVE20', required: true },
                { label: 'Discount Value', name: 'discount_value', type: 'number', placeholder: '20 (percent) or 500 (flat in ₹)', required: true },
                { label: 'Min Order (₹)', name: 'min_order', type: 'number', placeholder: '999 (optional)' },
                { label: 'Max Uses', name: 'max_uses', type: 'number', placeholder: '100 (blank = unlimited)' },
                { label: 'Valid Until', name: 'valid_until', type: 'date', placeholder: '' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-white/60 text-xs font-medium mb-1">{f.label}</label>
                  <input type={f.type} name={f.name} placeholder={f.placeholder} required={f.required}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold transition" />
                </div>
              ))}

              <div>
                <label className="block text-white/60 text-xs font-medium mb-1">Discount Type</label>
                <select name="discount_type" required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold transition">
                  <option value="percent" className="bg-[#1e293b]">Percentage (%)</option>
                  <option value="flat" className="bg-[#1e293b]">Flat Amount (₹)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-gold hover:bg-gold-light text-charcoal font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60">
                  {isPending ? 'Creating...' : 'Create Coupon'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg text-sm transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add app/admin/customers/ app/admin/coupons/
git commit -m "feat: add admin customers list and coupon management"
```

---

## Task 6: Analytics

**Files:**
- Create: `app/admin/analytics/page.tsx`

- [ ] **Step 1: Install recharts**

```bash
npm install recharts
```

- [ ] **Step 2: Create `app/admin/analytics/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import AnalyticsCharts from './AnalyticsCharts'

async function getAnalyticsData() {
  const supabase = await createClient()

  // Revenue by month (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount, status, created_at')
    .gte('created_at', sixMonthsAgo.toISOString())
    .in('status', ['paid', 'delivered', 'shipped'])

  // Group by month
  const monthlyRevenue: Record<string, number> = {}
  ;(orders ?? []).forEach(o => {
    const month = new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    monthlyRevenue[month] = (monthlyRevenue[month] ?? 0) + o.total_amount
  })

  const revenueChart = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue: revenue / 100,
  }))

  // Top products
  const { data: topItems } = await supabase
    .from('order_items')
    .select('product_id, quantity, products(name)')
    .limit(50)

  const productSales: Record<string, { name: string; quantity: number }> = {}
  ;(topItems ?? []).forEach((item: any) => {
    if (!item.product_id) return
    const name = item.products?.name ?? 'Unknown'
    if (!productSales[item.product_id]) {
      productSales[item.product_id] = { name, quantity: 0 }
    }
    productSales[item.product_id].quantity += item.quantity
  })

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  // Order status breakdown
  const { data: allOrders } = await supabase.from('orders').select('status')
  const statusBreakdown: Record<string, number> = {}
  ;(allOrders ?? []).forEach(o => {
    statusBreakdown[o.status] = (statusBreakdown[o.status] ?? 0) + 1
  })

  const statusChart = Object.entries(statusBreakdown).map(([status, count]) => ({
    status,
    count,
  }))

  return { revenueChart, topProducts, statusChart }
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData()
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Sales performance overview</p>
      </div>
      <AnalyticsCharts {...data} />
    </div>
  )
}
```

- [ ] **Step 3: Create `app/admin/analytics/AnalyticsCharts.tsx`**

```typescript
'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const PIE_COLORS = ['#C8A84B', '#8B3A2A', '#22c55e', '#6366f1', '#a855f7', '#ef4444']

interface Props {
  revenueChart: { month: string; revenue: number }[]
  topProducts: { name: string; quantity: number }[]
  statusChart: { status: string; count: number }[]
}

export default function AnalyticsCharts({ revenueChart, topProducts, statusChart }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue chart */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5 lg:col-span-2">
        <h2 className="text-white font-semibold mb-6">Monthly Revenue (₹)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
              formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#C8A84B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top products */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
        <h2 className="text-white font-semibold mb-5">Top Products</h2>
        <div className="space-y-3">
          {topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3">
              <span className="text-white/30 text-xs w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{p.name}</p>
                <div className="mt-1 bg-white/5 rounded-full h-1.5">
                  <div
                    className="bg-gold h-1.5 rounded-full"
                    style={{ width: `${(p.quantity / (topProducts[0]?.quantity || 1)) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-gold font-semibold text-sm flex-shrink-0">{p.quantity} sold</span>
            </div>
          ))}
          {topProducts.length === 0 && <p className="text-white/40 text-sm">No sales data yet</p>}
        </div>
      </div>

      {/* Status breakdown */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
        <h2 className="text-white font-semibold mb-5">Order Status</h2>
        {statusChart.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusChart} dataKey="count" nameKey="status" cx="50%" cy="50%"
                outerRadius={70} label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {statusChart.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-white/40 text-sm">No orders yet</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/analytics/ && npm run build 2>&1 | tail -5
git commit -m "feat: add admin analytics page with revenue and sales charts"
```

---

## Task 7: Deploy to Vercel

**Files:**
- Modify: `.gitignore`, verify `next.config.ts`

- [ ] **Step 1: Ensure .gitignore is correct**

```bash
cat .gitignore
```
Confirm these lines exist (add if missing):
```
.env.local
.env*.local
.next/
node_modules/
.superpowers/
```

- [ ] **Step 2: Run production build locally**

```bash
npm run build
```
Expected: Build completes with no errors. Fix any TypeScript errors before proceeding.

- [ ] **Step 3: Push to GitHub**

```bash
git add -A
git commit -m "chore: production build verified, ready for deployment"
git push origin main
```

- [ ] **Step 4: Deploy to Vercel**

```bash
npx vercel --prod
```
When prompted:
- Link to existing project? → `N` (new project)
- Project name: `sanoosha-premium`
- Root directory: `./` (current)

Expected: Vercel deployment URL printed.

- [ ] **Step 5: Add environment variables on Vercel**

Go to Vercel → Project → Settings → Environment Variables → Add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key |
| `RAZORPAY_KEY_ID` | your Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | your Razorpay key secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | your Razorpay key ID (same as above) |

- [ ] **Step 6: Redeploy after env vars**

```bash
npx vercel --prod
```

- [ ] **Step 7: Final smoke test**

Visit your Vercel URL:
1. Homepage loads ✓
2. `/shop` shows products ✓
3. `/login` works ✓
4. Add to cart → cart badge updates ✓
5. `/checkout` — fill form → Razorpay popup ✓
6. `/admin` (as admin) — all sections work ✓

- [ ] **Step 8: Add custom domain (optional)**

Vercel → Project → Settings → Domains → Add your domain.

- [ ] **Step 9: Final commit**

```bash
git add -A
git commit -m "feat: complete Sanoosha e-commerce platform deployed to Vercel"
```

---

**🎉 Sanoosha e-commerce platform complete!**

**Summary of what was built:**
- Customer store with Homepage, Shop, Product Detail, Cart, Checkout
- Razorpay payment integration (UPI, Cards, NetBanking)
- Supabase auth (email/password)
- Order tracking for customers
- Full admin dashboard: Overview, Products CRUD, Orders, Customers, Coupons, Analytics
- Deployed on Vercel with Supabase backend

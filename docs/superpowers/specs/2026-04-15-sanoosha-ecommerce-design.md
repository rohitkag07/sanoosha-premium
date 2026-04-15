# Sanoosha Premium — E-Commerce Platform Design Spec
**Date:** 2026-04-15  
**Project:** `/Users/rohit/Projects/websites/sanoosha-premium`  
**Brand:** Sanoosha — Authentic Rudraksha & Crystal Jewellery

---

## Overview

Convert existing static HTML site into a full-featured e-commerce platform with customer-facing store, auth, Razorpay payments, and a full admin dashboard. Target market: India only. Stack: Next.js 14 + Supabase + Razorpay + Vercel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + Admin | Next.js 14 (App Router) + TypeScript |
| Styling | TailwindCSS 3.4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| File Storage | Supabase Storage (product images) |
| Payments | Razorpay (UPI, Cards, NetBanking, EMI) |
| Deployment | Vercel (frontend), Supabase (backend) |
| MCP | Supabase MCP (DB management from Claude) |

---

## Project Structure

```
sanoosha-premium/
├── app/
│   ├── (store)/
│   │   ├── page.tsx                  # Homepage (hero + featured products)
│   │   ├── shop/page.tsx             # Product listing with filters
│   │   ├── product/[slug]/page.tsx   # Product detail + variants
│   │   ├── cart/page.tsx             # Cart
│   │   ├── checkout/page.tsx         # Checkout + Razorpay trigger
│   │   └── orders/page.tsx           # Customer order history
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── admin/
│   │   ├── page.tsx                  # Overview + stats + charts
│   │   ├── products/page.tsx         # Product CRUD
│   │   ├── orders/page.tsx           # Order management
│   │   ├── customers/page.tsx        # Customer list
│   │   ├── coupons/page.tsx          # Discount codes
│   │   └── analytics/page.tsx        # Sales analytics
│   └── api/
│       ├── razorpay/create-order/route.ts
│       └── razorpay/verify/route.ts
├── components/
│   ├── store/                        # ProductCard, CartItem, etc.
│   ├── admin/                        # AdminSidebar, StatsCard, etc.
│   └── ui/                           # Shared buttons, inputs, modals
├── lib/
│   ├── supabase.ts                   # Supabase client (server + browser)
│   └── razorpay.ts                   # Razorpay order utils
├── middleware.ts                     # Auth + admin route protection
└── public/
```

---

## Database Schema

### `products`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| name | text | |
| slug | text | unique, URL-friendly |
| description | text | |
| price | integer | in paise (₹1299 = 129900) |
| compare_price | integer | original price for strikethrough |
| category | enum | rudraksha, crystal, combo |
| images | text[] | Supabase Storage URLs |
| in_stock | boolean | default true |
| featured | boolean | default false |
| created_at | timestamptz | |

### `product_variants`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| product_id | uuid | FK → products |
| name | text | e.g. "5 Mukhi", "Rose Quartz" |
| price_modifier | integer | added to base price (can be negative) |
| stock_quantity | integer | |

### `orders`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| order_number | text | e.g. SNS-1001 |
| status | enum | pending, paid, processing, shipped, delivered, cancelled |
| total_amount | integer | in paise |
| razorpay_order_id | text | |
| razorpay_payment_id | text | |
| shipping_address | jsonb | name, phone, address, city, pincode, state |
| created_at | timestamptz | |

### `order_items`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| order_id | uuid | FK → orders |
| product_id | uuid | FK → products |
| variant_id | uuid | FK → product_variants (nullable) |
| quantity | integer | |
| price_at_purchase | integer | in paise, snapshot at time of order |

### `coupons`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| code | text | unique, uppercase |
| discount_type | enum | percent, flat |
| discount_value | integer | percent (0-100) or flat paise |
| min_order | integer | minimum cart value in paise |
| max_uses | integer | nullable = unlimited |
| used_count | integer | default 0 |
| valid_until | timestamptz | nullable = no expiry |
| is_active | boolean | default true |

### `profiles` (extends auth.users)
| Column | Type | Notes |
|---|---|---|
| id | uuid | FK → auth.users |
| full_name | text | |
| phone | text | |
| is_admin | boolean | default false |

---

## Auth System

- **Customer:** Supabase Auth (email + password). Protected routes: `/orders`, `/checkout`.
- **Admin:** `is_admin = true` in `profiles` table. Protected via Next.js middleware. All `/admin/*` routes require admin role. Initial admin: `kag07rohit@gmail.com`.
- **Middleware:** `middleware.ts` checks session on every request. Non-admin on `/admin/*` → redirect to `/`.

---

## Payment Flow (Razorpay)

1. Customer fills checkout form (name, phone, address)
2. Client calls `POST /api/razorpay/create-order` → creates Razorpay order server-side
3. Razorpay checkout popup opens (UPI, Cards, NetBanking, EMI)
4. On success → client calls `POST /api/razorpay/verify` with payment signature
5. Server verifies signature with Razorpay secret
6. Order status updated to `paid` in Supabase
7. Customer redirected to order confirmation page

Supported methods (Razorpay handles): UPI, GPay, PhonePe, Paytm, Debit/Credit Cards, NetBanking, EMI.

---

## Admin Dashboard

### Overview
- Stats cards: Total Revenue, Total Orders, Pending Orders, Total Customers
- Sales chart: last 30 days (bar chart)
- Recent orders table

### Products
- List all products with image, name, price, stock status
- Add product: name, slug, description, price, compare_price, category, images (upload to Supabase Storage), featured toggle
- Edit product inline
- Add/remove variants per product
- Toggle in_stock

### Orders
- Filter by status (pending, paid, shipped, etc.)
- Order detail: items, customer info, shipping address, payment ID
- Update order status (dropdown)

### Customers
- List: name, email, phone, order count, total spend
- Click to see customer's orders

### Coupons
- Create coupon: code, type (% or flat), value, min order, max uses, expiry
- Toggle active/inactive
- Usage stats

### Analytics
- Revenue by month (line chart)
- Top 5 selling products
- Order status breakdown (pie chart)

---

## Store (Customer-Facing)

### Homepage
- Hero banner (existing brand aesthetic: ivory/cream/gold)
- Featured products section
- Category sections (Rudraksha, Crystal, Combo)
- Trust badges (100% Authentic, Nepal Origin, etc.)

### Shop Page
- Filter by category (Rudraksha, Crystal, Combo)
- Sort (price low-high, high-low, newest)
- Product grid with ProductCard (image, name, price, compare_price, rating placeholder)

### Product Detail
- Image gallery
- Name, price (with compare_price strikethrough)
- Variant selector (if variants exist)
- Add to Cart button
- Description + authenticity info

### Cart
- Item list (image, name, variant, qty, price)
- Coupon code input
- Order summary (subtotal, discount, total)
- Proceed to Checkout

### Checkout
- Shipping form (name, phone, address, city, pincode, state)
- Order summary
- Pay Now → Razorpay popup

### Order History (`/orders`)
- List of past orders with status badges
- Click to see order detail

---

## Shipping

Manual for now. Admin updates order status manually. Customer sees status on `/orders` page. No courier integration at launch.

---

## MCP Integrations

- **Supabase MCP** — connect to manage DB, run queries, view tables directly from Claude
- **Vercel MCP** — deploy and monitor from Claude

---

## Deployment

- **Frontend:** Vercel (auto-deploy on `git push`)
- **Database/Auth/Storage:** Supabase free tier
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

---

## Out of Scope (Launch v1)

- Shipping aggregator (Shiprocket) — add later
- Google OAuth — add later
- Email notifications — add later
- Product reviews/ratings — add later
- Wishlist — add later

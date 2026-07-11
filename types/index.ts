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

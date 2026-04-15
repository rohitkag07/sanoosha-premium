import { createClient } from '@/lib/supabase/server'
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

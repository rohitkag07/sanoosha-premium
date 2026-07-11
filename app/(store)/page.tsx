export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import HomeContent from '@/components/store/HomeContent'
import type { Product } from '@/types'

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Failed to load featured products', error)
    return []
  }

  if (data?.length) {
    return data
  }

  // fallback if no featured products
  const fallback = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  return fallback.data ?? []
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return <HomeContent featuredProducts={featuredProducts} />
}

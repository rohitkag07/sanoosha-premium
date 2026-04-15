'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ProductCategory } from '@/types'

function parseMoney(value: string | null): number | null {
  if (!value) return null
  const cleaned = value.trim()
  if (cleaned === '') return null
  return Math.round(parseFloat(cleaned) * 100)
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const price = parseMoney(formData.get('price') as string) ?? 0
  const comparePrice = parseMoney(formData.get('compare_price') as string)
  const category = formData.get('category') as ProductCategory
  const imageUrl = (formData.get('image_url') as string).trim()
  const inStock = formData.get('in_stock') === 'true'
  const featured = formData.get('featured') === 'true'

  const { error } = await supabase.from('products').insert({
    name,
    slug,
    description,
    price,
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
  const price = parseMoney(formData.get('price') as string) ?? 0
  const comparePrice = parseMoney(formData.get('compare_price') as string)
  const imageUrl = (formData.get('image_url') as string).trim()

  const { error } = await supabase
    .from('products')
    .update({
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      price,
      compare_price: comparePrice,
      category: formData.get('category') as ProductCategory,
      images: imageUrl ? [imageUrl] : [],
      in_stock: formData.get('in_stock') === 'true',
      featured: formData.get('featured') === 'true',
    })
    .eq('id', id)

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
  const { error } = await supabase.from('products').update({ in_stock: inStock }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
}

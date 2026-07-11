'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { DiscountType } from '@/types'

export async function createCoupon(formData: FormData) {
  const supabase = await createClient()

  const code = (formData.get('code') as string).trim().toUpperCase()
  const discountType = formData.get('discount_type') as DiscountType
  const discountValue = parseInt(formData.get('discount_value') as string, 10)
  const minOrderRaw = formData.get('min_order') as string
  const maxUsesRaw = formData.get('max_uses') as string
  const validUntil = (formData.get('valid_until') as string) || null

  const minOrder = minOrderRaw ? Math.round(parseFloat(minOrderRaw) * 100) : 0
  const maxUses = maxUsesRaw ? parseInt(maxUsesRaw, 10) : null

  const { error } = await supabase.from('coupons').insert({
    code,
    discount_type: discountType,
    discount_value: discountValue,
    min_order: minOrder,
    max_uses: maxUses,
    valid_until: validUntil,
    is_active: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/coupons')
}

export async function toggleCoupon(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('coupons').update({ is_active: !isActive }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/coupons')
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('coupons').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/coupons')
}

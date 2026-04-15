export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import type { Coupon } from '@/types'
import CouponsClient from './CouponsClient'

async function getCoupons(): Promise<Coupon[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons()
  return <CouponsClient coupons={coupons} />
}

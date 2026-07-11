import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

function getSupabaseConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE URL and anon or publishable key are required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.')
  }

  return { supabaseUrl, supabaseKey }
}

export function createClient() {
  const { supabaseUrl: url, supabaseKey: key } = getSupabaseConfig()
  return createBrowserClient(url, key)
}

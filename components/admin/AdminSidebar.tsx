'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart2,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
    <aside className="w-72 min-h-screen bg-[#0f172a] flex flex-col border-r border-white/10">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="text-gold font-bold text-sm tracking-[0.3em] uppercase">SANOOSHA</div>
        <div className="text-white/40 text-xs mt-1">Admin Dashboard</div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                isActive
                  ? 'bg-gold/15 text-gold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 pb-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { ShoppingBag, User, Search } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function Navbar() {
  const totalItems = useCartStore(s => s.totalItems())

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-lt">
      <nav className="container mx-auto px-4 max-w-[1240px] flex items-center justify-between h-[72px]">
        <Link href="/">
          <img
            src="https://sanoosha.com/wp-content/uploads/2024/04/Sanoo-Photoroom.png"
            alt="Sanoosha"
            className="h-10"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-charcoal">
          <li><Link href="/shop?category=rudraksha" className="hover:text-terra transition">Rudraksha</Link></li>
          <li><Link href="/shop?category=crystal" className="hover:text-terra transition">Crystals</Link></li>
          <li><Link href="/shop?category=combo" className="hover:text-terra transition">Combo Sets</Link></li>
          <li><Link href="/#story" className="hover:text-terra transition">About</Link></li>
        </ul>

        <div className="flex items-center gap-5 text-charcoal">
          <Link href="/shop" aria-label="Search"><Search size={20} className="hover:text-terra transition" /></Link>
          <Link href="/login" aria-label="Account"><User size={20} className="hover:text-terra transition" /></Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingBag size={20} className="hover:text-terra transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-terra text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}

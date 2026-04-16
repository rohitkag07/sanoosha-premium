'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, X, Phone } from 'lucide-react'
import { useCartStore } from '@/store/cart'

const NAV_LINKS = [
  { href: '/shop?category=rudraksha', label: 'Rudraksha' },
  { href: '/shop?category=crystal', label: 'Crystals' },
  { href: '/shop?category=combo', label: 'Combo Sets' },
  { href: '/#story', label: 'About' },
]

export default function Navbar() {
  const totalItems = useCartStore(s => s.totalItems())
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/98 shadow-[0_2px_20px_rgba(26,26,26,0.08)]' : 'bg-white/95'} backdrop-blur-md border-b border-gray-lt/60`}>
        <nav className="container mx-auto px-4 max-w-[1240px] flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="https://sanoosha.com/wp-content/uploads/2024/04/Sanoo-Photoroom.png"
              alt="Sanoosha"
              className="h-9"
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-7 text-[13px] font-medium text-charcoal">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="relative group py-1 hover:text-terra transition-colors duration-200">
                  {l.label}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-terra group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-4 text-charcoal">
            <Link href="/shop" aria-label="Search" className="hidden md:block hover:text-terra transition-colors">
              <Search size={19} />
            </Link>
            <Link href="/login" aria-label="Account" className="hidden md:block hover:text-terra transition-colors">
              <User size={19} />
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative hover:text-terra transition-colors">
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-terra text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1 hover:text-terra transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-lt">
              <img src="https://sanoosha.com/wp-content/uploads/2024/04/Sanoo-Photoroom.png" alt="Sanoosha" className="h-8" />
              <button onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex-1 px-5 py-6 space-y-1">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-3 rounded-lg text-charcoal font-medium hover:bg-ivory hover:text-terra transition-colors text-[15px]"
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-lt mt-4 space-y-1">
                <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 py-3 px-3 rounded-lg text-charcoal hover:bg-ivory hover:text-terra transition-colors text-[15px]">
                  <User size={17} /> My Account
                </Link>
                <Link href="/cart" onClick={() => setOpen(false)} className="flex items-center gap-3 py-3 px-3 rounded-lg text-charcoal hover:bg-ivory hover:text-terra transition-colors text-[15px]">
                  <ShoppingBag size={17} /> Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
              </div>
            </nav>
            <div className="px-5 py-4 border-t border-gray-lt">
              <a href="https://wa.me/919232154621" className="flex items-center gap-2 text-sm text-gray-brand hover:text-terra transition-colors">
                <Phone size={15} /> +91 9232154621
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Collection' },
  { href: '/shop?category=rudraksha', label: 'Rudraksha' },
  { href: '/shop?category=crystal', label: 'Crystals' },
  { href: '/#story', label: 'About' },
]

export default function Navbar() {
  const totalItems = useCartStore(s => s.totalItems())
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    if (href === '/shop') return pathname === '/shop'
    return pathname.startsWith(href.split('?')[0]) && href.includes('?')
  }

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 bg-ivory/97 backdrop-blur-md border-b border-gray-lt/70 ${scrolled ? 'shadow-[0_2px_16px_rgba(26,26,26,0.07)]' : ''}`}>
        <nav className="container mx-auto px-6 max-w-[1240px] flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex flex-col items-start flex-shrink-0 group">
            <span className="font-serif text-[1.55rem] font-semibold text-charcoal tracking-[0.04em] leading-none group-hover:text-terra transition-colors duration-200">
              Sanoosha
            </span>
            <span className="text-[0.57rem] font-medium tracking-[0.22em] uppercase text-gold mt-[3px]">
              Sacred Collection
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {NAV_LINKS.map(l => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className={`relative text-[11.5px] font-medium tracking-[0.1em] uppercase transition-colors duration-200 pb-0.5 group ${
                    isActive(l.href) ? 'text-terra' : 'text-charcoal hover:text-terra'
                  }`}
                >
                  {l.label}
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-terra transition-all duration-300 ${
                    isActive(l.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <Link
              href="/shop"
              aria-label="Search"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-charcoal hover:bg-gray-lt/70 transition-colors"
            >
              <Search size={17} />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-charcoal hover:bg-gray-lt/70 transition-colors"
            >
              <Heart size={17} />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex w-9 h-9 items-center justify-center rounded-full text-charcoal hover:bg-gray-lt/70 transition-colors"
            >
              <ShoppingBag size={17} />
              {totalItems > 0 && (
                <span className="absolute top-[6px] right-[6px] bg-terra text-white text-[8px] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden flex w-9 h-9 items-center justify-center rounded-full text-charcoal hover:bg-gray-lt/70 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[280px] bg-ivory shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-lt">
              <div>
                <div className="font-serif text-xl font-semibold text-charcoal">Sanoosha</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-gold">Sacred Collection</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-charcoal hover:text-terra transition-colors">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-6 py-4">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 border-b border-gray-lt/60 font-serif text-xl font-medium text-charcoal hover:text-terra transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="px-6 py-5 border-t border-gray-lt space-y-1">
              <Link href="/cart" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-sm text-gray-brand hover:text-terra transition-colors">
                <ShoppingBag size={15} /> Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-sm text-gray-brand hover:text-terra transition-colors">
                My Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-12 pb-6">
      <div className="container mx-auto px-4 max-w-[1240px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              src="https://sanoosha.com/wp-content/uploads/2024/04/Sanoo-Photoroom.png"
              alt="Sanoosha"
              className="h-10 mb-4 brightness-0 invert"
            />
            <p className="text-sm text-white/60 leading-relaxed">
              Authentic energy jewellery from Nepal with premium packaging and certified Rudraksha stones.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="mailto:sanooshatjewel@yahoo.com" className="text-white/60 hover:text-gold transition text-sm">Email</a>
              <a href="https://wa.me/919232154621" className="text-white/60 hover:text-gold transition text-sm">WhatsApp</a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Collections</h5>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/shop?category=rudraksha" className="hover:text-gold transition">Rudraksha</Link></li>
              <li><Link href="/shop?category=crystal" className="hover:text-gold transition">Crystal Healing</Link></li>
              <li><Link href="/shop?category=combo" className="hover:text-gold transition">Combo Sets</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Support</h5>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/login" className="hover:text-gold transition">Account</Link></li>
              <li><Link href="/shop" className="hover:text-gold transition">Shop</Link></li>
              <li><Link href="/cart" className="hover:text-gold transition">Cart</Link></li>
              <li><Link href="/refund-policy" className="hover:text-gold transition">Refund Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-gold transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gold transition">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Contact</h5>
            <p className="text-sm text-white/60 leading-relaxed">
              sanooshatjewel@yahoo.com<br />+91 9232154621<br />Noida, Uttar Pradesh
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Sanoosha. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

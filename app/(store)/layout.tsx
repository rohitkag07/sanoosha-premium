import type { Metadata } from 'next'
import AnnouncementBar from '@/components/store/AnnouncementBar'
import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'

export const metadata: Metadata = {
  title: 'Sanoosha Premium',
  description: 'Premium Rudraksha and spiritual jewellery from Nepal',
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-[#f8f5f0] text-charcoal">
        <AnnouncementBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  )
}

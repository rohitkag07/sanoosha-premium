import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#091121]">{children}</main>
    </div>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="https://sanoosha.com/wp-content/uploads/2024/04/Sanoo-Photoroom.png"
            alt="Sanoosha"
            className="h-12 mx-auto mb-2"
          />
        </div>
        {children}
      </div>
    </div>
  )
}

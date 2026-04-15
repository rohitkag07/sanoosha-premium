'use client'

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [redirect, setRedirect] = useState('/')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRedirect(params.get('redirect') ?? '/')
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-brand shadow-lg p-8">
      <h1 className="font-serif text-2xl font-semibold text-charcoal mb-6">Welcome back</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-terra hover:bg-terra-dark text-white font-semibold py-3 rounded-lg text-sm uppercase tracking-wide transition disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-brand mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-terra font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-brand shadow-lg p-8">
      <h1 className="font-serif text-2xl font-semibold text-charcoal mb-6">Create account</h1>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
            placeholder="Priya Sharma"
          />
        </div>

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
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-lt rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terra transition"
            placeholder="Min 6 characters"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-terra hover:bg-terra-dark text-white font-semibold py-3 rounded-lg text-sm uppercase tracking-wide transition disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-brand mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-terra font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

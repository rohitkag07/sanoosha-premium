'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const MESSAGES = [
  { text: 'Free shipping on all orders above ₹999', code: null },
  { text: 'Use code', code: 'SACRED10', suffix: ' for 10% off your first order' },
  { text: 'Every purchase is Lab Certified from Nepal', code: null },
]

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)
  const [idx, setIdx] = useState(0)

  if (dismissed) return null

  const msg = MESSAGES[idx]

  return (
    <div className="relative bg-charcoal py-2.5 px-10 flex items-center justify-center gap-5">
      <p className="text-[11px] font-medium tracking-[0.04em] text-white/75 text-center">
        {msg.text}
        {msg.code && (
          <>
            {' '}
            <span className="font-bold text-gold tracking-widest border border-gold/50 px-1.5 py-0.5 rounded-sm text-[10px] mx-0.5">
              {msg.code}
            </span>
            {msg.suffix}
          </>
        )}
        <span className="hidden sm:inline text-white/30 mx-3">·</span>
        <span className="hidden sm:inline text-white/40 text-[10px] tracking-[0.12em] uppercase">Lab Certified</span>
        <span className="hidden sm:inline text-white/30 mx-2">·</span>
        <span className="hidden sm:inline text-white/40 text-[10px] tracking-[0.12em] uppercase">Nepal Origin</span>
      </p>

      <div className="hidden sm:flex items-center gap-1.5 ml-2">
        {MESSAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === idx ? 'bg-gold w-4' : 'bg-white/25 w-1.5 hover:bg-white/50'}`}
          />
        ))}
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/80 transition-colors"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  )
}

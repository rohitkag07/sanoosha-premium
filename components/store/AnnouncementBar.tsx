'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const MESSAGES = [
  '🌿 Free shipping on orders above ₹999',
  '📿 100% Authentic Nepal-origin Rudraksha',
  '✨ Every bead energised with Vedic mantras before dispatch',
]

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  const [idx, setIdx] = useState(0)

  if (!visible) return null

  return (
    <div className="bg-charcoal text-white text-center py-2.5 px-8 text-[11px] font-medium tracking-[0.05em] relative flex items-center justify-center gap-4">
      <span className="text-gold/60 hidden sm:inline">✦</span>
      <span>{MESSAGES[idx]}</span>
      <span className="text-gold/60 hidden sm:inline">✦</span>
      {/* Dot nav */}
      <div className="hidden sm:flex items-center gap-1 ml-4">
        {MESSAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-gold' : 'bg-white/30'}`}
          />
        ))}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X size={13} />
      </button>
    </div>
  )
}

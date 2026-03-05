'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { AlertTriangle, Shield, Zap } from 'lucide-react'

interface RedFlagFeedProps {
  flags: Array<{ flag: string; timestamp: number }>
}

function FlagItem({ flag, timestamp }: { flag: string; timestamp: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(ref.current,
      { opacity: 0, y: -12, backgroundColor: 'rgba(239,68,68,0.25)' },
      {
        opacity: 1, y: 0, backgroundColor: 'rgba(239,68,68,0.05)',
        duration: 0.5,
        ease: 'power2.out',
      }
    )
  }, [])

  const time = new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })

  return (
    <div
      ref={ref}
      className="flex items-center gap-2 px-3 py-2 rounded border border-red-500/20 bg-red-500/5"
    >
      <AlertTriangle size={11} className="text-red-400 shrink-0" />
      <span className="text-red-300 text-xs font-mono flex-1 leading-tight">{flag}</span>
      <span className="text-white/25 text-[10px] font-mono shrink-0">{time}</span>
    </div>
  )
}

export default function RedFlagFeed({ flags }: RedFlagFeedProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {flags.length === 0 ? (
        <div className="flex items-center gap-2 px-3 py-3 rounded border border-white/5">
          <Shield size={12} className="text-green-400/50" />
          <span className="text-white/25 text-xs font-mono">No red flags detected</span>
        </div>
      ) : (
        [...flags].reverse().map((f, i) => (
          <FlagItem key={`${f.flag}-${f.timestamp}`} flag={f.flag} timestamp={f.timestamp} />
        ))
      )}
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Clock, MessageSquare, Shield, AlertOctagon, Activity } from 'lucide-react'

interface StatusBarProps {
  turns: number
  startTime: number | null
  confidenceLevel: 'low' | 'medium' | 'high'
  scamType: string
  totalIntel: number
  sessionId: string
}

const confidenceColors = {
  low:    { text: 'text-green-400',  border: 'border-green-400/40',  bg: 'bg-green-400' },
  medium: { text: 'text-yellow-400', border: 'border-yellow-400/40', bg: 'bg-yellow-400' },
  high:   { text: 'text-red-400',    border: 'border-red-400/40',    bg: 'bg-red-400' },
}

function useElapsedTime(startTime: number | null): string {
  const [elapsed, setElapsed] = useState('00:00')

  useEffect(() => {
    if (!startTime) return
    const tick = () => {
      const s = Math.floor((Date.now() - startTime) / 1000)
      const m = Math.floor(s / 60)
      const sec = s % 60
      setElapsed(`${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startTime])

  return elapsed
}

export default function StatusBar({ turns, startTime, confidenceLevel, scamType, totalIntel, sessionId }: StatusBarProps) {
  const elapsed = useElapsedTime(startTime)
  const cc = confidenceColors[confidenceLevel]
  const barRef = useRef<HTMLDivElement>(null)
  const prevTurns = useRef(0)

  useEffect(() => {
    if (turns > prevTurns.current && barRef.current) {
      gsap.fromTo(barRef.current,
        { borderColor: 'rgba(251,191,36,0.6)' },
        { borderColor: 'rgba(255,255,255,0.08)', duration: 1.5 }
      )
      prevTurns.current = turns
    }
  }, [turns])

  const intelPct = Math.min((totalIntel / 8) * 100, 100)

  return (
    <div
      ref={barRef}
      className="flex flex-wrap items-center gap-4 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm"
    >
      {/* Session ID */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-honey-400 animate-pulse-slow" />
        <span className="text-white/30 text-[10px] font-mono tracking-widest">SESSION</span>
        <span className="text-honey-400/70 text-[10px] font-mono">{sessionId.slice(-8)}</span>
      </div>

      <div className="w-px h-4 bg-white/10" />

      {/* Timer */}
      <div className="flex items-center gap-1.5">
        <Clock size={11} className="text-white/40" />
        <span className="text-white/70 text-xs font-mono">{elapsed}</span>
      </div>

      {/* Turns */}
      <div className="flex items-center gap-1.5">
        <MessageSquare size={11} className="text-white/40" />
        <span className="text-white/40 text-xs font-mono">Turns:</span>
        <span className="text-white/80 text-xs font-mono">{turns}</span>
      </div>

      {/* Scam type */}
      {scamType !== 'generic_scam' && (
        <>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <AlertOctagon size={11} className="text-orange-400" />
            <span className="text-orange-300 text-xs font-mono uppercase tracking-wide">
              {scamType.replace('_', ' ')}
            </span>
          </div>
        </>
      )}

      {/* Confidence */}
      <div className="w-px h-4 bg-white/10" />
      <div className="flex items-center gap-1.5">
        <Shield size={11} className={cc.text} />
        <span className="text-white/40 text-xs font-mono">Confidence:</span>
        <span className={`${cc.text} text-xs font-mono uppercase`}>{confidenceLevel}</span>
      </div>

      {/* Intel progress */}
      <div className="ml-auto flex items-center gap-2">
        <Activity size={11} className="text-white/40" />
        <span className="text-white/40 text-xs font-mono">Intel:</span>
        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${cc.bg}`}
            style={{ width: `${intelPct}%` }}
          />
        </div>
        <span className="text-white/60 text-xs font-mono">{totalIntel}</span>
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { v4 as uuidv4 } from 'uuid'
import dynamic from 'next/dynamic'
import { Send, RefreshCw, Hexagon, Bug, Database, Flag } from 'lucide-react'

import ChatWindow, { Message } from '@/components/ChatWindow'
import IntelPanel from '@/components/IntelPanel'
import RedFlagFeed from '@/components/RedFlagFeed'
import StatusBar from '@/components/StatusBar'

import {
  Intel, emptyIntel, extractIntel, mergeIntel,
  detectScamFlags, classifyScamType, getConfidenceLevel
} from '@/lib/intel'

const HoneycombBg = dynamic(() => import('@/components/HoneycombBg'), { ssr: false })

interface IntelItem {
  type: string
  value: string
  id: string
}

interface RedFlagEntry {
  flag: string
  timestamp: number
}

export default function Dashboard() {
  const [sessionId, setSessionId] = useState('session_00000000')
  useEffect(() => {
    setSessionId(`session_${uuidv4().slice(0, 8)}`)
  }, [])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [intel, setIntel] = useState<Intel>(emptyIntel())
  const [intelItems, setIntelItems] = useState<IntelItem[]>([])
  const [redFlags, setRedFlags] = useState<RedFlagEntry[]>([])
  const [startTime, setStartTime] = useState<number | null>(null)
  const [turns, setTurns] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const sendBtnRef = useRef<HTMLButtonElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  // Derived state
  const allText = messages.map(m => m.content).join(' ')
  const scamType = classifyScamType(intel, allText)
  const confidenceLevel = getConfidenceLevel(redFlags.length)
  const threatLevel = Math.min(redFlags.length / 8, 1)

  // Intro animation
  useEffect(() => {
    if (!mainRef.current) return
    gsap.fromTo(mainRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  const processNewText = useCallback((text: string) => {
    // Extract new intel
    const newIntel = extractIntel(text)

    setIntel(prev => {
      const merged = mergeIntel(prev, newIntel)

      // Find truly new items
      const newItems: IntelItem[] = []
        ; (Object.keys(newIntel) as (keyof Intel)[]).forEach(key => {
          newIntel[key].forEach(val => {
            if (!prev[key].includes(val)) {
              newItems.push({ type: key, value: val, id: uuidv4() })
            }
          })
        })

      if (newItems.length > 0) {
        setIntelItems(prev => [...prev, ...newItems])
      }

      return merged
    })

    // Detect new red flags
    const flags = detectScamFlags(text)
    setRedFlags(prev => {
      const existingFlags = prev.map(f => f.flag)
      const newFlags = flags
        .filter(f => !existingFlags.includes(f))
        .map(f => ({ flag: f, timestamp: Date.now() }))
      return [...prev, ...newFlags]
    })
  }, [])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    if (!startTime) setStartTime(Date.now())

    // Animate send button
    if (sendBtnRef.current) {
      gsap.fromTo(sendBtnRef.current,
        { scale: 0.9 },
        { scale: 1, duration: 0.3, ease: 'back.out(2)' }
      )
    }

    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setTurns(t => t + 1)

    processNewText(text)

    try {
      const conversationHistory = messages.map(m => ({ text: m.content }))

      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: { text },
          conversationHistory,
        }),
      })

      const data = await res.json()
      const replyText = data.reply || 'Sorry, can you repeat that?'

      const assistantMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: replyText,
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, assistantMsg])
      processNewText(replyText)

    } catch (err) {
      console.error(err)
      const errMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [input, isLoading, messages, sessionId, startTime, processNewText])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetSession = () => {
    setMessages([])
    setInput('')
    setIntel(emptyIntel())
    setIntelItems([])
    setRedFlags([])
    setStartTime(null)
    setTurns(0)
  }

  const totalIntel = Object.values(intel).flat().length

  return (
    <div className="relative min-h-screen bg-[#080808] text-white overflow-hidden">
      {/* Three.js background */}
      <HoneycombBg threatLevel={threatLevel} />

      {/* Scan line effect */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.015]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)',
        }}
      />

      <div ref={mainRef} className="relative z-20 flex flex-col h-screen p-4 gap-3 opacity-0">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Hexagon size={28} className="text-honey-500" strokeWidth={1.5} />
              <Bug size={12} className="text-honey-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h1 className="text-honey-400 font-mono text-sm font-bold tracking-[0.2em] uppercase">
                Honeypot Command
              </h1>
              <p className="text-white/25 text-[10px] font-mono tracking-widest">
                AGENTIC SCAM INTERCEPTION SYSTEM
              </p>
            </div>
          </div>

          <button
            onClick={resetSession}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white/80 text-xs font-mono"
          >
            <RefreshCw size={11} />
            New Session
          </button>
        </div>

        {/* Status bar */}
        <StatusBar
          turns={turns}
          startTime={startTime}
          confidenceLevel={confidenceLevel}
          scamType={scamType}
          totalIntel={totalIntel}
          sessionId={sessionId}
        />

        {/* Main 3-column layout */}
        <div className="flex flex-1 gap-3 min-h-0">

          {/* LEFT: Chat */}
          <div className="flex flex-col flex-1 min-w-0 rounded-xl border border-white/8 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8">
              <div className="w-1.5 h-1.5 rounded-full bg-honey-500 animate-pulse" />
              <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Live Conversation</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 scroll-smooth custom-scrollbar">
              <ChatWindow messages={messages} isLoading={isLoading} />
            </div>

            {/* Input */}
            <div className="border-t border-white/8 p-3 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type as the scammer…"
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono text-white placeholder-white/25 focus:outline-none focus:border-honey-500/50 focus:bg-white/8 transition-colors disabled:opacity-50"
              />
              <button
                ref={sendBtnRef}
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2.5 rounded-lg bg-honey-500/20 border border-honey-500/40 hover:bg-honey-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send size={14} className="text-honey-400" />
              </button>
            </div>
          </div>

          {/* RIGHT: Intel + Flags panels */}
          <div className="flex flex-col gap-3 w-72 shrink-0">

            {/* Intel extraction */}
            <div className="flex-1 rounded-xl border border-white/8 bg-white/[0.02] backdrop-blur-sm overflow-hidden flex flex-col min-h-0">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Database size={11} className="text-honey-400" />
                  <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Extracted Intel</span>
                </div>
                {intelItems.length > 0 && (
                  <span className="text-honey-400 text-[10px] font-mono bg-honey-500/10 px-2 py-0.5 rounded-full border border-honey-500/20">
                    {intelItems.length}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                <IntelPanel items={intelItems} />
              </div>
            </div>

            {/* Red flags */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] backdrop-blur-sm overflow-hidden flex flex-col max-h-64">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Flag size={11} className="text-red-400" />
                  <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Red Flags</span>
                </div>
                {redFlags.length > 0 && (
                  <span className="text-red-400 text-[10px] font-mono bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                    {redFlags.length}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                <RedFlagFeed flags={redFlags} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

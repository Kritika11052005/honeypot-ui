'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { User, Bot } from 'lucide-react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
}

function MessageBubble({ msg }: { msg: Message }) {
  const ref = useRef<HTMLDivElement>(null)
  const isUser = msg.role === 'user'

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(ref.current,
      { opacity: 0, y: 16, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
    )
  }, [])

  const time = new Date(msg.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div
      ref={ref}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} opacity-0`}
    >
      {/* Avatar */}
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5
        ${isUser
          ? 'bg-red-500/20 border border-red-500/40'
          : 'bg-honey-500/20 border border-honey-500/40'
        }`}>
        {isUser
          ? <User size={13} className="text-red-400" />
          : <Bot size={13} className="text-honey-400" />
        }
      </div>

      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`text-[10px] font-mono tracking-wider uppercase
          ${isUser ? 'text-red-400/60' : 'text-honey-500/60'}`}>
          {isUser ? 'SCAMMER' : 'Sarthak (HONEYPOT)'}
        </div>
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed font-mono break-words whitespace-pre-wrap w-full
  ${isUser
            ? 'bg-red-500/10 border border-red-500/20 text-red-100 rounded-tr-sm'
            : 'bg-honey-500/10 border border-honey-500/20 text-honey-100 rounded-tl-sm'
          }`}>
          {msg.content}
        </div>
        <div className="text-[10px] text-white/20 font-mono">{time}</div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-center">
      <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-honey-500/20 border border-honey-500/40">
        <Bot size={13} className="text-honey-400" />
      </div>
      <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm bg-honey-500/10 border border-honey-500/20">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-honey-400"
              style={{
                animation: `bounce 1.2s ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col gap-4 py-4 px-1">
      {messages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-honey-600/30 font-mono text-xs tracking-widest uppercase mb-2">
            Honeypot Active
          </div>
          <div className="text-white/20 text-sm font-mono">
            Type a scammer message to begin the session
          </div>
        </div>
      )}
      {messages.map(msg => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Phone, CreditCard, Link, Mail, Hash, FileText, ShoppingCart, Wallet } from 'lucide-react'

interface IntelItem {
  type: string
  value: string
  id: string
}

interface IntelPanelProps {
  items: IntelItem[]
}

const typeConfig: Record<string, { icon: React.FC<any>; label: string; color: string; bg: string }> = {
  phoneNumbers:   { icon: Phone,       label: 'Phone',      color: 'text-green-400',  bg: 'border-green-400/30 bg-green-400/5' },
  upiIds:         { icon: Wallet,      label: 'UPI ID',     color: 'text-yellow-400', bg: 'border-yellow-400/30 bg-yellow-400/5' },
  bankAccounts:   { icon: CreditCard,  label: 'Account',    color: 'text-blue-400',   bg: 'border-blue-400/30 bg-blue-400/5' },
  phishingLinks:  { icon: Link,        label: 'Link',       color: 'text-red-400',    bg: 'border-red-400/30 bg-red-400/5' },
  emailAddresses: { icon: Mail,        label: 'Email',      color: 'text-purple-400', bg: 'border-purple-400/30 bg-purple-400/5' },
  caseIds:        { icon: Hash,        label: 'Case ID',    color: 'text-orange-400', bg: 'border-orange-400/30 bg-orange-400/5' },
  policyNumbers:  { icon: FileText,    label: 'Policy',     color: 'text-cyan-400',   bg: 'border-cyan-400/30 bg-cyan-400/5' },
  orderNumbers:   { icon: ShoppingCart,label: 'Order',      color: 'text-pink-400',   bg: 'border-pink-400/30 bg-pink-400/5' },
}

function IntelCard({ item, index }: { item: IntelItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const config = typeConfig[item.type] || typeConfig.caseIds
  const Icon = config.icon

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(ref.current,
      { opacity: 0, x: 40, scale: 0.92 },
      {
        opacity: 1, x: 0, scale: 1,
        duration: 0.45,
        ease: 'back.out(1.4)',
        delay: index * 0.04,
      }
    )
    // Flash highlight on entry
    gsap.fromTo(ref.current,
      { boxShadow: '0 0 20px rgba(251,191,36,0.6)' },
      { boxShadow: '0 0 0px rgba(251,191,36,0)', duration: 1.2, delay: 0.2 }
    )
  }, [])

  return (
    <div
      ref={ref}
      className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${config.bg} opacity-0`}
    >
      <Icon className={`${config.color} mt-0.5 shrink-0`} size={13} />
      <div className="min-w-0">
        <div className={`text-[10px] font-mono uppercase tracking-widest ${config.color} opacity-70 mb-0.5`}>
          {config.label}
        </div>
        <div className="text-xs font-mono text-white/90 break-all leading-tight">
          {item.value}
        </div>
      </div>
    </div>
  )
}

export default function IntelPanel({ items }: IntelPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      {items.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-honey-600/40 font-mono text-xs tracking-widest uppercase">
            No intel extracted yet
          </div>
          <div className="text-white/20 text-[10px] mt-1 font-mono">
            Start the conversation to begin extraction
          </div>
        </div>
      ) : (
        items.map((item, i) => (
          <IntelCard key={item.id} item={item} index={i} />
        ))
      )}
    </div>
  )
}

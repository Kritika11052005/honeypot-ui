import type { Metadata } from 'next'
import { JetBrains_Mono, Rajdhani } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '600', '700'],
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Honeypot Command — Agentic Scam Interception',
  description: 'AI-powered honeypot system that engages and extracts intelligence from scammers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${rajdhani.variable}`}>
      <body className="antialiased bg-[#080808]">
        {children}
      </body>
    </html>
  )
}

# 🍯 Honeypot Command — Agentic Scam Interception System

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge)](https://greensock.com/gsap/)
[![Three.js](https://img.shields.io/badge/Three.js-r165-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![GUVI Hackathon](https://img.shields.io/badge/GUVI_Hackathon-Finalist-gold?style=for-the-badge)](https://guvi.in/)

> An AI-powered honeypot that engages scammers as "Sarthak" — a naive, forgetful 68-year-old — while silently extracting phone numbers, UPI IDs, bank accounts, phishing links, and case IDs in real time.

![Honeypot Command Dashboard](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)

---

## 🌐 Live Demo

> Type as a scammer. Watch Sarthak stall, confuse, and extract intelligence — all in real time.

```
Frontend: honeypot-ui.vercel.app
Backend:  [agentic-honey-pot-api-endpoint.onrender.com](https://agentic-honey-pot-api-endpoint.onrender.com)
```

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [API Routes](#-api-routes)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Test Cases](#-test-cases)
- [How It Works](#-how-it-works)
- [Hackathon Context](#-hackathon-context)
- [License](#-license)

---

## 🎯 Overview

**Honeypot Command** is a full-stack agentic AI system built to fight phone and digital scams. The system deploys an AI persona — "Sarthak" — that impersonates a confused elderly victim. Instead of hanging up or ignoring scammers, Sarthak engages them, asks questions, stalls, and extracts actionable intelligence: phone numbers, UPI IDs, bank accounts, phishing links, and more.

The frontend dashboard provides a real-time command center for monitoring live sessions, watching intel get extracted turn-by-turn, and tracking red flags as they fire.

### What Makes This Special?

- **Agentic Persona**: Sarthak uses rotating question strategies to keep scammers engaged for 9+ turns
- **Real-time Intel Extraction**: Phone numbers, UPI IDs, emails, bank accounts, and phishing links extracted from every message
- **Threat-Reactive UI**: The Three.js background literally turns red as more red flags are detected
- **Deadline-Aware AI**: Backend uses retry logic and deadline budgets to stay within the 30s evaluator limit
- **Zero Client Exposure**: API key never reaches the browser — proxied through a secure Next.js route

---

## ✨ Key Features

### 🤖 Sarthak — The Honeypot Persona
- Portrays a naive, slightly hard-of-hearing 68-year-old retired government employee
- 10 rotating question strategies to extract scammer credentials across turns
- Fixed high-quality turn 1 opener to save latency and ensure engagement
- Fallback replies when Gemini is unavailable — never drops the conversation

### 🔍 Real-Time Intel Extraction
- **Phone numbers** — Indian mobile format detection (`+91`, `0`, direct 10-digit)
- **UPI IDs** — Distinguished from email addresses by TLD detection
- **Bank account numbers** — 9–18 digit pattern matching
- **Phishing links** — Full URL capture with `http/https` detection
- **Email addresses** — Full RFC-compliant email capture
- **Case IDs / Reference numbers** — CRN, URN, ticket, complaint IDs
- **Policy and order numbers** — Insurance and e-commerce fraud patterns

### 🚨 Scam Pattern Detection
12 scam patterns detected in real time, including urgency language, OTP requests, account threats, payment platforms, KYC scams, reward lures, authority impersonation, and more.

### 📊 Live Dashboard
- **Session status bar** — Live timer, turn counter, scam type classification, confidence level
- **Intel extraction panel** — Color-coded animated cards per intel type
- **Red flag feed** — Timestamped flags appearing newest-first
- **Three.js background** — Hexagonal mesh that intensifies amber → red as threat level rises
- **GSAP animations** — Flash effects on new intel, slide-in messages, pulse on status updates

### 🔐 Security
- API key proxied server-side via Next.js API route
- Rate limiting on backend (60 req/min)
- Session isolation per `sessionId`

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Framework, SSR, API proxy routes |
| **TypeScript** | Type safety across all components |
| **Tailwind CSS** | Utility-first styling |
| **GSAP 3.12** | Message animations, intel card reveals, flash effects |
| **Three.js r165** | Animated hexagonal particle background |
| **Lucide React** | Icon system |
| **JetBrains Mono** | Monospace font for terminal aesthetic |
| **Rajdhani** | Display font for headings |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | API server |
| **Google Gemini 2.5 Flash** | LLM powering Sarthak's responses |
| **Axios** | HTTP client with retry and timeout logic |
| **express-rate-limit** | Request throttling |
| **In-memory Map** | Session state storage |

### AI & Detection
| Technology | Purpose |
|---|---|
| **Google Gemini API** | Conversational AI for Sarthak persona |
| **Regex Pattern Engine** | 12-pattern scam detection system |
| **Custom Intel Extractor** | Phone, UPI, bank, link, email extraction |
| **Scam Classifier** | 7-type scam classification (phishing, UPI fraud, bank fraud, etc.) |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Vercel** | Frontend deployment |
| **Render** | Backend API deployment |
| **GitHub** | Version control |

---

## 🏗 Architecture

### System Flow

```
Scammer sends message
        ↓
Next.js Frontend (honeypot-ui)
        ↓
/api/message proxy route (adds API key server-side)
        ↓
Express Backend on Render
        ↓
┌───────────────────────────────┐
│  Session Manager              │
│  ↓           ↓               │
│  Scam      Intel              │
│  Detector  Extractor          │
│  ↓           ↓               │
│  Red Flags  Phone/UPI/Bank    │
│             Links/Email       │
└───────────────────────────────┘
        ↓
Gemini 2.5 Flash API
(with deadline-aware retry + exponential backoff)
        ↓
Sarthak's reply
        ↓
Frontend renders reply + animates new intel
        ↓
Three.js background reacts to threat level
        ↓
[After 9 turns OR 5 turns + intel OR 3 turns + 5 flags]
        ↓
Final result submitted to GUVI evaluation endpoint
```

### Scoring Architecture (Hackathon)

| Criterion | Weight | How We Score |
|---|---|---|
| Scam Detection | 20 pts | 12-pattern regex engine |
| Intelligence Extraction | 30 pts | 8-field intel extractor |
| Conversation Quality | 30 pts | Gemini + rotating strategies |
| Engagement Quality | 10 pts | 9+ turn engagement logic |
| Response Structure | 10 pts | Structured final payload |

### Session State

```typescript
{
  id: string
  messages: { role: 'user' | 'assistant', content: string }[]
  turns: number
  startTime: number
  scamDetected: boolean
  redFlags: string[]
  intelligence: {
    phoneNumbers: string[]
    upiIds: string[]
    bankAccounts: string[]
    phishingLinks: string[]
    emailAddresses: string[]
    caseIds: string[]
    policyNumbers: string[]
    orderNumbers: string[]
  }
  finalSent: boolean
}
```

---

## 🔌 API Routes

### Backend (Express — Render)

**POST** `/api/message`
- Headers: `x-api-key: <key>`, `Content-Type: application/json`
- Body: `{ sessionId, message: { text }, conversationHistory?, metadata? }`
- Response: `{ status: "success", reply: string }`

**GET** `/api/message`
- Health check — returns `{ status: "success", reply: "Hello" }`

**GET** `/`
- Root health check

### Frontend (Next.js API Route)

**POST** `/api/message`
- Secure proxy — adds API key server-side
- Forwards to backend and returns response
- Key never exposed to browser

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- Google Gemini API key
- Git

### Frontend Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/honeypot-ui.git
cd honeypot-ui

# 2. Install dependencies
npm install

# 3. Add environment variables
# Create .env.local with:
HONEYPOT_API_URL=https://agentic-honey-pot-api-endpoint.onrender.com
HONEYPOT_API_KEY=your_api_key_here

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend Setup

```bash
# 1. Clone backend repo
git clone https://github.com/YOUR_USERNAME/honeypot-api.git
cd honeypot-api

# 2. Install dependencies
npm install

# 3. Create .env
API_KEY=your_api_key_here
GEMINI_API_KEY=your_gemini_key_here
PORT=3000

# 4. Run
npm start
```

### Production Build

```bash
# Frontend
npm run build
npm start

# Deploy to Vercel
npx vercel
```

---

## 📁 Project Structure

```
honeypot-ui/                          # Frontend (Next.js)
├── app/
│   ├── api/
│   │   └── message/
│   │       └── route.ts              # Secure API proxy
│   ├── globals.css                   # Global styles + animations
│   ├── layout.tsx                    # Root layout with fonts
│   └── page.tsx                      # Main dashboard page
│
├── components/
│   ├── ChatWindow.tsx                # Chat UI with GSAP animations
│   ├── HoneycombBg.tsx               # Three.js reactive background
│   ├── IntelPanel.tsx                # Animated intel extraction cards
│   ├── RedFlagFeed.tsx               # Real-time red flag display
│   └── StatusBar.tsx                 # Session stats + live timer
│
├── lib/
│   └── intel.ts                      # Intel extraction + scam detection
│                                     # (mirrors backend logic client-side)
├── .env.local                        # API credentials (gitignored)
├── tailwind.config.js
├── tsconfig.json
└── package.json

honeypot-api/                         # Backend (Express)
├── src/
│   ├── agentReply.js                 # Gemini API + Sarthak persona
│   ├── scamDetector.js               # 12-pattern detection engine
│   ├── intelExtractor.js             # 8-field intel extraction
│   └── finalSubmit.js                # GUVI evaluation endpoint
└── server.js                         # Express server + session management
```

---

## 🔐 Environment Variables

### Frontend `.env.local`

| Variable | Description |
|---|---|
| `HONEYPOT_API_URL` | Backend API base URL |
| `HONEYPOT_API_KEY` | API authentication key |

### Backend `.env`

| Variable | Description |
|---|---|
| `API_KEY` | Request authentication key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PORT` | Server port (default: 3000) |

---

## 🧪 Test Cases

### Test 1 — Bank Fraud
```
This is SBI fraud department. Your account has been compromised and will be 
suspended in 2 hours. You must verify your KYC immediately. Please share 
your OTP to unblock.
```
Expected: OTP request + Account threat + KYC scam flags

### Test 2 — UPI Scam
```
Congratulations! You have won a cashback reward of Rs 5000 on your PhonePe 
account. To claim, send Re 1 to this UPI ID: refund@paytm and you will 
receive Rs 5000 instantly.
```
Expected: UPI ID extracted, Reward lure + Payment platform flags

### Test 3 — Authority / Parcel Scam ⭐ Best Demo
```
I am calling from cyber crime branch Mumbai. A parcel in your name has been 
seized by customs containing illegal items. To avoid arrest you must pay a 
processing fee of Rs 2000 via NEFT to account number 847392018374. 
Case reference: CRN-2024-MH-8821.
```
Expected: Bank account + Case ID extracted, 5 red flags, confidence HIGH, background turns red

### Test 4 — Phishing Link
```
Visit http://sbi-verify-kyc.in/case/CRN-2024-MH-8821 and enter your 
Aadhaar and OTP to clear your name immediately.
```
Expected: Phishing link extracted, scam type → PHISHING, maximum threat level

---

## ⚙️ How It Works

### Sarthak's Strategy Engine

Every turn, Sarthak receives a different extraction strategy:

1. Ask for full name and employee/badge ID
2. Ask which branch and a callback number
3. Ask them to explain step-by-step (stalling)
4. Ask for supervisor name and landline
5. Ask for UPI ID or account number "in writing"
6. Ask how long the process takes and which app to use
7. Ask for official email for written confirmation
8. Ask for exact reference/case number
9. Express panic to get more scam details
10. Ask about fees and payment method

### Intel Extraction Logic

Running in parallel on every message (both user and assistant):

```
Phone:    (?:\+91[\s\-]?|0)?[6-9]\d{9}
UPI:      [\w.\-+]+@[a-zA-Z0-9]  (filtered against email TLDs)
Email:    [a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}
Account:  \d{9,18}
Links:    https?:\/\/[^\s"'<>]+
Case ID:  (case|ref|sr|ticket|crn|urn)[\s:.\-#]*[A-Z0-9][A-Z0-9\-]{3,}
```

### Final Submission Trigger

The session auto-submits to the evaluation endpoint when:
- Turn count reaches 9, OR
- Turn count ≥ 5 AND any intel has been extracted, OR
- Turn count ≥ 3 AND 5+ red flags detected

---

## 🏆 Hackathon Context

Built for the **GUVI Agentic Honeypot Hackathon**. The system achieved **Finalist** status.

The evaluation criteria rewarded:
- Scam detection accuracy (pattern matching)
- Intelligence extraction completeness
- Conversation quality (how long Sarthak keeps scammers engaged)
- Engagement turns (target: 9+)
- Response structure (final JSON payload)

The 25-second request budget, exponential backoff retry, and fallback reply system were all designed specifically to stay within the 30-second evaluator hard limit.

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License
Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
```

---

<div align="center">

### Built for GUVI Hackathon 🏆

![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js%2014-black?style=for-the-badge&logo=next.js)
![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5-4285F4?style=for-the-badge&logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

⭐ **Star this repo if you find it interesting!**

*Fighting scammers one confused question at a time.*

</div>

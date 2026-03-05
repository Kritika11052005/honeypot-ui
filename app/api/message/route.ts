import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.HONEYPOT_API_URL!
const API_KEY = process.env.HONEYPOT_API_KEY!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await fetch(`${API_URL}/api/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Proxy error:', err)
    return NextResponse.json(
      { status: 'error', reply: 'Connection failed' },
      { status: 500 }
    )
  }
}

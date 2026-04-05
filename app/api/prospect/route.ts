import { NextRequest, NextResponse } from 'next/server'
import { getWebhookUrl } from '@/lib/settings'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const webhookUrl = getWebhookUrl()
    console.log('[prospect] Sending to n8n:', webhookUrl, JSON.stringify(body).slice(0, 200))

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(body),
    })

    const text = await res.text()
    console.log('[prospect] n8n status:', res.status, 'body length:', text.length)

    if (!res.ok) {
      console.error('[prospect] n8n error:', text.slice(0, 300))
      return NextResponse.json(
        { error: `n8n error: ${res.status}`, leads: [] },
        { status: res.status }
      )
    }

    if (!text) {
      console.error('[prospect] Empty response from n8n')
      return NextResponse.json(
        { error: 'Empty response', leads: [], totalLeads: 0 },
        { status: 200 }
      )
    }

    const data = JSON.parse(text)
    // Ensure leads array always exists
    if (!data.leads) data.leads = []
    console.log('[prospect] Success:', data.totalLeads, 'leads')
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[prospect] Error:', message)
    return NextResponse.json(
      { error: message, leads: [], totalLeads: 0 },
      { status: 500 }
    )
  }
}

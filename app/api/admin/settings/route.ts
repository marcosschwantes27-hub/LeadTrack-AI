import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { loadSettings, saveSettings } from '@/lib/settings'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  return NextResponse.json(loadSettings())
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const updated = saveSettings(body)
    return NextResponse.json(updated)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao salvar'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createToken, verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Senha obrigatória' }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin não configurado' }, { status: 500 })
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
    }

    const token = await createToken()

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24h
      path: '/',
    })

    return response
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro no login'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return NextResponse.json({ authenticated: false })
  const valid = await verifyToken(token)
  return NextResponse.json({ authenticated: valid })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_token', '', { maxAge: 0, path: '/' })
  return response
}

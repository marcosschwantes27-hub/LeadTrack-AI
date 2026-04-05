import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-dev-secret')

export async function createToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function getAdminToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_token')?.value ?? null
}

export async function isAdmin(): Promise<boolean> {
  const token = await getAdminToken()
  if (!token) return false
  return verifyToken(token)
}

import { createHmac, timingSafeEqual } from 'crypto'

const SECRET = process.env.JWT_SECRET || 'fallback-dev-secret'

interface TokenPayload {
  email: string
  role: string
  iat: number
  exp: number
}

function base64url(str: string): string {
  return Buffer.from(str).toString('base64url')
}

function fromBase64url(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf-8')
}

export function createToken(email: string): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload: TokenPayload = { email, role: 'admin', iat: now, exp: now + 86400 }
  const body = base64url(JSON.stringify(payload))
  const signature = createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64url')
  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): TokenPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, body, signature] = parts
  const expectedSig = createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64url')
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null
  let payload: TokenPayload
  try {
    payload = JSON.parse(fromBase64url(body))
  } catch {
    return null
  }
  if (payload.exp < Math.floor(Date.now() / 1000)) return null
  return payload
}

export function authenticate(request: Request): { email: string } | Response {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const token = auth.slice(7)
  const payload = verifyToken(token)
  if (!payload) {
    return new Response(JSON.stringify({ error: 'Token inválido o expirado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return { email: payload.email }
}

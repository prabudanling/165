// ============================================================
// 165 — RUANG ADMIN: authentication helpers
// WordPress-style simple auth: one password → HMAC-signed cookie.
// - ADMIN_PASSWORD env overrides the documented dev default.
// - ADMIN_SECRET env overrides the derived cookie-signing secret.
// Honest scope: this protects a single-admin editorial panel.
// All writes are versioned (VersionSnapshot) and audited (AuditLog).
// ============================================================
import { createHmac, createHash, timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'

export const ADMIN_COOKIE = 'adm165'
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// Documented development default — the founder is instructed (in the
// Panduan tab + deployment report) to set ADMIN_PASSWORD in production.
const DEV_DEFAULT_PASSWORD = 'qodiriyah165'

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEV_DEFAULT_PASSWORD
}

function adminSecret(): string {
  return process.env.ADMIN_SECRET?.trim() || `165-admin::${adminPassword()}`
}

export function checkPassword(input: string): boolean {
  const a = createHash('sha256').update(input ?? '').digest()
  const b = createHash('sha256').update(adminPassword()).digest()
  return timingSafeEqual(a, b)
}

export function makeToken(): string {
  const exp = Date.now() + TTL_MS
  const sig = createHmac('sha256', adminSecret()).update(String(exp)).digest('hex')
  return `${exp}.${sig}`
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false
  const dot = token.indexOf('.')
  if (dot <= 0) return false
  const exp = Number(token.slice(0, dot))
  const sig = token.slice(dot + 1)
  if (!Number.isFinite(exp) || exp < Date.now()) return false
  const expect = createHmac('sha256', adminSecret()).update(String(exp)).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expect, 'hex'))
  } catch {
    return false
  }
}

export function isAuthed(req: NextRequest): boolean {
  return verifyToken(req.cookies.get(ADMIN_COOKIE)?.value)
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(TTL_MS / 1000),
  }
}

// ---------- light in-memory login rate limit (per IP) ----------
const attempts = new Map<string, { count: number; lockedUntil: number }>()
const MAX_ATTEMPTS = 5
const LOCK_MS = 10 * 60 * 1000

export function loginLocked(ip: string): number {
  const a = attempts.get(ip)
  if (!a) return 0
  if (a.lockedUntil < Date.now()) return 0
  return Math.ceil((a.lockedUntil - Date.now()) / 1000)
}

export function registerLoginAttempt(ip: string, ok: boolean) {
  if (ok) { attempts.delete(ip); return }
  const a = attempts.get(ip) ?? { count: 0, lockedUntil: 0 }
  a.count += 1
  if (a.count >= MAX_ATTEMPTS) {
    a.lockedUntil = Date.now() + LOCK_MS
    a.count = 0
  }
  attempts.set(ip, a)
}

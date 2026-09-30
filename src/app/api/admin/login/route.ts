import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, checkPassword, cookieOptions, loginLocked, makeToken, registerLoginAttempt } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') ?? 'local').split(',')[0].trim()
    const locked = loginLocked(ip)
    if (locked > 0) {
      return NextResponse.json(
        { error: `Terlalu banyak percobaan. Coba lagi dalam ${locked} detik.` },
        { status: 429 },
      )
    }

    const body = await req.json().catch(() => null)
    const password = typeof body?.password === 'string' ? body.password : ''
    const ok = checkPassword(password)
    registerLoginAttempt(ip, ok)

    if (!ok) {
      return NextResponse.json({ error: 'Kata sandi salah.' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set(ADMIN_COOKIE, makeToken(), cookieOptions())
    return res
  } catch (err) {
    console.error('[api/admin/login]', err)
    return NextResponse.json({ error: 'Login gagal.' }, { status: 500 })
  }
}

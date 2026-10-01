import { NextResponse } from 'next/server'
import { getSanadRegistry } from '@/lib/queries'

// 165 — SANAD REGISTRY (display-only). Serves the featured murshid
// collection, recorded chains with per-link sources/statuses, and the
// marked sanad network. Falls back to the bundled snapshot when the
// database is unreachable.
export async function GET() {
  try {
    const data = await getSanadRegistry()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[api/sanad]', err)
    return NextResponse.json({ error: 'Failed to load sanad registry' }, { status: 500 })
  }
}

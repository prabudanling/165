import { NextRequest, NextResponse } from 'next/server'
import { searchEntities } from '@/lib/queries'
import { ENTITY_TYPES } from '@/lib/165'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') ?? '').trim()
    if (!q) return NextResponse.json({ query: q, groups: {}, total: 0 })

    const rows = await searchEntities(q, undefined, 120)
    const groups: Record<string, typeof rows> = {}
    for (const r of rows) {
      ;(groups[r.type] ??= []).push(r)
    }
    // order groups by canonical entity type order
    const ordered: Record<string, typeof rows> = {}
    for (const t of Object.keys(ENTITY_TYPES)) {
      if (groups[t]?.length) ordered[t] = groups[t]
    }
    return NextResponse.json({ query: q, groups: ordered, total: rows.length })
  } catch (err) {
    console.error('[api/search]', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

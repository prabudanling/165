import { NextRequest, NextResponse } from 'next/server'
import { searchEntities, getStats } from '@/lib/queries'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') ?? ''
    const type = searchParams.get('type') ?? undefined
    const limit = Math.min(Number(searchParams.get('limit') ?? 60), 200)
    const withStats = searchParams.get('stats') === '1'

    const entities = await searchEntities(q, type || undefined, limit)
    const stats = withStats ? await getStats() : undefined
    return NextResponse.json({ entities, stats })
  } catch (err) {
    console.error('[api/entities]', err)
    return NextResponse.json({ error: 'Failed to query entities' }, { status: 500 })
  }
}

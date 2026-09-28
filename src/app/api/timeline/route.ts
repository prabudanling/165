import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { toSummary } from '@/lib/queries'
import type { EntitySummaryDTO } from '@/lib/165'

const PRECISION_ORDER: Record<string, number> = { CENTURY: 0, DECADE: 1, YEAR: 2, MONTH: 3, DAY: 4 }

export async function GET() {
  try {
    const events = await db.entity.findMany({
      where: { type: 'EVENT', visibility: 'PUBLIC' },
      orderBy: { startDate: 'asc' },
    })
    const timeline = events
      .map((e) => ({
        entity: toSummary(e) as EntitySummaryDTO,
        summary: e.summary,
        summaryId: e.summaryId,
        sortYear: e.startDate ? parseInt(e.startDate.slice(0, 4), 10) : null,
        precisionRank: PRECISION_ORDER[e.startDatePrecision ?? 'UNKNOWN'] ?? 9,
        undated: !e.startDate,
      }))
      .sort((a, b) => {
        // dated events chronological; undated events always last (honest uncertainty)
        if (a.sortYear === null && b.sortYear === null) return a.entity.primaryName.localeCompare(b.entity.primaryName)
        if (a.sortYear === null) return 1
        if (b.sortYear === null) return -1
        if (a.sortYear !== b.sortYear) return a.sortYear - b.sortYear
        return b.precisionRank - a.precisionRank
      })
    return NextResponse.json({ timeline })
  } catch (err) {
    console.error('[api/timeline]', err)
    return NextResponse.json({ error: 'Failed to load timeline' }, { status: 500 })
  }
}

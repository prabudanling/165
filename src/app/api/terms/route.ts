import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const terms = await db.entity.findMany({
      where: { type: 'TERM', visibility: 'PUBLIC' },
      orderBy: { primaryName: 'asc' },
      select: {
        id: true, globalId: true, slug: true, primaryName: true,
        summary: true, summaryId: true, evidenceLevel: true, verificationStatus: true,
        nameVariants: { select: { name: true, language: true, kind: true } },
      },
    })
    return NextResponse.json({ terms })
  } catch (err) {
    console.error('[api/terms]', err)
    return NextResponse.json({ error: 'Failed to load glossary' }, { status: 500 })
  }
}

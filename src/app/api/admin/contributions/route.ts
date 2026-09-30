import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { CONTRIBUTION_STATUSES } from '@/lib/admin-data'

// ---------- GET: list contributions (moderation queue) ----------
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 })
  try {
    const rows = await db.contribution.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({
      contributions: rows.map((c) => ({
        id: c.id, reference: c.reference, kind: c.kind, title: c.title,
        status: c.status, statusNote: c.statusNote, reviewedBy: c.reviewedBy,
        submitterName: c.submitterName, submitterContact: c.submitterContact,
        payload: c.payload, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString(),
      })),
    })
  } catch (err) {
    console.error('[api/admin/contributions GET]', err)
    return NextResponse.json({ error: 'Database tidak dapat dijangkau.' }, { status: 503 })
  }
}

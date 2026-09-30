import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { CONTRIBUTION_STATUSES } from '@/lib/admin-data'

type Ctx = { params: Promise<{ id: string }> }

// ---------- PUT: change contribution status (workflow) ----------
export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 })
  try {
    const { id } = await params
    const existing = await db.contribution.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Kontribusi tidak ditemukan.' }, { status: 404 })

    const b = await req.json().catch(() => null)
    const status = String(b?.status ?? '')
    if (!CONTRIBUTION_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Status tidak dikenal.' }, { status: 400 })
    }

    const updated = await db.contribution.update({
      where: { id },
      data: {
        status,
        statusNote: typeof b?.statusNote === 'string' ? b.statusNote.slice(0, 500) : existing.statusNote,
        reviewedBy: 'admin',
      },
    })

    await db.auditLog.create({
      data: {
        actor: 'admin', action: 'STATUS_CHANGE', target: existing.reference,
        detail: `${existing.status} → ${status}`,
      },
    })

    return NextResponse.json({ contribution: { id: updated.id, reference: updated.reference, status: updated.status } })
  } catch (err) {
    console.error('[api/admin/contributions/[id] PUT]', err)
    return NextResponse.json({ error: 'Gagal memperbarui status.' }, { status: 503 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { EVIDENCE_KEYS, STATUS_KEYS, TYPE_KEYS, VISIBILITY_KEYS, DATE_PRECISION_KEYS, clean, uniqueSlug, writeAudit, writeVersionSnapshot, entityDependencyCounts } from '@/lib/admin-data'

type Ctx = { params: Promise<{ id: string }> }

// ---------- GET: full record (admin view) ----------
export async function GET(req: NextRequest, { params }: Ctx) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 })
  try {
    const { id } = await params
    const e = await db.entity.findUnique({
      where: { id },
      include: {
        nameVariants: true,
        _count: { select: { outgoingRelations: true, incomingRelations: true, versions: true } },
      },
    })
    if (!e) return NextResponse.json({ error: 'Entitas tidak ditemukan.' }, { status: 404 })
    const deps = await entityDependencyCounts(id)
    return NextResponse.json({
      entity: {
        ...e,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
        detailsJson: e.details ?? '',
        details: undefined,
        relations: e._count.outgoingRelations + e._count.incomingRelations,
        versions: e._count.versions,
        deps,
      },
    })
  } catch (err) {
    console.error('[api/admin/entities/[id] GET]', err)
    return NextResponse.json({ error: 'Database tidak dapat dijangkau.' }, { status: 503 })
  }
}

// ---------- PUT: update entity (versioned + audited) ----------
export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 })
  try {
    const { id } = await params
    const existing = await db.entity.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Entitas tidak ditemukan.' }, { status: 404 })

    const b = await req.json().catch(() => null)
    if (!b) return NextResponse.json({ error: 'Data tidak valid.' }, { status: 400 })

    const data: Record<string, unknown> = {}

    if (b.type !== undefined) {
      const type = String(b.type ?? '')
      if (!TYPE_KEYS.includes(type)) return NextResponse.json({ error: 'Tipe entitas tidak dikenal.' }, { status: 400 })
      data.type = type
    }
    if (b.primaryName !== undefined) {
      const v = clean(b.primaryName)
      if (!v || v.length < 2) return NextResponse.json({ error: 'Nama utama wajib diisi (min. 2 karakter).' }, { status: 400 })
      data.primaryName = v
    }
    for (const key of ['subtitle', 'summary', 'summaryId', 'summaryAr', 'startDate', 'endDate', 'region'] as const) {
      if (b[key] !== undefined) data[key] = clean(b[key])
    }
    for (const key of ['startDatePrecision', 'endDatePrecision'] as const) {
      if (b[key] !== undefined) data[key] = DATE_PRECISION_KEYS.includes(b[key]) ? b[key] : null
    }
    if (b.evidenceLevel !== undefined) {
      if (!EVIDENCE_KEYS.includes(b.evidenceLevel)) return NextResponse.json({ error: 'Tingkat bukti tidak dikenal.' }, { status: 400 })
      data.evidenceLevel = b.evidenceLevel
    }
    if (b.verificationStatus !== undefined) {
      if (!STATUS_KEYS.includes(b.verificationStatus)) return NextResponse.json({ error: 'Status verifikasi tidak dikenal.' }, { status: 400 })
      data.verificationStatus = b.verificationStatus
    }
    if (b.visibility !== undefined) {
      if (!VISIBILITY_KEYS.includes(b.visibility)) return NextResponse.json({ error: 'Visibilitas tidak dikenal.' }, { status: 400 })
      data.visibility = b.visibility
    }
    if (b.detailsJson !== undefined) {
      const v = clean(b.detailsJson)
      if (v) {
        try { JSON.parse(v) } catch {
          return NextResponse.json({ error: 'Kolom details bukan JSON yang sah.' }, { status: 400 })
        }
      }
      data.details = v
    }

    // slug follows renamed primaryName (old slug kept as fallback if taken elsewhere)
    let slugChanged = false
    if (data.primaryName && data.primaryName !== existing.primaryName) {
      const slug = await uniqueSlug(String(data.primaryName), id)
      if (slug !== existing.slug) { data.slug = slug; slugChanged = true }
    }

    // version snapshot of the PREVIOUS state (never delete knowledge silently)
    await writeVersionSnapshot(id, b.reason ? String(b.reason) : 'Diperbarui melalui Ruang Admin')

    const updated = await db.entity.update({ where: { id }, data })

    // keep the PRIMARY name variant aligned
    if (data.primaryName) {
      const primary = await db.nameVariant.findFirst({ where: { entityId: id, kind: 'PRIMARY' } })
      if (primary) {
        await db.nameVariant.update({ where: { id: primary.id }, data: { name: String(data.primaryName) } })
      } else {
        await db.nameVariant.create({ data: { entityId: id, name: String(data.primaryName), language: 'en', kind: 'PRIMARY' } })
      }
    }

    await writeAudit('admin', 'UPDATE', existing.globalId, `Fields: ${Object.keys(data).join(', ') || 'none'}${slugChanged ? ' (slug rotated)' : ''}`)

    return NextResponse.json({ entity: { id: updated.id, globalId: updated.globalId, slug: updated.slug, primaryName: updated.primaryName } })
  } catch (err) {
    console.error('[api/admin/entities/[id] PUT]', err)
    return NextResponse.json({ error: 'Gagal menyimpan (database tidak tersedia?).' }, { status: 503 })
  }
}

// ---------- DELETE: guarded deletion ----------
export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 })
  try {
    const { id } = await params
    const existing = await db.entity.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Entitas tidak ditemukan.' }, { status: 404 })

    const deps = await entityDependencyCounts(id)
    if (deps.relations > 0 || deps.claims > 0 || deps.sanadLinks > 0 || deps.collections > 0) {
      return NextResponse.json(
        {
          error: `Entitas ini masih dirujuk (${deps.relations} relasi, ${deps.claims} klaim, ${deps.sanadLinks} sanad, ${deps.collections} koleksi). 165 tidak pernah menghapus pengetahuan yang masih terhubung — sembunyikan dengan mengubah visibilitas menjadi PRIVATE.`,
        },
        { status: 409 },
      )
    }

    await db.entity.delete({ where: { id } }) // cascades nameVariants + versions of this entity only
    await writeAudit('admin', 'DELETE', existing.globalId, `Entity ${existing.type} "${existing.primaryName}" deleted via Ruang Admin (no remaining references)`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/admin/entities/[id] DELETE]', err)
    return NextResponse.json({ error: 'Gagal menghapus (database tidak tersedia?).' }, { status: 503 })
  }
}

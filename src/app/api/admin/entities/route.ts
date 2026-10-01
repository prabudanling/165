import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { EVIDENCE_KEYS, STATUS_KEYS, TYPE_KEYS, VISIBILITY_KEYS, DATE_PRECISION_KEYS, clean, nextGlobalId, uniqueSlug, writeAudit } from '@/lib/admin-data'

// ---------- GET: list all entities (admin view — includes PRIVATE) ----------
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 })
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') ?? '').trim()
    const type = searchParams.get('type') ?? undefined

    const where: Record<string, unknown> = {}
    if (type && TYPE_KEYS.includes(type)) where.type = type
    if (q) {
      where.OR = [
        { primaryName: { contains: q } },
        { subtitle: { contains: q } },
        { globalId: { contains: q } },
        { slug: { contains: q } },
      ]
    }

    const rows = await db.entity.findMany({
      where,
      orderBy: [{ type: 'asc' }, { primaryName: 'asc' }],
      include: { _count: { select: { outgoingRelations: true, incomingRelations: true, nameVariants: true, versions: true } } },
    })

    return NextResponse.json({
      entities: rows.map((e) => ({
        id: e.id, globalId: e.globalId, slug: e.slug, type: e.type, primaryName: e.primaryName,
        subtitle: e.subtitle, evidenceLevel: e.evidenceLevel, verificationStatus: e.verificationStatus,
        visibility: e.visibility, updatedAt: e.updatedAt.toISOString(),
        relations: e._count.outgoingRelations + e._count.incomingRelations,
        names: e._count.nameVariants, versions: e._count.versions,
      })),
    })
  } catch (err) {
    console.error('[api/admin/entities GET]', err)
    return NextResponse.json(
      { error: 'Database tidak dapat dijangkau. Registri butuh database hidup (bukan snapshot). Lihat tab Panduan.' },
      { status: 503 },
    )
  }
}

// ---------- POST: create entity ----------
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 })
  try {
    const b = await req.json().catch(() => null)
    if (!b) return NextResponse.json({ error: 'Data tidak valid.' }, { status: 400 })

    const type = String(b.type ?? '')
    const primaryName = clean(b.primaryName)
    if (!TYPE_KEYS.includes(type)) return NextResponse.json({ error: 'Tipe entitas tidak dikenal.' }, { status: 400 })
    if (!primaryName || primaryName.length < 2) return NextResponse.json({ error: 'Nama utama wajib diisi (min. 2 karakter).' }, { status: 400 })

    const evidenceLevel = EVIDENCE_KEYS.includes(b.evidenceLevel) ? b.evidenceLevel : 'F'
    const verificationStatus = STATUS_KEYS.includes(b.verificationStatus) ? b.verificationStatus : 'UNVERIFIED'
    const visibility = VISIBILITY_KEYS.includes(b.visibility) ? b.visibility : 'PUBLIC'

    let details: string | null = null
    if (clean(b.detailsJson)) {
      try { JSON.parse(b.detailsJson) } catch {
        return NextResponse.json({ error: 'Kolom details bukan JSON yang sah.' }, { status: 400 })
      }
      details = b.detailsJson
    }

    const globalId = await nextGlobalId(type)
    const slug = await uniqueSlug(primaryName)

    const entity = await db.entity.create({
      data: {
        globalId, slug, type, primaryName,
        subtitle: clean(b.subtitle),
        summary: clean(b.summary),
        summaryId: clean(b.summaryId),
        summaryAr: clean(b.summaryAr),
        evidenceLevel, verificationStatus, visibility,
        startDate: clean(b.startDate),
        startDatePrecision: DATE_PRECISION_KEYS.includes(b.startDatePrecision) ? b.startDatePrecision : null,
        endDate: clean(b.endDate),
        endDatePrecision: DATE_PRECISION_KEYS.includes(b.endDatePrecision) ? b.endDatePrecision : null,
        region: clean(b.region),
        details,
      },
    })

    await db.nameVariant.create({
      data: { entityId: entity.id, name: primaryName, language: 'en', kind: 'PRIMARY' },
    })
    await db.versionSnapshot.create({
      data: {
        entityId: entity.id, version: 1, changedBy: 'admin', reason: 'Entitas dibuat melalui Ruang Admin',
        snapshot: JSON.stringify({ globalId, slug, type, primaryName, visibility }),
      },
    })
    await writeAudit('admin', 'CREATE', globalId, `Entity ${type} created via Ruang Admin`)

    return NextResponse.json({ entity: { id: entity.id, globalId, slug, primaryName } }, { status: 201 })
  } catch (err) {
    console.error('[api/admin/entities POST]', err)
    return NextResponse.json({ error: 'Gagal membuat entitas (database tidak tersedia?).' }, { status: 503 })
  }
}

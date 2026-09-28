// 165 — server-side query helpers (used by API routes)
import { db } from '@/lib/db'
import { parseDetails, type EntityProfileDTO, type EntitySummaryDTO, type RelationshipDTO } from '@/lib/165'

export function toSummary(e: {
  id: string; globalId: string; slug: string; type: string; primaryName: string
  subtitle?: string | null; evidenceLevel: string; verificationStatus: string
  startDate?: string | null; startDatePrecision?: string | null
  endDate?: string | null; endDatePrecision?: string | null; region?: string | null
}): EntitySummaryDTO {
  return {
    id: e.id, globalId: e.globalId, slug: e.slug, type: e.type, primaryName: e.primaryName,
    subtitle: e.subtitle, evidenceLevel: e.evidenceLevel, verificationStatus: e.verificationStatus,
    startDate: e.startDate, startDatePrecision: e.startDatePrecision,
    endDate: e.endDate, endDatePrecision: e.endDatePrecision, region: e.region,
  }
}

export async function searchEntities(q: string, type?: string, limit = 60): Promise<EntitySummaryDTO[]> {
  const term = q.trim()
  const where: Record<string, unknown> = { visibility: 'PUBLIC' }
  if (type) where.type = type
  if (term) {
    where.OR = [
      { primaryName: { contains: term } },
      { subtitle: { contains: term } },
      { summary: { contains: term } },
      { summaryId: { contains: term } },
      { globalId: { contains: term } },
      { slug: { contains: term } },
      { nameVariants: { some: { name: { contains: term } } } },
    ]
  }
  const rows = await db.entity.findMany({
    where, take: limit,
    orderBy: [{ type: 'asc' }, { primaryName: 'asc' }],
  })
  return rows.map(toSummary)
}

export async function getEntityProfile(slug: string): Promise<EntityProfileDTO | null> {
  const e = await db.entity.findUnique({
    where: { slug },
    include: {
      nameVariants: true,
      outgoingRelations: { include: { toEntity: true } },
      incomingRelations: { include: { fromEntity: true } },
      claimsAsSubject: { include: { source: true } },
      stancesAsSource: { include: { claim: true } },
      collectionsOwned: { include: { item: true }, orderBy: { order: 'asc' } },
      versions: { orderBy: { version: 'desc' }, take: 20 },
    },
  })
  if (!e) return null

  const rels: RelationshipDTO[] = [
    ...e.outgoingRelations.map((r): RelationshipDTO => ({
      id: r.id, predicate: r.predicate, direction: 'OUT',
      evidenceLevel: r.evidenceLevel, verificationStatus: r.verificationStatus,
      context: r.context, sourceRef: r.sourceRef, other: toSummary(r.toEntity),
    })),
    ...e.incomingRelations.map((r): RelationshipDTO => ({
      id: r.id, predicate: r.predicate, direction: 'IN',
      evidenceLevel: r.evidenceLevel, verificationStatus: r.verificationStatus,
      context: r.context, sourceRef: r.sourceRef, other: toSummary(r.fromEntity),
    })),
  ]

  return {
    ...toSummary(e),
    summary: e.summary, summaryId: e.summaryId, summaryAr: e.summaryAr,
    isExampleRecord: e.isExampleRecord, visibility: e.visibility,
    latitude: e.latitude, longitude: e.longitude,
    details: parseDetails(e.details),
    names: e.nameVariants.map((n) => ({ name: n.name, language: n.language, kind: n.kind, note: n.note })),
    relationships: rels,
    stances: e.claimsAsSubject.map((s) => ({ stance: s.stance, note: s.note, source: toSummary(s.source) })),
    collectionItems: e.collectionsOwned.map((c) => ({ order: c.order, note: c.note, item: toSummary(c.item) })),
    versions: e.versions.map((v) => ({ version: v.version, changedBy: v.changedBy, reason: v.reason, createdAt: v.createdAt.toISOString() })),
    updatedAt: e.updatedAt.toISOString(),
  }
}

export async function getStats() {
  const group = await db.entity.groupBy({ by: ['type'], _count: { type: true } })
  const byType: Record<string, number> = {}
  let total = 0
  for (const g of group) { byType[g.type] = g._count.type; total += g._count.type }
  const relations = await db.relationship.count()
  const sanad = await db.entity.count({ where: { type: 'SANAD' } })
  const contributions = await db.contribution.count()
  return { total, byType, relations, sanadChains: sanad, contributions }
}

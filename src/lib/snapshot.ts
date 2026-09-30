// ============================================================
// 165 — SNAPSHOT QUERY LAYER (static, zero-database)
// Mirrors the reader functions of queries.ts against the bundled
// heritage-snapshot.json. Used automatically whenever the live
// database is unreachable (e.g. Vercel serverless).
// Single source of truth: snapshot is exported FROM the database
// via `bun run db:export` — never hand-edited.
// ============================================================
import raw from '@/data/heritage-snapshot.json'
import { ENTITY_TYPES, parseDetails, type EntitySummaryDTO, type EntityProfileDTO, type RelationshipDTO } from '@/lib/165'

export const SNAPSHOT = raw as unknown as Snapshot

export type SnapshotMeta = {
  entities: number; relations: number; sanadChains: number; contributions: number
  byType: Record<string, number>; exportedAt: string
}

type SnapshotEntity = {
  id: string; globalId: string; slug: string; type: string; primaryName: string
  subtitle: string | null; summary: string | null; summaryId: string | null; summaryAr: string | null
  evidenceLevel: string; verificationStatus: string; isExampleRecord: boolean
  startDate: string | null; startDatePrecision: string | null
  endDate: string | null; endDatePrecision: string | null
  latitude: number | null; longitude: number | null; region: string | null
  details: string | null; visibility: string
  createdAt: string; updatedAt: string
}
type SnapshotName = { id: string; entityId: string; name: string; language: string; kind: string; note: string | null }
type SnapshotRel = { id: string; fromEntityId: string; toEntityId: string; predicate: string; evidenceLevel: string; verificationStatus: string; context: string | null; sourceRef: string | null }
type SnapshotClaim = { id: string; claimEntityId: string; sourceEntityId: string; stance: string; note: string | null }
type SnapshotColl = { id: string; collectionId: string; itemEntityId: string; order: number; note: string | null }
type SnapshotVersion = { id: string; entityId: string; version: number; snapshot: string; changedBy: string; reason: string | null; createdAt: string }

export type Snapshot = {
  meta: SnapshotMeta
  entities: SnapshotEntity[]
  nameVariants: SnapshotName[]
  relationships: SnapshotRel[]
  claimSources: SnapshotClaim[]
  collectionItems: SnapshotColl[]
  versions: SnapshotVersion[]
  contributions: { reference: string; kind: string; title: string; status: string; createdAt: string }[]
}

// ---------- indexes ----------
const byId = new Map<string, SnapshotEntity>()
const bySlug = new Map<string, SnapshotEntity>()
for (const e of SNAPSHOT.entities) { byId.set(e.id, e); bySlug.set(e.slug, e) }

const namesByEntity = new Map<string, SnapshotName[]>()
for (const n of SNAPSHOT.nameVariants) {
  const arr = namesByEntity.get(n.entityId) ?? []
  arr.push(n)
  namesByEntity.set(n.entityId, arr)
}

function toSummary(e: SnapshotEntity): EntitySummaryDTO {
  return {
    id: e.id, globalId: e.globalId, slug: e.slug, type: e.type, primaryName: e.primaryName,
    subtitle: e.subtitle, evidenceLevel: e.evidenceLevel, verificationStatus: e.verificationStatus,
    startDate: e.startDate, startDatePrecision: e.startDatePrecision,
    endDate: e.endDate, endDatePrecision: e.endDatePrecision, region: e.region,
  }
}

// ---------- readers (mirror queries.ts signatures) ----------
export function snapshotSearch(q: string, type?: string, limit = 60): EntitySummaryDTO[] {
  const term = q.trim().toLowerCase()
  const rows = SNAPSHOT.entities.filter((e) => {
    if (e.visibility !== 'PUBLIC') return false
    if (type && e.type !== type) return false
    if (!term) return true
    const names = (namesByEntity.get(e.id) ?? []).some((n) => n.name.toLowerCase().includes(term))
    return (
      e.primaryName.toLowerCase().includes(term) ||
      (e.subtitle ?? '').toLowerCase().includes(term) ||
      (e.summary ?? '').toLowerCase().includes(term) ||
      (e.summaryId ?? '').toLowerCase().includes(term) ||
      e.globalId.toLowerCase().includes(term) ||
      e.slug.toLowerCase().includes(term) ||
      names
    )
  })
  rows.sort((a, b) => (a.type === b.type ? a.primaryName.localeCompare(b.primaryName) : a.type.localeCompare(b.type)))
  return rows.slice(0, limit).map(toSummary)
}

export function snapshotProfile(slug: string): EntityProfileDTO | null {
  const e = bySlug.get(slug)
  if (!e) return null

  const relDTO = (r: SnapshotRel, direction: 'OUT' | 'IN', other: SnapshotEntity): RelationshipDTO => ({
    id: r.id, predicate: r.predicate, direction,
    evidenceLevel: r.evidenceLevel, verificationStatus: r.verificationStatus,
    context: r.context, sourceRef: r.sourceRef, other: toSummary(other),
  })

  const rels: RelationshipDTO[] = []
  for (const r of SNAPSHOT.relationships) {
    if (r.fromEntityId === e.id) { const o = byId.get(r.toEntityId); if (o) rels.push(relDTO(r, 'OUT', o)) }
    if (r.toEntityId === e.id) { const o = byId.get(r.fromEntityId); if (o) rels.push(relDTO(r, 'IN', o)) }
  }

  const stances = SNAPSHOT.claimSources
    .filter((s) => s.claimEntityId === e.id)
    .map((s) => { const src = byId.get(s.sourceEntityId); return src ? { stance: s.stance, note: s.note, source: toSummary(src) } : null })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const collectionItems = SNAPSHOT.collectionItems
    .filter((c) => c.collectionId === e.id)
    .map((c) => { const item = byId.get(c.itemEntityId); return item ? { order: c.order, note: c.note, item: toSummary(item) } : null })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  return {
    ...toSummary(e),
    summary: e.summary, summaryId: e.summaryId, summaryAr: e.summaryAr,
    isExampleRecord: e.isExampleRecord, visibility: e.visibility,
    latitude: e.latitude, longitude: e.longitude,
    details: parseDetails(e.details),
    names: (namesByEntity.get(e.id) ?? []).map((n) => ({ name: n.name, language: n.language, kind: n.kind, note: n.note })),
    relationships: rels,
    stances,
    collectionItems,
    versions: SNAPSHOT.versions
      .filter((v) => v.entityId === e.id)
      .slice(0, 20)
      .map((v) => ({ version: v.version, changedBy: v.changedBy, reason: v.reason, createdAt: v.createdAt })),
    updatedAt: e.updatedAt,
  }
}

export function snapshotStats(): { total: number; byType: Record<string, number>; relations: number; sanadChains: number; contributions: number } {
  const m = SNAPSHOT.meta
  return { total: m.entities, byType: { ...m.byType }, relations: m.relations, sanadChains: m.sanadChains, contributions: m.contributions }
}

// ---------- shape-matching helpers (mirror live API response shapes) ----------
export type GraphNode = { id: string; globalId: string; slug: string; type: string; label: string }
export type GraphEdge = { id: string; from: string; to: string; predicate: string; evidenceLevel: string; verificationStatus: string }

export function snapshotGraphData(): { nodes: GraphNode[]; edges: GraphEdge[]; typeOrder: string[] } {
  const pub = SNAPSHOT.entities.filter((e) => e.visibility === 'PUBLIC')
  const ids = new Set(pub.map((e) => e.id))
  return {
    nodes: pub.map((e) => ({ id: e.id, globalId: e.globalId, slug: e.slug, type: e.type, label: e.primaryName })),
    edges: SNAPSHOT.relationships
      .filter((r) => ids.has(r.fromEntityId) && ids.has(r.toEntityId))
      .map((r) => ({ id: r.id, from: r.fromEntityId, to: r.toEntityId, predicate: r.predicate, evidenceLevel: r.evidenceLevel, verificationStatus: r.verificationStatus })),
    typeOrder: Object.keys(ENTITY_TYPES),
  }
}

const PRECISION_ORDER: Record<string, number> = { CENTURY: 0, DECADE: 1, YEAR: 2, MONTH: 3, DAY: 4 }

export function snapshotTimelineEvents() {
  const events = SNAPSHOT.entities
    .filter((e) => e.type === 'EVENT' && e.visibility === 'PUBLIC')
    .map((e) => ({
      entity: toSummary(e) as EntitySummaryDTO,
      summary: e.summary,
      summaryId: e.summaryId,
      sortYear: e.startDate ? parseInt(e.startDate.slice(0, 4), 10) : null,
      precisionRank: PRECISION_ORDER[e.startDatePrecision ?? 'UNKNOWN'] ?? 9,
      undated: !e.startDate,
    }))
    .sort((a, b) => {
      if (a.sortYear === null && b.sortYear === null) return a.entity.primaryName.localeCompare(b.entity.primaryName)
      if (a.sortYear === null) return 1
      if (b.sortYear === null) return -1
      if (a.sortYear !== b.sortYear) return a.sortYear - b.sortYear
      return b.precisionRank - a.precisionRank
    })
  return { timeline: events }
}

export function snapshotGlossaryTerms() {
  const terms = SNAPSHOT.entities
    .filter((e) => e.type === 'TERM' && e.visibility === 'PUBLIC')
    .sort((a, b) => a.primaryName.localeCompare(b.primaryName))
    .map((e) => ({
      id: e.id, globalId: e.globalId, slug: e.slug, primaryName: e.primaryName,
      summary: e.summary, summaryId: e.summaryId, evidenceLevel: e.evidenceLevel, verificationStatus: e.verificationStatus,
      nameVariants: (namesByEntity.get(e.id) ?? []).map((n) => ({ name: n.name, language: n.language, kind: n.kind })),
    }))
  return { terms }
}

export type AskCandidate = SnapshotEntity & { nameVariants: { name: string }[] }

export function snapshotAskIndex(): AskCandidate[] {
  return SNAPSHOT.entities
    .filter((e) => e.visibility === 'PUBLIC')
    .map((e) => ({ ...e, nameVariants: (namesByEntity.get(e.id) ?? []).map((n) => ({ name: n.name })) }))
}

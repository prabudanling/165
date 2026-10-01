// 165 — server-side query helpers (used by API routes)
// RESILIENCE DOCTRINE: every reader tries the live SQLite database
// first; on ANY error it transparently falls back to the bundled
// heritage snapshot and logs honestly. Zero-display is structurally
// impossible: if the DB cannot be reached, the compiled snapshot
// still serves the complete registry.
import { db } from '@/lib/db'
import { ENTITY_TYPES, parseDetails, type EntityProfileDTO, type EntitySummaryDTO, type RelationshipDTO } from '@/lib/165'
import {
  snapshotSearch, snapshotProfile, snapshotStats, SNAPSHOT,
  snapshotGraphData, snapshotTimelineEvents, snapshotGlossaryTerms, snapshotAskIndex,
  snapshotSanadLinks,
} from '@/lib/snapshot'

function logFallback(where: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err)
  console.warn(`[queries:${where}] database unavailable — serving bundled snapshot (${msg.slice(0, 140)})`)
}

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
  try {
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
  } catch (err) {
    logFallback('search', err)
    return snapshotSearch(q, type, limit)
  }
}

export async function getEntityProfile(slug: string): Promise<EntityProfileDTO | null> {
  try {
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
  } catch (err) {
    logFallback('profile', err)
    return snapshotProfile(slug)
  }
}

export async function getStats() {
  try {
    const group = await db.entity.groupBy({ by: ['type'], _count: { type: true } })
    const byType: Record<string, number> = {}
    let total = 0
    for (const g of group) { byType[g.type] = g._count.type; total += g._count.type }
    const relations = await db.relationship.count()
    const sanad = await db.entity.count({ where: { type: 'SANAD' } })
    const contributions = await db.contribution.count()
    return { total, byType, relations, sanadChains: sanad, contributions }
  } catch (err) {
    logFallback('stats', err)
    return snapshotStats()
  }
}

export async function getGraphData() {
  try {
    const entities = await db.entity.findMany({
      where: { visibility: 'PUBLIC' },
      select: { id: true, globalId: true, slug: true, type: true, primaryName: true, evidenceLevel: true, verificationStatus: true },
    })
    const rels = await db.relationship.findMany({
      select: { id: true, fromEntityId: true, toEntityId: true, predicate: true, evidenceLevel: true, verificationStatus: true },
    })
    const byId = new Map(entities.map((e) => [e.id, e]))
    return {
      nodes: entities.map((e) => ({ id: e.id, globalId: e.globalId, slug: e.slug, type: e.type, label: e.primaryName })),
      edges: rels
        .filter((r) => byId.has(r.fromEntityId) && byId.has(r.toEntityId))
        .map((r) => ({ id: r.id, from: r.fromEntityId, to: r.toEntityId, predicate: r.predicate, evidenceLevel: r.evidenceLevel, verificationStatus: r.verificationStatus })),
      typeOrder: Object.keys(ENTITY_TYPES),
    }
  } catch (err) {
    logFallback('graph', err)
    return snapshotGraphData()
  }
}

const PRECISION_ORDER: Record<string, number> = { CENTURY: 0, DECADE: 1, YEAR: 2, MONTH: 3, DAY: 4 }

export async function getTimelineEvents() {
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
        if (a.sortYear === null && b.sortYear === null) return a.entity.primaryName.localeCompare(b.entity.primaryName)
        if (a.sortYear === null) return 1
        if (b.sortYear === null) return -1
        if (a.sortYear !== b.sortYear) return a.sortYear - b.sortYear
        return b.precisionRank - a.precisionRank
      })
    return { timeline }
  } catch (err) {
    logFallback('timeline', err)
    return snapshotTimelineEvents()
  }
}

export async function getGlossaryTerms() {
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
    return { terms }
  } catch (err) {
    logFallback('terms', err)
    return snapshotGlossaryTerms()
  }
}

export async function getAskIndex() {
  try {
    const cand = await db.entity.findMany({
      where: { visibility: 'PUBLIC' },
      include: { nameVariants: { select: { name: true } } },
    })
    return cand
  } catch (err) {
    logFallback('ask', err)
    return snapshotAskIndex()
  }
}

// ------------------------------------------------------------
// SANAD REGISTRY (Task 26) — display-only, fully sourced.
// Returns the featured murshid collection, the recorded chains
// with every link's own source + status, and the marked network
// (places/institutions) + figures + sources of the sanad dataset.
// ------------------------------------------------------------
export type SanadLinkDTO = {
  id: string; order: number; fromName: string; toName: string
  personSlug?: string | null; personName?: string | null
  eraNote?: string | null; evidenceLevel: string; verificationStatus: string
  sourceRef?: string | null; context?: string | null
}

export type SanadChainDTO = { entity: EntitySummaryDTO; links: SanadLinkDTO[] }

export type SanadRegistryDTO = {
  featured: EntitySummaryDTO[]
  chains: SanadChainDTO[]
  figures: EntitySummaryDTO[]
  network: EntitySummaryDTO[]
  sources: EntitySummaryDTO[]
}

const SANAD_MARK = 'sanadGlobal=TQN-QN-WORLD'

function hasSanadMark(details: string | null): boolean {
  return !!details && details.includes(SANAD_MARK)
}

function bucketMarked(rows: { id: string; globalId: string; slug: string; type: string; primaryName: string; subtitle: string | null; details: string | null; evidenceLevel: string; verificationStatus: string; startDate: string | null; startDatePrecision: string | null; endDate: string | null; endDatePrecision: string | null; region: string | null }[]) {
  const marked = rows.filter((r) => hasSanadMark(r.details))
  return {
    figures: marked.filter((r) => r.type === 'PERSON').map(toSummary),
    network: marked.filter((r) => r.type === 'PLACE' || r.type === 'INSTITUTION').map(toSummary),
    sources: marked.filter((r) => r.type === 'SOURCE').map(toSummary),
  }
}

export async function getSanadRegistry(): Promise<SanadRegistryDTO> {
  try {
    const rows = await db.entity.findMany({
      where: { details: { contains: SANAD_MARK } },
      orderBy: [{ type: 'asc' }, { primaryName: 'asc' }],
    })
    const { figures, network, sources } = bucketMarked(rows as Parameters<typeof bucketMarked>[0])

    // featured — koleksi spesial atas permintaan Founder
    const coll = await db.entity.findUnique({ where: { globalId: '165-COLL-000002' } })
    let featured: EntitySummaryDTO[] = []
    if (coll) {
      const items = await db.collectionItem.findMany({
        where: { collectionId: coll.id },
        orderBy: { order: 'asc' },
        include: { item: true },
      })
      featured = items.map((ci) => toSummary(ci.item))
    }

    // chains + links
    const chainRows = rows.filter((r) => r.type === 'SANAD')
    const chainIds = chainRows.map((c) => c.id)
    const linkRows = chainIds.length
      ? await db.sanadLink.findMany({
          where: { sanadEntityId: { in: chainIds } },
          orderBy: [{ sanadEntityId: 'asc' }, { order: 'asc' }],
        })
      : []
    const personIds = [...new Set(linkRows.map((l) => l.personEntityId).filter((x): x is string => !!x))]
    const persons = personIds.length
      ? await db.entity.findMany({ where: { id: { in: personIds } }, select: { id: true, slug: true, primaryName: true } })
      : []
    const personById = new Map(persons.map((p) => [p.id, p]))

    const chains: SanadChainDTO[] = chainRows.map((c) => ({
      entity: toSummary(c),
      links: linkRows
        .filter((l) => l.sanadEntityId === c.id)
        .map((l) => ({
          id: l.id, order: l.order, fromName: l.fromName, toName: l.toName,
          personSlug: l.personEntityId ? personById.get(l.personEntityId)?.slug ?? null : null,
          personName: l.personEntityId ? personById.get(l.personEntityId)?.primaryName ?? null : null,
          eraNote: l.eraNote, evidenceLevel: l.evidenceLevel, verificationStatus: l.verificationStatus,
          sourceRef: l.sourceRef, context: l.context,
        })),
    }))

    return { featured, chains, figures, network, sources }
  } catch (err) {
    logFallback('sanad', err)
    return snapshotSanadRegistry()
  }
}

// snapshot fallback — zero-database mirror of the above
export function snapshotSanadRegistry(): SanadRegistryDTO {
  const marked = SNAPSHOT.entities.filter((e) => hasSanadMark(e.details))
  const figures = marked.filter((e) => e.type === 'PERSON').map(toSummary)
  const network = marked.filter((e) => e.type === 'PLACE' || e.type === 'INSTITUTION').map(toSummary)
  const sources = marked.filter((e) => e.type === 'SOURCE').map(toSummary)

  const coll = SNAPSHOT.entities.find((e) => e.globalId === '165-COLL-000002')
  const featured = coll
    ? SNAPSHOT.collectionItems
        .filter((c) => c.collectionId === coll.id)
        .sort((a, b) => a.order - b.order)
        .map((c) => SNAPSHOT.entities.find((e) => e.id === c.itemEntityId))
        .filter((e): e is NonNullable<typeof e> => !!e)
        .map(toSummary)
    : []

  const chainRows = marked.filter((e) => e.type === 'SANAD')
  const links = snapshotSanadLinks()
  const entityById = new Map(SNAPSHOT.entities.map((e) => [e.id, e]))
  const chains: SanadChainDTO[] = chainRows.map((c) => ({
    entity: toSummary(c),
    links: links
      .filter((l) => l.sanadEntityId === c.id)
      .map((l) => {
        const p = l.personEntityId ? entityById.get(l.personEntityId) : undefined
        return {
          id: l.id, order: l.order, fromName: l.fromName, toName: l.toName,
          personSlug: p?.slug ?? null, personName: p?.primaryName ?? null,
          eraNote: l.eraNote, evidenceLevel: l.evidenceLevel, verificationStatus: l.verificationStatus,
          sourceRef: l.sourceRef, context: l.context,
        }
      }),
  }))

  return { featured, chains, figures, network, sources }
}

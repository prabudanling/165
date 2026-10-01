// ============================================================
// 165 — RUANG ADMIN: server-side data helpers
// Entity CRUD with the preservation doctrine enforced:
// - every update stores a VersionSnapshot of the previous state
// - every mutation writes an AuditLog row (never silent)
// - delete is guarded: entities referenced by relations/claims/
//   collections must be HIDDEN (visibility) instead of deleted
// ============================================================
import { db } from '@/lib/db'
import { ENTITY_TYPES } from '@/lib/165'

export const GLOBAL_ID_PREFIX: Record<string, string> = {
  PERSON: 'PERSON', INSTITUTION: 'INST', ORGANIZATION: 'ORG', PLACE: 'PLACE',
  BOOK: 'BOOK', MANUSCRIPT: 'MS', DOCUMENT: 'DOC', MEDIA: 'MEDIA',
  EVENT: 'EVT', SANAD: 'SANAD', RESEARCH: 'RES', SOURCE: 'SRC',
  CLAIM: 'CLM', TRADITION: 'TRAD', COLLECTION: 'COLL', TERM: 'TERM',
}

export const TYPE_KEYS = Object.keys(ENTITY_TYPES) as string[]
export const EVIDENCE_KEYS = ['A', 'B', 'C', 'D', 'E', 'F']
export const STATUS_KEYS = ['VERIFIED', 'DOCUMENTED', 'COMMUNITY_SUBMITTED', 'DISPUTED', 'TRADITIONAL_ACCOUNT', 'UNVERIFIED', 'WITHDRAWN']
export const VISIBILITY_KEYS = ['PUBLIC', 'RESTRICTED', 'PRIVATE']
export const DATE_PRECISION_KEYS = ['DAY', 'MONTH', 'YEAR', 'DECADE', 'CENTURY', 'UNKNOWN']
export const CONTRIBUTION_STATUSES = ['SUBMITTED', 'SCREENING', 'EDITORIAL_REVIEW', 'SOURCE_REVIEW', 'VERIFICATION', 'APPROVED', 'PUBLISHED', 'REJECTED', 'DISPUTED']

export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
  return base || 'entitas'
}

export async function nextGlobalId(type: string): Promise<string> {
  const prefix = GLOBAL_ID_PREFIX[type] ?? type.toUpperCase().slice(0, 8)
  const stem = `165-${prefix}-`
  const rows = await db.entity.findMany({
    where: { globalId: { startsWith: stem } },
    select: { globalId: true },
  })
  let max = 0
  for (const r of rows) {
    const n = Number(r.globalId.slice(stem.length))
    if (Number.isFinite(n) && n > max) max = n
  }
  return `${stem}${String(max + 1).padStart(6, '0')}`
}

export async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name)
  const taken = await db.entity.findMany({ where: { slug: { startsWith: base } }, select: { id: true, slug: true } })
  const used = new Set(taken.filter((t) => t.id !== excludeId).map((t) => t.slug))
  if (!used.has(base)) return base
  for (let i = 2; i < 500; i++) {
    const cand = `${base}-${i}`
    if (!used.has(cand)) return cand
  }
  return `${base}-${Date.now().toString(36)}`
}

export async function writeAudit(actor: string, action: string, target: string, detail?: string) {
  await db.auditLog.create({ data: { actor, action, target, detail: detail?.slice(0, 500) } })
}

export async function writeVersionSnapshot(entityId: string, reason: string) {
  const prev = await db.entity.findUnique({
    where: { id: entityId },
    include: { nameVariants: true },
  })
  if (!prev) return 1
  const last = await db.versionSnapshot.findFirst({ where: { entityId }, orderBy: { version: 'desc' } })
  const version = (last?.version ?? 0) + 1
  await db.versionSnapshot.create({
    data: {
      entityId, version, changedBy: 'admin', reason: reason.slice(0, 300),
      snapshot: JSON.stringify({
        globalId: prev.globalId, slug: prev.slug, type: prev.type, primaryName: prev.primaryName,
        subtitle: prev.subtitle, summary: prev.summary, summaryId: prev.summaryId, summaryAr: prev.summaryAr,
        evidenceLevel: prev.evidenceLevel, verificationStatus: prev.verificationStatus, visibility: prev.visibility,
        startDate: prev.startDate, startDatePrecision: prev.startDatePrecision,
        endDate: prev.endDate, endDatePrecision: prev.endDatePrecision,
        region: prev.region, details: prev.details,
        names: prev.nameVariants.map((n) => ({ name: n.name, language: n.language, kind: n.kind })),
      }),
    },
  })
  return version
}

export async function entityDependencyCounts(entityId: string) {
  const [outRel, inRel, claimsAsSubject, stancesAsSource, sanadLinks, collectionsOwned, collectionsIn] =
    await Promise.all([
      db.relationship.count({ where: { fromEntityId: entityId } }),
      db.relationship.count({ where: { toEntityId: entityId } }),
      db.claimSource.count({ where: { claimEntityId: entityId } }),
      db.claimSource.count({ where: { sourceEntityId: entityId } }),
      db.sanadLink.count({ where: { personEntityId: entityId } }),
      db.collectionItem.count({ where: { collectionId: entityId } }),
      db.collectionItem.count({ where: { itemEntityId: entityId } }),
    ])
  return { relations: outRel + inRel, claims: claimsAsSubject + stancesAsSource, sanadLinks, collections: collectionsOwned + collectionsIn }
}

export function clean(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const v = value.trim()
  return v.length ? v : null
}

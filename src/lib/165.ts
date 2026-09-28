// 165 — shared vocabularies & types (single source of truth for UI + API)

export const ENTITY_TYPES = {
  PERSON: { label: 'Person', labelId: 'Tokoh', icon: 'User' },
  INSTITUTION: { label: 'Institution', labelId: 'Institusi', icon: 'Landmark' },
  ORGANIZATION: { label: 'Organization', labelId: 'Organisasi', icon: 'Building2' },
  PLACE: { label: 'Place', labelId: 'Tempat', icon: 'MapPin' },
  BOOK: { label: 'Book', labelId: 'Kitab', icon: 'BookOpen' },
  MANUSCRIPT: { label: 'Manuscript', labelId: 'Naskah', icon: 'ScrollText' },
  DOCUMENT: { label: 'Document', labelId: 'Dokumen', icon: 'FileText' },
  MEDIA: { label: 'Media', labelId: 'Media', icon: 'Video' },
  EVENT: { label: 'Event', labelId: 'Peristiwa', icon: 'CalendarDays' },
  SANAD: { label: 'Sanad', labelId: 'Sanad', icon: 'Link2' },
  RESEARCH: { label: 'Research', labelId: 'Riset', icon: 'FlaskConical' },
  SOURCE: { label: 'Source', labelId: 'Sumber', icon: 'Library' },
  CLAIM: { label: 'Claim', labelId: 'Klaim', icon: 'Scale' },
  TRADITION: { label: 'Tradition', labelId: 'Tradisi', icon: 'Sparkles' },
  COLLECTION: { label: 'Collection', labelId: 'Koleksi', icon: 'Layers' },
  TERM: { label: 'Term', labelId: 'Istilah', icon: 'Languages' },
} as const

export type EntityTypeKey = keyof typeof ENTITY_TYPES

export const EVIDENCE_LEVELS = {
  A: { label: 'Level A — Primary Source', desc: 'Primary sources: manuscripts, documents, archival records in 165\'s holdings.', tone: 'emerald' },
  B: { label: 'Level B — Authoritative Institutional Source', desc: 'Authoritative institutional records issued by 165 itself.', tone: 'green' },
  C: { label: 'Level C — Scholarly Source', desc: 'Published scholarly literature. Citations are attached during source review.', tone: 'teal' },
  D: { label: 'Level D — Oral History', desc: 'Oral history and traditional accounts. Preserved as testimony, never as fact.', tone: 'amber' },
  E: { label: 'Level E — Community Record', desc: 'Community-submitted records, pending editorial and source review.', tone: 'orange' },
  F: { label: 'Level F — Unverified', desc: 'Unverified material. Displayed with explicit uncertainty; never silently promoted.', tone: 'rose' },
} as const

export type EvidenceLevelKey = keyof typeof EVIDENCE_LEVELS

export const VERIFICATION_STATUSES = {
  VERIFIED: { label: 'Verified', desc: 'Reviewed and verified by the appropriate council.', tone: 'emerald' },
  DOCUMENTED: { label: 'Documented', desc: 'Documented against an identified source; verification review may continue.', tone: 'green' },
  COMMUNITY_SUBMITTED: { label: 'Community Submitted', desc: 'Submitted by the public; in editorial workflow.', tone: 'sky' },
  DISPUTED: { label: 'Disputed', desc: 'Competing sources exist. Differences are displayed, never silently resolved.', tone: 'rose' },
  TRADITIONAL_ACCOUNT: { label: 'Traditional Account', desc: 'Preserved as tradition. Tradition is never promoted to fact.', tone: 'amber' },
  UNVERIFIED: { label: 'Unverified', desc: 'Neither supported nor disputed by accessible sources. No assertion made.', tone: 'slate' },
  WITHDRAWN: { label: 'Withdrawn', desc: 'Withdrawn from publication. Prior versions remain in the archive.', tone: 'stone' },
} as const

export type VerificationStatusKey = keyof typeof VERIFICATION_STATUSES

export const PREDICATES = {
  TEACHER_OF: { label: 'teacher of', reverse: 'STUDENT_OF' },
  STUDENT_OF: { label: 'student of', reverse: 'TEACHER_OF' },
  AUTHORED: { label: 'authored', reverse: 'AUTHORED_BY' },
  AUTHORED_BY: { label: 'authored by', reverse: 'AUTHORED' },
  ASSOCIATED_WITH: { label: 'associated with', reverse: 'ASSOCIATED_WITH' },
  LOCATED_IN: { label: 'located in', reverse: 'CONTAINS' },
  CONTAINS: { label: 'contains', reverse: 'LOCATED_IN' },
  HELD_BY: { label: 'held by', reverse: 'HOLDS' },
  HOLDS: { label: 'holds', reverse: 'HELD_BY' },
  REFERENCES: { label: 'references', reverse: 'REFERENCED_BY' },
  REFERENCED_BY: { label: 'referenced by', reverse: 'REFERENCES' },
  APPEARS_IN: { label: 'appears in', reverse: 'MENTIONS' },
  MENTIONS: { label: 'mentions', reverse: 'APPEARS_IN' },
  OCCURRED_IN: { label: 'occurred in', reverse: 'HOSTED' },
  STUDIES: { label: 'studies', reverse: 'STUDIED_BY' },
  STUDIED_BY: { label: 'studied by', reverse: 'STUDIES' },
  DOCUMENTS: { label: 'documents', reverse: 'DOCUMENTED_BY' },
  DOCUMENTED_BY: { label: 'documented by', reverse: 'DOCUMENTS' },
  LINEAGE_FOUNDER_OF: { label: 'historical eponym of', reverse: 'NAMED_AFTER' },
  NAMED_AFTER: { label: 'named after', reverse: 'LINEAGE_FOUNDER_OF' },
  LINEAGE_OF: { label: 'lineage of', reverse: 'DRAWS_ON' },
  DRAWS_ON: { label: 'draws on', reverse: 'LINEAGE_OF' },
  PART_OF: { label: 'part of', reverse: 'INCLUDES' },
  INCLUDES: { label: 'includes', reverse: 'PART_OF' },
  FOUNDED: { label: 'founded', reverse: 'FOUNDED_BY' },
  FOUNDED_BY: { label: 'founded by', reverse: 'FOUNDED' },
} as const

export type PredicateKey = keyof typeof PREDICATES

export const CONTRIBUTION_KINDS = {
  KNOWLEDGE: 'Submit Knowledge',
  SOURCE: 'Submit Source',
  BIOGRAPHY: 'Submit Biography',
  INSTITUTION: 'Submit Institution',
  MANUSCRIPT: 'Submit Manuscript',
  ORAL_HISTORY: 'Oral History',
  CORRECTION: 'Correction',
  OTHER: 'Other',
} as const

export const CONTRIBUTION_FLOW = [
  'SUBMITTED', 'SCREENING', 'EDITORIAL_REVIEW', 'SOURCE_REVIEW', 'VERIFICATION', 'APPROVED', 'PUBLISHED',
] as const
export const CONTRIBUTION_TERMINAL = ['REJECTED', 'DISPUTED'] as const

export type ContributionStatus = (typeof CONTRIBUTION_FLOW)[number] | (typeof CONTRIBUTION_TERMINAL)[number]

// ---------- wire types ----------
export type NameVariantDTO = { name: string; language: string; kind: string; note?: string | null }

export type RelationshipDTO = {
  id: string; predicate: string; direction: 'OUT' | 'IN'
  evidenceLevel: string; verificationStatus: string; context?: string | null; sourceRef?: string | null
  other: EntitySummaryDTO
}

export type EntitySummaryDTO = {
  id: string; globalId: string; slug: string; type: string; primaryName: string
  subtitle?: string | null; evidenceLevel: string; verificationStatus: string
  startDate?: string | null; startDatePrecision?: string | null; endDate?: string | null; endDatePrecision?: string | null
  region?: string | null
}

export type EntityProfileDTO = EntitySummaryDTO & {
  summary?: string | null; summaryId?: string | null; summaryAr?: string | null
  isExampleRecord: boolean; visibility: string
  latitude?: number | null; longitude?: number | null
  details?: Record<string, unknown> | null
  names: NameVariantDTO[]
  relationships: RelationshipDTO[]
  stances: { stance: string; note?: string | null; source: EntitySummaryDTO }[]
  collectionItems?: { order: number; note?: string | null; item: EntitySummaryDTO }[]
  versions: { version: number; changedBy: string; reason?: string | null; createdAt: string }[]
  updatedAt: string
}

export function parseDetails(json: string | null | undefined): Record<string, unknown> | null {
  if (!json) return null
  try { return JSON.parse(json) as Record<string, unknown> } catch { return null }
}

export function dateLabel(start?: string | null, startP?: string | null, end?: string | null, endP?: string | null): string {
  const fmt = (v: string | null | undefined, p: string | null | undefined) => {
    if (!v) return p === 'UNKNOWN' ? 'date not recorded' : null
    switch (p) {
      case 'DECADE': return `${v.replace(/s$/, '')}s`
      case 'CENTURY': return `${v}th century`
      case 'MONTH': return v
      case 'DAY': return v
      default: return v
    }
  }
  const s = fmt(start, startP)
  const e = fmt(end, endP)
  if (s && e) return `${s} – ${e}`
  if (s) return s
  if (e) return `until ${e}`
  return startP === 'UNKNOWN' ? 'date not recorded' : ''
}

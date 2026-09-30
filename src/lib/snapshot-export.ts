// ============================================================
// 165 — snapshot export core (shared by CLI script + admin API)
// Writes src/data/heritage-snapshot.json + snapshot-counts.json
// from the live database. On read-only filesystems (Vercel
// serverless) the write fails — the caller surfaces an honest
// Indonesian message instead of pretending success.
// ============================================================
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { db } from '@/lib/db'

export type ExportResult = {
  counts: {
    entities: number; relations: number; sanadChains: number; contributions: number
    byType: Record<string, number>
    exportedAt: string
  }
  files: string[]
}

export async function exportSnapshot(): Promise<ExportResult> {
  const [entities, nameVariants, relationships, claimSources, collectionItems, versions, contributions] =
    await Promise.all([
      db.entity.findMany({ orderBy: [{ type: 'asc' }, { primaryName: 'asc' }] }),
      db.nameVariant.findMany({ orderBy: { name: 'asc' } }),
      db.relationship.findMany({ orderBy: { id: 'asc' } }),
      db.claimSource.findMany(),
      db.collectionItem.findMany({ orderBy: { order: 'asc' } }),
      db.versionSnapshot.findMany({ orderBy: { version: 'desc' } }),
      db.contribution.findMany({ orderBy: { createdAt: 'desc' } }),
    ])

  const byType: Record<string, number> = {}
  for (const e of entities) byType[e.type] = (byType[e.type] ?? 0) + 1

  const counts = {
    entities: entities.length,
    relations: relationships.length,
    sanadChains: byType['SANAD'] ?? 0,
    contributions: contributions.length,
    byType,
    exportedAt: new Date().toISOString(),
  }

  const snapshot = {
    meta: counts,
    entities,
    nameVariants,
    relationships,
    claimSources,
    collectionItems,
    versions: versions.slice(0, 400),
    contributions: contributions.map((c) => ({
      reference: c.reference, kind: c.kind, title: c.title,
      status: c.status, createdAt: c.createdAt.toISOString(),
    })),
  }

  const outDir = join(process.cwd(), 'src', 'data')
  mkdirSync(outDir, { recursive: true })
  const f1 = join(outDir, 'heritage-snapshot.json')
  const f2 = join(outDir, 'snapshot-counts.json')
  writeFileSync(f1, JSON.stringify(snapshot, null, 1))
  writeFileSync(f2, JSON.stringify(counts, null, 1))

  return { counts, files: [f1, f2] }
}

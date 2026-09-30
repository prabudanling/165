import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isAuthed } from '@/lib/admin-auth'
import { getStats } from '@/lib/queries'
import { db } from '@/lib/db'
import countsFile from '@/data/snapshot-counts.json'

// read snapshot-counts.json from disk at request time (fresh after
// an admin export); fall back to the build-time import if the file
// is not readable (e.g. traced serverless output)
function currentCounts(): { entities: number; relations: number; sanadChains: number; contributions: number; byType: Record<string, number>; exportedAt: string } {
  try {
    const raw = readFileSync(join(process.cwd(), 'src', 'data', 'snapshot-counts.json'), 'utf8')
    return JSON.parse(raw)
  } catch {
    return countsFile as { entities: number; relations: number; sanadChains: number; contributions: number; byType: Record<string, number>; exportedAt: string }
  }
}

export async function GET(req: NextRequest) {
  const authenticated = isAuthed(req)
  let dbAvailable = false
  try {
    await db.entity.count()
    dbAvailable = true
  } catch {
    dbAvailable = false
  }

  // stats always resolve (live DB → bundled snapshot fallback)
  let stats: Awaited<ReturnType<typeof getStats>> | null = null
  try { stats = await getStats() } catch { stats = null }

  const counts = currentCounts()

  return NextResponse.json({
    authenticated,
    dbAvailable,
    stats: stats ?? { total: counts.entities, byType: counts.byType, relations: counts.relations, sanadChains: counts.sanadChains, contributions: counts.contributions },
    snapshot: { exportedAt: counts.exportedAt, counts },
  })
}

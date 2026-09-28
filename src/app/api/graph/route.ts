import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ENTITY_TYPES } from '@/lib/165'

export async function GET() {
  try {
    const entities = await db.entity.findMany({
      where: { visibility: 'PUBLIC' },
      select: { id: true, globalId: true, slug: true, type: true, primaryName: true, evidenceLevel: true, verificationStatus: true },
    })
    const rels = await db.relationship.findMany({
      select: { id: true, fromEntityId: true, toEntityId: true, predicate: true, evidenceLevel: true, verificationStatus: true },
    })

    const byId = new Map(entities.map((e) => [e.id, e]))
    const edges = rels
      .filter((r) => byId.has(r.fromEntityId) && byId.has(r.toEntityId))
      .map((r) => ({ id: r.id, from: r.fromEntityId, to: r.toEntityId, predicate: r.predicate, evidenceLevel: r.evidenceLevel, verificationStatus: r.verificationStatus }))

    const nodes = entities.map((e) => ({ id: e.id, globalId: e.globalId, slug: e.slug, type: e.type, label: e.primaryName }))
    return NextResponse.json({
      nodes,
      edges,
      typeOrder: Object.keys(ENTITY_TYPES),
    })
  } catch (err) {
    console.error('[api/graph]', err)
    return NextResponse.json({ error: 'Failed to build graph' }, { status: 500 })
  }
}

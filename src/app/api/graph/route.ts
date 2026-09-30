import { NextResponse } from 'next/server'
import { getGraphData } from '@/lib/queries'

export async function GET() {
  try {
    const graph = await getGraphData()
    return NextResponse.json(graph)
  } catch (err) {
    console.error('[api/graph]', err)
    return NextResponse.json({ error: 'Failed to build graph' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getTimelineEvents } from '@/lib/queries'

export async function GET() {
  try {
    const { timeline } = await getTimelineEvents()
    return NextResponse.json({ timeline })
  } catch (err) {
    console.error('[api/timeline]', err)
    return NextResponse.json({ error: 'Failed to load timeline' }, { status: 500 })
  }
}

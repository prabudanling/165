import { NextRequest, NextResponse } from 'next/server'
import { getEntityProfile } from '@/lib/queries'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const profile = await getEntityProfile(slug)
    if (!profile) return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
    return NextResponse.json({ profile })
  } catch (err) {
    console.error('[api/entities/[slug]]', err)
    return NextResponse.json({ error: 'Failed to load entity' }, { status: 500 })
  }
}

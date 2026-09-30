import { NextResponse } from 'next/server'
import { getGlossaryTerms } from '@/lib/queries'

export async function GET() {
  try {
    const { terms } = await getGlossaryTerms()
    return NextResponse.json({ terms })
  } catch (err) {
    console.error('[api/terms]', err)
    return NextResponse.json({ error: 'Failed to load glossary' }, { status: 500 })
  }
}

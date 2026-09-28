import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

// simple in-memory rate limiter (per-IP)
const hits = new Map<string, { count: number; reset: number }>()
function rateLimited(key: string, max = 10, windowMs = 10 * 60_000): boolean {
  const now = Date.now()
  const h = hits.get(key)
  if (!h || h.reset < now) { hits.set(key, { count: 1, reset: now + windowMs }); return false }
  h.count += 1
  return h.count > max
}

const submissionSchema = z.object({
  kind: z.enum(['KNOWLEDGE', 'SOURCE', 'BIOGRAPHY', 'INSTITUTION', 'MANUSCRIPT', 'ORAL_HISTORY', 'CORRECTION', 'OTHER']),
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().trim().min(20, 'Please describe the submission in at least 20 characters').max(8000),
  submitterName: z.string().trim().min(2, 'Name is required').max(120),
  submitterContact: z.string().trim().max(200).optional().or(z.literal('')),
  sourceNote: z.string().trim().max(2000).optional().or(z.literal('')),
  consent: z.literal(true),
})

async function nextReference(): Promise<string> {
  const year = new Date().getFullYear()
  const count = await db.contribution.count()
  return `165-SUB-${year}-${String(count + 1).padStart(5, '0')}`
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'local'
    if (rateLimited(ip)) {
      return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
    }
    const body = await req.json().catch(() => null)
    const parsed = submissionSchema.safeParse(body)
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return NextResponse.json({ error: first?.message ?? 'Invalid submission' }, { status: 400 })
    }
    const d = parsed.data
    const reference = await nextReference()

    const contribution = await db.contribution.create({
      data: {
        reference,
        kind: d.kind,
        title: d.title,
        payload: JSON.stringify({
          description: d.description,
          sourceNote: d.sourceNote || null,
          consent: true,
        }),
        submitterName: d.submitterName,
        submitterContact: d.submitterContact || null,
        status: 'SUBMITTED',
        statusNote: 'Received. Awaiting screening by the Editorial Council.',
      },
    })

    await db.auditLog.create({
      data: { actor: 'public', action: 'SUBMIT', target: reference, detail: `Contribution "${d.title}" (${d.kind}) submitted.` },
    })

    return NextResponse.json({
      ok: true,
      reference: contribution.reference,
      status: contribution.status,
      message: 'Submission received. Contribution is not publication — it now enters the editorial workflow.',
    }, { status: 201 })
  } catch (err) {
    console.error('[api/contribute POST]', err)
    return NextResponse.json({ error: 'Failed to submit contribution' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ref = (searchParams.get('ref') ?? '').trim().toUpperCase()
    if (!ref) {
      // return workflow definition for UI display
      const open = await db.contribution.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { reference: true, kind: true, status: true, createdAt: true } })
      return NextResponse.json({ recent: open })
    }
    const c = await db.contribution.findUnique({
      where: { reference: ref },
      select: { reference: true, kind: true, title: true, status: true, statusNote: true, createdAt: true, updatedAt: true },
    })
    if (!c) return NextResponse.json({ error: 'Reference not found. Check the ID and try again.' }, { status: 404 })
    return NextResponse.json({ contribution: c })
  } catch (err) {
    console.error('[api/contribute GET]', err)
    return NextResponse.json({ error: 'Failed to look up contribution' }, { status: 500 })
  }
}

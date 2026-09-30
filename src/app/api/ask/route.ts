import { NextRequest, NextResponse } from 'next/server'
import { getAskIndex } from '@/lib/queries'
import { EVIDENCE_LEVELS, VERIFICATION_STATUSES } from '@/lib/165'

// simple in-memory rate limiter (per-IP, MVP scale)
const hits = new Map<string, { count: number; reset: number }>()
function rateLimited(key: string, max = 20, windowMs = 60_000): boolean {
  const now = Date.now()
  const h = hits.get(key)
  if (!h || h.reset < now) { hits.set(key, { count: 1, reset: now + windowMs }); return false }
  h.count += 1
  return h.count > max
}

const SANAD_WORDS = ['sanad', 'silsilah', 'ijazah', 'ijazah', 'baiat', "bai'", 'khalifah', 'mursyid', 'legitim', 'ijab', 'talqin']
const URGENCY_NONE = 'I cannot verify that.'

function score(text: string | null | undefined, words: string[]): number {
  if (!text) return 0
  const t = text.toLowerCase()
  let s = 0
  for (const w of words) {
    if (!w) continue
    if (t.includes(w)) s += w.includes(' ') ? 3 : 2
  }
  return s
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'local'
    if (rateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }
    const body = await req.json().catch(() => null)
    const question: string = typeof body?.question === 'string' ? body.question.slice(0, 500) : ''
    if (!question.trim()) return NextResponse.json({ error: 'A question is required.' }, { status: 400 })

    // tokenize question — drop common stopwords, keep meaningful terms (min 3 chars)
    const stop = new Set(['what', 'who', 'is', 'the', 'a', 'an', 'of', 'in', 'on', 'to', 'and', 'or', 'does', 'do', 'did', 'how', 'when', 'where', 'apa', 'siapa', 'adalah', 'itu', 'yang', 'dari', 'dan', 'atau', 'bagaimana', 'kapan', 'dimana', 'di', 'ke', 'untuk', 'dengan', 'tell', 'me', 'about'])
    const words = question.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 3 && !stop.has(w))
    const cand = await getAskIndex()

    const scored = cand
      .map((e) => {
        let s = score(e.primaryName, words) * 3
        s += score(e.subtitle, words) * 2
        s += score(e.summary, words)
        s += score(e.summaryId, words)
        for (const v of e.nameVariants) s += score(v.name, words) * 2
        return { e, s }
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 5)

    const isSanadSensitive = SANAD_WORDS.some((w) => question.toLowerCase().includes(w))

    if (scored.length === 0) {
      return NextResponse.json({
        answer: 'This information is not verified in 165\u2019s records.',
        answerId: 'Informasi ini tidak terverifikasi dalam catatan 165.',
        found: false,
        references: [],
        policy: '165 does not fabricate answers. Unknown is better than fabricated certainty.',
        sanadNotice: isSanadSensitive
          ? 'Sanad, ijazah and spiritual authority are especially sensitive: 165 never creates, merges, predicts, or legitimizes them. Recorded chains appear in the Sanad registry only when sourced.'
          : undefined,
      })
    }

    const refs = scored.map(({ e }) => ({
      globalId: e.globalId, slug: e.slug, type: e.type, primaryName: e.primaryName,
      evidenceLevel: e.evidenceLevel,
      evidenceLabel: EVIDENCE_LEVELS[e.evidenceLevel as keyof typeof EVIDENCE_LEVELS]?.label ?? e.evidenceLevel,
      verificationStatus: e.verificationStatus,
      statusLabel: VERIFICATION_STATUSES[e.verificationStatus as keyof typeof VERIFICATION_STATUSES]?.label ?? e.verificationStatus,
      summary: e.summary,
    }))

    const best = scored[0].e
    const lines: string[] = []
    lines.push(`Based on ${scored.length} record${scored.length > 1 ? 's' : ''} in 165\u2019s database, the closest subject is "${best.primaryName}" (${best.globalId}).`)
    if (best.summary) lines.push(best.summary)
    const uncertain = refs.filter((r) => r.verificationStatus !== 'DOCUMENTED' && r.verificationStatus !== 'VERIFIED')
    if (uncertain.length > 0) {
      lines.push(`Note: ${uncertain.length === refs.length ? 'All' : 'Some'} matching records are ${uncertain.map((u) => u.statusLabel.toLowerCase()).join(', ')} — they are preserved as such and are not presented as verified fact.`)
    }
    lines.push('Everything above is quoted from 165\u2019s records with their evidence levels. 165 does not generate claims beyond these records.')

    return NextResponse.json({
      answer: lines.join(' '),
      found: true,
      references: refs,
      sanadNotice: isSanadSensitive
        ? 'Sanad, ijazah and spiritual authority are especially sensitive: 165 never creates, merges, predicts, or legitimizes them. Recorded chains appear in the Sanad registry only when sourced.'
        : undefined,
      policy: 'Source-grounded · Traceable · Uncertainty-aware · Non-fabricating · Human-supervised',
    })
  } catch (err) {
    console.error('[api/ask]', err)
    return NextResponse.json({ error: 'Ask 165 failed' }, { status: 500 })
  }
}

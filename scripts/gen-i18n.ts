// 165 — Pipeline terjemahan antarmuka via LLM (backend only)
// Menerjemahkan katalog UI (src/lib/i18n/catalog.ts) ke SELURUH bahasa registry
// (src/lib/i18n/languages.ts) kecuali 6 bahasa kurasi tangan — amanat founder:
// "seluruh bahasa, default Bahasa Indonesia, jangan sampai ada yang terlewat".
// Output: src/data/i18n/{code}.json — dimuat dinamis oleh mesin i18n.
// Resume-safe: bahasa yang sudah punya file dilewati. Jalankan ulang: bun scripts/gen-i18n.ts
import ZAI from 'z-ai-web-dev-sdk'
import { writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { CATALOG, CATALOG_KEYS } from '../src/lib/i18n/catalog'
import { LANGUAGES } from '../src/lib/i18n/languages'

const OUT_DIR = 'src/data/i18n'
mkdirSync(OUT_DIR, { recursive: true })

/** Tulis ulang src/data/i18n/registry.ts — loader statis per bahasa (chunk terpisah, Turbopack-safe). */
function writeRegistry() {
  const codes = readdirSync(OUT_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort()
  const entries = codes.map((c) => `  ${JSON.stringify(c)}: () => import(${JSON.stringify(`./${c}.json`)}),`).join('\n')
  const body = `// GENERATED FILE — jangan sunting. Regenerate: bun scripts/gen-i18n.ts
// Loader statis per bahasa — dijamin ter-code-split per bahasa oleh bundler.
import type { CatalogKey } from '@/lib/i18n/catalog'

export type DictModule = { strings: Partial<Record<CatalogKey, string>> }

export const AI_DICT_LOADERS: Record<string, () => Promise<DictModule>> = {
${entries}
}
`
  writeFileSync('src/data/i18n/registry.ts', body, 'utf8')
  return codes.length
}

// [code, native name, human name] — DITURUNKAN dari registry bahasa 165
// (seluruh bahasa non-kurasi: 75 tier 'ai' yang sudah ada + seluruh tier 'core'),
// sehingga registry dan pipeline TIDAK PERNAH melenceng satu bahasa pun.
const TARGETS: Array<[string, string, string]> = LANGUAGES
  .filter((l) => l.tier !== 'curated')
  .map((l) => [l.code, l.native, l.name])

const payload = CATALOG_KEYS.map((k) => `${k}\n  id: ${CATALOG[k][0]}\n  en: ${CATALOG[k][1]}`).join('\n')

// circuit-breaker 429 global: saat kuota ketat, SEMUA worker berhenti bersama
// cukup lama (45 dtk), bukan retry cepat yang membuat limit makin panas.
let cooldownUntil = 0
async function waitCooldown() {
  const now = Date.now()
  if (now < cooldownUntil) {
    await new Promise((r) => setTimeout(r, cooldownUntil - now))
  }
}

function systemPrompt(lang: string, native: string, english: string) {
  return [
    'You are a professional UI localizer for 165.web.id — a dignified, scholarly Islamic heritage institution (TQN Qodiriah Naqsabandiyah knowledge & preservation platform).',
    `Translate interface strings into: ${english} (${native}). Output language: ${lang}.`,
    'Rules:',
    '- Respectful, formal, clean register suited to a scholarly Islamic institution. No slang.',
    '- Keep placeholders EXACTLY as-is: {n} {q} {code} {title} {curated} {ai}.',
    '- Keep brand tokens unchanged: "165", "TQN Qodiriah Naqsabandiyah", "Master Control", "Master Blueprint", "SEO", "API", "AI", "v1.0", "000/007/008/009".',
    '- Terms like "sanad" may stay romanized when natural.',
    '- Do NOT transliterate into Latin for languages that use another script (write Arabic-fa-ur-ps-sd in Arabic script, Hindi in Devanagari, etc.).',
    '- Return ONLY a valid JSON object: {"key": "translation", ...} with EXACTLY the same keys. No markdown fences, no commentary.',
  ].join('\n')
}

function userPrompt() {
  return `Translate ALL ${CATALOG_KEYS.length} strings below. Respond with JSON only.\n\n${payload}`
}

function extractJson(raw: string): Record<string, string> | null {
  let t = raw.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) t = fence[1].trim()
  const start = t.indexOf('{')
  const end = t.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    const obj = JSON.parse(t.slice(start, end + 1))
    if (obj && typeof obj === 'object') return obj as Record<string, string>
    return null
  } catch {
    return null
  }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)),
  ])
}

async function translateOne(zai: Awaited<ReturnType<typeof ZAI.create>>, code: string, native: string, english: string): Promise<{ ok: boolean; missing: number; err?: string }> {
  const outPath = `${OUT_DIR}/${code}.json`
  if (existsSync(outPath)) return { ok: true, missing: 0 }

  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      await waitCooldown()
      const completion = await withTimeout(
        zai.chat.completions.create({
          messages: [
            { role: 'assistant', content: systemPrompt(code, native, english) },
            { role: 'user', content: userPrompt() },
          ],
          thinking: { type: 'disabled' },
        }),
        120_000,
      )
      const raw = completion.choices[0]?.message?.content ?? ''
      const parsed = extractJson(raw)
      if (!parsed) throw new Error('unparseable response')
      const strings: Record<string, string> = {}
      let missing = 0
      for (const key of CATALOG_KEYS) {
        const v = parsed[key]
        if (typeof v === 'string' && v.trim().length > 0) strings[key] = v.trim()
        else {
          strings[key] = CATALOG[key][0] // honest fallback to Indonesian
          missing++
        }
      }
      writeFileSync(
        outPath,
        JSON.stringify({ code, generatedAt: new Date().toISOString(), tier: 'ai', strings }, null, 1),
        'utf8',
      )
      const total = writeRegistry()
      console.log(`[${code}] ok (${CATALOG_KEYS.length - missing}/${CATALOG_KEYS.length} translated) · registry=${total}`)
      return { ok: true, missing }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`[${code}] attempt ${attempt} failed: ${msg.slice(0, 120)}`)
      if (attempt >= 8) return { ok: false, missing: 0, err: msg }
      if (/429|Too many/i.test(msg)) {
        // kuota ketat: panaskan breaker global, tunggu serempak, lama
        cooldownUntil = Math.max(cooldownUntil, Date.now() + 45_000)
        console.warn(`[429] cooldown global 45s · sampai ${new Date(cooldownUntil).toISOString()}`)
      } else {
        await new Promise((r) => setTimeout(r, 8000 * attempt))
      }
    }
  }
  return { ok: false, missing: 0, err: 'unreachable' }
}

async function main() {
  const zai = await ZAI.create()
  const queue = TARGETS.filter(([code]) => !existsSync(`${OUT_DIR}/${code}.json`))
  console.log(`targets=${TARGETS.length} remaining=${queue.length}`)
  const CONCURRENCY = 2
  let idx = 0
  let done = 0
  let failed = 0

  async function worker(id: number) {
    // stagger worker starts to avoid burst rate-limiting
    await new Promise((r) => setTimeout(r, id * 4000))
    while (idx < queue.length) {
      await waitCooldown()
      const my = idx++
      const [code, native, english] = queue[my]
      const res = await translateOne(zai, code, native, english)
      done++
      if (!res.ok) failed++
      console.log(`progress ${done}/${queue.length} (${code}: ${res.ok ? 'ok' : 'FAILED'})`)
      await new Promise((r) => setTimeout(r, 2500))
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)))
  const total = writeRegistry()
  console.log(`DONE ok=${queue.length - failed} failed=${failed} registry=${total}`)
}

main().catch((e) => {
  console.error('FATAL', e)
  process.exit(1)
})

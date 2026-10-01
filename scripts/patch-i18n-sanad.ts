/**
 * 165 — PATCH i18n sanad keys (Task 26 follow-up)
 * Menerjemahkan HANYA kunci-kunci baru (sanad.*) untuk kamus AI yang sudah
 * ada (src/data/i18n/*.json) lalu menggabungkannya. Resume-safe: file yang
 * sudah lengkap dilewati. Fallback runtime tetap Indonesia bila gagal.
 */
import ZAI from 'z-ai-web-dev-sdk'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

const NEW_KEYS = [
  'sanad.kicker', 'sanad.title', 'sanad.lede', 'sanad.displayOnly',
  'sanad.featured', 'sanad.featuredLede', 'sanad.chains', 'sanad.linksCount',
  'sanad.blockNote', 'sanad.network', 'sanad.sources', 'sanad.referenceNote',
  'sanad.openProfile', 'home.statSanadNoteRecorded',
] as const

const REF: Record<string, { id: string; en: string }> = {
  'sanad.kicker': { id: 'Sanad Global · Murshid & Majlis', en: 'Global Sanad · Murshids & Majlis' },
  'sanad.title': { id: 'Sanad TQN se-dunia — direkam, bukan dikarang', en: "The world's TQN sanad — recorded, never invented" },
  'sanad.lede': {
    id: 'Atas permintaan Founder, registri sanad TQN Qodiriah Naqsabandiyah kini terisi: silsilah klasik dua jalur, jalur Banten hingga majlis TQN 165 Cikangkung, dan tokoh mursyid se-dunia — Abah Anom (Suryalaya), Abah Krawanggana, dan Abah Sukanta sebagai koleksi spesial. Setiap mata rantai membawa sumber dan statusnya sendiri; segmen yang belum ditranskripsi dari kitab silsilah tampil sebagai MATA BLOK yang jujur.',
    en: "At the Founder's request, the sanad registry of TQN Qodiriah Naqsabandiyah is now filled: the classical chains of both lineages, the Banten route down to the TQN 165 Cikangkung majlis, and murshid figures worldwide — with Abah Anom (Suryalaya), Abah Krawanggana and Abah Sukanta as a special collection. Every link carries its own source and status; segments not yet transcribed from the silsilah books appear as honest BLOCK LINKS.",
  },
  'sanad.displayOnly': {
    id: 'Sanad hanya ditampilkan — sistem tidak pernah membuat, menggabung, memprediksi, atau melegitimasi sanad. Rantai masuk hanya dengan Sumber → Relasi → Bukti → Konteks → Status Verifikasi.',
    en: 'Sanad is display-only — the system never creates, merges, predicts, or legitimizes sanad. A chain enters only via Source → Relationship → Evidence → Context → Verification Status.',
  },
  'sanad.featured': { id: 'Koleksi Spesial — Murshid TQN se-Dunia', en: 'Special Collection — TQN Murshids Worldwide' },
  'sanad.featuredLede': { id: 'Disusun khusus atas permintaan langsung Founder 165.', en: 'Composed specially at the direct request of the Founder of 165.' },
  'sanad.chains': { id: 'Rantai sanad tercatat', en: 'Recorded sanad chains' },
  'sanad.linksCount': { id: '{n} mata rantai', en: '{n} links' },
  'sanad.blockNote': { id: 'MATA BLOK — menunggu transkripsi kitab silsilah; 165 tidak mengarang nama.', en: 'BLOCK LINK — awaiting transcription from the silsilah book; 165 invents no names.' },
  'sanad.network': { id: 'Jaringan majlis & tempat', en: 'Network of majlis & places' },
  'sanad.sources': { id: 'Sumber catatan sanad', en: 'Sanad record sources' },
  'sanad.referenceNote': {
    id: 'Catatan jujur: sanad Suryalaya (Abah Anom) tidak dipegang 165 — beliau dicatat sebagai figur referensi mursyid TQN se-dunia, bukan sebagai simpul sanad majlis 165.',
    en: 'Honest note: the Suryalaya sanad (Abah Anom) is not held by 165 — he is recorded as a reference figure of TQN murshids worldwide, not as a node of the 165 majlis sanad.',
  },
  'sanad.openProfile': { id: 'Buka profil', en: 'Open profile' },
  'home.statSanadNoteRecorded': { id: 'tercatat — tiap mata bersumber', en: 'recorded — every link sourced' },
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function extractJson(s: string): Record<string, string> | null {
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    const obj = JSON.parse(s.slice(start, end + 1))
    return obj && typeof obj === 'object' ? (obj as Record<string, string>) : null
  } catch { return null }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`timeout ${ms}ms`)), ms))])
}

const prompt = (lang: string) =>
  `Translate ALL ${NEW_KEYS.length} interface strings below into ${lang}.\n` +
  `Context: an institutional knowledge-preservation platform (165.web.id) for the TQN Qodiriah Naqsabandiyah Sufi order. Register: respectful, formal, precise. Islamic terms: keep "sanad", "murshid", "TQN", "Suryalaya", "Cikangkung", "165" as-is; translate naturally around them.\n` +
  `Rules: preserve {n} placeholders exactly; do not add keys; return ONLY a valid JSON object with EXACTLY these keys.\n\n` +
  NEW_KEYS.map((k) => `${k}\n  id: ${REF[k].id}\n  en: ${REF[k].en}`).join('\n')

async function main() {
  const zai = await ZAI.create()
  const dir = 'src/data/i18n'
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
  let done = 0
  let failed = 0
  for (const f of files) {
    const code = f.replace('.json', '')
    const outPath = `${dir}/${f}`
    let dict: Record<string, unknown>
    try { dict = JSON.parse(readFileSync(outPath, 'utf8')) } catch { continue }
    const missing = NEW_KEYS.filter((k) => !(k in dict))
    if (missing.length === 0) { done++; continue }

    let ok = false
    for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
      try {
        const completion = await withTimeout(
          zai.chat.completions.create({
            messages: [{ role: 'user', content: prompt(code) }],
            thinking: { type: 'disabled' },
          }),
          120000,
        )
        const obj = extractJson(completion.choices[0]?.message?.content ?? '')
        if (!obj) throw new Error('no json')
        let merged = 0
        for (const k of NEW_KEYS) {
          if (typeof obj[k] === 'string' && obj[k].trim()) { dict[k] = obj[k].trim(); merged++ }
        }
        if (merged < NEW_KEYS.length) throw new Error(`only ${merged}/${NEW_KEYS.length}`)
        writeFileSync(outPath, JSON.stringify(dict, null, 1) + '\n', 'utf8')
        ok = true
        done++
        console.log(`[patch] ${code} ok (+${merged}) total=${done}`)
      } catch (e) {
        console.log(`[patch] ${code} a${attempt}: ${e instanceof Error ? e.message : e}`)
        await sleep(30000)
      }
    }
    if (!ok) { failed++; console.log(`[patch] ${code} FAILED (fallback Indonesia tetap hidup)`) }
    await sleep(4000)
  }
  console.log(`PATCH DONE ok=${done} failed=${failed}`)
}

await main()

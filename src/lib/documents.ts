// 165 — Registry dokumen kanonik (Master Control, Governance, Konstitusi Editorial,
// Kebijakan Sumber, Master Blueprint, Arsitektur Sistem).
// Isi dokumen disalin VERBATIM dari docs/canon/*.md ke dalam bundle (lihat scripts/gen-documents.ts).
// Prinsip Source-First: yang tampil di situs adalah dokumen aslinya, bukan parafrasa.
import { CANON_DOCS, CANON_GENERATED_AT, type CanonDoc } from '@/data/documents/canon'

export interface DocMeta {
  /** stable key for routing/state, e.g. '000' */
  key: string
  /** printed code, e.g. '000', '007', 'BP' */
  code: string
  /** canonical document id, e.g. '165-000' */
  docId: string
  title: string
  subtitle: string
  kind: 'Dokumen Kendali' | 'Tata Kelola' | 'Konstitusi' | 'Kebijakan' | 'Cetak Biru' | 'Arsitektur'
  status: string
  version: string
  /** Indonesian description (2–3 sentences) */
  role: string
  /** position in the 12-layer master architecture (Doc 000 §5) */
  layer: string
}

export type CanonDocument = DocMeta & CanonDoc

const REGISTRY: Array<DocMeta & { file: string }> = [
  {
    key: '000',
    file: '000_165_MASTER_SYSTEM_CONTROL_AND_INDEX_v1_0.md',
    code: '000',
    docId: '165-000',
    title: '165 Master System Control & Index',
    subtitle: 'Dokumen kendali tertinggi tingkat proyek',
    kind: 'Dokumen Kendali',
    status: 'MASTER DRAFT — CONTROL BASELINE',
    version: 'v1.0',
    role: 'Otak kendali seluruh peradaban dokumen 165: north star, prinsip strategis, model kebenaran Tier A–D, arsitektur 144 dokumen dalam 12 lapis, peta sistem, roadmap 10 fase, decision register, dan change control. Semua pekerjaan penting 165 harus dapat dipetakan kembali ke dokumen ini.',
    layer: 'Lintas 12 lapis — kendali tertinggi',
  },
  {
    key: 'blueprint',
    file: '165_MASTER_BLUEPRINT_v1_0.md',
    code: 'BP',
    docId: '165-BP-000001',
    title: '165 Master Blueprint',
    subtitle: 'TQN Qodiriyah wa Naqsyabandiyah Global Knowledge, Heritage & Digital Preservation Platform',
    kind: 'Cetak Biru',
    status: 'FOUNDATIONAL — V1.0',
    version: 'v1.0',
    role: 'Cetak biru awal yang melahirkan 165: master idea, konstitusi editorial, sejarah hulu–hilir, framework hikmah, website sebagai sumber kebenaran, arsitektur media sosial, mesin konten 1→7, keanggotaan, internasionalisasi, jadwal 12 bulan, hingga strategic end state.',
    layer: 'Fondasi — pendahulu Dokumen 000',
  },
  {
    key: 'architecture',
    file: '165_MASTER_SYSTEM_ARCHITECTURE_v1_0.md',
    code: 'ARCH',
    docId: '165-ARCH-000001',
    title: '165 Master System Architecture',
    subtitle: 'Arsitektur 1 + 144 = 145 dokumen master, fase A–L',
    kind: 'Arsitektur',
    status: 'FOUNDATIONAL — V1.0',
    version: 'v1.0',
    role: 'Menjawab pertanyaan arsitektural: berapa banyak dokumen yang harus dibangun dan dalam urutan apa. Menetapkan 12 lapis (Constitutional s.d. Continuity), 12 fase pembangunan A–L, sistem status dokumen, dan aturan kerja Draft → Review → Final → Save → Master Index.',
    layer: 'Fondasi — pendahulu Dokumen 000',
  },
  {
    key: '007',
    file: '007_165_GOVERNANCE_AND_DECISION_RIGHTS_v1_0.md',
    code: '007',
    docId: '165-007',
    title: '165 Governance & Decision Rights',
    subtitle: 'Siapa memutuskan apa, sampai batas mana, dengan akuntabilitas apa',
    kind: 'Tata Kelola',
    status: 'MASTER DRAFT — CONTROL BASELINE',
    version: 'v1.0',
    role: 'Filosofi tata kelola, kekuasaan terpelihara Founder beserta batasnya, badan pemerintahan, model hak putuskan Level 0–4, matriks RACI, konflik kepentingan, kemandirian editorial, tata kelola AI, batas otoritas spiritual, suksesi, dan uji empat kunci tata kelola.',
    layer: 'Layer 01 — Constitutional & Governance',
  },
  {
    key: '008',
    file: '008_165_EDITORIAL_CONSTITUTION_v1_0.md',
    code: '008',
    docId: '165-008',
    title: '165 Editorial Constitution',
    subtitle: 'Konstitusi editorial: sumber sebelum narasi',
    kind: 'Konstitusi',
    status: 'MASTER DRAFT — CONTROL BASELINE',
    version: 'v1.0',
    role: 'Hukum tertulis untuk segala yang ditampilkan 165: non-negotiables editorial, label epistemik E1–E5, hierarki sumber, standar sitasi & kutipan, sejarah yang dipersengketakan, silsilah, konten sakral, karāmāt, transliterasi & terjemahan, foto/audio/video, koreksi & retraction, hingga kontrol halusinasi AI.',
    layer: 'Layer 01 — Constitutional & Governance',
  },
  {
    key: '009',
    file: '009_165_SOURCE_AND_CITATION_POLICY_v1_0.md',
    code: '009',
    docId: '165-009',
    title: '165 Source & Citation Policy',
    subtitle: 'Kebijakan sumber & sitasi: setiap klaim dapat dilacak ke sumbernya',
    kind: 'Kebijakan',
    status: 'MASTER DRAFT — CONTROL BASELINE',
    version: 'v1.0',
    role: 'Anatomi sumber 165: Source ID kanonik, jenis & kelas sumber, objek klaim, model sumber→klaim, status bukti, penilaian sumber, kebijakan sumber primer/oral/arsip keluarga, sitasi publik & researcher mode, source graph & reverse lookup, kebijakan sitasi AI, sampai model database registry sumber.',
    layer: 'Layer 09 — Research & Scholarship',
  },
]

export const DOCUMENTS: readonly CanonDocument[] = REGISTRY.map((meta) => {
  const doc = CANON_DOCS.find((d) => d.file === meta.file)
  if (!doc) throw new Error(`[documents] canonical file missing from bundle: ${meta.file}`)
  const { file: _file, ...rest } = doc
  return { ...meta, ...rest }
})

export function getDocument(key: string): CanonDocument | undefined {
  return DOCUMENTS.find((d) => d.key === key)
}

// ---------- derived stats ----------
export function docWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length
}

export function docHeadings(content: string): number {
  return content.split('\n').filter((l) => /^#{1,3} /.test(l)).length
}

export function readingMinutes(words: number): number {
  return Math.max(2, Math.round(words / 220))
}

// ---------- anchors & TOC ----------
export function anchorSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'bagian'
}

export interface TocItem {
  depth: 1 | 2
  text: string
  id: string
  line: number
}

/** Parse H1/H2 headings (with line numbers) for the table of contents. */
export function docToc(content: string): TocItem[] {
  const toc: TocItem[] = []
  const seen = new Map<string, number>()
  content.split('\n').forEach((raw, i) => {
    const m = /^(#{1,2}) (.+)$/.exec(raw.trimEnd())
    if (!m) return
    const depth = m[1].length as 1 | 2
    const text = m[2].replace(/\s+#+\s*$/, '').trim()
    let id = anchorSlug(text)
    const n = seen.get(id) ?? 0
    seen.set(id, n + 1)
    if (n > 0) id = `${id}-${n + 1}`
    toc.push({ depth, text, id, line: i + 1 })
  })
  return toc
}

/** Nearest heading (id) at or above the given line — used by search results. */
export function headingAboveLine(toc: TocItem[], line: number): string | null {
  let current: string | null = null
  for (const item of toc) {
    if (item.line <= line) current = item.id
    else break
  }
  return current
}

// ---------- full-text search across documents ----------
export interface DocSearchHit {
  docKey: string
  docCode: string
  docTitle: string
  line: number
  anchorId: string | null
  anchorText: string | null
  excerpt: string
}

export function searchDocuments(query: string, perDoc = 6): DocSearchHit[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const hits: DocSearchHit[] = []
  for (const doc of DOCUMENTS) {
    const lines = doc.content.split('\n')
    const toc = docToc(doc.content)
    let count = 0
    for (let i = 0; i < lines.length && count < perDoc; i++) {
      const idx = lines[i].toLowerCase().indexOf(q)
      if (idx === -1) continue
      const anchorId = headingAboveLine(toc, i + 1)
      const anchorText = anchorId ? toc.find((t) => t.id === anchorId)?.text ?? null : null
      const start = Math.max(0, idx - 60)
      const end = Math.min(lines[i].length, idx + q.length + 70)
      const excerpt = `${start > 0 ? '…' : ''}${lines[i].slice(start, end).trim()}${end < lines[i].length ? '…' : ''}`
      hits.push({ docKey: doc.key, docCode: doc.code, docTitle: doc.title, line: i + 1, anchorId, anchorText, excerpt })
      count++
    }
  }
  return hits
}

export function corpusStats() {
  const words = DOCUMENTS.reduce((s, d) => s + docWords(d.content), 0)
  const headings = DOCUMENTS.reduce((s, d) => s + docHeadings(d.content), 0)
  const bytes = DOCUMENTS.reduce((s, d) => s + d.bytes, 0)
  return { documents: DOCUMENTS.length, words, headings, bytes, generatedAt: CANON_GENERATED_AT }
}

export type { CanonDoc }

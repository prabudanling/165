// 165 — Canonical document bundle generator
// Reads docs/canon/*.md (verbatim founder documents) and emits a TypeScript module
// so the documents ship INSIDE the app bundle (no filesystem, no DB — Vercel-safe,
// same resilience doctrine as the heritage snapshot).
//
// Run: bun run docs:gen
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC_DIR = 'docs/canon'
const OUT_FILE = 'src/data/documents/canon.ts'

interface CanonDoc {
  file: string
  bytes: number
  content: string
}

const files = readdirSync(SRC_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort()

const docs: CanonDoc[] = files.map((file) => {
  const content = readFileSync(join(SRC_DIR, file), 'utf8')
  return { file, bytes: Buffer.byteLength(content, 'utf8'), content }
})

const header = `// GENERATED FILE — jangan sunting manual. Regenerate dengan: bun run docs:gen
// Sumber kebenaran: docs/canon/*.md (dokumen kanonik Founder, disalin verbatim)
// Dokumen ini di-bundle ke dalam aplikasi agar selalu tampil tanpa database/filesystem.

export interface CanonDoc {
  file: string
  bytes: number
  content: string
}

export const CANON_DOCS: readonly CanonDoc[] = ${JSON.stringify(docs, null, 2)}

export const CANON_GENERATED_AT = ${JSON.stringify(new Date().toISOString())}
`

writeFileSync(OUT_FILE, header, 'utf8')

const totalBytes = docs.reduce((s, d) => s + d.bytes, 0)
console.log(`✓ ${docs.length} dokumen → ${OUT_FILE} (${(totalBytes / 1024).toFixed(1)} KB)`)
for (const d of docs) console.log(`  · ${d.file} (${(d.bytes / 1024).toFixed(1)} KB)`)

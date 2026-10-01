// 165 — Generator aset brand (vektor → PNG via sharp)
// Menghasilkan ikon crest & banner OG secara deterministik: tajam di semua
// ukuran, on-brand pasti, dan bebas dari kuota API gambar AI.
// Jalankan: bun scripts/gen-brand-assets.ts
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'node:fs'

const PUBLIC = 'public'
mkdirSync(PUBLIC, { recursive: true })

const EMERALD = { hi: '#0a7a53', mid: '#006a47', deep: '#054a33' }
const GOLD = { hi: '#f2d98c', mid: '#d9a93f', deep: '#b5811c' }
const CREAM = '#f9f6ec'

/** Crest "165" — emerald squircle + cincin emas + bintang-8 + angka serif emas. */
function crestSvg(rx = 220): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${EMERALD.hi}"/>
      <stop offset="0.55" stop-color="${EMERALD.mid}"/>
      <stop offset="1" stop-color="${EMERALD.deep}"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${GOLD.hi}"/>
      <stop offset="0.5" stop-color="${GOLD.mid}"/>
      <stop offset="1" stop-color="${GOLD.deep}"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="${rx}" fill="url(#bg)"/>
  <g opacity="0.10" fill="none" stroke="${GOLD.hi}" stroke-width="10">
    <rect x="262" y="262" width="500" height="500"/>
    <rect x="262" y="262" width="500" height="500" transform="rotate(45 512 512)"/>
  </g>
  <circle cx="512" cy="512" r="330" fill="none" stroke="url(#gold)" stroke-width="14"/>
  <circle cx="512" cy="512" r="352" fill="none" stroke="url(#gold)" stroke-width="4" opacity="0.55"/>
  <text x="512" y="512" dy="0.35em" text-anchor="middle"
        font-family="DejaVu Serif" font-weight="bold" font-size="330"
        fill="url(#gold)" letter-spacing="8">165</text>
  <g fill="url(#gold)">
    <circle cx="512" cy="120" r="10"/>
    <circle cx="512" cy="904" r="10"/>
  </g>
</svg>`
}

/** Banner Open Graph 1200×630 — krem berkelas, crest kiri, tipografi kanan. */
function ogSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${GOLD.hi}"/>
      <stop offset="0.5" stop-color="${GOLD.mid}"/>
      <stop offset="1" stop-color="${GOLD.deep}"/>
    </linearGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbf8f0"/>
      <stop offset="1" stop-color="#efe9d6"/>
    </linearGradient>
    <linearGradient id="crestbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${EMERALD.hi}"/>
      <stop offset="0.55" stop-color="${EMERALD.mid}"/>
      <stop offset="1" stop-color="${EMERALD.deep}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g opacity="0.06" fill="none" stroke="${GOLD.mid}" stroke-width="6">
    <rect x="880" y="60" width="330" height="330"/>
    <rect x="880" y="60" width="330" height="330" transform="rotate(45 1045 225)"/>
  </g>
  <rect x="0" y="0" width="1200" height="10" fill="url(#gold)"/>
  <rect x="0" y="620" width="1200" height="10" fill="url(#gold)"/>

  <!-- crest emblem (scaled) -->
  <g transform="translate(96,100) scale(0.42)">
    <rect width="1024" height="1024" rx="220" fill="url(#crestbg)"/>
    <g opacity="0.10" fill="none" stroke="${GOLD.hi}" stroke-width="10">
      <rect x="262" y="262" width="500" height="500"/>
      <rect x="262" y="262" width="500" height="500" transform="rotate(45 512 512)"/>
    </g>
    <circle cx="512" cy="512" r="330" fill="none" stroke="url(#gold)" stroke-width="14"/>
    <circle cx="512" cy="512" r="352" fill="none" stroke="url(#gold)" stroke-width="4" opacity="0.55"/>
    <text x="512" y="512" dy="0.35em" text-anchor="middle" font-family="DejaVu Serif" font-weight="bold" font-size="330" fill="url(#gold)" letter-spacing="8">165</text>
    <g fill="url(#gold)"><circle cx="512" cy="120" r="10"/><circle cx="512" cy="904" r="10"/></g>
  </g>

  <!-- tipografi -->
  <text x="545" y="188" font-family="DejaVu Serif" font-weight="bold" font-size="130" fill="url(#gold)" letter-spacing="4">165</text>
  <rect x="545" y="224" width="220" height="6" rx="3" fill="url(#gold)"/>
  <text x="545" y="292" font-family="DejaVu Sans" font-weight="bold" font-size="27" fill="#0e3d2c" letter-spacing="1">TQN QODIRIYAH WA NAQSYABANDIYAH</text>
  <text x="545" y="340" font-family="DejaVu Sans" font-size="25" fill="#41584e">Knowledge · Heritage · Digital Preservation</text>
  <rect x="545" y="378" width="480" height="2" rx="1" fill="#d8cfb2"/>
  <text x="545" y="446" font-family="DejaVu Sans" font-size="27" fill="${GOLD.deep}" font-weight="bold">165.web.id</text>
  <text x="545" y="486" font-family="DejaVu Sans" font-size="22" fill="#6f7a72">178 bahasa · dengan sumber, bukan klaim</text>
  <text x="545" y="520" font-family="DejaVu Sans" font-size="22" fill="#6f7a72">with sources, not claims — Bahasa Indonesia by default</text>
</svg>`
}

async function main() {
  const crest = Buffer.from(crestSvg(220))
  const crestFull = Buffer.from(crestSvg(0)) // full-bleed untuk apple touch icon

  const jobs: Array<[string, sharp.Sharp]> = [
    [`${PUBLIC}/icon-512.png`, sharp(crest).resize(512, 512)],
    [`${PUBLIC}/icon-192.png`, sharp(crest).resize(192, 192)],
    [`${PUBLIC}/icon-32.png`, sharp(crest).resize(32, 32)],
    [`${PUBLIC}/apple-touch-icon.png`, sharp(crestFull).resize(180, 180)],
    [`${PUBLIC}/og-165.png`, sharp(Buffer.from(ogSvg())).resize(1200, 630)],
  ]
  for (const [out, pipeline] of jobs) {
    const buf = await pipeline.png({ compressionLevel: 9 }).toBuffer()
    writeFileSync(out, buf)
    console.log(`✓ ${out} (${(buf.length / 1024).toFixed(1)} KB)`)
  }
  console.log('brand assets selesai.')
}

main().catch((e) => {
  console.error('FATAL', e)
  process.exit(1)
})

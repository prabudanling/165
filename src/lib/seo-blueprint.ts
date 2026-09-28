// 165 — SEO & Page Architecture blueprint (single source of truth for the SEO section)
// Doctrine: every planned page is a TEMPLATE + ENTITY type with structured data,
// stable URL + Global ID, trilingual hreflang, and publication GATES (no fabrication).

import type { EvidenceLevelKey, VerificationStatusKey } from '@/lib/165'

// ---------- template catalog ----------

export type TemplateKind =
  | 'person' | 'term' | 'book' | 'event' | 'place'
  | 'institution' | 'sanad' | 'collection' | 'article' | 'faq'

export interface TemplateMeta {
  kind: TemplateKind
  label: string          // Indonesian label
  labelEn: string
  path: string           // planned URL path
  schema: string         // JSON-LD @type
  count: number          // phase-1 planned pages
  why: string            // why search engines reward this page type
  gates: string[]        // publication gates (honesty policies shown in UI)
}

export const TEMPLATE_CATALOG: TemplateMeta[] = [
  {
    kind: 'person',
    label: 'Profil Tokoh',
    labelEn: 'Person Profile',
    path: '/person/',
    schema: 'Person',
    count: 250,
    why: 'Nama tokoh adalah kueri pencarian paling umum tentang tarekat: periode, guru, murid, karya — semua terjawab dalam satu halaman biografis terstruktur.',
    gates: [
      'Bidang tokoh hidup dibatasi kebijakan privasi',
      'Tanggal lahir/wafat hanya tampil setelah kolasi dua sumber',
    ],
  },
  {
    kind: 'term',
    label: 'Glossarium Istilah',
    labelEn: 'Glossary Term',
    path: '/glossary/',
    schema: 'DefinedTerm',
    count: 300,
    why: 'Glossarium 300 istilah menangkap kueri "apa itu X" — konten evergreen paling stabil yang menarik pembaca baru setiap hari.',
    gates: ['Formularium antar-cabang tidak digeneralisasi'],
  },
  {
    kind: 'book',
    label: 'Kitab & Naskah',
    labelEn: 'Book / Manuscript',
    path: '/library/',
    schema: 'Book',
    count: 150,
    why: 'Kitab klasik dicari dengan judul Arab dan latin sekaligus — satu halaman, dua pintu kueri, dengan penulis tersambung sebagai entitas Person.',
    gates: ['Kutipan teks hanya setelah edisi rujukan ditetapkan'],
  },
  {
    kind: 'event',
    label: 'Peristiwa & Linimasa',
    labelEn: 'Event',
    path: '/timeline/',
    schema: 'Event',
    count: 100,
    why: 'Peristiwa dengan tanggal terstruktur memenuhi panel ringkasan mesin pencari dan kueri linimasa sejarah tarekat.',
    gates: ['Akun tradisional tampil dengan label, tidak pernah sebagai fakta'],
  },
  {
    kind: 'place',
    label: 'Tempat & Lokasi',
    labelEn: 'Place',
    path: '/atlas/',
    schema: 'Place',
    count: 60,
    why: 'Tempat menghubungkan sejarah dengan geografi — menangkap kueri lokal dan perjalanan studi ziarah.',
    gates: ['Koordinat dari data geografis terverifikasi'],
  },
  {
    kind: 'institution',
    label: 'Profil Institusi',
    labelEn: 'Institution',
    path: '/institution/',
    schema: 'Organization',
    count: 80,
    why: 'Profil pesantren/khanaqah menangkap kueri nama institusi, alamat, dan pengasuh — simpul direktori global.',
    gates: ['Profil hanya setelah konfirmasi institusi'],
  },
  {
    kind: 'sanad',
    label: 'Halaman Sanad',
    labelEn: 'Sanad Chain',
    path: '/sanad/',
    schema: 'ItemList',
    count: 40,
    why: 'Rantai sanad ditampilkan dengan peringatan metodologis — kejujuran metodologi adalah sinyal kepercayaan terkuat bagi domain pengetahuan.',
    gates: [
      'Peringatan metodologis wajib sebelum konten',
      'Node hilang ditampilkan "menunggu kolasi" — tidak pernah diisi',
    ],
  },
  {
    kind: 'collection',
    label: 'Koleksi Arsip',
    labelEn: 'Collection',
    path: '/archive/',
    schema: 'CollectionPage',
    count: 30,
    why: 'Katalog koleksi dengan daftar item membuat arsip ditemukan peneliti, bukan hanya pembaca umum.',
    gates: ['Item arsip tampil sesuai izin akses'],
  },
  {
    kind: 'article',
    label: 'Artikel Kebijakan & Riset',
    labelEn: 'Article',
    path: '/research/',
    schema: 'Article',
    count: 120,
    why: 'Artikel kebijakan dan riset membangun topical authority bagi seluruh domain — mesin pencari mengenali 165 sebagai sumber, bukan agregator.',
    gates: ['Sitasi formal dengan identifier sumber'],
  },
  {
    kind: 'faq',
    label: 'Ask 165 (FAQ)',
    labelEn: 'FAQ',
    path: '/ask/',
    schema: 'FAQPage',
    count: 70,
    why: 'FAQ dengan skema FAQPage memenuhi rich results "people also ask" — pintu masuk terbesar bagi audiens baru.',
    gates: ['Jawaban ditinjau dewan sebelum FAQPage schema aktif'],
  },
]

export const PAGE_MAP_TOTAL = TEMPLATE_CATALOG.reduce((s, t) => s + t.count, 0) // 1200

// release phases (cumulative honesty: pages ship as sources allow)
export const RELEASE_PHASES = [
  { phase: 'Fase 1', title: 'Fondasi', detail: 'glossarium inti + tokoh + FAQ', pages: 150 },
  { phase: 'Fase 2', title: 'Perpustakaan & Linimasa', detail: 'kitab, peristiwa, tokoh lanjutan', pages: 350 },
  { phase: 'Fase 3', title: 'Peta & Institusi', detail: 'tempat, institusi, artikel, sanad', pages: 215 },
  { phase: 'Fase 4', title: 'Kelengkapan', detail: 'sisa katalog hingga 1.200+', pages: 485 },
]

// ---------- URL index (planned sitemap, rendered by UrlDirectory) ----------

export interface UrlRow {
  path: string
  kind: TemplateKind
  schema: string
  priority: number
  lastmod: string
}

const PRIORITY: Record<TemplateKind, number> = {
  person: 0.9, term: 0.9, book: 0.8, event: 0.8, place: 0.7,
  institution: 0.8, sanad: 0.7, collection: 0.6, article: 0.8, faq: 0.7,
}

const LASTMOD_POOL = [
  '2025-10-02', '2025-10-19', '2025-11-04', '2025-11-20',
  '2025-12-08', '2025-12-27', '2026-01-09', '2026-01-22',
]

// real seed slugs appear first; the rest are clearly synthetic (no fabricated names)
export function generateUrlIndex(): UrlRow[] {
  const rows: UrlRow[] = []
  for (const t of TEMPLATE_CATALOG) {
    const entity = PREVIEW_ENTITIES[t.kind]
    rows.push({
      path: `${t.path}${entity.slug}`,
      kind: t.kind,
      schema: t.schema,
      priority: PRIORITY[t.kind],
      lastmod: entity.updated,
    })
    for (let i = 1; i < t.count; i++) {
      const n = i + 1
      rows.push({
        path: `${t.path}${t.kind}-${String(n).padStart(6, '0')}`,
        kind: t.kind,
        schema: t.schema,
        priority: PRIORITY[t.kind],
        lastmod: LASTMOD_POOL[i % LASTMOD_POOL.length],
      })
    }
  }
  return rows
}

// ---------- preview entities (honest demo records for template gallery) ----------

export interface PreviewFact { label: string; value: string }
export interface PreviewSection { heading: string; body: string }
export interface RelatedLink { title: string; kind: TemplateKind }
export interface SanadNode { name: string; role: string; pending?: boolean }

export interface PreviewEntity {
  kind: TemplateKind
  globalId: string
  slug: string
  name: string
  arabic?: string
  subtitle: string
  dates?: string
  status: VerificationStatusKey
  level: EvidenceLevelKey
  updated: string
  summary: string
  facts: PreviewFact[]
  sections: PreviewSection[]
  related: RelatedLink[]
  sanadNodes?: SanadNode[]
  faqs?: { q: string; a: string }[]
  byline?: string
  demoNote: string
}

export const PREVIEW_ENTITIES: Record<TemplateKind, PreviewEntity> = {
  person: {
    kind: 'person',
    globalId: '165-PERSON-000001',
    slug: 'abdul-qadir-al-jilani',
    name: 'ʿAbd al-Qādir al-Jīlānī',
    arabic: 'عبد القادر الجيلاني',
    subtitle: 'Titik pangkal silsilah Qadiriyyah — Baghdad',
    dates: '± 1077 – 1166 M (± 470 – 561 H)',
    status: 'DOCUMENTED',
    level: 'C',
    updated: '2025-11-20',
    summary:
      'Tokoh tasawuf Baghdad yang dalam sejarah tarekat dikenal sebagai titik pangkal silsilah Qadiriyyah. Entri ini memisahkan fakta biografis yang terdokumentasi dari gelar dan kisah kehormatan yang beredar sebagai tradisi.',
    facts: [
      { label: 'Nama lengkap', value: 'Abū Muḥammad ʿAbd al-Qādir ibn Abī Sāliḥ al-Jīlī / al-Kīlānī' },
      { label: 'Lahir', value: '± 1077 M, Jīlān (Persia) — tanggal bervariasi antar sumber' },
      { label: 'Wafat', value: '1166 M, Baghdad' },
      { label: 'Makam', value: 'Baghdad — kompleks yang dinamai dengan namanya' },
      { label: 'Tarekat', value: 'Qadiriyyah (dinamai setelah namanya)' },
      { label: 'Gelar kehormatan', value: 'al-Ghawth al-Aʿẓam — tradisional, bukan gelar resmi' },
    ],
    sections: [
      {
        heading: 'Peran dalam silsilah TQN',
        body: 'Dalam sebagian besar silsilah TQN, nama beliau menandai cabang Qadiriyyah yang kemudian dipadukan dengan cabang Naqshbandiyyah. Bentuk dan tanggal penyatuan ini bervariasi antar riwayat — 165 menampilkan setiap versi silsilah terpisah, tanpa penggabungan.',
      },
      {
        heading: 'Kehati-hatian sumber',
        body: 'Banyak kumpulan khotbah dan ucapan dinisbatkan secara populer kepada beliau. Sebelum terbit di produksi, setiap atribusi melewati source review terhadap edisi teks yang teridentifikasi.',
      },
    ],
    related: [
      { title: 'ʿAwārif al-Maʿārif', kind: 'book' },
      { title: 'Banten', kind: 'place' },
      { title: 'Silsilah Naqshbandiyyah', kind: 'sanad' },
    ],
    demoNote: 'Entri contoh untuk pratinjau template — bukan entri produksi. Tanda "±" adalah ketidakpastian yang disengaja.',
  },

  book: {
    kind: 'book',
    globalId: '165-BOOK-000001',
    slug: 'awarif-al-marif',
    name: 'ʿAwārif al-Maʿārif',
    arabic: 'عوارف المعارف',
    subtitle: 'Manual adab tasawuf karya ʿUmar al-Suhrawardī (w. 1234 M)',
    status: 'DOCUMENTED',
    level: 'C',
    updated: '2025-12-08',
    summary:
      'Karya klasik tentang adab dan metode tarekat yang menjadi rujukan lintas silsilah, termasuk tradisi yang melatarbelakangi TQN. Halaman kitab di 165 selalu mencantumkan edisi rujukan sebelum kutipan dipublikasikan.',
    facts: [
      { label: 'Penulis', value: 'ʿUmar ibn Muḥammad al-Suhrawardī (entitas tersambung)' },
      { label: 'Bahasa', value: 'Arab' },
      { label: 'Struktur', value: '± 75 bab (bervariasi antar edisi)' },
      { label: 'Edisi rujukan', value: 'menunggu penetapan dewan naskah' },
      { label: 'Peran', value: 'adab & metode suluk' },
    ],
    sections: [
      {
        heading: 'Mengapa kitab ini penting bagi 165',
        body: 'Kitab manual adalah penghubung teori dan amalan: adab murid kepada guru, adab dzikr, dan etika tarekat. Halaman kitab menjadi simpul yang menyambungkan tokoh, istilah, dan praktik dalam mesh tautan internal.',
      },
    ],
    related: [
      { title: 'ʿAbd al-Qādir al-Jīlānī', kind: 'person' },
      { title: 'Suluk', kind: 'term' },
      { title: 'Khatm', kind: 'term' },
    ],
    demoNote: 'Jumlah bab ditandai "±" karena bervariasi antar edisi — angka final menunggu kolasi edisi.',
  },

  term: {
    kind: 'term',
    globalId: '165-TERM-000001',
    slug: 'khatm',
    name: 'Khatm',
    arabic: 'ختم',
    subtitle: 'Dzikr jamaah tersusun dalam TQN',
    status: 'DOCUMENTED',
    level: 'C',
    updated: '2025-10-19',
    summary:
      'Ibadah dzikir jamaah yang dibaca berurutan sesuai formularium tertentu. Dalam TQN, khatm menjadi amalan pokok jamaah — namun bentuk susunannya bervariasi antar cabang, dan 165 mencatat variasi tersebut tanpa menyatukannya.',
    facts: [
      { label: 'Jenis entri', value: 'Glossarium' },
      { label: 'Bidang', value: 'amalan tarekat' },
      { label: 'Makna harfiyah', value: 'penyempurnaan / pembacaan lengkap' },
      { label: 'Variasi antar cabang', value: 'ya — formularium tidak digeneralisasi' },
    ],
    sections: [
      {
        heading: 'Catatan metodologis glossarium',
        body: 'Glossarium 165 memberi definisi paling umum yang disepakati lintas literatur, lalu menandai pembedaan penggunaan antar cabang sebagai bidang terbuka. Pendekatan ini membuat halaman glossarium aman untuk dikutip sejak hari pertama.',
      },
    ],
    related: [
      { title: 'Wird', kind: 'term' },
      { title: 'Talqin', kind: 'term' },
      { title: 'Silsilah Naqshbandiyyah', kind: 'sanad' },
    ],
    demoNote: 'Definisi umum untuk demonstrasi template glossarium.',
  },

  event: {
    kind: 'event',
    globalId: '165-EVENT-000001',
    slug: 'dua-silsilah-tqn',
    name: 'Penyatuan dua silsilah dalam TQN',
    subtitle: 'Qadiriyyah + Naqshbandiyyah dalam satu amalan',
    dates: 'Abad 19 – awal abad 20 M (rentang riwayat)',
    status: 'TRADITIONAL_ACCOUNT',
    level: 'D',
    updated: '2025-11-04',
    summary:
      'Riwayat tradisional menempatkan lahirnya amalan TQN sebagai perpaduan dzikir jahr Qadiriyyah dan dzikir khafi Naqshbandiyyah. Bentuk, waktu, dan tokoh pelopornya bervariasi antar riwayat komunitas — sehingga entri ini disajikan sebagai akun tradisional, bukan fakta final.',
    facts: [
      { label: 'Jenis', value: 'peristiwa silsilah amalan' },
      { label: 'Rentang', value: 'abad 19 – awal 20 M (bervariasi)' },
      { label: 'Wilayah', value: 'Nusantara (bervariasi antar riwayat)' },
      { label: 'Sumber utama', value: 'riwayat lisan & tradisi jamaah (Level D)' },
    ],
    sections: [
      {
        heading: 'Mengapa entri ini tidak ditegakkan sebagai fakta',
        body: 'Aturan sejarah kritis 165: tradisi lisan dipertahankan sebagai testimoni. Jika dua riwayat komunitas memberi tokoh pelopor yang berbeda, keduanya ditampilkan berdampingan dengan statusnya masing-masing — dan halaman ini diperbarui tercatat saat sumber primer ditemukan, bukan diganti senyap.',
      },
    ],
    related: [
      { title: 'Silsilah Naqshbandiyyah', kind: 'sanad' },
      { title: 'Banten', kind: 'place' },
      { title: 'Khatm', kind: 'term' },
    ],
    demoNote: 'Demonstrasi penanganan akun tradisional pada template peristiwa.',
  },

  place: {
    kind: 'place',
    globalId: '165-PLACE-000001',
    slug: 'banten',
    name: 'Banten',
    subtitle: 'Wilayah penting dalam sejarah TQN di Nusantara',
    status: 'DOCUMENTED',
    level: 'C',
    updated: '2025-10-02',
    summary:
      'Provinsi di ujung barat Pulau Jawa yang dalam riwayat tarekat Nusantara menjadi salah satu pusat penting perkembangan TQN. Halaman tempat di 165 menghubungkan geografi dengan peristiwa, institusi, dan tokoh yang terdokumentasi di wilayah tersebut.',
    facts: [
      { label: 'Wilayah', value: 'Pulau Jawa bagian barat, Indonesia' },
      { label: 'Peran dalam TQN', value: 'pusat perkembangan historis (kolasi sumber berjalan)' },
      { label: 'Entitas tersambung', value: 'institusi & peristiwa di wilayah ini' },
    ],
    sections: [
      {
        heading: 'Geografi & sejarah',
        body: 'Halaman tempat bukan halaman wisata: ia adalah simpul antara "di mana" dan "siapa serta kapan". Setiap klaim geografis tentang sejarah tarekat membawa status dan level buktinya sendiri.',
      },
    ],
    related: [
      { title: 'Penyatuan dua silsilah', kind: 'event' },
      { title: 'Pesantren TQN (contoh)', kind: 'institution' },
    ],
    demoNote: 'Koordinat & batas wilayah menyusul dari data geografis terverifikasi.',
  },

  institution: {
    kind: 'institution',
    globalId: '165-INST-000001',
    slug: 'pesantren-tqn-contoh',
    name: 'Pesantren TQN (Profil Contoh)',
    subtitle: 'Template profil institusi — menunggu entri resmi',
    status: 'UNVERIFIED',
    level: 'F',
    updated: '2026-01-09',
    summary:
      'Profil contoh yang menunjukkan bagaimana sebuah pesantren TQN akan tampil: identitas, sejarah pendirian dengan sumbernya, amalan yang diajarkan, silsilah pengasuh, dan fasilitas arsip. Tidak ada nama nyata yang dipakai sebelum sumber resmi tersedia.',
    facts: [
      { label: 'Jenis', value: 'pesantren tarekat (contoh)' },
      { label: 'Status', value: 'placeholder — menunggu pengajuan data komunitas' },
      { label: 'Data dibutuhkan', value: 'dokumen pendirian · silsilah pengasuh · izin amalan' },
    ],
    sections: [
      {
        heading: 'Kebijakan profil institusi',
        body: '165 tidak membuat profil institusi sebelum ada dokumen atau konfirmasi dari pihak institusi itu sendiri. Halaman ini hanya mendemonstrasikan struktur halaman bagi mesin pencari — dan ditarik dari daftar contoh begitu entri nyata pertama terbit.',
      },
    ],
    related: [
      { title: 'Banten', kind: 'place' },
      { title: 'Ask 165 — Pertanyaan Umum', kind: 'faq' },
    ],
    demoNote: 'Placeholder eksplisit — tidak menyebut institusi nyata.',
  },

  sanad: {
    kind: 'sanad',
    globalId: '165-SANAD-000001',
    slug: 'silsilah-naqshbandiyyah',
    name: 'Silsilah Naqshbandiyyah — Segmen Awal',
    arabic: 'السلسلة النقشبندية',
    subtitle: 'Rantai transmisi rohani — disajikan sebagai akun tradisional',
    status: 'TRADITIONAL_ACCOUNT',
    level: 'D',
    updated: '2025-12-27',
    summary:
      'Segmen awal silsilah Naqshbandiyyah sebagaimana umum diriwayatkan dalam literatur tarekat. Rantai lengkap bervariasi antar kitab dan antar cabang; 165 menampilkan setiap varian terpisah dan tidak pernah menggabungkan, melengkapi, atau memprediksi tautan yang tidak terdokumentasi.',
    sanadNodes: [
      { name: 'Nabi Muhammad ﷺ', role: 'sumber transmisi' },
      { name: 'Abū Bakr aṣ-Ṣiddīq', role: 'pewaris pertama' },
      { name: 'Salmān al-Fārisī', role: 'pewaris' },
      { name: 'Qāsim ibn Muḥammad', role: 'pewaris' },
      { name: 'Jaʿfar aṣ-Ṣādiq', role: 'pewaris' },
      { name: 'Bāyazīd al-Bisṭāmī', role: 'pewaris' },
      { name: 'Abū al-Ḥasan al-Kharqānī', role: 'pewaris' },
      { name: 'Abū ʿAlī al-Fārmadī', role: 'pewaris' },
      { name: '— segmen lanjutan —', role: 'menunggu kolasi naskah', pending: true },
      { name: 'Bahāʾ ad-Dīn Naqshband', role: 'eponim cabang' },
    ],
    facts: [
      { label: 'Jenis', value: 'silsilah rohani (sanad)' },
      { label: 'Sumber rujukan', value: 'literatur hagiografi Naqshbandi (Level D)' },
      { label: 'Status', value: 'TRADITIONAL ACCOUNT — varian ditampilkan terpisah' },
      { label: 'Kebijakan', value: 'tidak digabung · tidak dilengkapi · tidak diprediksi' },
    ],
    sections: [
      {
        heading: 'Sanad safety di 165',
        body: 'Halaman sanad selalu dibuka dengan peringatan metodologis sebelum konten, karena kesalahan pembacaan sanad bukan sekadar kesalahan data — ia menyentuh legitimasi transmisi. Setiap node akan tersambung ke entri tokohnya begitu entri tersebut terbit.',
      },
    ],
    related: [
      { title: 'ʿAbd al-Qādir al-Jīlānī', kind: 'person' },
      { title: 'Talqin', kind: 'term' },
      { title: 'Penyatuan dua silsilah', kind: 'event' },
    ],
    demoNote: 'Node "—" disengaja: bagian yang belum terkolasi tidak pernah diisi diam-diam.',
  },

  collection: {
    kind: 'collection',
    globalId: '165-COLL-000001',
    slug: 'koleksi-khatm-wirid',
    name: 'Koleksi Khatm & Wirid (Contoh)',
    subtitle: 'Template koleksi arsip — katalog menunggu deposit',
    status: 'UNVERIFIED',
    level: 'F',
    updated: '2026-01-22',
    summary:
      'Koleksi contoh yang mendemonstrasikan katalog arsip: daftar item dengan izin akses, provenance, dan status digitalisasi. Jumlah item saat ini nol — bukan karena arsip tidak ada, tetapi karena deposit sumber sedang menunggu.',
    facts: [
      { label: 'Jumlah item', value: '0 — menunggu arsip dari Founder & jamaah' },
      { label: 'Kebijakan akses', value: 'per item, ditetapkan pemilik sumber' },
      { label: 'Digitalisasi', value: 'rencana 3-2-1 preservation' },
    ],
    sections: [
      {
        heading: 'Arsip yang jujur sejak halaman pertama',
        body: 'Halaman koleksi tidak pernah memamerkan item yang belum ada. Kondisi "katalog menunggu" ditampilkan terbuka — dan justru menjadi ajakan bagi pemilik manuskrip untuk mendepositkannya.',
      },
    ],
    related: [
      { title: 'Pesantren TQN (contoh)', kind: 'institution' },
      { title: 'Kebijakan sanad', kind: 'article' },
    ],
    demoNote: 'Demonstrasi template koleksi dengan katalog kosong yang jujur.',
  },

  article: {
    kind: 'article',
    globalId: '165-ARTICLE-000001',
    slug: 'kebijakan-sanad',
    name: 'Mengapa Sanad Tidak Pernah Diciptakan, Digabung, atau Diprediksi',
    subtitle: 'Kebijakan inti 165 tentang integritas silsilah',
    status: 'DOCUMENTED',
    level: 'B',
    updated: '2025-11-20',
    byline: 'Dewan Editorial 165',
    summary:
      'Kebijakan editorial yang melarang penciptaan, penggabungan, atau prediksi rantai sanad dalam sistem apa pun di 165 — termasuk oleh AI. Berlaku pada data, API, pencarian, dan pengalaman "Ask 165".',
    facts: [
      { label: 'Jenis', value: 'kebijakan institusional' },
      { label: 'Dasar', value: 'Master Build Directive 165 (165-SRC-000001)' },
      { label: 'Berlaku untuk', value: 'data · API · AI · tampilan publik' },
      { label: 'Perubahan', value: 'hanya oleh Founder melalui dewan' },
    ],
    sections: [
      {
        heading: 'Aturan',
        body: 'Tiga larangan mutlak: (1) sanad tidak boleh diciptakan tanpa dokumen; (2) dua varian sanad tidak boleh digabung menjadi satu; (3) tautan yang hilang tidak boleh diprediksi — termasuk oleh mesin. Yang belum diketahui ditulis "BELUM TERVERIFIKASI".',
      },
      {
        heading: 'Mengapa ini menjadi sinyal kepercayaan',
        body: 'Mesin pencari modern dan pengguna semakin menilai kejujuran institusi. Halaman kebijakan yang tegas, dapat dikutip, dan konsisten dengan praktik adalah salah satu sinyal E-E-A-T terkuat yang bisa dimiliki domain pengetahuan.',
      },
    ],
    related: [
      { title: 'Silsilah Naqshbandiyyah', kind: 'sanad' },
      { title: 'Ask 165 — Pertanyaan Umum', kind: 'faq' },
    ],
    demoNote: 'Level B — sumber institusional resmi 165.',
  },

  faq: {
    kind: 'faq',
    globalId: '165-FAQ-000001',
    slug: 'pertanyaan-umum',
    name: 'Ask 165 — Pertanyaan Umum',
    subtitle: 'Halaman FAQ dengan skema FAQPage',
    status: 'DOCUMENTED',
    level: 'B',
    updated: '2026-01-09',
    summary:
      'Halaman tanya-jawab inti yang menjelaskan apa itu 165, cara kerja verifikasi, dan kebijakan bahasa — disusun agar mesin pencari menampilkannya pada rich results "people also ask".',
    faqs: [
      {
        q: 'Apa itu 165?',
        a: '165 adalah platform pengetahuan, warisan, dan preservasi digital global untuk TQN Qodiriah Naqsabandiyah: arsip, direktori, peta pengetahuan, dan sistem kutipan dalam satu infrastruktur.',
      },
      {
        q: 'Bagaimana 165 memverifikasi informasi?',
        a: 'Setiap pernyataan membawa level bukti (A–F) dan status verifikasi (mis. VERIFIED, DOCUMENTED, TRADITIONAL ACCOUNT). Alurnya: SUBMITTED → SCREENING → EDITORIAL REVIEW → SOURCE REVIEW → VERIFICATION → PUBLISHED.',
      },
      {
        q: 'Mengapa ada informasi yang ditampilkan "BELUM TERVERIFIKASI"?',
        a: 'Karena bagi 165, ketidakpastian yang jujur lebih baik daripada kepastian yang direkayasa. Yang belum diketahui ditandai terbuka — tidak pernah diisi diam-diam.',
      },
      {
        q: 'Bisakah saya mengirimkan sejarah keluarga kiai atau jamaah?',
        a: 'Bisa — melalui halaman Contribute. Kiriman menerima nomor referensi 165-SUB-… dan melewati alur review penuh. Kontribusi ≠ publikasi.',
      },
      {
        q: 'Dalam bahasa apa 165 tersedia?',
        a: 'Bahasa Indonesia, Inggris, dan Arab — satu entitas, satu sumber, tiga pengalaman bahasa dengan hreflang yang benar.',
      },
    ],
    facts: [
      { label: 'Jenis', value: 'FAQ — pengetahuan dasar' },
      { label: 'Skema', value: 'FAQPage (rich results)' },
      { label: 'Pemutakhiran', value: 'menyusul keputusan dewan' },
    ],
    sections: [],
    related: [
      { title: 'Kebijakan sanad', kind: 'article' },
      { title: 'Pesantren TQN (contoh)', kind: 'institution' },
    ],
    demoNote: 'Contoh FAQPage — jawaban ringkas untuk rich results.',
  },
}

// ---------- JSON-LD builders ----------

const BASE_URL = 'https://165.web.id'

export function buildJsonLd(e: PreviewEntity): Record<string, unknown> {
  const url = `${BASE_URL}${TEMPLATE_CATALOG.find((t) => t.kind === e.kind)!.path}${e.slug}`
  const crumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: TEMPLATE_CATALOG.find((t) => t.kind === e.kind)!.label },
      { '@type': 'ListItem', position: 3, name: e.name, item: url },
    ],
  }
  let main: Record<string, unknown>
  switch (e.kind) {
    case 'person':
      main = {
        '@type': 'Person',
        name: e.name,
        description: e.summary,
        identifier: e.globalId,
        ...(e.arabic ? { alternateName: e.arabic } : {}),
      }
      break
    case 'book':
      main = {
        '@type': 'Book',
        name: e.name,
        description: e.summary,
        identifier: e.globalId,
        inLanguage: 'ar',
        author: { '@type': 'Person', name: 'ʿUmar ibn Muḥammad al-Suhrawardī' },
      }
      break
    case 'term':
      main = {
        '@type': 'DefinedTerm',
        name: e.name,
        description: e.summary,
        identifier: e.globalId,
        inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'Glossarium 165', url: `${BASE_URL}/glossary/` },
      }
      break
    case 'event':
      main = {
        '@type': 'Event',
        name: e.name,
        description: e.summary,
        identifier: e.globalId,
        eventStatus: 'https://schema.org/EventScheduled',
      }
      break
    case 'place':
      main = { '@type': 'Place', name: e.name, description: e.summary, identifier: e.globalId }
      break
    case 'institution':
      main = { '@type': 'Organization', name: e.name, description: e.summary, identifier: e.globalId }
      break
    case 'sanad':
      main = {
        '@type': 'ItemList',
        name: e.name,
        description: e.summary,
        identifier: e.globalId,
        itemListElement: (e.sanadNodes ?? []).map((n, i) => ({
          '@type': 'ListItem', position: i + 1, name: n.name,
          ...(n.pending ? { description: 'menunggu kolasi naskah' } : {}),
        })),
      }
      break
    case 'collection':
      main = {
        '@type': 'CollectionPage',
        name: e.name,
        description: e.summary,
        identifier: e.globalId,
        hasPart: [],
      }
      break
    case 'article':
      main = {
        '@type': 'Article',
        headline: e.name,
        description: e.summary,
        identifier: e.globalId,
        author: { '@type': 'Organization', name: e.byline ?? 'Dewan Editorial 165' },
        publisher: { '@type': 'Organization', name: '165 — TQN Qodiriah Naqsabandiyah' },
      }
      break
    case 'faq':
      main = {
        '@type': 'FAQPage',
        identifier: e.globalId,
        mainEntity: (e.faqs ?? []).map((f) => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
      break
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      crumb,
      { ...main, url, dateModified: e.updated, isPartOf: { '@type': 'WebSite', name: '165', url: `${BASE_URL}/` } },
    ],
  }
}

// ---------- SEO checklist ----------

export const CHECKLIST_BASE: string[] = [
  '<title> unik ≤ 60 karakter',
  'Meta description 140–160 karakter',
  'Satu <h1> = nama entitas',
  'URL stabil: slug manusiawi + Global ID',
  'rel=canonical pada setiap halaman',
  'BreadcrumbList JSON-LD',
  'Markah semantik (article · header · aside · time)',
  'Skema inti JSON-LD sesuai tipe halaman',
  '≥ 5 tautan internal ke entitas tersambung',
  'Mobile-first · target sentuh ≥ 44px',
  'hreflang id · en · ar',
  'Byline + dateModified (E-E-A-T)',
]

// ---------- derived meta for SERP simulation ----------

export function metaTitle(e: PreviewEntity): string {
  const m = TEMPLATE_CATALOG.find((t) => t.kind === e.kind)!
  return `${e.name} — ${m.label} | 165`
}
export function metaDescription(e: PreviewEntity): string {
  const d = e.summary.replace(/\s+/g, ' ').trim()
  return d.length > 158 ? `${d.slice(0, 155).trimEnd()}…` : d
}

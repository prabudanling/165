/**
 * 165 — SEED LAYER
 *
 * Epistemic policy (NON-NEGOTIABLE, per Master Build Directive):
 *  - The ONLY accessible primary source is the "165 Website Master Build
 *    Directive" → seeded as 165-SRC-000001 (Level B, DOCUMENTED).
 *  - Everything else is seeded as TRADITIONAL_ACCOUNT / UNVERIFIED with an
 *    explicit note that scholarly citations are pending source review.
 *  - NO sanad chains are created. NO teacher-student links are inferred.
 *  - NO books, manuscripts or media are fabricated. Those registries ship
 *    empty by design, awaiting the Founder's archive.
 *  - Tradition is never presented as fact.
 */
import { PrismaClient } from '@prisma/client'
import {
  SANAD_GLOBAL_ENTITIES, SANAD_GLOBAL_RELATIONSHIPS, SANAD_LINKS, SANAD_GLOBAL_COLLECTION_ITEMS,
} from './data-sanad-global'

const prisma = new PrismaClient()

// vocabulary
const E = {
  PERSON: 'PERSON', INSTITUTION: 'INSTITUTION', ORGANIZATION: 'ORGANIZATION',
  PLACE: 'PLACE', BOOK: 'BOOK', MANUSCRIPT: 'MANUSCRIPT', DOCUMENT: 'DOCUMENT',
  MEDIA: 'MEDIA', EVENT: 'EVENT', SANAD: 'SANAD', RESEARCH: 'RESEARCH',
  SOURCE: 'SOURCE', CLAIM: 'CLAIM', TRADITION: 'TRADITION',
  COLLECTION: 'COLLECTION', TERM: 'TERM',
} as const

type EntitySeed = {
  globalId: string; slug: string; type: string; primaryName: string;
  subtitle?: string; summary?: string; summaryId?: string;
  evidenceLevel: string; verificationStatus: string;
  startDate?: string; startDatePrecision?: string; endDate?: string; endDatePrecision?: string;
  latitude?: number; longitude?: number; region?: string;
  details?: Record<string, unknown>;
  names?: { name: string; language: string; kind: string; note?: string }[]
}

const SRC_DIRECTIVE = '165-SRC-000001'
const SRC_COMMUNITY = '165-SRC-000002'

const entities: EntitySeed[] = [
  // ---------- SOURCES (the "source of source") ----------
  {
    globalId: SRC_DIRECTIVE, slug: 'master-build-directive', type: E.SOURCE,
    primaryName: '165 Website Master Build Directive',
    subtitle: 'Founder communication — primary institutional instrument',
    summary: 'The founding technical and institutional instruction for 165.web.id, issued by the Founder. Defines the mission, entity model, trust architecture, evidence system, sanad safety, governance workflow and build order of the platform.',
    summaryId: 'Instrumen teknis dan kelembagaan pendiri 165.web.id, diterbitkan oleh Founder. Mendefinisikan misi, model entitas, arsitektur kepercayaan, sistem bukti, keselamatan sanad, alur tata kelola, dan urutan pembangunan platform.',
    evidenceLevel: 'B', verificationStatus: 'DOCUMENTED',
    startDate: '2025', startDatePrecision: 'YEAR',
    details: { sourceType: 'INSTITUTIONAL', citation: 'Founder of 165, "165 Website Master Build Directive", institutional communication, 2025.', url: 'https://165.web.id' },
  },
  {
    globalId: SRC_COMMUNITY, slug: 'community-traditional-accounts', type: E.SOURCE,
    primaryName: 'Community & traditional accounts (aggregate placeholder)',
    subtitle: 'Aggregate oral/community record — citations pending',
    summary: 'A placeholder aggregate for general community and traditional accounts. 165 explicitly marks this source as weak: no specific scholarly citations are attached yet. Attachments occur only during formal source review.',
    summaryId: 'Wadah agregat untuk catatan komunitas dan tradisi umum. 165 secara eksplisit menandai sumber ini sebagai lemah: belum ada sitasi ilmiah spesifik yang melekat. Pelekatn hanya dilakukan dalam tinjauan sumber formal.',
    evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    details: { sourceType: 'COMMUNITY', citation: 'Aggregate community record — pending formal citation review.', note: 'WEAK SOURCE — treat all downstream claims as traditional account, not fact.' },
  },

  // ---------- INSTITUTION ----------
  {
    globalId: '165-INST-000001', slug: '165', type: E.INSTITUTION,
    primaryName: '165',
    subtitle: 'TQN Qodiriah Naqsabandiyah — Global Knowledge, Heritage & Digital Preservation',
    summary: '165 is a digital institution for the knowledge, heritage, research and preservation of TQN Qodiriah Naqsabandiyah. It is not a website but an institutional infrastructure: a knowledge platform, archive, research base, global directory, knowledge graph and citation system — built so that every statement can be traced to evidence.',
    summaryId: '165 adalah institusi digital untuk pengetahuan, warisan, riset, dan preservasi TQN Qodiriah Naqsabandiyah. Ia bukan sekadar website, melainkan infrastruktur kelembagaan: platform pengetahuan, arsip, basis riset, direktori global, graf pengetahuan, dan sistem sitasi — dibangun agar setiap pernyataan dapat dilacak ke buktinya.',
    evidenceLevel: 'B', verificationStatus: 'DOCUMENTED',
    details: { domain: '165.web.id', foundedBy: '165-PERSON-000001', purpose: 'Knowledge preservation & research infrastructure', masterPrinciple: 'One Source, Many Experiences', epistemicRule: 'Do not make 165 look more authoritative than its evidence allows.' },
  },

  // ---------- PEOPLE ----------
  {
    globalId: '165-PERSON-000001', slug: 'gugun-gunara-muhammad-lutfi-azmi', type: E.PERSON,
    primaryName: 'Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi',
    subtitle: 'Founder & Founding Steward of 165 · Custodian of the Founding Vision',
    summary: 'Founder and Founding Steward of 165, recognized by the institution as Custodian of the Founding Vision. Per the Master Build Directive, the institution he establishes — not the person — is the long-term preserver of knowledge: the system is deliberately structured against personality cult and permanent personal ownership of TQN knowledge.',
    summaryId: 'Pendiri dan Founding Steward 165, diakui institusi sebagai Custodian of the Founding Vision. Sesuai Master Build Directive, institusi yang beliau dirikan — bukan pribadinya — yang menjadi pelestari pengetahuan jangka panjang: sistem sengaja dirancang anti kultus figur dan kepemilikan permanen atas pengetahuan TQN.',
    evidenceLevel: 'B', verificationStatus: 'DOCUMENTED',
    details: { position: 'Founder & Founding Steward of 165', custody: 'Custodian of the Founding Vision', note: 'Dual-name representation follows the directive text; split into two entities if the Founder determines they are distinct individuals. [FLAG / REQUIRES FOUNDER DECISION]' },
    names: [
      { name: 'Gugun Gunara', language: 'ln', kind: 'ALIAS' },
      { name: 'Muhammad Lutfi Azmi', language: 'ln', kind: 'ALIAS' },
      { name: 'Tuan Haji Gugun Gunara', language: 'id', kind: 'TITLE', note: 'honorific form' },
    ],
  },
  {
    globalId: '165-PERSON-000002', slug: 'abdul-qadir-al-jilani', type: E.PERSON,
    primaryName: 'Shaykh Abdul Qadir al-Jilani',
    subtitle: 'Historical eponym of the Qadiriyya lineage',
    summary: 'A widely documented Hanbali scholar and Sufi figure (commonly given as 1077–1166 CE) after whom the Qadiriyya lineage is named. 165 records him as a historical reference figure of the lineage — NOT as a verified node in any specific sanad chain. Dates follow commonly cited accounts; scholarly citations are pending source review.',
    summaryId: 'Ulama Hanbali dan tokoh tasawuf yang luas didokumentasikan (umumnya disebut 1077–1166 M) yang menjadi nama bagi silsilah Qadiriyya. 165 mencatatnya sebagai figur rujukan historis silsilah — BUKAN sebagai simpul terverifikasi dalam sanad tertentu.',
    evidenceLevel: 'D', verificationStatus: 'TRADITIONAL_ACCOUNT',
    startDate: '1077', startDatePrecision: 'YEAR', endDate: '1166', endDatePrecision: 'YEAR',
    details: { role: 'Historical eponym — Qadiriyya lineage', note: 'Dates per commonly cited historical accounts; citations pending scholarly source review. No teacher–student relationships are asserted.' },
    names: [
      { name: 'عبد القادر الجيلاني', language: 'ar', kind: 'TRANSLITERATION' },
      { name: 'Abd al-Qadir al-Jilani', language: 'en', kind: 'VARIANT' },
    ],
  },
  {
    globalId: '165-PERSON-000003', slug: 'bahauddin-naqshband', type: E.PERSON,
    primaryName: 'Shaykh Baha\'uddin Naqshband',
    subtitle: 'Historical eponym of the Naqshbandiyya lineage',
    summary: 'A Sufi figure of Transoxiana (commonly given as 1318–1389 CE) after whom the Naqshbandiyya lineage is named. 165 records him as a historical reference figure of the lineage — NOT as a verified node in any specific sanad chain. Dates follow commonly cited accounts; scholarly citations are pending source review.',
    summaryId: 'Tokoh tasawuf dari Transoxiana (umumnya disebut 1318–1389 M) yang menjadi nama bagi silsilah Naqshbandiyya. 165 mencatatnya sebagai figur rujukan historis silsilah — BUKAN sebagai simpul terverifikasi dalam sanad tertentu.',
    evidenceLevel: 'D', verificationStatus: 'TRADITIONAL_ACCOUNT',
    startDate: '1318', startDatePrecision: 'YEAR', endDate: '1389', endDatePrecision: 'YEAR',
    details: { role: 'Historical eponym — Naqshbandiyya lineage', note: 'Dates per commonly cited historical accounts; citations pending scholarly source review. No teacher–student relationships are asserted.' },
    names: [
      { name: 'بهاء الدين النقشبند', language: 'ar', kind: 'TRANSLITERATION' },
      { name: 'Baha\' al-Din Naqshband', language: 'en', kind: 'VARIANT' },
    ],
  },

  // ---------- TRADITIONS ----------
  {
    globalId: '165-TRAD-000001', slug: 'tqn-qodiriah-naqsabandiyah', type: E.TRADITION,
    primaryName: 'TQN Qodiriah Naqsabandiyah',
    subtitle: 'Combined tarekat tradition preserved by 165',
    summary: 'Tarekat Qodiriah Naqsabandiyah — a combined Sufi order tradition drawing on the Qadiriyya and Naqshbandiyya lineages, practiced widely in Indonesia. This is a general description from community and traditional accounts: it is NOT asserted as verified history, and the historical circumstances of the combined order are not recorded in 165\'s current sources.',
    summaryId: 'Tarekat Qodiriah Naqsabandiyah — tradisi tarekat gabungan yang bersumber pada silsilah Qadiriyya dan Naqshbandiyya, diamalkan secara luas di Indonesia. Ini deskripsi umum dari catatan komunitas dan tradisi: TIDAK diklaim sebagai sejarah terverifikasi.',
    evidenceLevel: 'D', verificationStatus: 'TRADITIONAL_ACCOUNT',
    details: { note: 'General description; scholarly citations to be attached during formal source review.' },
    names: [
      { name: 'طريقة القادرية النقشبندية', language: 'ar', kind: 'TRANSLITERATION' },
      { name: 'Tarekat Qodiriah Naqsabandiyah', language: 'id', kind: 'VARIANT' },
    ],
  },
  {
    globalId: '165-TRAD-000002', slug: 'tariqa-qadiriyya', type: E.TRADITION,
    primaryName: 'Tariqa Qadiriyya',
    subtitle: 'Lineage tradition',
    summary: 'One of the two lineage traditions on which TQN draws, named after Shaykh Abdul Qadir al-Jilani. General reference description; scholarly citations pending.',
    summaryId: 'Salah satu dari dua tradisi silsilah yang menjadi rujukan TQN, dinamai menurut Shaykh Abdul Qadir al-Jilani. Deskripsi rujukan umum; sitasi ilmiah menunggu tinjauan.',
    evidenceLevel: 'D', verificationStatus: 'TRADITIONAL_ACCOUNT',
  },
  {
    globalId: '165-TRAD-000003', slug: 'tariqa-naqshbandiyya', type: E.TRADITION,
    primaryName: 'Tariqa Naqshbandiyya',
    subtitle: 'Lineage tradition',
    summary: 'One of the two lineage traditions on which TQN draws, named after Shaykh Baha\'uddin Naqshband. General reference description; scholarly citations pending.',
    summaryId: 'Salah satu dari dua tradisi silsilah yang menjadi rujukan TQN, dinamai menurut Shaykh Baha\'uddin Naqshband. Deskripsi rujukan umum; sitasi ilmiah menunggu tinjauan.',
    evidenceLevel: 'D', verificationStatus: 'TRADITIONAL_ACCOUNT',
  },

  // ---------- PLACES ----------
  {
    globalId: '165-PLACE-000001', slug: 'indonesia', type: E.PLACE,
    primaryName: 'Indonesia',
    subtitle: 'Archipelagic nation-state of Southeast Asia',
    summary: 'The archipelagic nation in Southeast Asia where TQN Qodiriah Naqsabandiyah is widely practiced. General geographic record.',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    latitude: -2.5, longitude: 118, region: 'Southeast Asia',
  },
  {
    globalId: '165-PLACE-000002', slug: 'west-java', type: E.PLACE,
    primaryName: 'West Java',
    subtitle: 'Province of Indonesia (Jawa Barat)',
    summary: 'Province of Indonesia. Community records broadly associate Sundanese West Java with tarekat activity generally; 165 asserts no specific institutional history here yet.',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    latitude: -6.9, longitude: 107.6, region: 'Southeast Asia',
    names: [{ name: 'Jawa Barat', language: 'id', kind: 'VARIANT' }],
  },
  {
    globalId: '165-PLACE-000003', slug: 'cianjur', type: E.PLACE,
    primaryName: 'Cianjur',
    subtitle: 'Town and regency, West Java',
    summary: 'A town and regency in West Java widely associated in community accounts with TQN activity. Association only — 165 does not assert origins, dates or institutional histories for this place in its current records.',
    summaryId: 'Kota dan kabupaten di Jawa Barat yang secara luas diasosiasikan dalam catatan komunitas dengan aktivitas TQN. Asosiasi saja — 165 tidak mengklaim asal-usul, tanggal, atau sejarah kelembagaan tempat ini.',
    evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    latitude: -6.82, longitude: 107.14, region: 'Southeast Asia',
  },

  // ---------- EVENTS ----------
  {
    globalId: '165-EVT-000001', slug: 'master-build-directive-issued', type: E.EVENT,
    primaryName: 'Master Build Directive issued for 165.web.id',
    summary: 'The Founder issued the Master Build Directive, activating the institutional build of 165.web.id — the knowledge, heritage and digital preservation platform for TQN Qodiriah Naqsabandiyah.',
    summaryId: 'Founder menerbitkan Master Build Directive, mengaktifkan pembangunan kelembagaan 165.web.id.',
    evidenceLevel: 'B', verificationStatus: 'DOCUMENTED',
    startDate: '2025', startDatePrecision: 'YEAR',
  },
  {
    globalId: '165-EVT-000002', slug: 'founding-of-165', type: E.EVENT,
    primaryName: 'Founding of 165',
    summary: 'The founding of 165 as a digital knowledge institution by its Founder. The founding date is NOT recorded in any accessible source, so 165 deliberately records this event without a date rather than inventing one. [Uncertainty is preserved, not hidden.]',
    summaryId: 'Pendirian 165 sebagai institusi pengetahuan digital oleh Founder. Tanggal pendirian TIDAK tercatat dalam sumber yang dapat diakses, sehingga 165 sengaja mencatat peristiwa ini tanpa tanggal.',
    evidenceLevel: 'B', verificationStatus: 'DOCUMENTED',
    startDatePrecision: 'UNKNOWN',
  },

  // ---------- DOCUMENTS ----------
  {
    globalId: '165-DOC-000001', slug: 'master-discovery-report', type: E.DOCUMENT,
    primaryName: '165 Website Master Discovery Report',
    subtitle: 'Phase 0 deliverable — produced before any code',
    summary: 'The Phase 0 discovery deliverable: inventory of sources (including the seven files that were declared but could not be located), executive understanding, institutional principles, functional requirements, entity and relationship models, and cross-reference flags requiring Founder decisions.',
    evidenceLevel: 'B', verificationStatus: 'DOCUMENTED',
    details: { documentType: 'DISCOVERY_REPORT', location: 'docs/DISCOVERY-REPORT.md' },
  },

  // ---------- RESEARCH ----------
  {
    globalId: '165-RES-000001', slug: 'reference-architecture-165', type: E.RESEARCH,
    primaryName: 'Reference Architecture of the 165 Knowledge Platform',
    subtitle: 'Internal technical research — draft',
    summary: 'The internal architectural study describing 165\'s six-layer model (data, knowledge, content, application, presentation, intelligence), its entity and relationship model, trust architecture and preservation strategy.',
    evidenceLevel: 'B', verificationStatus: 'DOCUMENTED',
    details: { status: 'DRAFT', venue: 'Internal — 165 Technology Council (planned)' },
  },

  // ---------- CLAIMS (demonstrating the evidence system honestly) ----------
  {
    globalId: '165-CLM-000001', slug: 'claim-tqn-combines-two-lineages', type: E.CLAIM,
    primaryName: 'Claim: TQN combines the Qadiriyya and Naqshbandiyya lineages',
    summary: 'Statement under review: "TQN Qodiriah Naqsabandiyah combines the Qadiriyya and Naqshbandiyya lineages." Currently supported only by aggregate community accounts (Level E) — presented as traditional account, NOT as verified history.',
    evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    details: { subjectRef: '165-TRAD-000001' },
  },
  {
    globalId: '165-CLM-000002', slug: 'claim-founder-of-165', type: E.CLAIM,
    primaryName: 'Claim: 165 was founded by Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi',
    summary: 'Statement: "165 was founded by Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi, as Founder & Founding Steward." Supported by the Master Build Directive itself (Level B, DOCUMENTED).',
    evidenceLevel: 'B', verificationStatus: 'DOCUMENTED',
    details: { subjectRef: '165-PERSON-000001' },
  },
  {
    globalId: '165-CLM-000003', slug: 'claim-tqn-origin-cianjur', type: E.CLAIM,
    primaryName: 'Claim: TQN originated in Cianjur (NOT ASSERTED)',
    summary: 'Statement under examination: "TQN originated in Cianjur." 165\'s records neither support nor dispute this claim: no accessible source establishes it. The claim therefore stands UNVERIFIED and 165 makes no assertion. This record demonstrates the Critical Historical Rule — uncertainty is displayed, never silently resolved.',
    summaryId: 'Pernyataan yang sedang diperiksa: "TQN berasal dari Cianjur." Catatan 165 tidak mendukung dan tidak membantah: tidak ada sumber yang dapat diakses. Klaim berstatus UNVERIFIED dan 165 tidak mengambil sikap.',
    evidenceLevel: 'F', verificationStatus: 'UNVERIFIED',
    details: { subjectRef: '165-PLACE-000003', note: 'Demonstrates: no silent resolution of competing narratives.' },
  },

  // ---------- TERMS (glossary — cautious generic definitions) ----------
  ...[
    ['tqn', 'TQN', 'Tarekat Qodiriah Naqsabandiyah', 'Abbreviation for Tarekat Qodiriah Naqsabandiyah, the combined order tradition whose knowledge and heritage 165 preserves.', 'Singkatan dari Tarekat Qodiriah Naqsabandiyah, tradisi tarekat gabungan yang pengetahuan dan warisannya dilestarikan 165.'],
    ['tariqa', 'Tariqa', 'طريقة', 'An Arabic term meaning "path" or "way": a Sufi order or method of spiritual discipline under the guidance of a teacher. Definitions vary between traditions; 165 records usage-context, not doctrine.', 'Istilah Arab yang berarti "jalan": sebuah tarekat atau metode disiplin spiritual di bawah bimbingan seorang guru. Definisi bervariasi antar tradisi.'],
    ['sanad', 'Sanad', 'سند', 'A chain of transmission connecting a person to a teacher or authority through successive links. In 165, sanad records are display-only: they are never created, merged, predicted, or granted legitimacy by the system.', 'Rantai periwayatan yang menghubungkan seseorang dengan guru atau otoritas melalui mata rantai berturut-turut. Dalam 165, sanad hanya untuk ditampilkan: tidak pernah dibuat, digabung, diprediksi, atau dilegitimasi oleh sistem.'],
    ['mursyid', 'Mursyid', 'مرشد', 'A spiritual guide or teacher within a tarekat — the one who guides disciples along the path. Usage and prerequisites differ across traditions; 165 does not adjudicate them.', 'Pembimbing spiritual dalam tarekat — yang membimbing murid-menurid di sepanjang jalan. Prasyarat dan penggunaannya berbeda antar tradisi.'],
    ['khalifah', 'Khalifah (tarekat context)', 'خليفة', 'Within tarekat usage: a deputy authorized by a teacher. Authorization is a matter between traditions and their teachers; 165 records such claims only with sources, never conferring them.', 'Dalam penggunaan tarekat: wakil yang diberi kewenangan oleh seorang guru. Kewenangan adalah urusan antara tradisi dan gurunya; 165 hanya mencatat klaim beserta sumbernya.'],
    ['ijazah', 'Ijazah', 'إجازة', 'A document or oral grant of permission/authorization to transmit knowledge or practice. In 165, claimed ijazah are treated as claims requiring source, evidence and context — never as automatic fact.', 'Dokumen atau pemberian izin lisan untuk meriwayatkan pengetahuan atau amalan. Dalam 165, ijazah diperlakukan sebagai klaim yang membutuhkan sumber, bukti, dan konteks.'],
    ['baiat', 'Bai\'at', 'بيعة', 'A pledge or oath of allegiance, in tarekat context typically made by a disciple to a guide. 165 records the existence of such commitments only where sourced; participation is private by design.', 'Ikrar atau janji setia, dalam konteks tarekat biasanya diucapkan murid kepada pembimbing. 165 hanya mencatat keberadaannya bila bersumber; partisipasi bersifat privat.'],
    ['dzikir', 'Dzikir', 'ذكر', 'Remembrance — devotional recitation practice central to Sufi disciplines. Forms, counts and sequences vary by order and teacher; 165 catalogs variant practices without ranking them.', 'Mengingat — amalan pembacaan devosional yang menjadi inti disiplin tasawuf. Bentuk dan urutannya bervariasi antar tarekat dan guru.'],
    ['wirid', 'Wirid', 'ورد', 'A assigned litany of recitations. In TQN communities, specific wirid forms belong to their own teaching contexts; 165 does not reproduce practice instructions without authorization and source.', 'Litani pembacaan yang diberikan. Bentuk wirid tertentu milik konteks pengajarannya masing-masing; 165 tidak mereproduksi instruksi amalan tanpa izin dan sumber.'],
    ['suluk', 'Suluk', 'سلوك', 'Structured spiritual retreat or journey practice in some Sufi traditions. Details are tradition-specific and are recorded by 165 only as described in sources.', 'Praktik murakabah/perjalanan spiritual terstruktur dalam sebagian tradisi tasawuf. Rinciannya spesifik pada tiap tradisi.'],
  ].map(([slug, en, ar, defEn, defId], i) => ({
    globalId: `165-TERM-${String(i + 1).padStart(6, '0')}`,
    slug, type: E.TERM,
    primaryName: en as string,
    subtitle: 'Glossary term — traditional account',
    summary: defEn as string,
    summaryId: defId as string,
    evidenceLevel: 'D', verificationStatus: 'TRADITIONAL_ACCOUNT',
    names: [{ name: ar as string, language: 'ar', kind: 'VARIANT' }],
    details: { definitionLangNote: 'Definitions are generic and cautious; doctrine is not adjudicated by 165.' },
  })),

  // ---------- COLLECTION ----------
  {
    globalId: '165-COLL-000001', slug: 'founding-records', type: E.COLLECTION,
    primaryName: 'Founding Records',
    subtitle: 'The documentary core of 165\'s institutional origin',
    summary: 'A curated collection of the founding instruments of 165: the Master Build Directive, the Discovery Report, the founder record and the founding events.',
    evidenceLevel: 'B', verificationStatus: 'DOCUMENTED',
  },

  // ---------- SANAD GLOBAL (Task 26 — permintaan langsung Founder) ----------
  ...SANAD_GLOBAL_ENTITIES,
]

// ---------- RELATIONSHIPS (each one explicit; none inferred) ----------
const relationships = [
  { from: '165-PERSON-000001', to: '165-INST-000001', predicate: 'FOUNDED', level: 'B', status: 'DOCUMENTED', source: SRC_DIRECTIVE, context: 'Founder & Founding Steward of 165.' },
  { from: '165-INST-000001', to: '165-TRAD-000001', predicate: 'ASSOCIATED_WITH', level: 'B', status: 'DOCUMENTED', source: SRC_DIRECTIVE, context: '165 exists to preserve the knowledge and heritage of this tradition.' },
  { from: '165-TRAD-000002', to: '165-TRAD-000001', predicate: 'LINEAGE_OF', level: 'E', status: 'TRADITIONAL_ACCOUNT', source: SRC_COMMUNITY, context: 'One of two lineage traditions drawn upon. Historical merge point not recorded in current sources.' },
  { from: '165-TRAD-000003', to: '165-TRAD-000001', predicate: 'LINEAGE_OF', level: 'E', status: 'TRADITIONAL_ACCOUNT', source: SRC_COMMUNITY, context: 'One of two lineage traditions drawn upon. Historical merge point not recorded in current sources.' },
  { from: '165-PERSON-000002', to: '165-TRAD-000002', predicate: 'LINEAGE_FOUNDER_OF', level: 'D', status: 'TRADITIONAL_ACCOUNT', source: SRC_COMMUNITY, context: 'Historical eponym. NOT a verified sanad node.' },
  { from: '165-PERSON-000003', to: '165-TRAD-000003', predicate: 'LINEAGE_FOUNDER_OF', level: 'D', status: 'TRADITIONAL_ACCOUNT', source: SRC_COMMUNITY, context: 'Historical eponym. NOT a verified sanad node.' },
  { from: '165-PLACE-000002', to: '165-PLACE-000001', predicate: 'LOCATED_IN', level: 'C', status: 'DOCUMENTED', context: 'Province of Indonesia.' },
  { from: '165-PLACE-000003', to: '165-PLACE-000002', predicate: 'LOCATED_IN', level: 'C', status: 'DOCUMENTED', context: 'Town and regency of West Java.' },
  { from: '165-EVT-000001', to: '165-INST-000001', predicate: 'ASSOCIATED_WITH', level: 'B', status: 'DOCUMENTED', source: SRC_DIRECTIVE, context: 'Directive issued for the build of 165.' },
  { from: '165-EVT-000001', to: '165-PERSON-000001', predicate: 'ASSOCIATED_WITH', level: 'B', status: 'DOCUMENTED', source: SRC_DIRECTIVE, context: 'Issued by the Founder.' },
  { from: '165-DOC-000001', to: '165-INST-000001', predicate: 'ASSOCIATED_WITH', level: 'B', status: 'DOCUMENTED', context: 'Phase 0 deliverable about the institution.' },
  { from: '165-RES-000001', to: '165-INST-000001', predicate: 'STUDIES', level: 'B', status: 'DOCUMENTED', context: 'Studies the platform\'s own architecture.' },
  { from: '165-RES-000001', to: SRC_DIRECTIVE, predicate: 'REFERENCES', level: 'B', status: 'DOCUMENTED', context: 'Primary source of the architecture.' },
  { from: '165-CLM-000002', to: '165-PERSON-000001', predicate: 'ASSOCIATED_WITH', level: 'B', status: 'DOCUMENTED', source: SRC_DIRECTIVE, context: 'Claim subject.' },
  { from: '165-CLM-000003', to: '165-PLACE-000003', predicate: 'ASSOCIATED_WITH', level: 'F', status: 'UNVERIFIED', context: 'Claim subject — NOT ASSERTED by 165.' },
  { from: '165-COLL-000001', to: '165-INST-000001', predicate: 'PART_OF', level: 'B', status: 'DOCUMENTED', context: 'Collection definition.' },
  ...SANAD_GLOBAL_RELATIONSHIPS,
]

// ---------- CLAIM ↔ SOURCE STANCES ----------
const claimStances = [
  { claim: '165-CLM-000001', source: SRC_COMMUNITY, stance: 'SUPPORTED_BY', note: 'Supported only by weak aggregate community accounts — Level E. Pending scholarly review.' },
  { claim: '165-CLM-000002', source: SRC_DIRECTIVE, stance: 'SUPPORTED_BY', note: 'Stated directly by the Master Build Directive.' },
  // CLM-000003 deliberately has NO stance: neither supported nor disputed — unverified.
]

// ---------- COLLECTION ITEMS ----------
const collectionItems = [
  { collection: '165-COLL-000001', item: SRC_DIRECTIVE, order: 1 },
  { collection: '165-COLL-000001', item: '165-DOC-000001', order: 2 },
  { collection: '165-COLL-000001', item: '165-PERSON-000001', order: 3 },
  { collection: '165-COLL-000001', item: '165-EVT-000001', order: 4 },
  { collection: '165-COLL-000001', item: '165-EVT-000002', order: 5 },
  ...SANAD_GLOBAL_COLLECTION_ITEMS,
]

async function main() {
  console.log('Seeding 165 — Minimum Viable Institution data layer…')

  // idempotent reset of knowledge data
  // DOCTRINE (Task 26): seed NEVER deletes public contributions — submissions
  // are the community's record, not the knowledge model's.
  await prisma.claimSource.deleteMany()
  await prisma.collectionItem.deleteMany()
  await prisma.sanadLink.deleteMany()
  await prisma.relationship.deleteMany()
  await prisma.nameVariant.deleteMany()
  await prisma.versionSnapshot.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.entity.deleteMany()

  const idByGlobal: Record<string, string> = {}

  for (const e of entities) {
    const row = await prisma.entity.create({
      data: {
        globalId: e.globalId, slug: e.slug, type: e.type, primaryName: e.primaryName,
        subtitle: e.subtitle, summary: e.summary, summaryId: e.summaryId,
        evidenceLevel: e.evidenceLevel, verificationStatus: e.verificationStatus,
        startDate: e.startDate, startDatePrecision: e.startDatePrecision,
        endDate: e.endDate, endDatePrecision: e.endDatePrecision,
        latitude: e.latitude, longitude: e.longitude, region: e.region,
        details: e.details ? JSON.stringify(e.details) : null,
        nameVariants: { create: e.names ?? [] },
      },
    })
    idByGlobal[e.globalId] = row.id

    // preservation: initial version snapshot for every entity
    await prisma.versionSnapshot.create({
      data: {
        entityId: row.id, version: 1,
        snapshot: JSON.stringify({ globalId: e.globalId, primaryName: e.primaryName, verificationStatus: e.verificationStatus, evidenceLevel: e.evidenceLevel }),
        changedBy: 'seed', reason: 'Initial institutional record (Phase 1 seed).',
      },
    })
    await prisma.auditLog.create({
      data: { actor: 'seed', action: 'CREATE', target: e.globalId, detail: `Entity ${e.type} created during Phase 1 seed.` },
    })
  }

  for (const r of relationships) {
    await prisma.relationship.create({
      data: {
        fromEntityId: idByGlobal[r.from], toEntityId: idByGlobal[r.to], predicate: r.predicate,
        evidenceLevel: r.level, verificationStatus: r.status, context: r.context, sourceRef: r.source ?? null,
      },
    })
  }

  for (const c of claimStances) {
    await prisma.claimSource.create({
      data: { claimEntityId: idByGlobal[c.claim], sourceEntityId: idByGlobal[c.source], stance: c.stance, note: c.note },
    })
  }

  for (const ci of collectionItems) {
    await prisma.collectionItem.create({
      data: { collectionId: idByGlobal[ci.collection], itemEntityId: idByGlobal[ci.item], order: ci.order },
    })
  }

  // ---------- SANAD LINKS (Task 26) ----------
  // Setiap mata membawa sumber + statusnya sendiri. Mata "MATA BLOK" menandai
  // segmen yang transkripsi per-namanya menunggu deposit kitab silsilah —
  // tidak ada nama yang dikarang untuk mengisinya.
  for (const l of SANAD_LINKS) {
    await prisma.sanadLink.create({
      data: {
        sanadEntityId: idByGlobal[l.chain], order: l.order,
        fromName: l.fromName, toName: l.toName,
        personEntityId: l.person ? idByGlobal[l.person] ?? null : null,
        eraNote: l.eraNote ?? null,
        evidenceLevel: l.evidenceLevel, verificationStatus: l.verificationStatus,
        sourceRef: l.sourceRef ?? null, context: l.context ?? null,
      },
    })
  }

  const counts = await prisma.entity.groupBy({ by: ['type'], _count: { type: true } })
  const linkCount = await prisma.sanadLink.count()
  console.log('Seed complete:', counts.map((c) => `${c.type}=${c._count.type}`).join(' '))
  console.log(`Sanad registry: ${linkCount} mata rantai tercatat — setiap mata bersumber; segmen tanpa nama = MATA BLOK yang jujur.`)
}

main().finally(() => prisma.$disconnect())

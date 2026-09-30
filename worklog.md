# 165 — MASTER BUILD WORKLOG

Single shared worklog. Each agent MUST append (never overwrite) a section using the template:

---
Task ID: <id>
Agent: <name>
Task: <task>

Work Log:
- ...

Stage Summary:
- ...

---
Task ID: 0
Agent: Chief Digital Architect (main)
Task: PHASE 0 — Discovery: inventory, read, extract, cross-reference all sources; produce Master Discovery Report before coding.

Work Log:
- Inventoried `/home/z/my-project/upload/` → EMPTY. All 7 declared source files (001–006 incl. Constitutions, Founder's Charter, Master Blueprint) NOT FOUND.
- Read the 165 Website Master Build Directive in full (single accessible primary source).
- Inspected project scaffold: Next.js 16 App Router, TS 5, Prisma 6 + SQLite (`db/custom.db`), shadcn/ui full set, Tailwind 4.
- Produced `/home/z/my-project/docs/DISCOVERY-REPORT.md` (Sections A–H) with explicit `REQUIRES FOUNDER DECISION` flags:
  * Charter documents absent — no page may claim to represent them.
  * Founder dual-name ("Gugun Gunara — Muhammad Lutfi Azmi") represented as ONE person with two name variants pending decision.
  * Founding date unknown — recorded as precision-UNKNOWN event.
  * Sanad registry ships EMPTY by design (safety), Library/Media ship with honest empty states (no fabrication).
- Environment constraint accepted: single visible route `/` → full institutional experience as client-side SPA + API routes.

Stage Summary:
- Discovery delivered. Build authorized under Minimum Viable Institution principle.
- Single evidence source for seed data: `165-SRC-000001` = Master Build Directive (Level B).
- Phases 1–6 (architecture, design system, foundation, core knowledge, archive/research scaffolds, trust spine) proceed next.

---
Task ID: 1
Agent: Chief Digital Architect (main)
Task: PHASE 1 — Database architecture (entity & relationship model) + seed.

Work Log:
- Wrote prisma/schema.prisma: Entity (16 types, globalId scheme 165-XXX-000001, precision-aware dating, multilingual summaries, evidenceLevel A–F, 7 verification statuses, privacy visibility), NameVariant, Relationship (27 predicates, sourced+statused), ClaimSource (SUPPORTED_BY/DISPUTED_BY), SanadLink (display-only), CollectionItem, VersionSnapshot, AuditLog, Contribution (10 workflow states).
- Fixed bidirectional relation declarations; db:push OK (SQLite, db/custom.db).
- Wrote prisma/seed.ts (idempotent, audit + v1 snapshot per entity). Seed policy: ONLY traceable to 165-SRC-000001 (Master Build Directive, Level B); traditions marked TRADITIONAL_ACCOUNT; unasserted claim (Cianjur origin) left UNVERIFIED with no stance; NO books/manuscripts/media fabricated; sanad EMPTY by design.
- Seeded: 30 entities (3 persons, 3 traditions, 3 places, 10 terms, 2 sources, 2 events, 3 claims, 1 institution, 1 collection, 1 document, 1 research), 16 relationships, 3 claim-stances.

Stage Summary:
- Data layer honors: evidence system, critical historical rule, sanad safety, no-fabrication, never-delete-silently.

---
Task ID: 3
Agent: Chief Digital Architect (main)
Task: PHASE 3 — API layer.

Work Log:
- Built route handlers: /api/entities (list+search+stats), /api/entities/[slug] (full profile with bidirectional relations, stances, versions), /api/search (grouped), /api/stats, /api/timeline (undated-last ordering), /api/graph, /api/terms, /api/ask (retrieval-only, non-fabricating, sanad-sensitive notice, per-IP rate limit), /api/contribute (POST zod-validated + reference 165-SUB-YYYY-NNNNN; GET status lookup; rate-limited; audit-logged).
- All verified live via curl + browser.

Stage Summary:
- No public write path to Entity exists — contribution ≠ publication enforced at API level.

---
Task ID: 4
Agent: Chief Digital Architect (main)
Task: PHASE 2+4 — Design system & core frontend (single-route SPA per sandbox constraint).

Work Log:
- globals.css: institutional palette (parchment bg, deep-green ink/primary, brass accent — no blue/indigo), serif display stack (Iowan/Palatino/Georgia), Amiri Arabic stack, parchment texture, double-rule divider, small-caps labels, custom scrollbars.
- Components (src/components/165/): ui.tsx (EvidenceBadge, StatusBadge, TypeBadge, SectionHeading, EmptyState, HonestNote, useApi via TanStack Query), entity-card, entity-profile (§17 profile architecture: header/summary/dates/details/name-variants/claim-stances/collection/relationships grouped+badged/version history/verification footer), knowledge-graph (dependency-free SVG radial, 30 nodes, type-colored, traditional-account edges dashed, focus isolation), ask165, sanad-registry, query-provider.
- Sections: home (hero+founder recognition+10-identity grid+trust strip+featured+Ask165+deposit-transparency banner), explore (search/timeline/atlas/graph tabs), library+archive+media (honest empty states), research (sources/claims/research), academy (curriculum+live glossary), trust (how-165-knows, evidence levels, statuses, critical historical rule, sanad policy, AI 5 commitments, no-pay-to-verify, dispute), about (institution+flags FLAG-01..04, founder anti-cult, governance councils+roles, ethics, contact), contribute (workflow viz, form with validation+consent, reference tracking).
- institution-app.tsx: sticky header nav + mobile menu, section router, profile overlay, sticky footer (min-h-screen flex + mt-auto), skip-link, aria labels.
- Fixed lint (react-hooks/set-state-in-effect) by migrating useApi to TanStack Query with QueryProvider.
- layout.tsx: institutional metadata, OG, canonical, keywords.

Stage Summary:
- Full IA from Directive §10 implemented within single-route constraint; design honors §30 (dignified, scholarly, timeless).

---
Task ID: 7
Agent: Chief Digital Architect (main)
Task: End-to-end self-verification with Agent Browser + fixes.

Work Log:
- Fixed: font-display/arabic tokens not emitted (moved to non-inline @theme block) — verified serif + arabic render.
- Fixed: stale palette (reload) — parchment bg confirmed via computed style lab(96.5,-0.3,3.4).
- Golden path verified in browser: home render; profile 165 (badges B/Documented, 6 relationships, version history); search "tqn" → 7 grouped result types; timeline (2025 event + undated honesty section); knowledge graph (30 nodes; click isolates neighbourhood: 23 dimmed, focus ring); trust (evidence levels, sanad empty-by-design, critical historical rule); Ask 165 grounded answer with globalId citations; Ask 165 unanswerable/sanad question → honest non-fabricating response + sanad safety notice; contribute submit → 165-SUB-2026-00001 → status lookup works; about flags + founder anti-cult pane; library/archive honest states.
- Mobile (iPhone 14): hamburger menu, stacked hero, natural footer push (docH 5617 > 844). Desktop restored 1280x800.
- Final lint clean; recent dev.log shows only 200s (earlier 500s were HMR-transient during hook→provider refactor, resolved).

Stage Summary:
- Browser-verified interactivity is the standard of done — met. Zero console errors on final pass.
- Documentation delivered: docs/DISCOVERY-REPORT.md, docs/ARCHITECTURE-DECISIONS.md (ADR-001..010 + data dictionary + API surface), worklog.md.

---
Task ID: 8-b
Agent: frontend-styling-expert
Task: UrlDirectory component (SEO section)

Work Log:
- Read worklog.md (context/conventions), src/lib/seo-blueprint.ts (verified API: generateUrlIndex() → 1200 UrlRow[], TEMPLATE_CATALOG, PAGE_MAP_TOTAL), sibling seo-templates.tsx (tone, KIND_HUE palette, badge style), ui.tsx (shared primitives), sections/seo.tsx (integration point — already imports { UrlDirectory } from '../seo/url-directory').
- Created src/components/165/seo/url-directory.tsx ('use client'): minimal header row ("Peta Sitemap — Fase 1" + muted count line + brass Network badge chip); responsive toolbar (Search icon inside shadcn Input "Cari URL atau slug…", shadcn Select "Semua tipe" + one option per catalog entry with count, aria-live result count "Menampilkan X–Y dari N URL" in id-ID); shadcn Table in rounded-md border bg-card wrapper with exact "nice-scroll max-h-[460px] overflow-y-auto" scroll div and sticky header.
- Columns: URL (mono 12.5px, truncate + title), Tipe (KindBadge reusing seo-templates.tsx KIND_HUE values verbatim, inline-flex span with ${hue}14/${hue}55/${hue} inline style), Skema (mono 12px), Prioritas (mono right-aligned toFixed(1)), Diperbarui (mono 12px, hidden md:table-cell).
- Pagination: 25 rows/page; Prev/Next outline sm buttons with aria-labels, "Halaman i dari j" text, ≤7-number centered window with ellipses (pageWindow helper, e.g. 1 … 4 5 6 … 48); page resets to 1 inside search/filter handlers (no setState-in-effect, honoring project lint fix history); current page clamped defensively.
- Empty state reuses shared EmptyState primitive (SearchX icon, dashed border) with exact copy "Tidak ada URL yang cocok dengan filter." + a small "Bersihkan filter" reset button.
- Performance: generateUrlIndex() memoized once (useMemo []), filtered list memoized, only the 25-row slice rendered. No blue/indigo anywhere; institutional tokens only (border-border, bg-card, bg-secondary, text-muted-foreground, var(--brass)).
- Verification: bunx tsc --noEmit → zero errors in url-directory.tsx; bun run lint → clean.

Stage Summary:
- UrlDirectory shipped and wired to the already-imported usage in sections/seo.tsx; planned sitemap browsable (search + type filter + pagination over all 1.200 rows) without rendering the full list at once.
- Note for orchestrator: pre-existing unrelated type errors exist elsewhere (examples/, skills/, sections/home.tsx, and sections/seo.tsx line 7 imports lucide `Sitemap` which does not exist in lucide-react 0.525.0 — my file uses `Network` instead). url-directory.tsx itself is fully clean.

---
Task ID: 8
Agent: Chief Digital Architect (main) + frontend-styling-expert (8-b)
Task: PHASE 8 — SEO & Page Architecture: "pages search engines love" at 1.000+ page scale (founder request: eternal pages).

Work Log:
- Wrote src/lib/seo-blueprint.ts: 10-template catalog (person/term/book/event/place/institution/sanad/collection/article/faq), phase-1 page map totaling 1.200 URLs, release phases (150→350→215→485), URL index generator (real seed slugs first, clearly-synthetic slugs for the rest — no fabricated names), 10 honest preview entities reusing EVIDENCE_LEVELS/VERIFICATION_STATUSES vocab, per-template publication GATES, JSON-LD builders (Person/Book/DefinedTerm/Event/Place/Organization/ItemList/CollectionPage/Article/FAQPage + BreadcrumbList), base 12-point SEO checklist, meta title/description helpers.
- Built src/components/165/seo/seo-templates.tsx: TemplateGallery — template selector + 4 tabs per template: live page preview (breadcrumb, status/evidence badges, Arabic display, infobox, sanad chain viz with honest "menunggu kolasi" node, FAQ accordion, citation box with Global ID), SERP simulation with title/description length meters, JSON-LD viewer with copy button, SEO checklist + amber publication-gate panel.
- [8-b via frontend-styling-expert] Built src/components/165/seo/url-directory.tsx: 1.200-URL directory — search, type filter (Radix Select), 25/page pagination with 7-number window, kind-hued badges, aria-live count, EmptyState reset, memoized rows.
- Built src/components/165/sections/seo.tsx: hero stats (1.200+ · 10 · 3 · 12+), 6 pillars (JSON-LD, internal-link mesh, E-E-A-T, stable URL+Global ID, trilingual hreflang, SSR), page-map table + phases + doctrine note ("jumlah halaman tidak pernah mengalahkan kebenaran halaman"), gallery, directory, 6 technical-foundation cards (URL/ID, sitemap shards, robots, CWV targets, hreflang map, dateModified/versioning), E-E-A-T quartet, "Dibangun untuk Keabadian" strip (versioning, no silent deletion, permanent citation, 3-2-1), live-now note, contribute CTA.
- Wired NAV (added "SEO", footer link "SEO & Pages"); REAL SEO infra: layout.tsx + Organization/WebSite JSON-LD scripts, hreflang id/en/ar/x-default, googleBot robots, viewport themeColor; new app/sitemap.ts (honest: only real URLs listed; full 1.200 map documented in section) and app/robots.ts (allow knowledge, disallow /api/ + /search; removed conflicting public/robots.txt).
- Fixed pre-existing home.tsx error (EVENT icon undefined → CalendarDays + import).
- Fixed lucide 0.525 issue: Sitemap icon not exported → ListTree alias.

Stage Summary:
- Browser-verified (Agent Browser): SEO nav → all sections render; template switching + all 4 tabs work (sanad JSON-LD shows ItemList with honest pending node); directory search "khatm"→2, filter Profil Tokoh→250, pagination 26–50 ✓; console clean; mobile iPhone 14: hamburger→SEO ok, template selector scroll-x, footer naturally pushed (5642px doc). Desktop full-page screenshot reviewed — palette/typography on-institution.
- SEO infra live: /robots.txt 200, /sitemap.xml 200, canonical + 4 hreflang links + 3 JSON-LD blocks in homepage HTML.
- Doctrine preserved: every preview entity labeled demo, evidence levels shown, publication gates visible, no fabricated sanad/names (synthetic slugs only).

---
Task ID: 22
Agent: Chief Digital Architect (main)
Task: Root-cause answer for founder ("Vercel = no database") + rebuild snapshot resilience layer (previous session's artifacts were NOT present in this working copy) + WordPress-style Ruang Admin (login, dashboard, registry CRUD, contribution moderation, snapshot publish, free-DB guide) — full Indonesian UI.

Work Log:
- Ground-truth audit: disk state matched worklog Task 0–8 only (30 entities / 16 relations / 1 contribution); snapshot fallback + motion artifacts from the prior session were absent → rebuilt from scratch.
- SNAPSHOT LAYER REBUILD: prisma/export-snapshot.ts (CLI wrapper) + src/lib/snapshot-export.ts (shared core) + src/lib/snapshot.ts (typed static layer w/ indexes; shape-matching helpers: search/profile/stats/graph/terms/timeline/ask) + src/data/heritage-snapshot.json + src/data/snapshot-counts.json (generated via `bun run db:export`, package.json script added).
- queries.ts rewritten under RESILIENCE DOCTRINE: every reader try/catch → logFallback("[queries:X] database unavailable — serving bundled snapshot") → snapshot result; graph/timeline/terms/ask routes refactored onto façades (getGraphData/getTimelineEvents/getGlossaryTerms/getAskIndex) keeping response shapes byte-compatible.
- home.tsx trust strip: static counts floor (data?.stats.total ?? counts.entities) → 0-display structurally impossible even client-side.
- NO-DB PROOF: moved db/custom.db out, restarted → all 9 public endpoints returned full data (stats 30/16/1, graph 30n/16e, terms 10, timeline 2, profile complete, search 7 groups, ask grounded); honest fallback lines present in dev.log; DB restored after.
- ADMIN BACKEND: src/lib/admin-auth.ts (ADMIN_PASSWORD env w/ documented dev default, HMAC-signed 7d httpOnly cookie, timing-safe compare, 5-attempt/10-min lock) + src/lib/admin-data.ts (globalId sequencing per-type prefix, slugify+unique, guarded delete dependency counts, VersionSnapshot-before-update, AuditLog every mutation) + routes: login/logout/session (dbAvailable + fresh counts from disk), entities GET/POST, entities/[id] GET/PUT/DELETE (409 + Indonesian guidance when referenced), contributions GET, contributions/[id] PUT (workflow statuses), snapshot POST (re-export; honest 501/503 on serverless/read-only).
- ADMIN UI (all Indonesian, institutional parchment/brass design, shadcn): admin.tsx (session shell + login card + 5 tabs), registry.tsx (searchable table incl. PRIVATE rows, editor dialog w/ full fields + JSON details validation + guarded delete two-step), extras.tsx (DashboardPanel w/ honest system status, ContributionsPanel w/ 9-state workflow, PublishPanel w/ rebuild button + 3-step flow, GuidePanel: WordPress-honest comparison, Turso recommended w/ 4 layman steps, Neon/Supabase alternatives, ADMIN_PASSWORD security steps, 4-step work rhythm).
- institution-app.tsx: 'admin' section + footer "Ruang Admin" link + deep-link hash routing (history.replaceState + hashchange, deferred setState per hooks lint).
- Fixes during verification: editingId null/undefined typing; session endpoint reads snapshot-counts.json from disk at request time (fresh after export) w/ build-time import fallback; silent session refresh after snapshot publish (message no longer unmounted).
- Verification: lint clean; tsc clean (excl. pre-existing examples/skills); curl suite (login wrong/right, session, list, create→165-BOOK-000001 auto-ID/slug, put rename slug-rotate + evidence, public profile reflects, delete, 409 guard, contribution SCREENING→SUBMITTED, snapshot export) all green; audit trail verified (CREATE/UPDATE field-list/DELETE/STATUS_CHANGE, 30 version snapshots); agent-browser golden path: home 30/16 → #admin deep-link → login → dashboard → registry search/table → editor load/save/revert (subtitle null after revert) → publish rebuild (message + fresh badge 17.40.32) → guide content checks → logout → footer link → mobile iPhone 14 no horizontal overflow; console clean; screenshots admin-dasbor/registri/terbitkan/panduan/mobile.png.

Stage Summary:
- Zero-display is structurally impossible site-wide (server fallback + client static floor); Vercel "0" incident class is closed regardless of DB availability.
- Founder now has a WordPress-style admin room in Bahasa Indonesia at footer → Ruang Admin (dev password documented; ADMIN_PASSWORD env must be set in Vercel).
- Free-DB path documented in-app: Turso recommended (SQLite-native, no schema change); founder sends URL+token → next session wires live cloud editing.
- Data discipline preserved: versioning, audit, guarded delete, contribution≠publication, sanad untouched.

---
Task ID: 23
Agent: Chief Digital Architect (main)
Task: Masukkan 6 dokumen kanonik Founder (000, BP, ARCH, 007, 008, 009) ke website sebagai "Ruang Dokumen Sistem" — rak dokumen + pembaca markdown institusional (TOC, scroll-spy, progress bar, pencarian lintas dokumen), bundle-safe tanpa DB.

Work Log:
- Ground truth: worklog Task 0–22 terbaca; 6 file .md diterima di upload/ (144 KB, 6.871 baris, ±20.300 kata).
- BUNDLE PIPELINE: dokumen asli diarsipkan ke docs/canon/*.md (verbatim); scripts/gen-documents.ts membaca & meng-JSON-escape ke src/data/documents/canon.ts (140.9 KB, di dalam bundle → Vercel-safe, tanpa filesystem/DB — doctrine snapshot yang sama). Script terdaftar sebagai `bun run docs:gen`.
- REGISTRY: src/lib/documents.ts — metadata 6 dokumen (key/docId/code/kind/status/version/role/layer), stats korpus (kata/bagian/menit baca), docToc() parse H1/H2 + anchor deterministik (anchorSlug, sama dengan renderer), headingAboveLine, searchDocuments() full-text lintas dokumen dengan excerpt + jangkar bagian.
- SECTION: src/components/165/sections/documents.tsx ('use client', react-markdown 10 + remark-gfm 4 baru diinstall):
  * Rak: SectionHeading, HonestNote hijau "Salinan verbatim", strip statistik (6 dokumen · 20.300 kata · 580 bagian · ±93 mnt), pencarian lintas dokumen dengan <mark> highlight + klik → buka dokumen pada bagian yang memuat potongan, grid 6 kartu dokumen (kode besar brass, kind icon, role, layer, meta).
  * Pembaca: header sticky top-16 (kembali ke rak, kode|judul, chip 165-000/v1.0) + progress bar baca brass 2px; TOC sidebar sticky (desktop, scroll-spy border brass aktif) + <details> accordion (mobile); front matter dokumen (kind/docId/version/status/judul/subtitle/role/meta); ReactMarkdown dengan tipografi institusional (h1 ber-anker + rule brass, tabel scrollable & bergaya, blockquote brass, pre/code mono, hr rule-double); navigasi Sebelumnya/Berikutnya.
- WIRE: NAV + 'Dokumen' (setelah About), router #documents, footer "Dokumen Sistem", home: banner pengantar "Now open · Ruang Dokumen" + HonestNote amber diperbarui secara jujur (6 dokumen deposited & readable; Founder's Charter sisanya masih ditunggu).
- VERIFIKASI (agent-browser): lint ✓ tsc ✓ (tanpa error baru); shelf render; buka 000 (TOC 67 bagian, 15 tabel, 133 paragraf); lompat TOC presisi (heading top = 96px); search "Tier A" → 1 potongan → klik → terbuka pada bagian TIER A (scrollY 3296); progress bar 50% di tengah; buka 008 (89 h1+11 h2, TOC 99); navigasi Berikutnya 000→BP ✓; footer link ✓; home banner1+banner2 ✓; mobile iPhone 14: shelf & reader tanpa overflow horizontal, TOC mobile buka + lompat ✓; console & page errors bersih; dev.log hanya query normal.
- Screenshot: tool-results/documents-shelf.png, documents-reader-000.png, documents-home-banner.png.

Stage Summary:
- Keenam dokumen kendali 165 kini TAMPIL UTUH (verbatim) di situs — nav "Dokumen" / footer "Dokumen Sistem" / #documents — dan ikut ter-bundle sehingga tampil bahkan tanpa database (Vercel-safe, doctrine resilience dipertahankan).
- Disiplin Source-First dijaga: tidak ada parafrasa; ID kanonik, versi, status, dan catatan "salinan verbatim" tampil; alur perubahan tetap lewat governance (dokumen sumber di docs/canon/, regenerate via `bun run docs:gen`).
- Banner transparansi home diperbarui jujur: 6 dari dokumen yang dideklarasikan sudah terdeposit; Founder's Charter & sisanya masih ditunggu.

---
Task ID: 24
Agent: Chief Digital Architect (main)
Task: i18n god-mode — seluruh bahasa dunia di 165.web.id, default Bahasa Indonesia penuh: registry 178 bahasa, kamus kurasi tangan (id/en/ms/jv/su/ar), pipeline terjemahan AI ~87 bahasa utama, pemilih bahasa + RTL + persistensi, seluruh chrome diterjemahkan.

Work Log:
- KATALOG: src/lib/i18n/catalog.ts — 131 kunci (nav, header, footer, umum, home, 11 judul+kicker+lede section, chrome ruang dokumen, pemilih bahasa) berpasangan [id, en]; helper placeholder {n}/{q}/{code}/{title}/{curated}/{ai}.
- REGISTRY: src/lib/i18n/languages.ts — 178 bahasa (seluruh ISO-639-1 yang hidup + bahasa Nusantara: Bali, Bugis, Aceh, Madura, Minangkabau, Sasak, Makassar, Batak Toba, Iban, Tetum + regional dunia + liturgis sa/pali/la/eo), nama asli (skrip asli), nama Indonesia, dir LTR/RTL (11 RTL), 8 grup region (Nusantara di urutan pertama), tier curated/ai/core.
- KAMUS KURASI: src/lib/i18n/dictionaries.ts — ms, jv, su, ar ditulis tangan penuh 131 kunci (id/en dari katalog). Arab formal; Jawa/Sunda menghormati register lokal.
- MESIN: src/lib/i18n/index.ts — useSyncExternalStore dengan SNAPSHOT=versi store (fix bug: snapshot berbasis kode bahasa membuat header tidak re-render saat kamus AI tiba asinkron); fallback berlapis kamus aktif → Indonesia → kunci; persistensi localStorage '165-lang'; initLanguage pasca-hydration bebas mismatch; applyDocumentMeta mengeset html[lang] + html[dir] (RTL penuh untuk ar/fa/ur/he/ps/sd/ug/ku/yi/dv/ckb).
- PIPELINE AI: scripts/gen-i18n.ts (npm: i18n:gen) — 87 bahasa target via z-ai-web-dev-sdk (backend); prompt institusional (register hormat, placeholder & brand terkunci, skrip asli); konkurensi 2 + stagger + backoff 429 + timeout 120s; resume-safe; validasi 131 kunci per bahasa (yang gagal jatuh hormat ke Indonesia); menulis src/data/i18n/{code}.json + MENULIS ULANG src/data/i18n/registry.ts (loader statis per bahasa — template-literal dynamic import TERBUKTI gagal di Turbopack, loader statis terjamin ter-code-split).
- PICKER: src/components/165/language-picker.tsx — tombol Globe di nav desktop + mobile menu; dialog pencarian (native/Indonesia/Inggris/kode), grup region, titik tier (hijau=kurasi, kuning=AI, abu=antarmuka Indonesia), badge Bawaan/Aktif, catatan jujur tier; tutup klik-luar/Escape.
- WIRE t(): institution-app (NAV, header, footer, skip, menu), home (hero, stats, identity, principle, featured, ask, banner dokumen, deposit), documents (seluruh chrome), explore/library/archive/media/research/academy/trust/about/seo/contribute (kicker+title+lede). Konten warisan & grid identity tetap bahasa sumber (kebijakan konten, jujur di picker).
- VERIFIKASI (agent-browser): default ID SSR ✓; Arab → dir=rtl + nav/hero/footer Arab ✓ (screenshot); Jawa ✓; persistensi pasca-reload ✓; Mandarin (kamus AI via registry) nav+hero+footer ✓ (screenshot); mobile iPhone 14: menu → pemilih bahasa, dialog 359px muat, grup Nusantara pertama ✓ (screenshot); dokumen ✓; konsol & page errors bersih; lint ✓ tsc ✓.
- Kejadian ditangani: 429 rate-limit (turun ke konkurensi 2 + backoff), proses latar mati sunyi (restart + disown), template dynamic import gagal (registry statis), header tidak re-render (snapshot versi).

Stage Summary:
- 165 kini bilingual-institutional: BAHASA INDONESIA sebagai bawaan SSR+client, 6 bahasa kurasi penuh, ~87 bahasa kamus AI (pipeline latar berjalan, registry update otomatis/HMR), total 178 bahasa dapat dipilih dengan presentasi jujur; 11 bahasa RTL didukung penuh.
- Status pipeline saat arsip: 6/87 selesai (id-en-ms-jv-su-ar + zh/ja/fr/de), sisanya terus masuk; bahasa tanpa kamus menampilkan antarmuka Indonesia (bukan kosong, bukan angka 0 — doctrine yang sama).
- Konten dokumen & catatan warisan sengaja tidak diterjemahkan (verbatim doctrine) — antarmuka multi-bahasa, isi sumber tetap asli.

---
Task ID: 25
Agent: Chief Digital Architect (main)
Task: 165 v.4 — "Emerald Radiance": permintaan founder (header dirapikan ala website anak-anak modern, visual lebih smooth, warna lebih keren) → upgrade identitas visual menyeluruh: palet zamrud-emas baru, radius pil besar, font bulat Nunito, header kaca melayang dengan nav pengukur-diri, hero gradien mesh + ornamen melayang.

Work Log:
- PALET (globals.css ditulis ulang): primary zamrud lebih hidup oklch(0.46 0.105 163), brass → emas bercahaya oklch(0.64 0.125 78), latar krem lebih terang, radius global 0.375rem → 1rem (semua komponen shadcn otomatis membulat); dark mode diselaraskan.
- LAPISAN v.4: utilitas .v4-mesh (gradien mesh zamrud-emas-teal multi-radial, versi dark), .v4-gradient-text (headline zamrud→emas), .v4-card/.v4-lift (kartu lembut + hover lift transform-only), .v4-glow/.v4-glow-gold; keyframes v4-float & v4-breathe + guard prefers-reduced-motion (CSS & motion-reduce:animate-none).
- FONT: Nunito (bulat, ramah) via next/font/google self-hosted (--font-nunito) + rantai eksplisit font-family di body. TEMUAN PENTING: terungkap var(--font-sans) lama tak pernah benar-benar aktif (preflight TW4 tidak menautkan --default-font-family; var font hidup di <body>) → kini dirantai eksplisit; perlu restart + rm -rf .next karena Turbopack menyajikan CSS basi.
- HEADER v.4 (institution-app.tsx): header pil kaca MELAYANG (rounded-full, backdrop-blur, shadow, sticky), wordmark squircle gradien zamrud→emas (hover playfulness), nav pill dengan pill aktif berwarna + glow, CTA Kontribusi gradien, menu mobile kartu kaca rounded-3xl + item pill; footer: crest rounded-t-[2.5rem] + bar gradien zamrud-emas-teal + badge gradien.
- NAV PENGUKUR-DIRI: audit 42 kamus i18n menemukan label terpanjang (fr 114 char vs id 80) → nav pasti luap untuk banyak bahasa. Solusi: baris ghost tak terlihat mengukur lebar tiap pill → item yang tak muat mengalir ke menu pil "···" (dropdown kaca); re-measure tiap render + ResizeObserver + document.fonts.ready; ghost dibungkus klip 40px agar tak melebarkan dokumen mobile. Terverifikasi: id 1440 = 11 pil muat; fr = 9 + "···"; 1280 = 8 + "···"; <1280 hamburger.
- LABEL NAV diringkas (catalog.ts + 4 kamus kurasi): Perpustakaan→Pustaka, Kepercayaan & Metode→Kepercayaan, Tentang 165→Tentang, Berpartisipasi→Kontribusi; kunci baru nav.more (id/en/ms/jv/su/ar).
- PRIMITIF (ui.tsx, entity-card.tsx): Kicker → pil emas dengan titik; Evidence/Status/TypeBadge → rounded-full; EmptyState rounded-3xl border dashed + chip ikon; HonestNote & Skeleton rounded-2xl; EntityCard v4-card + v4-lift.
- HOME v.4 (home.tsx): hero rounded-[2.5rem] v4-mesh + 3 orb glow bernapas + 4 ornamen melayang (Buku/Sparkles/Gulungan/Bulan, chip putih rounded-2xl) + "165" gradient-text + tombol pil gradien (hover lift, active scale); kartu statistik 4 warna (chip ikon rounded-2xl + garis gradien); grid identitas 10 kartu dengan chip ikon 6 hue berputar + hover rotate; panel prinsip v4-mesh + sparkles; banner dokumen gradien emas→zamrud + chip ikon gradien emas; offsets sticky dokumen disesuaikan (toolbar 76px, TOC 168px).
- VERIFIKASI (agent-browser): lint ✓ tsc ✓ (0 error); desktop 1440/1280: tanpa luap, ··· & dropdown fr berfungsi, klik item navigasi ✓; mobile iPhone 14: overflowX false (390=390), kartu menu 13 item, pembaca dokumen sticky 76px presisi; Nunito computed aktif + font loaded; konsol & pageerrors bersih; dev.log hanya 200. Screenshot: v4-home-hero, v4-home-mid, v4-home-featured, v4-home-footer, v4-final-desktop, v4-final-mobile, v4-more-menu-fr, v4-header-french.

Stage Summary:
- 165 resmi v.4 "Emerald Radiance": hangat & playful ala website anak modern (pil, gradien mulus, ornamen melayang, font bulat) namun martabat institusional terjaga (serif display, rule ganda, disiplin sumber utuh — tak ada konten/data yang berubah).
- Nav tahan 178 bahasa: sistem pengukur-diri memastikan tak pernah luap pada bahasa mana pun; hamburger di <1280px.
- Bonus perbaikan struktural: rantai font UI kini benar-benar aktif (sebelumnya diam-diam fallback sistem).

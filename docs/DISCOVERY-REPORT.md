# 165 WEBSITE MASTER DISCOVERY REPORT

**Document Type:** Phase 0 — Discovery (MANDATORY FIRST DELIVERABLE)
**Prepared by:** Chief Digital Architect of 165
**Status:** DELIVERED — prior to any code being written
**Date:** Build session, 2025

---

## A. SOURCES READ

| # | Source | Status | Notes |
|---|--------|--------|-------|
| 1 | **165 Website Master Build Directive** (Founder communication, this session) | ✅ READ IN FULL | Primary accessible source. Contains: role activation, source-first protocol, hierarchy of authority, master entity model, master relationship model, information architecture, trust architecture, evidence system, sanad safety, AI architecture, governance model, contribution workflow, global identity scheme, multilingual policy, design philosophy, build order (Phase 0–10). |
| 2 | **Filesystem inspection** (`/home/z/my-project/`) | ✅ EXECUTED | Confirmed scaffold: Next.js 16 App Router, TypeScript 5, Prisma 6 + SQLite, shadcn/ui (New York), Tailwind 4, TanStack Query, Zustand, framer-motion, next-auth v4 available. |

## B. SOURCES NOT ACCESSIBLE — `CONFLICT / REQUIRES FOUNDER DECISION`

The following seven declared source files **could not be located on the filesystem** (`/home/z/my-project/upload/` is empty). **No content was invented on their behalf.**

| Declared file | Status |
|---------------|--------|
| `001-founder-165-website.txt` | ❌ NOT FOUND — contents unknown |
| `002-constitution-165.txt` | ❌ NOT FOUND — contents unknown |
| `003-operating-constitution-165.txt` | ❌ NOT FOUND — contents unknown |
| `004-THE FOUNDER'S CHARTER.txt` | ❌ NOT FOUND — contents unknown |
| `004.txt` | ❌ NOT FOUND — contents unknown |
| `005.txt` | ❌ NOT FOUND — contents unknown |
| `006-master-blueprint.txt` | ❌ NOT FOUND — contents unknown |

**Consequences and mitigation:**

1. **Constitution / Operating Constitution / Founder's Charter / Institutional Charter / Master Blueprint are NOT in evidence.** Per the Hierarchy of Authority, these sit at Levels 1–4 — ABOVE the Master Build Directive (which functions here as a technical specification / Level 6–7 instrument issued by the Founder).
2. Therefore **no page, component, or dataset in this build claims to quote, summarize, or represent the Constitution, Charters, or Master Blueprint.** Governance pages present the *structure* of governance (roles, councils, workflows) as mandated by the Directive — never their supposed content.
3. **Any future conflict between the Directive and the (inaccessible) charter documents is pre-flagged:** when the Founder supplies the files, a reconciliation pass is required. Silent resolution is prohibited by protocol.
4. All seeded institutional data in this build traces to exactly one source: the **165 Website Master Build Directive** (recorded in the database as Source `165-SRC-000001`, Level B — Authoritative Institutional Source). Everything else is marked with honest uncertainty labels (`TRADITIONAL ACCOUNT`, `UNVERIFIED`, `EXAMPLE RECORD`).

## C. EXECUTIVE UNDERSTANDING — WHAT 165 IS

**165** is the digital knowledge, heritage, and preservation institution for **TQN Qodiriah Naqsabandiyah**, founded by **Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi**, serving as **Founder & Founding Steward, Custodian of the Founding Vision**.

It is **not** a company website, blog, CMS, or database. It is conceived as ten things at once:

1. **Knowledge Platform** — structured entities and relationships, not pages.
2. **Digital Archive** — heritage-grade preservation, versioning, audit trails.
3. **Research Infrastructure** — sources, claims, citations, bibliography.
4. **Global Directory** — people, institutions, places.
5. **Knowledge Graph** — typed relationships across all entities.
6. **Heritage Platform** — tradition preserved *as tradition*.
7. **Educational Platform** — Academy: courses, curriculum, fellowship.
8. **Digital Preservation Institution** — 3-2-1 backup principle, migration strategy.
9. **Citation & Provenance System** — every claim traceable to evidence.
10. **Global Reference Infrastructure** — persistent IDs, canonical URLs, APIs.

**Master Principle:** *ONE SOURCE, MANY EXPERIENCES* — one correct datum feeds profile, search, map, timeline, graph, archive, research, citation, AI, API, education, and media.

**Guiding epistemic rule:** *DO NOT MAKE 165 LOOK MORE AUTHORITATIVE THAN ITS EVIDENCE ALLOWS — MAKE IT MORE TRUSTWORTHY THAN IT NEEDS TO APPEAR.* Unknown is better than fabricated certainty.

## D. INSTITUTIONAL PRINCIPLES (EXTRACTED FROM THE DIRECTIVE)

1. **Source-First Protocol** — inventory → read → extract → cross-reference; nothing built before sources are understood.
2. **Hierarchy of Authority** — Constitution (L1) → Operating Constitution (L2) → Founder's Charter (L3) → Institutional Charter (L4) → Specialized Charters & Policies (L5) → Technical Specifications (L6) → Implementation Decisions (L7). *Institutional principles always beat technical convenience.*
3. **Data-First Architecture** — six layers: DATA, KNOWLEDGE, CONTENT, APPLICATION, PRESENTATION, INTELLIGENCE.
4. **One Source, Many Experiences** — no manual duplication of data.
5. **Critical Historical Rule** — never promote tradition→fact, claim→fact, oral history→documentary fact, community belief→verified history. If sources disagree, **display the disagreement**.
6. **Sanad Safety** — never create, merge, predict, or legitimize sanad. Sanad requires Source → Relationship → Evidence → Context → Verification Status.
7. **Trust Architecture** — Trust Engine, "How 165 Knows", Source of Source, citation system, verification status, provenance, version history, correction history, dispute room, contributor identity, editorial review.
8. **Evidence Levels A–F** — A: Primary Source; B: Authoritative Institutional Source; C: Scholarly Source; D: Oral History; E: Community Record; F: Unverified.
9. **Verification Statuses** — VERIFIED, DOCUMENTED, COMMUNITY SUBMITTED, DISPUTED, TRADITIONAL ACCOUNT, UNVERIFIED, WITHDRAWN.
10. **Contribution ≠ Publication** — workflow SUBMITTED → SCREENING → EDITORIAL REVIEW → SOURCE REVIEW → VERIFICATION → APPROVED → PUBLISHED / REJECTED / DISPUTED.
11. **No Pay-to-Verify** — verification is independent of payment.
12. **Privacy by Design** — protection for living persons, students, contributors, contact info, private documents.
13. **AI: Source-Grounded, Traceable, Uncertainty-Aware, Non-Fabricating, Human-Supervised** — if no source: *say the information is not verified*. Never fabricate sanad, ijazah, baiat, history, figures, sources, quotes, bibliographies, or spiritual authority.
14. **Never Delete Knowledge Silently** — versions, dates, authors, reasons, review history preserved.
15. **Multilingual by Design** — Indonesian, English, Arabic ready; no hard-coded language in data.
16. **Archive-First Thinking** — versioning, audit trail, immutable records, export, 3-2-1 backup.
17. **Minimum Viable Institution** — smallest version that already respects the institutional architecture; do not overbuild.
18. **Anti-Personality-Cult** — the Founder establishes the institution; the institution preserves knowledge; knowledge belongs to its sources, traditions, communities, and heritage contexts.
19. **Design Philosophy** — dignified, scholarly, timeless, trustworthy; spiritual without theatre; modern without losing heritage; global without losing Indonesian roots. No generic Islamic template, no excessive ornament/animation, no artificial "AI-looking" design.
20. **Founder Recognition** — the system must recognize Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi as Founder & Founding Steward.

## E. FUNCTIONAL REQUIREMENTS (WHAT THE WEBSITE MUST DO)

**Core systems (this build):**
- F1. Global search across all entity types (keyword; semantic-ready foundation).
- F2. Entity profiles with consistent architecture: Header, Summary, Timeline, Relationships, Sources, Verification, Changelog, Related Entities.
- F3. Knowledge graph view (typed relationships, entity-type colored).
- F4. Timeline engine (date-precision aware: exact / year / decade / approximate).
- F5. Library: books & manuscripts with evidence/status display.
- F6. Archive: documents, oral history, heritage records (registry + status).
- F7. Research: sources, bibliography, claims with support/dispute.
- F8. Academy: structure, curriculum placeholder, glossary of terms.
- F9. Media registry.
- F10. Sanad registry — display-only, safety-gated.
- F11. Contribution system with full workflow states and status lookup by reference.
- F12. Trust system UI: "How 165 Knows", evidence levels, verification statuses, provenance, version history, changelog.
- F13. Ask 165 (preview) — retrieval-grounded answers that explicitly say "not verified" when records are silent; zero fabrication.
- F14. Governance documentation (roles & councils) — structure only.
- F15. Glossary / terminology system.
- F16. Multilingual name variants (ID/EN/AR slots).
- F17. Persistent Global IDs (165-PERSON-000001 …), slugs, canonical metadata.
- F18. Audit log & version snapshots for every change.

**Deferred (roadmap, per Build Order):** full authentication + role-based admin (Phase 3 continuation), public API + developer docs (Phase 9), archival export & redundancy tooling (Phase 10), world map tiles (Phase 7 — atlas implemented as region-grouped view in MVP), full multilingual UI i18n (schema-ready, UI toggle deferred).

**Constraints accepted from environment:**
- Single visible route (`/`) — the entire institutional experience is delivered as a client-side SPA with section navigation; backend delivered as API routes.
- SQLite via Prisma — appropriate for Minimum Viable Institution; migration path documented.

## F. ENTITY MODEL

Implemented entities (Master Entity Model, §8 of the Directive):

| Entity | Global ID prefix | Notes |
|--------|-----------------|-------|
| Person | `165-PERSON-` | name variants, lifespan (precision-aware), roles |
| Institution | `165-INST-` | including 165 itself |
| Place | `165-PLACE-` | region hierarchy-ready (lat/long nullable) |
| Book | `165-BOOK-` | author relationship, language |
| Manuscript | `165-MSS-` | holding institution relationship |
| Document | `165-DOC-` | archive registry |
| Media | `165-MEDIA-` | audio/video/photo/interview |
| Event | `165-EVT-` | timeline engine source |
| Sanad | `165-SANAD-` | display-only chain, safety-gated |
| Research | `165-RES-` | studies-subject relationship |
| Source | `165-SRC-` | the "source of source" |
| Claim | `165-CLM-` | support/dispute via ClaimSource |
| Tradition | `165-TRAD-` | e.g., TQN itself |
| Collection | `165-COLL-` | grouping of items |
| Term | `165-TERM-` | glossary with definitions |
| Organization | `165-ORG-` | distinguished from Institution (formal bodies) |

Supporting structures: **NameVariant** (multilingual), **Relationship** (typed, sourced, status), **ClaimSource** (stance: SUPPORTED/DISPUTED), **SanadLink** (ordered, sourced), **VersionSnapshot**, **AuditLog**, **Contribution** (workflow states).

## G. RELATIONSHIP MODEL

Implemented predicates (Master Relationship Model, §9 of the Directive):

- `TEACHER_OF` / `STUDENT_OF` — Person → Person *(display-only; never inferred)*
- `AUTHORED` — Person → Book/Manuscript
- `ASSOCIATED_WITH` — Person → Institution/Organization/Tradition
- `LOCATED_IN` — Institution/Event → Place
- `HELD_BY` — Manuscript → Institution/Library
- `REFERENCES` — Book/Research → Source
- `SUPPORTED_BY` / `DISPUTED_BY` — Claim → Source (via ClaimSource stance)
- `APPEARS_IN` — Person → Document
- `OCCURRED_IN` — Event → Place
- `STUDIES` — Research → Subject (any entity)
- `DOCUMENTS` — Media → Event/Entity
- `LINEAGE_FOUNDER_OF` — Person → Tradition (traditional-account only)
- `PART_OF` — Collection containment / organizational hierarchy
- `FOUNDED` — Person → Institution

Every relationship carries: evidence level, verification status, optional source reference, context note. **The system never generates relationships automatically.**

## H. CROSS-REFERENCE FINDINGS & FLAGS

1. `FLAG / REQUIRES FOUNDER DECISION` — The seven declared source files are absent (Section B). All Level 1–4 documents must be supplied and reconciled before any content page claims to represent them.
2. `FLAG / REQUIRES FOUNDER DECISION` — Founder name is recorded in the Directive as a single office: "Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi". This build represents **one Person entity with two name variants** (dual-name form is common in TQN tradition). If these are two individuals, the entity must be split — one command from the Founder.
3. `FLAG / REQUIRES FOUNDER DECISION` — Founding date of 165 is not stated in accessible sources. The only date recorded is the issuing of the Master Build Directive (2025) as an Event, marked `DOCUMENTED` (it happened — this session).
4. `FLAG / DEFERRED` — Authentication (NextAuth v4) is available but deferred: no role accounts exist to grant; role model is documented and schema-ready. **No login promises verification.**
5. `FLAG / POLICY` — Sanad registry ships **empty by design**, displaying the Sanad Safety policy. This is intentional honesty, not a missing feature.
6. `FLAG / POLICY` — Ask 165 ships as retrieval-only over the database with an explicit "NOT VERIFIED" fallback. No generative claims.

---

*This report was produced before any code was written, per the First Deliverable requirement. Build proceeds under the Minimum Viable Institution principle: Phases 1–6 foundations with trust architecture as the spine.*

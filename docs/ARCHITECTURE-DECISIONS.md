# 165 — Architecture Decision Records & Data Dictionary

Status: v1.0 (MVI — Minimum Viable Institution build)
Supersedes: none. Amended by: Founder decisions pending (see flags).

---

## ADR-001 — Single-Route SPA Delivery
- **Context:** Sandbox exposes exactly one visible route (`/`).
- **Decision:** The full institutional experience (Home, Explore, Library, Archive, Research, Academy, Media, Trust & Method, About, Contribute) is delivered as a client-side SPA with internal section router + entity-profile overlay. Backend is delivered as Next.js API route handlers (`/api/*`).
- **Consequence:** Canonical URLs per entity exist logically (`/{slug}` metadata reserved); when multi-route deployment becomes available, the SPA router maps 1:1 to real routes without data-layer change.

## ADR-002 — Prisma + SQLite for MVI
- **Context:** Institutional architecture requires entities/relationships/versioning now; scale comes later.
- **Decision:** SQLite via Prisma 6. Enum-like vocabularies enforced at application layer (`src/lib/165.ts`), list payloads stored as JSON strings (SQLite has no list primitives).
- **Consequence:** Straight migration path to PostgreSQL; vocabularies are single-source and typed.

## ADR-003 — Evidence & Status Travel With Every Fact
- **Context:** Master Directive §13 (evidence levels A–F) and §37 (no false authority).
- **Decision:** `evidenceLevel` + `verificationStatus` are mandatory columns on every entity AND every relationship. UI renders them on cards, profiles, timeline items, graph edges and Ask-165 references.
- **Consequence:** It is impossible to store an unsourced assertion without it being visibly labelled.

## ADR-004 — Sanad Registry Ships Empty (Display-Only)
- **Context:** §15 Sanad Safety.
- **Decision:** `SanadLink` table exists (order, from/to transmitter, optional person ref, required source policy, status), seeded with zero rows. Registry page renders the safety policy as its primary content. No API creates links.
- **Consequence:** Emptiness is institutional honesty, not a missing feature.

## ADR-005 — Contribution ≠ Publication
- **Context:** §24 workflow.
- **Decision:** `Contribution` records enter at `SUBMITTED` with permanent reference `165-SUB-YYYY-NNNNN`; public status lookup by reference; no public write path to `Entity` exists anywhere in the API.
- **Consequence:** The knowledge graph can only grow through the editorial workflow.

## ADR-006 — Ask 165: Retrieval-Only, Non-Generative
- **Context:** §16 AI architecture.
- **Decision:** `/api/ask` performs keyword retrieval over stored records and composes answers strictly from retrieved text + statuses. Empty result ⇒ "This information is not verified in 165's records." Sanad-related questions always surface the Sanad Safety notice. Per-IP rate limiting.
- **Consequence:** The system cannot fabricate; it can only quote or stay silent.

## ADR-007 — Never Delete Knowledge Silently
- **Context:** §35.
- **Decision:** Every entity creation/change writes `VersionSnapshot` (version, actor, reason) + `AuditLog` entry. Profiles render the changelog.
- **Consequence:** Corrections are additive; history is reconstructible.

## ADR-008 — No Authentication in MVI
- **Context:** No council accounts exist to grant; §33 MVI.
- **Decision:** Role model documented (Founder/Steward, Trustee, 5 councils, Researcher, Editor, Archivist, Contributor, Verified Contributor, Reviewer, Public User). Login deferred; `Contribution` table already carries submitter identity + review metadata.
- **Consequence:** No login exists that could promise verification. **No pay-to-verify by construction.**

## ADR-009 — Founder Representation
- **Context:** Directive records "Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi" as one office.
- **Decision:** One `Person` entity (`165-PERSON-000001`) with two ALIAS name variants. Split into two entities on Founder instruction (FLAG-02).
- **Consequence:** Anti-personality-cult structuring: recognition without ownership claims.

## ADR-010 — Institutional Visual Identity
- **Context:** §30 design philosophy; no blue/indigo.
- **Decision:** Warm parchment ground, deep-green ink/primary, brass accent, Iowan/Palatino/Georgia display serif, Amiri Arabic stack, all-small-caps institutional labels, hairline double rules, restrained dotted texture.
- **Consequence:** Dignified, scholarly, timeless; no generic Islamic template, no theatrical animation.

---

## Data Dictionary (core)

| Table | Purpose | Key columns |
|---|---|---|
| `Entity` | One row per real-world thing (16 types) | `globalId` (165-PERSON-000001), `slug`, `type`, `primaryName`, `summary` (+`Id`/`Ar`), `evidenceLevel` A–F, `verificationStatus` (7 states), `startDate/endDate` + precision, `lat/lng`, `region`, `details` (JSON), `visibility` |
| `NameVariant` | Multilingual names/aliases | `name`, `language` (id/en/ar/ln), `kind` (PRIMARY/ALIAS/VARIANT/TRANSLITERATION/TITLE) |
| `Relationship` | Typed, sourced edges | `predicate` (27 vocab), both directions, `evidenceLevel`, `verificationStatus`, `sourceRef`, `context` |
| `ClaimSource` | Claim ↔ Source stance | `stance` SUPPORTED_BY / DISPUTED_BY, `note` |
| `SanadLink` | Display-only sanad chain links | `order`, `fromName`, `toName`, `personEntityId`, `sourceRef`, `evidenceLevel`, `verificationStatus` |
| `CollectionItem` | Collection containment | `order`, `note` |
| `VersionSnapshot` | Point-in-time entity state | `version`, `snapshot` JSON, `changedBy`, `reason` |
| `AuditLog` | Institutional audit trail | `actor`, `action`, `target`, `detail` |
| `Contribution` | Public submissions workflow | `reference` 165-SUB-YYYY-NNNNN, `kind`, `payload` JSON, `status` (10 states), `statusNote`, `reviewedBy` |

## API Surface (v1)

| Endpoint | Methods | Notes |
|---|---|---|
| `/api/entities` | GET | list/search, `?q=&type=&limit=&stats=1` |
| `/api/entities/[slug]` | GET | full profile: relations (both directions), stances, collection items, versions |
| `/api/search` | GET | grouped-by-type results |
| `/api/stats` | GET | counts by type, relations, sanad, contributions |
| `/api/timeline` | GET | events; undated always last (honest uncertainty) |
| `/api/graph` | GET | nodes + typed edges |
| `/api/terms` | GET | glossary with multilingual variants |
| `/api/ask` | POST | retrieval-grounded Q&A, non-fabricating, rate-limited |
| `/api/contribute` | POST/GET | submit (zod-validated, rate-limited) / status lookup by reference |

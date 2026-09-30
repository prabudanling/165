# 009 — 165 SOURCE & CITATION POLICY

**Project:** 165.web.id  
**Vision:** TQN Qodiriyah wa Naqsyabandiyah Global Knowledge, Heritage & Digital Preservation Platform  
**Document ID:** 165-009  
**Version:** 1.0  
**Status:** MASTER DRAFT — SOURCE & CITATION BASELINE  
**Owner:** Founder & Chief Architect — 165.web.id  
**Prepared:** 2026-10-01

---

# 1. PURPOSE

Dokumen ini menetapkan standar sumber, evidence, provenance, dan citation untuk seluruh ekosistem 165.

Tujuan utamanya:

> **Setiap pengetahuan penting di 165 harus memiliki jejak bukti yang dapat ditelusuri.**

Policy ini mengatur discovery, registration, assessment, verification, citation, preservation, versioning, correction, source-to-claim mapping, dan machine-readable evidence.

---

# 2. CORE PRINCIPLES

1. Source before assertion.
2. Traceability before appearance.
3. Primary evidence where available.
4. Attribution before synthesis.
5. Preserve uncertainty.
6. Never fabricate citations.
7. Never cite a source that does not support the claim.
8. Authority/title is not a substitute for evidence.
9. Preserve original context.
10. Keep citation metadata separate from prose.
11. Preserve version history.
12. Prefer persistent identifiers where available.
13. Make important evidence machine-readable.
14. Design for migration and long-term preservation.
15. Treat the source record as institutional memory.

---

# 3. SCOPE

Berlaku untuk:

- website articles,
- biographies,
- historical timelines,
- glossary,
- research publications,
- manuscripts,
- photographs,
- audio/video,
- oral histories,
- documentaries,
- social-media derivatives,
- newsletters,
- education,
- AI-assisted content,
- database,
- knowledge graph,
- API,
- internal research packets,
- future 165 products.

---

# 4. CANONICAL SOURCE ID

Setiap source penting diberi:

`165-SRC-####`

Contoh:

`165-SRC-0001`

Source ID tetap dipertahankan walaupun metadata diperbaiki, URL berubah, atau source kemudian direklasifikasi.

---

# 5. SOURCE TYPES

Controlled vocabulary:

- MANUSCRIPT
- BOOK
- BOOK_CHAPTER
- JOURNAL_ARTICLE
- THESIS
- INSTITUTIONAL_DOCUMENT
- ARCHIVAL_RECORD
- LETTER
- PERIODICAL
- PHOTOGRAPH
- AUDIO
- VIDEO
- ORAL_HISTORY
- INSCRIPTION
- WEBSITE
- SOCIAL_MEDIA
- DATABASE
- DATASET
- INTERVIEW
- OTHER

---

# 6. SOURCE CLASSES

### PRIMARY
Evidence yang dekat dengan objek/peristiwa.

### SECONDARY
Penelitian atau sintesis berdasarkan sumber lain.

### INSTITUTIONAL
Sumber resmi/terbitan institusi.

### ORAL / LIVING TRADITION
Kesaksian, memori, tradisi komunitas.

### TERTIARY / DISCOVERY
Sumber untuk menemukan lead atau konteks awal.

Satu sumber dapat mempunyai lebih dari satu atribut klasifikasi.

---

# 7. MINIMUM SOURCE RECORD

Setiap source record sedapat mungkin memiliki:

```text
Source ID
Title
Creator / Author
Date
Source Type
Source Class
Language
Publisher / Institution
Edition
Volume / Issue / Page
Repository / Custodian
Canonical Location
Persistent Identifier
URL
Access Date
Provenance Note
Rights Status
Citation Key
Evidence Status
Review Status
Notes
Created
Updated
```

---

# 8. SOURCE VS OBJECT VS CONTENT

Bedakan:

### SOURCE
Asal informasi.

`165-SRC-0012`

### OBJECT
Objek archive/heritage.

`165-MSS-0041`

### CONTENT
Artikel/halaman yang menggunakan source.

`165-CNT-0187`

Hubungan:

```text
165-MSS-0041
   ↓ supported by
165-SRC-0012
   ↓ cited by
165-CNT-0187
```

---

# 9. CLAIM OBJECT

Gunakan konsep:

`165-CLM-####`

Minimum:

```text
Claim ID
Content ID
Claim Text
Claim Type
Evidence Status
Confidence Status
Source IDs
Evidence Locations
Reviewer
Date Checked
Notes
```

Tujuan:

> memetakan setiap material claim ke evidence yang mendukungnya.

---

# 10. SOURCE-TO-CLAIM MODEL

```text
CLAIM
  │
  ├── SUPPORTED_BY → SOURCE
  ├── LOCATED_AT → PAGE / FOLIO / TIMESTAMP
  ├── DISCUSSED_IN → RESEARCH
  └── PUBLISHED_IN → CONTENT
```

Model ini memungkinkan 165 menjawab:

- Apa sumber pernyataan ini?
- Di halaman/folio/timestamp mana?
- Artikel apa saja yang memakai source tersebut?

---

# 11. EVIDENCE STATUS

Gunakan:

### CONFIRMED
Evidence memadai dan tidak ditemukan contradiction material.

### WELL-SUPPORTED
Didukung beberapa sumber kredibel dengan keterbatasan tertentu.

### SOURCE-DEPENDENT
Berasal terutama dari source/tradition tertentu dan harus diatribusikan.

### DISPUTED
Ada perbedaan sumber atau interpretasi material.

### UNRESOLVED
Belum cukup evidence untuk kesimpulan.

### UNVERIFIED
Belum diverifikasi.

Bahasa publik tidak boleh lebih pasti daripada evidence status.

---

# 12. SOURCE STATUS

- UNASSESSED
- DISCOVERED
- REGISTERED
- REVIEWED
- VERIFIED
- DISPUTED
- SUPERSEDED
- RETIRED

`DISCOVERED` berarti baru ditemukan sebagai lead; belum berarti verified.

---

# 13. SOURCE ASSESSMENT

Nilai terpisah:

- Provenance: Strong / Moderate / Weak / Unknown
- Authenticity: Strong / Moderate / Weak / Unknown
- Context: Complete / Partial / Unknown
- Corroboration: Strong / Moderate / Limited / None
- Editorial History: Clear / Partial / Unknown

Jangan menggunakan satu angka “truth score” yang menyederhanakan seluruh masalah.

---

# 14. PRIMARY SOURCE POLICY

Primary source harus dinilai berdasarkan:

- provenance,
- authenticity,
- date,
- authorship,
- context,
- custody,
- transmission,
- condition,
- possible alteration.

Primary source tidak otomatis sempurna; ia dapat bias, tidak lengkap, atau bermasalah dalam transmission.

---

# 15. SECONDARY SOURCE POLICY

Sumber akademik harus dibedakan dari primary evidence.

Jika peneliti menginterpretasikan manuskrip, jangan mengubah interpretasi peneliti menjadi seolah-olah isi langsung manuskrip.

Gunakan attribution:

> “Menurut penelitian X...”

---

# 16. INSTITUTIONAL SOURCE POLICY

Gunakan untuk:

- official chronology,
- institutional history,
- official statements,
- organizational information.

Atribusi harus jelas, misalnya:

> “Menurut riwayat resmi [institusi]...”

Institutional status tidak menggantikan source evaluation.

---

# 17. ORAL HISTORY POLICY

Minimum metadata:

```text
Interview ID
Interviewee
Interviewer
Date
Location
Consent
Recording
Transcript
Language
Relationship to subject
Relevant Context
Editorial Status
```

Oral history adalah evidence berharga dengan karakter berbeda dari contemporaneous documentary records.

---

# 18. FAMILY ARCHIVE POLICY

Record:

- custodian,
- relation,
- submission/acquisition context,
- original filename,
- physical description,
- date estimate,
- provenance,
- permission,
- restrictions.

Do not convert family testimony into objective fact without appropriate corroboration.

---

# 19. WEBSITE SOURCE POLICY

Record:

- website title,
- page title,
- author/organization,
- publication date,
- modified date,
- canonical URL,
- access date,
- archived copy where appropriate,
- relevant section.

Jangan mengutip homepage untuk klaim yang sebenarnya berada di subpage.

---

# 20. SOCIAL MEDIA SOURCE POLICY

Social media dapat menjadi:

- evidence bahwa akun tertentu membuat public statement,
- discovery source,
- contextual source,
- community testimony.

Record:

- platform,
- account,
- post ID if available,
- date,
- text/media,
- URL,
- access date,
- capture/archive status,
- authenticity notes.

Viralitas bukan bukti kebenaran.

---

# 21. NEWS SOURCE POLICY

News dapat membantu chronology, public statements, dan contemporary context.

Untuk major claims, sedapat mungkin cari primary statement/document atau independent corroboration.

---

# 22. SOURCE INDEPENDENCE

Corroboration harus mempertimbangkan apakah sources benar-benar independen.

Gunakan relationship types:

- DERIVED_FROM
- QUOTES_FROM
- TRANSLATES
- REPRODUCES
- SUMMARIZES
- EDITS
- REFERENCES

Sepuluh artikel yang semuanya menyalin satu sumber bukan sepuluh independent evidence streams.

---

# 23. EVIDENCE LOCATION

Citation harus sedapat mungkin menuju lokasi evidence:

- Book → page/chapter/volume
- Manuscript → folio/page/line
- PDF → page/section
- Audio → timestamp
- Video → timestamp
- Oral history → timestamp/transcript page
- Website → heading/section

---

# 24. BIBLIOGRAPHIC COMPLETENESS

Book:
- author
- title
- edition
- publisher
- place
- year
- ISBN if present
- volume/pages

Journal:
- author
- title
- journal
- volume
- issue
- year
- pages
- DOI if present

Thesis:
- author
- title
- institution
- degree
- year
- repository reference

---

# 25. PERSISTENT IDENTIFIERS

Simpan identifier yang memang tersedia:

- DOI
- ISBN
- ISSN
- ORCID
- Handle
- ARK
- repository ID
- accession number
- catalog number

165 juga menggunakan internal Permanent ID.

Jangan mengganti identifier eksternal dengan ID internal; simpan keduanya.

---

# 26. CITATION KEY

Contoh:

`165SRC_SAMBAS_FATHARIFIN_1880`

Citation key tidak menggantikan:

`165-SRC-0007`

---

# 27. CITATION OUTPUT

Canonical bibliographic metadata disimpan secara structured.

Output dapat mendukung:

- Chicago
- APA
- MLA
- footnotes
- bibliography
- BibTeX
- RIS
- CSL JSON

**Structured source record is canonical; citation formatting is presentation.**

---

# 28. FOOTNOTES

Untuk research-heavy historical content, footnotes dapat menjadi default.

Footnotes harus menunjuk source dan evidence location bila tersedia.

---

# 29. PUBLIC CITATION

Untuk public education pages:

> [1] Source

dengan expandable details.

Tujuan: readable tanpa kehilangan traceability.

---

# 30. RESEARCHER MODE

Research users dapat melihat:

- full bibliographic metadata,
- page/folio/timestamp,
- repository/call number,
- persistent IDs,
- rights,
- related claims,
- related sources.

---

# 31. SOURCE PANEL

Website sebaiknya memiliki:

> **Sources & Evidence**

dengan:

- primary sources,
- scholarly sources,
- institutional sources,
- oral sources,
- archive objects,
- related claims.

---

# 32. SOURCE GRAPH

Kelak:

```text
SOURCE
 ↓
CLAIMS
 ↓
CONTENT
 ↓
PEOPLE
 ↓
PLACES
 ↓
DOCUMENTS
 ↓
MEDIA
```

Ini menjadi foundation Knowledge Graph.

---

# 33. REVERSE LOOKUP

165 harus mampu menemukan:

> Semua content yang menggunakan Source X.

Dan:

> Semua source yang digunakan Content Y.

Penting untuk correction, source retirement, rights review, dan audit.

---

# 34. RETIRED / PROBLEMATIC SOURCE

Jika source bermasalah:

1. jangan hapus record diam-diam,
2. ubah status,
3. jelaskan alasannya,
4. identifikasi affected claims,
5. review affected content,
6. update dependent publications.

---

# 35. SOURCE VERSIONING

Edition yang berbeda harus dicatat sebagai bibliographic versions jika material.

Jangan mencampur page references dari edition A dengan metadata edition B.

---

# 36. DIGITAL SOURCE PRESERVATION

Untuk important digital sources, simpan bila legal/practical:

- canonical URL,
- access date,
- archive/snapshot,
- saved copy,
- integrity information,
- repository ID.

Citation status dan preservation status harus terpisah.

---

# 37. DEAD LINKS

Jika URL mati:

- jangan hapus citation,
- cari replacement,
- cari archived copy,
- update target,
- simpan original URL.

---

# 38. UNDated SOURCES

Jika tidak ada tanggal:

`n.d.` / no date.

Jangan membuat tanggal palsu.

Tanggal estimasi harus diberi label:

`estimated`

serta alasan estimasinya.

---

# 39. UNKNOWN AUTHOR / TITLE

Jika author tidak diketahui:

- gunakan institution jika jelas,
- atau anonymous/unknown sesuai style.

Jika title tidak ada:

- gunakan descriptive title,
- tandai bahwa itu editorial metadata.

Jangan menyamarkan descriptive title sebagai original title.

---

# 40. TRANSLATION

Simpan:

- original title,
- original language,
- translator,
- translated title,
- edition,
- publisher/pages.

Jika terjemahan dibuat 165:

> **165 translation**

Terjemahan harus mempertahankan uncertainty dan attribution dari sumber.

---

# 41. TRANSCRIPTION

Pisahkan:

### ORIGINAL
File/sumber asli.

### TRANSCRIPTION
Hasil penyalinan.

### TRANSLATION
Alih bahasa.

### EDITORIAL NORMALIZATION
Penyesuaian untuk readability.

---

# 42. OCR

OCR:

`MACHINE GENERATED — NOT VERIFIED`

Setelah human verification:

`HUMAN VERIFIED TRANSCRIPT`

Jika sebagian:

`PARTIALLY VERIFIED`

---

# 43. AI-GENERATED CITATION POLICY

AI tidak boleh memasukkan citation ke canonical source registry tanpa verification.

Workflow:

```text
AI SUGGESTION
 ↓
SOURCE DISCOVERY
 ↓
HUMAN VERIFICATION
 ↓
REGISTER SOURCE
 ↓
APPROVED CITATION
```

Fluent text is not evidence.

---

# 44. SOURCE DISCOVERY VS VERIFICATION

Search engine membantu menemukan source.

Source registry menyimpan source yang sudah diperiksa sesuai workflow.

Tidak boleh menyamakan:

> “Search menemukan”

dengan:

> “165 memverifikasi”.

---

# 45. CLAIM COVERAGE

Metrik internal:

`Claim Coverage = material claims with mapped evidence / total material claims`

Tujuan: meningkatkan evidence coverage, bukan membuat artikel terlihat akademik.

---

# 46. SOURCE AUDIT

Audit berkala:

- source existence,
- citation support,
- page references,
- URL validity,
- duplicate sources,
- metadata completeness,
- source status,
- edition accuracy,
- rights,
- unsupported claims.

---

# 47. SOURCE CONFLICT MATRIX

Gunakan:

| Topic | Source A | Source B | Difference | Possible Explanation | Status |
|---|---|---|---|---|---|

Tidak semua conflict harus dipaksa menjadi satu jawaban.

---

# 48. NEGATIVE EVIDENCE

Ketiadaan source bukan otomatis bukti bahwa peristiwa tidak pernah terjadi.

Gunakan wording:

> “165 belum menemukan sumber yang dapat diakses yang mendokumentasikan X sampai [tanggal review].”

---

# 49. SEARCH / RESEARCH LOG

Untuk difficult research:

- query,
- date,
- repository/database,
- researcher,
- result notes.

Ini mendukung reproducibility.

---

# 50. SOURCE ACCESS LEVEL

Gunakan:

`PUBLIC`

`REGISTERED`

`RESEARCH`

`RESTRICTED`

`PRIVATE`

Citation tetap dapat ada meskipun underlying object restricted, jika disclosure aman dan lawful.

---

# 51. RIGHTS VS CITATION

Citation rights berbeda dari reproduction rights.

Source dapat:

- boleh dikutip,
- tetapi tidak boleh direproduksi penuh.

Rights status harus menjadi field terpisah.

---

# 52. COPYRIGHT

Jangan mengasumsikan karya tua otomatis public domain.

Rights assessment bergantung pada yurisdiksi dan fakta karya.

Untuk ketidakpastian material, lakukan legal review.

---

# 53. PROVENANCE VS CITATION

Citation menjawab:

> “Dari mana informasi ini berasal?”

Provenance menjawab:

> “Bagaimana objek ini sampai kepada kita?”

Keduanya saling terhubung tetapi bukan hal yang sama.

---

# 54. CHAIN OF CUSTODY

Untuk archive sensitif:

```text
Original Custodian
 ↓
Transfer
 ↓
165 Intake
 ↓
Digitization
 ↓
Preservation
 ↓
Publication / Restricted Access
```

---

# 55. SOURCE REGISTRY — DATABASE MODEL

Suggested fields:

```text
source_id
source_type
source_class
title_original
title_display
creator
creator_ids
date_original
date_published
date_accessed
language
publisher
institution
edition
volume
issue
pages
repository
call_number
accession_number
doi
isbn
issn
orcid
handle
ark
url
archived_url
provenance
rights_status
access_level
source_status
review_status
citation_key
abstract
notes
created_at
updated_at
```

---

# 56. CLAIM DATABASE MODEL

```text
claim_id
content_id
claim_text
claim_type
evidence_status
confidence_status
source_ids
evidence_locations
reviewer_id
review_date
conflict_ids
notes
created_at
updated_at
```

---

# 57. RELATIONSHIP VOCABULARY

Approved relationship candidates:

- SUPPORTS
- CONTRADICTS
- DERIVED_FROM
- QUOTES
- TRANSLATES
- SUMMARIZES
- EDITS
- REPRODUCES
- DIGITIZES
- REFERENCES
- SUPERSEDES
- IS_VERSION_OF
- HELD_BY
- PUBLISHED_BY

---

# 58. KNOWLEDGE GRAPH

Example:

```text
165-SRC-0007
 ├─ SUPPORTS → 165-CLM-0003
 ├─ REFERENCES → 165-PER-0008
 ├─ REFERENCES → 165-PLC-0011
 └─ USED_BY → 165-CNT-0023
```

---

# 59. SOURCE EXPORT

Research users should eventually be able to export:

- BibTeX
- RIS
- CSL JSON
- citation text
- metadata JSON

---

# 60. SOURCE IMPORT

Potential imports:

- CSV
- BibTeX
- RIS
- DOI metadata
- repository export
- archival structured records

Imported metadata remains subject to validation.

---

# 61. DUPLICATE CONTROL

Possible duplicate matching:

- title,
- author,
- date,
- ISBN/DOI,
- repository ID,
- accession number,
- normalized metadata.

AI may suggest matches; final merge follows controlled verification.

---

# 62. SOURCE MERGE

Example:

```text
SRC-0012
SRC-0089
 ↓
MERGE
 ↓
SRC-0012
```

Keep redirect:

`SRC-0089 → SRC-0012`

Historical references must remain resolvable.

---

# 63. SOURCE SPLIT

If one record contains multiple distinct works:

- create new IDs,
- split metadata,
- migrate affected content,
- preserve audit trail.

---

# 64. NAME AUTHORITY

Creator records should support:

- canonical name,
- aliases,
- titles,
- alternative spellings,
- external IDs where applicable.

Do not merge people only because names are similar.

---

# 65. DATE NORMALIZATION

Store:

- original date expression,
- normalized date,
- calendar,
- uncertainty.

Original expression must remain preserved.

---

# 66. HISTORICAL SPELLING

Preserve original spelling where historically significant.

Store normalized search form separately.

---

# 67. SOURCE NOTE VS INTERPRETATION

Source note:

> What does the source contain?

Interpretation:

> What may this mean?

Keep the two conceptually separate.

---

# 68. EVIDENCE-DRIVEN SYNTHESIS

When combining sources, map relevant claims to relevant sources.

Avoid one citation covering a paragraph containing unrelated claims.

---

# 69. RESEARCH PACKET

Major research projects should have:

```text
165-SPK-####
Research Question
Scope
Source Register
Claim Register
Evidence Extracts
Notes
Images / Files
Bibliography
Conflicting Sources
Working Conclusions
Reviewer Notes
Draft
```

---

# 70. SOURCE-DRIVEN CONTENT MODEL

Canonical chain:

```text
SOURCE
 ↓
PROVENANCE
 ↓
EVIDENCE
 ↓
CLAIM
 ↓
CONTENT
 ↓
DISTRIBUTION
 ↓
KNOWLEDGE GRAPH
 ↓
PRESERVATION
```

---

# 71. AI TRACEABILITY

Future 165 AI should be able to answer:

> “Why does 165 say this?”

with:

- claim,
- supporting sources,
- evidence location,
- source class,
- uncertainty,
- review date.

---

# 72. SECURITY

Restricted source material must not leak through:

- public search indexing,
- AI retrieval,
- public APIs,
- browser cache,
- exposed storage,
- downloadable derivatives.

Access controls apply to human and machine access.

---

# 73. DATA INTEGRITY

Canonical source records require:

- validation,
- backups,
- version history,
- audit trail.

Important digital files should use integrity checks where appropriate.

---

# 74. MIGRATION

Critical metadata must not live only in one CMS.

Source registry should be exportable in documented structured forms.

---

# 75. RELATION TO OTHER DOCUMENTS

Document 009 directly supports:

- 008 — Editorial Constitution
- 010 — Correction, Retraction & Dispute Policy
- 013 — History Methodology
- 031 — Knowledge Architecture
- 033 — Glossary
- 051 — People Data Model
- 054 — Silsilah Data Model
- 068 — Knowledge Graph Specification
- 079 — Metadata Standard
- 080 — Preservation Metadata
- 082 — Provenance
- 088 — Information Architecture
- 092 — Search Architecture
- 094 — Structured Data
- 121 — Research Charter
- 122 — Research Methodology
- 123 — Bibliography & Citation Standard
- 132 — Knowledge Graph & Ontology
- 134 — AI Research Assistant

---

# 76. IMPLEMENTATION TASKS

## SOURCE REGISTRY

- [ ] Create `165-SRC` schema
- [ ] Create source table
- [ ] Create entry form
- [ ] Create source review workflow
- [ ] Add persistent identifier fields
- [ ] Add provenance fields
- [ ] Add rights/access fields

## CLAIM SYSTEM

- [ ] Create `165-CLM` schema
- [ ] Map claims to sources
- [ ] Add evidence locations
- [ ] Add reviewer/status

## CITATION ENGINE

- [ ] Select canonical structured metadata format
- [ ] Add Chicago output
- [ ] Add APA output
- [ ] Add bibliography export
- [ ] Add BibTeX/RIS/CSL JSON where practical

## WEBSITE

- [ ] Source panel
- [ ] Evidence panel
- [ ] Source detail page
- [ ] Related claims
- [ ] Related content
- [ ] Citation export

## AI

- [ ] Source-grounded retrieval
- [ ] Citation traceability
- [ ] Unsupported-claim detection
- [ ] Source-status filtering

---

# 77. DEFINITION OF DONE

Document 009 is ready for APPROVAL when:

- [ ] source types approved
- [ ] source classes approved
- [ ] `165-SRC-####` approved
- [ ] `165-CLM-####` approved
- [ ] claim-to-source mapping approved
- [ ] evidence-location policy approved
- [ ] citation output policy approved
- [ ] digital source preservation policy approved
- [ ] source versioning approved
- [ ] duplicate/merge policy approved
- [ ] oral-history source policy approved
- [ ] AI citation policy approved
- [ ] rights/citation distinction approved
- [ ] website mapping exists
- [ ] database mapping exists
- [ ] knowledge-graph mapping exists

---

# 78. MASTER FORMULA

> **SOURCE → PROVENANCE → EVIDENCE → CLAIM → CITATION → CONTENT → DISTRIBUTION → KNOWLEDGE GRAPH → PRESERVATION**

Citation is not decoration.

> **Citation is the bridge between what 165 says and why 165 is entitled to say it.**

---

# 79. NEXT DOCUMENT

## 010 — 165 CORRECTION, RETRACTION & DISPUTE POLICY

Document 010 akan menetapkan bagaimana 165 bertindak ketika:

- terjadi factual error,
- source bermasalah,
- user/reader mengajukan correction,
- dua sources bertentangan,
- research baru muncul,
- content harus direvisi,
- atau publication harus ditarik.

**009 menjawab:** “Dari mana pengetahuan 165 berasal?”

**010 menjawab:** “Apa yang dilakukan 165 ketika pengetahuan itu perlu diperbaiki?”

---

# 80. SAVE & CONTROL

**Canonical filename:**

`009_165_SOURCE_AND_CITATION_POLICY_v1_0.md`

**Canonical location:**

`165/01-CONSTITUTION/009_165_SOURCE_AND_CITATION_POLICY.md`

**Register in:**

`165/00-CONTROL/000_165_MASTER_SYSTEM_CONTROL_AND_INDEX.md`

**Change log:**

```text
2026-10-01
DOC-009
Created 165 Source & Citation Policy v1.0
Status: MASTER DRAFT
Purpose: Source registry, evidence traceability and citation baseline
Next document: DOC-010
```

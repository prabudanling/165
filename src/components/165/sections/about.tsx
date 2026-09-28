'use client'

// 165 — ABOUT: Institution · Founder · Governance · Ethics & Method · Contact
import { Landmark, ScrollText, ShieldCheck, User, Mail } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { EntitySummaryDTO } from '@/lib/165'
import { EntityCard } from '../entity-card'
import { EvidenceBadge, HonestNote, Kicker, SectionHeading, SkeletonCard, useApi } from '../ui'

const TABS = [
  { key: 'institution', label: 'The Institution', icon: Landmark },
  { key: 'founder', label: 'Founder', icon: User },
  { key: 'governance', label: 'Governance', icon: ShieldCheck },
  { key: 'ethics', label: 'Ethics & Method', icon: ScrollText },
  { key: 'contact', label: 'Contact', icon: Mail },
] as const

export function AboutSection({ onOpenEntity, onNavigate }: { onOpenEntity: (slug: string) => void; onNavigate: (s: string) => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('institution')
  return (
    <div className="space-y-6">
      <SectionHeading
        kicker="About 165"
        title="An institution, established"
        lede="What 165 is, who established it, how it is governed, and the ethics that bind every record."
      />
      <div role="tablist" aria-label="About views" className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
            className={cn('inline-flex h-9 items-center gap-1.5 rounded-sm border px-3.5 text-[13px] font-medium transition-colors',
              tab === t.key ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-[var(--brass)]/50')}>
            <t.icon className="size-3.5" aria-hidden /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'institution' && <InstitutionPane onOpenEntity={onOpenEntity} onNavigate={onNavigate} />}
      {tab === 'founder' && <FounderPane onOpenEntity={onOpenEntity} />}
      {tab === 'governance' && <GovernancePane />}
      {tab === 'ethics' && <EthicsPane onNavigate={onNavigate} />}
      {tab === 'contact' && <ContactPane onNavigate={onNavigate} />}
    </div>
  )
}

function InstitutionPane({ onOpenEntity, onNavigate }: { onOpenEntity: (slug: string) => void; onNavigate: (s: string) => void }) {
  const { data, loading } = useApi<{ entities: EntitySummaryDTO[] }>('/api/entities?type=INSTITUTION')
  return (
    <div className="space-y-5">
      <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed">
        <p>
          <strong>165</strong> is the digital knowledge, heritage and preservation institution of{' '}
          <strong>TQN Qodiriah Naqsabandiyah</strong>. It exists so that the knowledge of the tradition — its people,
          institutions, places, works, documents and memories — can be held with citation-grade care and passed on intact.
        </p>
        <p>
          The platform is built on one master principle — <em>One Source, Many Experiences</em> — and one epistemic rule:{' '}
          <em>never appear more authoritative than the evidence allows.</em>
        </p>
      </div>
      {loading ? <SkeletonCard /> : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(data?.entities ?? []).map((e) => <EntityCard key={e.id} entity={e} onOpen={onOpenEntity} />)}
        </div>
      )}

      <section aria-labelledby="flags-h" className="rounded-md border border-border bg-card p-5 sm:p-6">
        <Kicker>Cross-reference flags — discovery, Phase 0</Kicker>
        <h3 id="flags-h" className="font-display mt-1.5 text-[15px] font-semibold">Open items requiring Founder decision</h3>
        <ul className="text-muted-foreground mt-3 space-y-2.5 text-[13px] leading-relaxed">
          <li className="flex gap-2"><span className="text-[var(--brass)] font-mono shrink-0">FLAG-01</span> Seven founding documents (Constitutions, Founder&apos;s Charter, Master Blueprint) were declared but not located. No page claims to represent them until deposit and review.</li>
          <li className="flex gap-2"><span className="text-[var(--brass)] font-mono shrink-0">FLAG-02</span> The founder is recorded as one office — &ldquo;Gugun Gunara — Muhammad Lutfi Azmi&rdquo; — represented as one person with two name variants. If they are two individuals, the record will be split.</li>
          <li className="flex gap-2"><span className="text-[var(--brass)] font-mono shrink-0">FLAG-03</span> No founding date appears in accessible sources. The founding event is recorded without a date rather than inventing one.</li>
          <li className="flex gap-2"><span className="text-[var(--brass)] font-mono shrink-0">FLAG-04</span> Authentication and council accounts are architected but deferred until councils are constituted — no login exists that could promise verification.</li>
        </ul>
      </section>

      <button onClick={() => onNavigate('trust')} className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm underline decoration-dotted underline-offset-4">
        Read the full trust architecture <span aria-hidden>→</span>
      </button>
    </div>
  )
}

function FounderPane({ onOpenEntity }: { onOpenEntity: (slug: string) => void }) {
  const { data, loading } = useApi<{ entities: EntitySummaryDTO[] }>('/api/entities?type=PERSON&limit=50')
  const founder = (data?.entities ?? []).find((e) => e.slug === 'gugun-gunara-muhammad-lutfi-azmi')

  return (
    <div className="space-y-5">
      <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed">
        <p>
          <strong>Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi</strong> is recognized by this system as{' '}
          <strong>Founder &amp; Founding Steward of 165</strong> and <strong>Custodian of the Founding Vision</strong>.
        </p>
        <p className="text-muted-foreground">
          The institution is deliberately structured against personality cult: the Founder establishes the institution;
          the institution preserves the knowledge; the knowledge belongs to its proper sources, traditions, communities,
          authors and heritage contexts. The long-term steward is the system of governance — not any single person.
        </p>
      </div>
      {loading ? <SkeletonCard /> : founder ? (
        <div className="max-w-md"><EntityCard entity={founder} onOpen={onOpenEntity} /></div>
      ) : null}
    </div>
  )
}

function GovernancePane() {
  const councils = [
    ['Founder / Founding Steward', 'Custodian of the founding vision; establishes and stewards the institution.'],
    ['Trustee', 'Guardianship of the institution and its assets across generations.'],
    ['Scholarly Council', 'Reviews knowledge claims and their scholarly standing.'],
    ['Ethics Council', 'Adjudicates ethical questions, privacy and dignity of persons.'],
    ['Editorial Council', 'Runs the editorial workflow from screening to publication.'],
    ['Archive Council', 'Custody of documents, manuscripts and preservation standards.'],
    ['Technology Council', 'Architecture, security, data governance and AI supervision.'],
  ]
  const roles = [
    ['Researcher', 'Studies the records; produces research outputs.'],
    ['Editor', 'Edits and structures records within the workflow.'],
    ['Archivist', 'Registers documents and manages the archive.'],
    ['Verified Contributor', 'Contributor whose submissions have passed review.'],
    ['Contributor', 'Submits knowledge, sources, corrections — never auto-published.'],
    ['Reviewer', 'Performs source review and verification steps.'],
    ['Public User', 'Searches, reads, cites, and may contribute.'],
  ]
  return (
    <div className="space-y-6">
      <section aria-labelledby="councils-h">
        <Kicker>Governance structure</Kicker>
        <h3 id="councils-h" className="font-display mt-1.5 text-xl font-semibold tracking-tight">Councils</h3>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {councils.map(([t, d]) => (
            <li key={t} className="rounded-md border border-border bg-card p-4">
              <h4 className="font-display text-[14px] font-semibold">{t}</h4>
              <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">{d}</p>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="roles-h">
        <Kicker>Role-based permissions</Kicker>
        <h3 id="roles-h" className="font-display mt-1.5 text-xl font-semibold tracking-tight">Roles</h3>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map(([t, d]) => (
            <li key={t} className="rounded-md border border-border bg-card p-4">
              <h4 className="font-display text-[14px] font-semibold">{t}</h4>
              <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">{d}</p>
            </li>
          ))}
        </ul>
      </section>
      <HonestNote tone="green">
        <strong>No pay-to-verify.</strong> No payment can move any record toward verified status. Verification is a function
        of the councils and the evidence — nothing else. Council seats are established by the Founder&apos;s instruments;
        until those instruments are deposited, this page describes structure only.
      </HonestNote>
    </div>
  )
}

function EthicsPane({ onNavigate }: { onNavigate: (s: string) => void }) {
  return (
    <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed">
      <p><strong>Ethics of representation.</strong> Tradition is preserved as tradition. Oral history remains testimony.
        Competing accounts are shown side by side. Silence is stated, never filled with invention.</p>
      <p><strong>Ethics of persons.</strong> Living persons, students and contributors are protected by privacy-by-design.
        The platform publishes only what serves the knowledge, and never exposes private contact or participation.</p>
      <p><strong>Ethics of authority.</strong> 165 records claims about ijazah, baiat and spiritual authority only with sources;
        it confers no legitimacy and revokes none. Authority belongs to the traditions themselves.</p>
      <p><strong>Method.</strong> Evidence levels A–F grade every record; verification statuses state exactly where each record
        stands in review; version history keeps every change traceable. The full system is documented in{' '}
        <button onClick={() => onNavigate('trust')} className="underline underline-offset-2">Trust &amp; Method</button>.</p>
    </div>
  )
}

function ContactPane({ onNavigate }: { onNavigate: (s: string) => void }) {
  return (
    <div className="max-w-3xl space-y-5">
      <HonestNote tone="amber">
        <strong>Contact channels are being established.</strong> Official correspondence addresses will be published
        with the governance instruments. In the meantime, the contribution workflow is the institutional channel:
        every submission receives a permanent reference and enters the editorial workflow.
      </HonestNote>
      <button onClick={() => onNavigate('contribute')} className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-sm px-5 text-sm font-medium transition-colors">
        <Mail className="size-4" aria-hidden /> Submit knowledge, a source, or a correction
      </button>
    </div>
  )
}

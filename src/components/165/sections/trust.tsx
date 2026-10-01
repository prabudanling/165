'use client'

// 165 — TRUST & METHOD: the epistemic spine of the institution
// How 165 knows · Evidence levels · Verification statuses · Sanad safety ·
// Versioning · Corrections · Dispute · Contributor identity · Editorial review · AI policy
import { Accessibility, AppWindow, Braces, Eye, FileWarning, History, Languages, Link2, Lock, Scale, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { EVIDENCE_LEVELS, VERIFICATION_STATUSES } from '@/lib/165'
import { useI18n } from '@/lib/i18n'
import { EvidenceBadge, HonestNote, Kicker, SectionHeading, StatusBadge } from '../ui'
import { SanadRegistry } from '../sanad-registry'

export function TrustSection({ onOpenEntity }: { onOpenEntity?: (slug: string) => void }) {
  const { t } = useI18n()
  return (
    <div className="space-y-12">
      <SectionHeading
        kicker={t('sec.trust.kicker')}
        title={t('sec.trust.title')}
        lede={t('sec.trust.lede')}
      />

      {/* trust engine */}
      <section aria-labelledby="engine-h" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Eye, t: 'How 165 knows', d: 'A record is a claim plus its evidence. The interface never hides the difference.' },
          { icon: Link2, t: 'Source of source', d: 'Every statement traces back through typed relationships to an identified source.' },
          { icon: History, t: 'Never delete silently', d: 'Changes write version snapshots and audit entries. Corrections are additive.' },
          { icon: Users, t: 'Editorial review', d: 'Contribution ≠ publication. Public submissions pass through the council workflow.' },
        ].map((c) => (
          <div key={c.t} className="rounded-md border border-border bg-card p-5">
            <c.icon className="size-4.5 text-[var(--brass)]" aria-hidden />
            <h3 className="font-display mt-2.5 text-[15px] font-semibold">{c.t}</h3>
            <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">{c.d}</p>
          </div>
        ))}
      </section>

      {/* evidence levels */}
      <section aria-labelledby="ev-h">
        <Kicker>The evidence system</Kicker>
        <h2 id="ev-h" className="font-display mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">Six levels of evidence</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-[14px] leading-relaxed">
          Not all information deserves the same confidence. 165 grades evidence rather than flattening it.
        </p>
        <ul className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
          {Object.entries(EVIDENCE_LEVELS).map(([k, v]) => (
            <li key={k} className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
              <EvidenceBadge level={k} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-[14px] font-medium">{v.label.split('— ')[1]}</p>
                <p className="text-muted-foreground mt-0.5 text-[13px] leading-relaxed">{v.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* verification statuses */}
      <section aria-labelledby="vs-h">
        <Kicker>Verification statuses</Kicker>
        <h2 id="vs-h" className="font-display mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">Seven honest states</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(VERIFICATION_STATUSES).map(([k, v]) => (
            <span key={k} title={v.desc} className="inline-flex">
              <StatusBadge status={k} />
            </span>
          ))}
        </div>
        <p className="text-muted-foreground mt-3 max-w-2xl text-[14px] leading-relaxed">{VERIFICATION_STATUSES.DISPUTED.desc} {VERIFICATION_STATUSES.TRADITIONAL_ACCOUNT.desc}</p>
      </section>

      {/* the critical rule */}
      <section aria-labelledby="crit-h" className="rounded-lg border border-[var(--brass)]/40 bg-[var(--brass-soft)]/25 px-5 py-8 sm:px-8">
        <Scale className="size-5 text-[var(--brass)]" aria-hidden />
        <h2 id="crit-h" className="font-display mt-3 text-xl font-semibold tracking-tight sm:text-2xl">The Critical Historical Rule</h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed">
          165 will not turn tradition into fact, claims into fact, oral history into documentary fact,
          or community belief into verified history. Where two sources differ, 165 shows the difference —
          it never resolves silently.
        </p>
        <p className="font-display mt-4 text-[15px] font-semibold sm:text-base">
          &ldquo;Do not make 165 look more authoritative than its evidence allows — make it more trustworthy than it needs to appear.&rdquo;
        </p>
      </section>

      {/* sanad safety + sanad global registry (Task 26) */}
      <SanadRegistry onOpenEntity={onOpenEntity} />

      {/* AI policy */}
      <section aria-labelledby="ai-h">
        <Kicker>AI architecture</Kicker>
        <h2 id="ai-h" className="font-display mt-1.5 flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
          <Sparkles className="size-4.5 text-[var(--brass)]" aria-hidden /> Ask 165 — five commitments
        </h2>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-5">
          {['Source-grounded', 'Traceable', 'Uncertainty-aware', 'Non-fabricating', 'Human-supervised'].map((c) => (
            <li key={c} className="rounded-md border border-border bg-card px-3 py-2.5 text-center text-[13px] font-medium">{c}</li>
          ))}
        </ul>
        <HonestNote className="mt-4" tone="amber">
          <strong>Hard prohibition.</strong> 165&apos;s AI never fabricates sanad, ijazah, baiat, history, persons, sources,
          quotations, bibliographies, teacher–student relations, or spiritual authority. When the records are silent,
          the system answers: <em>&ldquo;This information is not verified in 165&apos;s records.&rdquo;</em>
        </HonestNote>
      </section>

      {/* dispute & corrections */}
      <section aria-labelledby="disp-h" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-5 sm:p-6">
          <FileWarning className="size-4.5 text-[var(--brass)]" aria-hidden />
          <h3 className="font-display mt-2.5 text-[15px] font-semibold">Dispute room &amp; corrections</h3>
          <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">
            Anyone may dispute a record or propose a correction through the contribution workflow. Disputed records
            remain visible with their dispute, pending review. Historical corrections preserve the previous version,
            the author, the reason and the date.
          </p>
        </div>
        <div className="rounded-md border border-border bg-card p-5 sm:p-6">
          <ShieldCheck className="size-4.5 text-[var(--brass)]" aria-hidden />
          <h3 className="font-display mt-2.5 text-[15px] font-semibold">No pay-to-verify · privacy by design</h3>
          <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">
            Verification is independent of payment — nothing can be bought to &ldquo;verified&rdquo; status.
            Living persons, students and contributors receive privacy protection by default.
          </p>
        </div>
      </section>

      {/* standar internasional — komitmen kualitas dunia, bahasa Indonesia dulu */}
      <section aria-labelledby="std-h">
        <Kicker>Standar internasional · International standards</Kicker>
        <h2 id="std-h" className="font-display mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
          Dibangun di atas standar dunia · Built on world standards
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Accessibility,
              t: 'WCAG 2.1 AA',
              d: 'Skip-link, kontras, fokus terlihat, prefers-reduced-motion, dan RTL penuh untuk 11 bahasa.',
            },
            {
              icon: Languages,
              t: 'ISO 639 · 178 bahasa',
              d: 'Registry bahasa dunia dengan label jujur: kurasi tangan, kurasi AI, fallback Bahasa Indonesia.',
            },
            {
              icon: Braces,
              t: 'Schema.org JSON-LD',
              d: 'Organization, WebSite & SearchAction terbaca mesin pencari dan asisten AI tanpa menebak.',
            },
            {
              icon: AppWindow,
              t: 'PWA · Open Graph',
              d: 'Manifest, ikon crest, theme-color, dan kartu OG — siap dipasang & dibagikan lintas platform.',
            },
            {
              icon: Lock,
              t: 'Privasi by design',
              d: 'Tanpa pelacak, tanpa cookie pihak ketiga; preferensi bahasa tersimpan lokal di perangkat Anda.',
            },
            {
              icon: History,
              t: 'Integritas data',
              d: 'Pure-append, audit trail, versi snapshot, dan ekspor statis — riwayat tidak pernah terhapus senyap.',
            },
          ].map((c) => (
            <li key={c.t} className="rounded-md border border-border bg-card p-5">
              <c.icon className="size-4.5 text-[var(--brass)]" aria-hidden />
              <h3 className="font-display mt-2.5 text-[15px] font-semibold">{c.t}</h3>
              <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">{c.d}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

'use client'

// 165 — ACADEMY: curriculum outline (planned) + multilingual glossary of terms
import { GraduationCap, Languages } from 'lucide-react'
import type { EntitySummaryDTO } from '@/lib/165'
import { EntityCard } from '../entity-card'
import { EvidenceBadge, EmptyState, Kicker, SectionHeading, SkeletonCard, StatusBadge, TypeBadge, useApi } from '../ui'

type Term = EntitySummaryDTO & { summary?: string | null; summaryId?: string | null; nameVariants: { name: string; language: string; kind: string }[] }

export function AcademySection({ onOpenEntity }: { onOpenEntity: (slug: string) => void }) {
  const { data, loading } = useApi<{ terms: Term[] }>('/api/terms')

  return (
    <div className="space-y-8">
      <SectionHeading
        kicker="Academy"
        title="Learning built on sources, not on authority"
        lede="The Academy will host courses, curriculum and fellowship — every lesson citing the records it rests on. Its foundations are laid here: the terminology system is already live."
      />

      {/* curriculum outline */}
      <section aria-labelledby="curr-h">
        <Kicker>Curriculum outline — planned structure</Kicker>
        <h2 id="curr-h" className="font-display mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">Four foundations of study</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Foundations', 'Tradition, terminology, and the epistemic framework — what 165 records and how it knows.'],
            ['Sources & Methods', 'Reading primary sources, oral history methodology, citation and provenance practice.'],
            ['Heritage & Preservation', 'Archival science for institutions: versioning, audit, digitisation, long-term custody.'],
            ['Fellowship', 'Research fellowship for scholars and archivists — application opens with the councils.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-md border border-border bg-card p-4 sm:p-5">
              <GraduationCap className="size-4 text-[var(--brass)]" aria-hidden />
              <h3 className="font-display mt-2.5 text-[15px] font-semibold">{t}</h3>
              <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">{d}</p>
              <p className="text-muted-foreground/70 mt-2 text-[11px] tracking-wider uppercase">planned · phase 4+</p>
            </div>
          ))}
        </div>
      </section>

      {/* glossary */}
      <section aria-labelledby="gloss-h">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <Kicker>Terminology system — live data</Kicker>
            <h2 id="gloss-h" className="font-display mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">Glossary of terms</h2>
            <p className="text-muted-foreground mt-1.5 max-w-2xl text-[13px] leading-relaxed">
              Definitions are deliberately cautious and generic: 165 records usage and context, it does not adjudicate doctrine.
              Terms carry multilingual forms (Indonesian · English · Arabic).
            </p>
          </div>
          <Languages className="size-5 text-[var(--brass)]" aria-hidden />
        </div>

        {loading && <div className="mt-4"><SkeletonCard /></div>}
        {!loading && (data?.terms ?? []).length === 0 && (
          <EmptyState title="No terms recorded yet" className="mt-4" />
        )}
        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {(data?.terms ?? []).map((t) => (
            <li key={t.id}>
              <button type="button" onClick={() => onOpenEntity(t.slug)}
                className="w-full rounded-md border border-border bg-card p-4 text-left transition-colors hover:border-[var(--brass)]/60 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-[15px] font-semibold sm:text-base">{t.primaryName}</h3>
                  <span className="font-arabic text-lg text-[var(--brass)]" lang="ar" dir="rtl">
                    {t.nameVariants.find((v) => v.language === 'ar')?.name ?? ''}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">{t.summary}</p>
                {t.summaryId && <p className="text-muted-foreground/90 mt-1 text-[13px] leading-relaxed italic">{t.summaryId}</p>}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <TypeBadge type={t.type} />
                  <EvidenceBadge level={t.evidenceLevel} />
                  <StatusBadge status={t.verificationStatus} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

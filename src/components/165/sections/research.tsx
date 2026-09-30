'use client'

// 165 — RESEARCH: research, publications, sources (bibliography), claims
import { FlaskConical, Library, Scale } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import type { EntitySummaryDTO } from '@/lib/165'
import { EntityCard } from '../entity-card'
import { EvidenceBadge, EmptyState, HonestNote, Kicker, SectionHeading, SkeletonCard, StatusBadge, useApi } from '../ui'

export function ResearchSection({ onOpenEntity, onNavigate }: { onOpenEntity: (slug: string) => void; onNavigate: (s: string) => void }) {
  const [tab, setTab] = useState<'research' | 'sources' | 'claims'>('sources')
  const { data, loading } = useApi<{ entities: EntitySummaryDTO[] }>('/api/entities?limit=200')
  const { t } = useI18n()

  const research = (data?.entities ?? []).filter((e) => e.type === 'RESEARCH')
  const sources = (data?.entities ?? []).filter((e) => e.type === 'SOURCE')
  const claims = (data?.entities ?? []).filter((e) => e.type === 'CLAIM')

  return (
    <div className="space-y-6">
      <SectionHeading
        kicker={t('sec.research.kicker')}
        title={t('sec.research.title')}
        lede={t('sec.research.lede')}
      />
      <div role="tablist" aria-label="Research views" className="flex flex-wrap gap-1.5">
        {([['sources', 'Sources & Bibliography', Library], ['claims', 'Claims Under Review', Scale], ['research', 'Research & Publications', FlaskConical]] as const).map(([k, label, Icon]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={cn('inline-flex h-9 items-center gap-1.5 rounded-sm border px-3.5 text-[13px] font-medium transition-colors',
              tab === k ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-[var(--brass)]/50')}>
            <Icon className="size-3.5" aria-hidden /> {label}
          </button>
        ))}
      </div>

      {loading && <SkeletonCard />}

      {!loading && tab === 'sources' && (
        <div className="space-y-3">
          <p className="text-muted-foreground text-[13px]">
            The <strong className="text-foreground">Source of Source</strong>: every record in 165 must trace to one of these.
          </p>
          {sources.map((s) => (
            <button key={s.id} type="button" onClick={() => onOpenEntity(s.slug)}
              className="w-full rounded-md border border-border bg-card p-4 text-left transition-colors hover:border-[var(--brass)]/60 sm:p-5">
              <div className="flex flex-wrap items-center gap-1.5">
                <EvidenceBadge level={s.evidenceLevel} withLabel />
                <StatusBadge status={s.verificationStatus} />
              </div>
              <h3 className="font-display mt-2 text-[15px] font-semibold sm:text-base">{s.primaryName}</h3>
              {s.subtitle && <p className="text-muted-foreground mt-0.5 text-[13px]">{s.subtitle}</p>}
            </button>
          ))}
        </div>
      )}

      {!loading && tab === 'claims' && (
        <div className="space-y-3">
          <HonestNote tone="amber">
            <strong>Critical Historical Rule.</strong> Where sources disagree, 165 displays the disagreement.
            Where no source exists, 165 asserts nothing. Tradition stays tradition; claims stay claims.
          </HonestNote>
          {claims.map((c) => (
            <button key={c.id} type="button" onClick={() => onOpenEntity(c.slug)}
              className="w-full rounded-md border border-border bg-card p-4 text-left transition-colors hover:border-[var(--brass)]/60 sm:p-5">
              <div className="flex flex-wrap items-center gap-1.5">
                <EvidenceBadge level={c.evidenceLevel} />
                <StatusBadge status={c.verificationStatus} />
              </div>
              <h3 className="font-display mt-2 text-[15px] font-semibold sm:text-base">{c.primaryName}</h3>
            </button>
          ))}
        </div>
      )}

      {!loading && tab === 'research' && (
        research.length === 0 ? (
          <EmptyState icon={FlaskConical} title="No publications yet">
            Research profiles, publications and bibliographies begin with the Founder&apos;s materials and the scholarly review cycle.{' '}
            <button onClick={() => onNavigate('contribute')} className="underline underline-offset-2">Propose research</button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {research.map((e) => <EntityCard key={e.id} entity={e} onOpen={onOpenEntity} />)}
          </div>
        )
      )}
    </div>
  )
}

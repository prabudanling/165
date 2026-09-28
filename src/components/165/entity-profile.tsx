'use client'

// 165 — Entity Profile: consistent profile architecture per Master Directive §17
// Header · Summary · Timeline · Relationships · Sources · Verification · Changelog · Related
import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRightLeft, CalendarClock, ExternalLink, Fingerprint, History, Scale, ScrollText, ShieldCheck, Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dateLabel, PREDICATES, type EntityProfileDTO, type RelationshipDTO } from '@/lib/165'
import { EvidenceBadge, HonestNote, SkeletonCard, StatusBadge, TypeBadge, useApi } from './ui'

function RelRow({ rel, onOpen }: { rel: RelationshipDTO; onOpen: (slug: string) => void }) {
  const pred = PREDICATES[rel.predicate as keyof typeof PREDICATES]
  const label = pred ? pred.label : rel.predicate.toLowerCase()
  const isIn = rel.direction === 'IN'
  return (
    <li className="flex flex-col gap-1.5 rounded-md border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 text-sm">
        <p className="text-muted-foreground text-[11px] uppercase tracking-wider">
          {isIn ? 'receives' : 'points to'} · {rel.predicate.replaceAll('_', ' ')}
        </p>
        <p className="mt-0.5">
          <button type="button" onClick={() => onOpen(rel.other.slug)} className="font-medium underline decoration-[var(--brass)]/50 decoration-1 underline-offset-2 hover:decoration-[var(--brass)]">
            {rel.other.primaryName}
          </button>
          <span className="text-muted-foreground"> — {isIn ? 'is ' : ''}{label} {isIn ? 'this entity' : ''}{isIn ? '' : ''}</span>
        </p>
        {rel.context && <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">{rel.context}</p>}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        <EvidenceBadge level={rel.evidenceLevel} withLabel />
        <StatusBadge status={rel.verificationStatus} />
        {rel.sourceRef && (
          <span className="text-muted-foreground/80 font-mono text-[10px]" title={`Source: ${rel.sourceRef}`}>
            src: {rel.sourceRef}
          </span>
        )}
      </div>
    </li>
  )
}

function DetailRow({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(90px,140px)_1fr] gap-2 px-4 py-2.5 text-sm sm:grid-cols-[160px_1fr] sm:px-5">
      <dt className="text-muted-foreground text-[12px] uppercase tracking-wider">{k}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  )
}

export function EntityProfile({ slug, onBack, onOpen }: { slug: string; onBack: () => void; onOpen: (slug: string) => void }) {
  const { data, loading, error } = useApi<{ profile: EntityProfileDTO }>(`/api/entities/${slug}`)
  const [showId, setShowId] = useState(false)

  const grouped = useMemo(() => {
    const g: Record<string, RelationshipDTO[]> = {}
    for (const r of data?.profile.relationships ?? []) (g[r.predicate] ??= []).push(r)
    return Object.entries(g).sort((a, b) => a[0].localeCompare(b[0]))
  }, [data])

  if (loading) return <div className="grid grid-cols-1 gap-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
  if (error || !data?.profile) {
    return (
      <HonestNote tone="rose">
        <strong>Entity could not be loaded.</strong> {error ?? 'Not found.'}
        <button onClick={onBack} className="ml-2 underline">Return to previous view</button>
      </HonestNote>
    )
  }

  const p = data.profile
  const dates = dateLabel(p.startDate, p.startDatePrecision, p.endDate, p.endDatePrecision)
  const details = p.details ?? {}

  return (
    <article className="min-w-0">
      {/* breadcrumb + back */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-sm px-1 py-1 text-[13px] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to {p.type === 'TERM' ? 'glossary' : 'previous view'}
        </button>
        <p className="text-muted-foreground/80 hidden font-mono text-[11px] sm:block">{p.globalId}</p>
      </div>

      {/* header */}
      <header className="mt-4 rounded-md border border-border bg-card p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-1.5">
          <TypeBadge type={p.type} />
          <EvidenceBadge level={p.evidenceLevel} withLabel />
          <StatusBadge status={p.verificationStatus} />
          {p.isExampleRecord && (
            <span className="rounded-sm border border-stone-400/40 bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-700">EXAMPLE RECORD</span>
          )}
        </div>
        <h1 className="font-display mt-3 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">{p.primaryName}</h1>
        {p.subtitle && <p className="text-muted-foreground mt-1.5 text-[15px]">{p.subtitle}</p>}
        <div className="rule-double mt-4 max-w-[120px]" aria-hidden />
        <div className="text-muted-foreground mt-4 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-3">
          <p className="inline-flex items-center gap-1.5"><Fingerprint className="size-3.5" aria-hidden /> <span className="font-mono">{p.globalId}</span></p>
          <p className="inline-flex items-center gap-1.5"><ScrollText className="size-3.5" aria-hidden /> canonical: <span className="font-mono">/{p.slug}</span></p>
          {dates && <p className="inline-flex items-center gap-1.5"><CalendarClock className="size-3.5" aria-hidden /> {dates}</p>}
        </div>
      </header>

      {/* summary */}
      {p.summary && (
        <section aria-labelledby="s-summary" className="mt-6">
          <h2 id="s-summary" className="label-caps text-muted-foreground text-[13px]">Summary</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed sm:text-base">{p.summary}</p>
          {p.summaryId && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowId((v) => !v)}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-[13px] underline decoration-dotted underline-offset-4"
                aria-expanded={showId}
              >
                <Languages className="size-3.5" aria-hidden /> {showId ? 'Sembunyikan' : 'Tampilkan'} versi Bahasa Indonesia
              </button>
              {showId && <p className="mt-2 max-w-3xl border-l-2 border-[var(--brass)]/50 pl-3 text-[15px] leading-relaxed italic">{p.summaryId}</p>}
            </div>
          )}
        </section>
      )}

      {/* detail grid */}
      <section aria-labelledby="s-details" className="mt-6">
        <h2 id="s-details" className="label-caps text-muted-foreground text-[13px]">Record details</h2>
        <dl className="mt-2 divide-y divide-border rounded-md border border-border bg-card">
          <DetailRow k="Verification">
            <span className="flex flex-wrap items-center gap-2">
              <StatusBadge status={p.verificationStatus} />
              <EvidenceBadge level={p.evidenceLevel} withLabel />
            </span>
          </DetailRow>
          <DetailRow k="Dating">{dates || <span className="text-muted-foreground">not recorded — uncertainty preserved</span>}</DetailRow>
          {p.region && <DetailRow k="Region">{p.region}</DetailRow>}
          {p.latitude != null && p.longitude != null && (
            <DetailRow k="Coordinates"><span className="font-mono text-[13px]">{p.latitude}, {p.longitude}</span></DetailRow>
          )}
          {p.visibility !== 'PUBLIC' && <DetailRow k="Visibility"><span className="font-mono">{p.visibility}</span></DetailRow>}
          {Object.entries(details).map(([k, v]) => (
            <DetailRow key={k} k={k.replaceAll('_', ' ')}>
              {typeof v === 'string' ? v : <span className="font-mono text-[12px] break-all">{JSON.stringify(v)}</span>}
            </DetailRow>
          ))}
        </dl>
      </section>

      {/* name variants */}
      {p.names.length > 0 && (
        <section aria-labelledby="s-names" className="mt-6">
          <h2 id="s-names" className="label-caps text-muted-foreground text-[13px]">Name variants &amp; multilingual forms</h2>
          <ul className="mt-2 divide-y divide-border rounded-md border border-border bg-card">
            {p.names.map((n, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-2.5 text-sm sm:px-5">
                <span className={cn('min-w-0', n.language === 'ar' && 'font-arabic text-[17px] leading-relaxed')}>{n.name}</span>
                <span className="text-muted-foreground font-mono text-[11px] uppercase">{n.kind.toLowerCase()} · {n.language}{n.note ? ` · ${n.note}` : ''}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* claim stances */}
      {p.type === 'CLAIM' && (
        <section aria-labelledby="s-claims" className="mt-6">
          <h2 id="s-claims" className="label-caps text-muted-foreground flex items-center gap-2 text-[13px]"><Scale className="size-3.5" aria-hidden /> Source stances</h2>
          {p.stances.length === 0 ? (
            <HonestNote className="mt-2" tone="amber">
              No source in 165&apos;s records either supports or disputes this claim. It stands <strong>unverified</strong> and 165 makes no assertion.
            </HonestNote>
          ) : (
            <ul className="mt-2 space-y-2">
              {p.stances.map((s, i) => (
                <li key={i} className="rounded-md border border-border bg-card px-4 py-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('rounded-sm border px-1.5 py-0.5 text-[11px] font-medium',
                      s.stance === 'SUPPORTED_BY' ? 'border-emerald-700/30 bg-emerald-50 text-emerald-900' : 'border-rose-700/30 bg-rose-50 text-rose-900')}>
                      {s.stance === 'SUPPORTED_BY' ? 'SUPPORTED BY' : 'DISPUTED BY'}
                    </span>
                    <button type="button" onClick={() => onOpen(s.source.slug)} className="font-medium underline underline-offset-2 hover:decoration-[var(--brass)]">
                      {s.source.primaryName}
                    </button>
                    <EvidenceBadge level={s.source.evidenceLevel} />
                    <StatusBadge status={s.source.verificationStatus} />
                  </div>
                  {s.note && <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">{s.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* collection items */}
      {p.collectionItems && p.collectionItems.length > 0 && (
        <section aria-labelledby="s-collection" className="mt-6">
          <h2 id="s-collection" className="label-caps text-muted-foreground text-[13px]">Collection contents</h2>
          <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {p.collectionItems.map((c) => (
              <li key={c.item.id}>
                <button type="button" onClick={() => onOpen(c.item.slug)} className="w-full rounded-md border border-border bg-card px-4 py-3 text-left text-sm transition-colors hover:border-[var(--brass)]/60 hover:bg-accent/40">
                  <span className="text-muted-foreground font-mono text-[11px]">{String(c.order).padStart(2, '0')}</span>
                  <span className="ml-2 font-medium">{c.item.primaryName}</span>
                  <span className="text-muted-foreground ml-2 text-[12px]">{c.item.type}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* relationships */}
      <section aria-labelledby="s-rels" className="mt-6">
        <h2 id="s-rels" className="label-caps text-muted-foreground flex items-center gap-2 text-[13px]">
          <ArrowRightLeft className="size-3.5" aria-hidden /> Relationships ({p.relationships.length})
        </h2>
        {p.relationships.length === 0 ? (
          <HonestNote className="mt-2" tone="amber">
            No relationships are recorded for this entity. 165 never infers or auto-generates relationships — every edge is an explicit, sourced institutional decision.
          </HonestNote>
        ) : (
          <ul className="mt-2 space-y-2">
            {grouped.map(([pred, rels]) => (
              <li key={pred}>
                <p className="text-muted-foreground mb-1.5 text-[12px] font-semibold tracking-wide uppercase">{pred.replaceAll('_', ' ')}</p>
                <ul className="space-y-2">
                  {rels.map((r) => <RelRow key={r.id} rel={r} onOpen={onOpen} />)}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* version history / changelog */}
      <section aria-labelledby="s-versions" className="mt-6">
        <h2 id="s-versions" className="label-caps text-muted-foreground flex items-center gap-2 text-[13px]"><History className="size-3.5" aria-hidden /> Version history — knowledge is never deleted silently</h2>
        <ol className="mt-2 divide-y divide-border rounded-md border border-border bg-card">
          {p.versions.map((v) => (
            <li key={v.version} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5 text-sm sm:px-5">
              <span className="font-mono text-[11px] text-[var(--brass)]">v{String(v.version).padStart(2, '0')}</span>
              <span className="font-medium">{v.changedBy}</span>
              {v.reason && <span className="text-muted-foreground text-[13px]">{v.reason}</span>}
              <time className="text-muted-foreground ml-auto font-mono text-[11px]">{new Date(v.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</time>
            </li>
          ))}
        </ol>
      </section>

      {/* verification footer */}
      <footer className="mt-8 flex items-start gap-2.5 rounded-md border border-border bg-secondary/60 px-4 py-3.5">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--brass)]" aria-hidden />
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          This profile renders directly from 165&apos;s structured records. Evidence levels and verification statuses travel with every fact.
          Nothing on this page was inferred, generated, or silently resolved.{' '}
          <button type="button" onClick={() => onOpen('165')} className="underline underline-offset-2 hover:decoration-[var(--brass)]">About 165</button>
        </p>
      </footer>
    </article>
  )
}

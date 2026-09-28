'use client'

// 165 — EXPLORE: global search, timeline engine, knowledge atlas, knowledge graph
import { useMemo, useState } from 'react'
import { CalendarClock, Compass, Network, Search, Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ENTITY_TYPES, dateLabel, type EntitySummaryDTO } from '@/lib/165'
import { EntityCard, EntityCardGrid } from '../entity-card'
import { KnowledgeGraph } from '../knowledge-graph'
import { EvidenceBadge, HonestNote, Kicker, SectionHeading, SkeletonCard, StatusBadge, TypeBadge, useApi } from '../ui'

type SearchPayload = { query: string; groups: Record<string, EntitySummaryDTO[]>; total: number }
type TimelineItem = {
  entity: EntitySummaryDTO; summary?: string | null; summaryId?: string | null
  sortYear: number | null; undated: boolean
}
type GraphPayload = { nodes: { id: string; globalId: string; slug: string; type: string; label: string }[]; edges: { id: string; from: string; to: string; predicate: string; verificationStatus: string }[] }

const TABS = [
  { key: 'search', label: 'Global Search', icon: Search },
  { key: 'timeline', label: 'Timeline', icon: CalendarClock },
  { key: 'atlas', label: 'Knowledge Atlas', icon: Compass },
  { key: 'graph', label: 'Knowledge Graph', icon: Network },
] as const

export function ExploreSection({ onOpenEntity }: { onOpenEntity: (slug: string) => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('search')

  return (
    <div className="space-y-6">
      <SectionHeading
        kicker="Explore"
        title="Every record, one atlas of knowledge"
        lede="Search people, institutions, places, traditions, terms, sources and claims. Each result travels with its evidence level and verification status."
      />
      <div role="tablist" aria-label="Explore views" className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-sm border px-3.5 text-[13px] font-medium transition-colors',
              tab === t.key ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-[var(--brass)]/50',
            )}
          >
            <t.icon className="size-3.5" aria-hidden /> {t.label}
          </button>
        ))}
      </div>
      {tab === 'search' && <SearchView onOpenEntity={onOpenEntity} />}
      {tab === 'timeline' && <TimelineView onOpenEntity={onOpenEntity} />}
      {tab === 'atlas' && <AtlasView onOpenEntity={onOpenEntity} />}
      {tab === 'graph' && <GraphView onOpenEntity={onOpenEntity} />}
    </div>
  )
}

// ---------------- search ----------------
function SearchView({ onOpenEntity }: { onOpenEntity: (slug: string) => void }) {
  const [q, setQ] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const { data, loading, error } = useApi<SearchPayload>(submitted ? `/api/search?q=${encodeURIComponent(submitted)}` : null)

  const groups = useMemo(() => {
    const g = data?.groups ?? {}
    if (!typeFilter) return g
    return typeFilter in g ? { [typeFilter]: g[typeFilter] } : {}
  }, [data, typeFilter])

  const searchableTypes = Object.keys(ENTITY_TYPES)

  return (
    <div className="space-y-5">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => { e.preventDefault(); setSubmitted(q.trim()) }}
        role="search"
      >
        <label htmlFor="global-search" className="sr-only">Search 165 records</label>
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden />
          <input
            id="global-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search people, institutions, places, books, terms, claims…"
            className="border-input bg-card focus-visible:ring-ring h-11 w-full rounded-sm border pr-3 pl-9 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-sm px-6 text-sm font-medium transition-colors">
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5" aria-label="Filter by entity type">
        <button
          onClick={() => setTypeFilter(null)}
          className={cn('h-7 rounded-full border px-3 text-[12px] font-medium transition-colors',
            !typeFilter ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground')}
        >
          All types
        </button>
        {searchableTypes.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(typeFilter === t ? null : t)}
            className={cn('h-7 rounded-full border px-3 text-[12px] font-medium transition-colors',
              typeFilter === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground')}
          >
            {ENTITY_TYPES[t as keyof typeof ENTITY_TYPES].label}
          </button>
        ))}
      </div>

      {!submitted && <EmptySearch onOpenEntity={onOpenEntity} />}

      {submitted && loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
      )}
      {submitted && error && <HonestNote tone="rose">Search failed: {error}</HonestNote>}
      {submitted && !loading && data && data.total === 0 && (
        <HonestNote tone="amber">
          No records match <strong>&ldquo;{data.query}&rdquo;</strong> in 165&apos;s current holdings.
          This is a statement about the archive — not about the truth. The record may exist outside our deposits yet.
        </HonestNote>
      )}
      {submitted && !loading && data && data.total > 0 && (
        <div className="space-y-7">
          {Object.entries(groups).map(([type, rows]) => (
            <section key={type} aria-label={`${type} results`}>
              <div className="flex items-center gap-2.5">
                <TypeBadge type={type} />
                <h3 className="font-display text-[15px] font-semibold">{ENTITY_TYPES[type as keyof typeof ENTITY_TYPES]?.label ?? type}</h3>
                <span className="text-muted-foreground text-[12px]">{rows.length} record{rows.length > 1 ? 's' : ''}</span>
              </div>
              <EntityCardGrid entities={rows} onOpen={onOpenEntity} className="mt-3" />
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptySearch({ onOpenEntity }: { onOpenEntity: (slug: string) => void }) {
  const { data, loading } = useApi<{ entities: EntitySummaryDTO[] }>('/api/entities?limit=9')
  return (
    <div>
      <p className="text-muted-foreground text-[13px]">Begin anywhere — here are recent records:</p>
      {loading ? (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
      ) : (
        <EntityCardGrid entities={data?.entities ?? []} onOpen={onOpenEntity} className="mt-3" />
      )}
    </div>
  )
}

// ---------------- timeline ----------------
function TimelineView({ onOpenEntity }: { onOpenEntity: (slug: string) => void }) {
  const { data, loading, error } = useApi<{ timeline: TimelineItem[] }>('/api/timeline')
  if (loading) return <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>
  if (error) return <HonestNote tone="rose">Timeline failed: {error}</HonestNote>
  const items = data?.timeline ?? []
  const dated = items.filter((i) => !i.undated)
  const undated = items.filter((i) => i.undated)

  return (
    <div className="space-y-6">
      <ol className="relative space-y-5 border-l border-border pl-5 sm:pl-7">
        {dated.map((it) => (
          <li key={it.entity.id} className="relative">
            <span aria-hidden className="absolute top-1.5 -left-[26px] size-2.5 rounded-full border-2 border-[var(--brass)] bg-background sm:-left-[34px]" />
            <button type="button" onClick={() => onOpenEntity(it.entity.slug)} className="w-full rounded-md border border-border bg-card p-4 text-left transition-colors hover:border-[var(--brass)]/60 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-lg font-semibold text-[var(--brass)]">{it.sortYear ?? dateLabel(it.entity.startDate, it.entity.startDatePrecision)}</span>
                <EvidenceBadge level={it.entity.evidenceLevel} />
                <StatusBadge status={it.entity.verificationStatus} />
              </div>
              <h3 className="font-display mt-1 text-[15px] font-semibold sm:text-base">{it.entity.primaryName}</h3>
              {it.summary && <p className="text-muted-foreground mt-1 line-clamp-3 text-[13px] leading-relaxed">{it.summary}</p>}
            </button>
          </li>
        ))}
      </ol>
      {undated.length > 0 && (
        <section aria-label="Events without recorded dates">
          <Kicker>Undated events — uncertainty preserved</Kicker>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {undated.map((it) => (
              <button key={it.entity.id} type="button" onClick={() => onOpenEntity(it.entity.slug)} className="rounded-md border border-dashed border-border bg-card p-4 text-left transition-colors hover:border-[var(--brass)]/60">
                <h3 className="font-display text-[15px] font-semibold">{it.entity.primaryName}</h3>
                <p className="text-muted-foreground mt-1 text-[12px] italic">Date not recorded — 165 will not invent one.</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ---------------- atlas ----------------
function AtlasView({ onOpenEntity }: { onOpenEntity: (slug: string) => void }) {
  const { data, loading, error } = useApi<{ entities: EntitySummaryDTO[] }>('/api/entities?type=PLACE&limit=100')
  if (loading) return <SkeletonCard />
  if (error) return <HonestNote tone="rose">Atlas failed: {error}</HonestNote>
  const places = data?.entities ?? []
  const byRegion = new Map<string, EntitySummaryDTO[]>()
  for (const p of places) {
    const r = p.region ?? 'Uncharted'
    if (!byRegion.has(r)) byRegion.set(r, [])
    byRegion.get(r)!.push(p)
  }

  return (
    <div className="space-y-5">
      <HonestNote tone="green">
        <strong>Knowledge Atlas (MVP).</strong> Regions are shown as structured groupings; the interactive world map
        (map tiles, gazetteer) is planned for Phase 7. Coordinates are already stored per place — the data is map-ready.
      </HonestNote>
      {places.length === 0 && <HonestNote tone="amber">No places are recorded yet.</HonestNote>}
      {[...byRegion.entries()].map(([region, rows]) => (
        <section key={region} aria-label={`Places in ${region}`}>
          <h3 className="font-display text-[15px] font-semibold">{region}</h3>
          <EntityCardGrid entities={rows} onOpen={onOpenEntity} className="mt-3" />
        </section>
      ))}
    </div>
  )
}

// ---------------- graph ----------------
function GraphView({ onOpenEntity }: { onOpenEntity: (slug: string) => void }) {
  const { data, loading, error } = useApi<GraphPayload>('/api/graph')
  if (loading) return <SkeletonCard />
  if (error) return <HonestNote tone="rose">Graph failed: {error}</HonestNote>
  return (
    <div>
      <KnowledgeGraph nodes={data?.nodes ?? []} edges={data?.edges ?? []} onOpen={onOpenEntity} />
      <div className="mt-4 flex items-center gap-2 text-[12px] text-muted-foreground">
        <Undo2 className="size-3.5" aria-hidden />
        Every edge in this graph is an explicit institutional record — never auto-generated.
      </div>
    </div>
  )
}

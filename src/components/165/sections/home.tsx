'use client'

// 165 — HOME: institutional identity, founder recognition, trust spine, featured records
import { useState } from 'react'
import {
  Archive, ArrowRight, BookOpen, BookOpenText, CalendarDays, Compass, FileBadge2, FlaskConical, Landmark, Languages, Layers,
  Library, Link2, Scale, ScrollText, ShieldCheck, Sparkles, User, Network, MapPin, Video,
} from 'lucide-react'
import { ENTITY_TYPES, type EntitySummaryDTO } from '@/lib/165'
import counts from '@/data/snapshot-counts.json'
import { useI18n } from '@/lib/i18n'
import { EntityCard } from '../entity-card'
import { Ask165 } from '../ask165'
import { EvidenceBadge, HonestNote, Kicker, SkeletonCard, StatusBadge, useApi } from '../ui'

const IDENTITY = [
  { icon: BookOpen, title: 'Knowledge Platform', desc: 'Structured entities and typed relationships — not a pile of pages.' },
  { icon: Archive, title: 'Digital Archive', desc: 'Versioned, audited, exportable. Heritage-grade preservation from day one.' },
  { icon: FlaskConical, title: 'Research Infrastructure', desc: 'Sources, claims, citations and bibliography under one roof.' },
  { icon: Compass, title: 'Global Directory', desc: 'People, institutions and places with persistent global IDs.' },
  { icon: Network, title: 'Knowledge Graph', desc: 'Every recorded relationship visible, navigable and sourced.' },
  { icon: Sparkles, title: 'Heritage Platform', desc: 'Tradition preserved as tradition — never silently promoted to fact.' },
  { icon: Library, title: 'Educational Platform', desc: 'The Academy: curriculum, scholars and fellowship, built on sources.' },
  { icon: ShieldCheck, title: 'Preservation Institution', desc: '3-2-1 backup thinking, migration strategy, long-term custody.' },
  { icon: FileBadge2, title: 'Citation & Provenance', desc: 'Every statement traceable to its evidence. Source of source.' },
  { icon: Landmark, title: 'Global Reference', desc: 'Canonical URLs, persistent identifiers, API-ready foundations.' },
]

const STATS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PERSON: User, INSTITUTION: Landmark, PLACE: MapPin, TRADITION: Sparkles,
  TERM: Languages, EVENT: CalendarDays,
}

export function HomeSection({ onOpenEntity, onNavigate }: {
  onOpenEntity: (slug: string) => void
  onNavigate: (section: string) => void
}) {
  const { data, loading } = useApi<{ stats: { total: number; byType: Record<string, number>; relations: number; sanadChains: number; contributions: number } }>('/api/stats')
  const { data: feat, loading: featLoading } = useApi<{ entities: EntitySummaryDTO[] }>('/api/entities?limit=60')
  const { t } = useI18n()

  const featuredTypes = ['INSTITUTION', 'PERSON', 'TRADITION', 'COLLECTION']
  const featured = (feat?.entities ?? []).filter((e) => featuredTypes.includes(e.type)).slice(0, 6)

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* ---------------- hero ---------------- */}
      <section className="parchment-texture relative overflow-hidden rounded-lg border border-border bg-secondary/40 px-5 py-12 sm:px-10 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '18px 18px',
        }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <Kicker className="justify-center">{t('home.kicker')}</Kicker>
          <p className="font-display mt-6 text-7xl leading-none font-semibold tracking-tight sm:text-8xl" aria-label="165">165</p>
          <p className="font-arabic mt-3 text-2xl text-[var(--brass)]" dir="rtl" lang="ar" aria-hidden>مَعْدِنُ العِلْمِ وَالحِفْظِ الرَّقَمِيِّ</p>
          <h1 className="font-display mt-4 text-xl leading-snug font-semibold sm:text-2xl">
            {t('home.subtitle')}
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed">
            {t('home.lede')}
          </p>
          <p className="text-muted-foreground mt-3 text-[13px]">
            {t('home.foundedBy')} <strong className="text-foreground font-medium">Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi</strong>, {t('home.founderRole')}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <button onClick={() => onNavigate('explore')} className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-sm px-5 text-sm font-medium transition-colors">
              <Compass className="size-4" aria-hidden /> {t('home.ctaExplore')}
            </button>
            <button onClick={() => onNavigate('trust')} className="border-border bg-card hover:bg-accent inline-flex h-10 items-center gap-2 rounded-sm border px-5 text-sm font-medium transition-colors">
              <ShieldCheck className="size-4 text-[var(--brass)]" aria-hidden /> {t('home.ctaHow')}
            </button>
            <button onClick={() => onNavigate('contribute')} className="border-border bg-card hover:bg-accent inline-flex h-10 items-center gap-2 rounded-sm border px-5 text-sm font-medium transition-colors">
              {t('home.ctaContribute')}
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- trust strip ---------------- */}
      {/* Snapshot counts are the structural floor: even if the API is
          unreachable (serverless), the real numbers are always displayed — 0 is impossible. */}
      <section aria-label="Institutional statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: t('home.statRecords'), value: data?.stats.total ?? counts.entities, icon: Layers },
          { label: t('home.statRelations'), value: data?.stats.relations ?? counts.relations, icon: Link2 },
          { label: t('home.statSanad'), value: data?.stats.sanadChains ?? counts.sanadChains, icon: ScrollText, note: t('home.statSanadNote') },
          { label: t('home.statEvidence'), value: 6, icon: Scale, note: 'A – F' },
        ].map((s) => (
          <div key={s.label} className="rounded-md border border-border bg-card p-4 sm:p-5">
            {s.icon && <s.icon className="size-4 text-[var(--brass)]" aria-hidden />}
            <p className="font-display mt-2 text-2xl font-semibold sm:text-3xl">{s.value}</p>
            <p className="text-muted-foreground mt-0.5 text-[12px] leading-tight">{s.label}{s.note ? ` · ${s.note}` : ''}</p>
          </div>
        ))}
      </section>

      {/* ---------------- what 165 is ---------------- */}
      <section aria-labelledby="identity-h">
        <Kicker>{t('home.identityKicker')}</Kicker>
        <h2 id="identity-h" className="font-display mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">{t('home.identityTitle')}</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-[15px] leading-relaxed">
          {t('home.identityLede')}
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {IDENTITY.map((it) => (
            <li key={it.title} className="group rounded-md border border-border bg-card p-4 transition-colors hover:border-[var(--brass)]/50 sm:p-5">
              <it.icon className="size-4.5 text-[var(--brass)]" aria-hidden />
              <h3 className="font-display mt-2.5 text-[15px] font-semibold">{it.title}</h3>
              <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">{it.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- master principle ---------------- */}
      <section className="rounded-lg border border-[var(--brass)]/40 bg-[var(--brass-soft)]/30 px-5 py-10 text-center sm:px-10">
        <Kicker className="justify-center">{t('home.principleKicker')}</Kicker>
        <p className="font-display mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">{t('home.principleTitle')}</p>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed">
          {t('home.principleLede')}
        </p>
      </section>

      {/* ---------------- featured records ---------------- */}
      <section aria-labelledby="featured-h">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Kicker>{t('home.featuredKicker')}</Kicker>
            <h2 id="featured-h" className="font-display mt-1.5 text-2xl font-semibold tracking-tight">{t('home.featuredTitle')}</h2>
          </div>
          <button onClick={() => onNavigate('explore')} className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm underline decoration-dotted underline-offset-4">
            {t('home.featuredAll')} <span aria-hidden>→</span>
          </button>
        </div>
        {featLoading ? (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((e) => <EntityCard key={e.id} entity={e} onOpen={onOpenEntity} />)}
          </div>
        )}
      </section>

      {/* ---------------- ask 165 ---------------- */}
      <section aria-labelledby="ask-h">
        <Kicker>{t('home.askKicker')}</Kicker>
        <h2 id="ask-h" className="font-display mt-1.5 mb-4 text-2xl font-semibold tracking-tight">{t('home.askTitle')}</h2>
        <Ask165 />
      </section>

      {/* ---------------- canonical documents banner ---------------- */}
      <div className="border-[var(--brass)]/40 from-[var(--brass-soft)] to-card rounded-md border bg-gradient-to-r p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="border-[var(--brass)]/50 bg-secondary flex size-10 shrink-0 items-center justify-center rounded-sm border">
              <BookOpenText className="size-4.5 text-[var(--brass)]" aria-hidden />
            </span>
            <div>
              <p className="label-caps text-[11px] text-[var(--brass)]">{t('home.docsKicker')}</p>
              <p className="font-display mt-1 text-[16px] leading-snug font-semibold sm:text-[17px]">
                {t('home.docsTitle')}
              </p>
              <p className="text-muted-foreground mt-1 text-[12.5px]">{t('home.docsSub')}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-sm px-4 text-[13px] font-medium transition-colors sm:self-center"
          >
            {t('home.docsCta')} <ArrowRight className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>

      {/* ---------------- honesty banner ---------------- */}
      <HonestNote tone="amber">
        <strong>{t('home.depositTitle')}</strong>{' '}
        {t('home.depositBody')}{' '}
        <button onClick={() => onNavigate('documents')} className="underline underline-offset-2">{t('nav.documents')}</button>.
      </HonestNote>
    </div>
  )
}

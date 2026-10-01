'use client'

// 165 — HOME: institutional identity, founder recognition, trust spine, featured records
import { useState } from 'react'
import {
  Archive, ArrowRight, BookOpen, BookOpenText, CalendarDays, Compass, FileBadge2, FlaskConical, Landmark, Languages, Layers,
  Library, Link2, Moon, Scale, ScrollText, ShieldCheck, Sparkles, User, Network, MapPin, Video,
} from 'lucide-react'
import { ENTITY_TYPES, type EntitySummaryDTO } from '@/lib/165'
import counts from '@/data/snapshot-counts.json'
import { useI18n } from '@/lib/i18n'
import { EntityCard } from '../entity-card'
import { Ask165 } from '../ask165'
import { EvidenceBadge, HonestNote, Kicker, SkeletonCard, StatusBadge, useApi } from '../ui'
import { cn } from '@/lib/utils'

// v.4 — friendly rotating icon-chip hues (no blue/indigo)
const HUES = [
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-teal-100 text-teal-700',
  'bg-rose-100 text-rose-700',
  'bg-orange-100 text-orange-700',
  'bg-lime-100 text-lime-700',
]

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
      {/* ---------------- hero v.4 — smooth radiance ---------------- */}
      <section className="v4-mesh border-primary/15 shadow-emerald-950/5 relative overflow-hidden rounded-[2.5rem] border bg-card px-5 py-14 shadow-xl sm:px-10 sm:py-20">
        {/* breathing glow orbs — smooth, blurred, calm */}
        <div aria-hidden className="bg-emerald-300/35 v4-breathe pointer-events-none absolute -top-24 -left-24 size-80 rounded-full blur-3xl motion-reduce:animate-none" />
        <div aria-hidden className="bg-[var(--brass)]/25 v4-breathe pointer-events-none absolute -right-20 -bottom-28 size-96 rounded-full blur-3xl motion-reduce:animate-none" style={{ animationDelay: '2.5s' }} />
        <div aria-hidden className="bg-teal-200/40 pointer-events-none absolute top-1/3 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl" />

        {/* floating friendly ornaments (desktop) */}
        <div aria-hidden className="v4-float pointer-events-none absolute top-9 left-8 hidden sm:block motion-reduce:animate-none">
          <span className="border-border/70 flex size-12 items-center justify-center rounded-2xl border bg-white/80 shadow-lg backdrop-blur"><BookOpen className="size-5 text-emerald-600" /></span>
        </div>
        <div aria-hidden className="v4-float pointer-events-none absolute top-14 right-10 hidden sm:block motion-reduce:animate-none" style={{ animationDelay: '1.2s' }}>
          <span className="border-border/70 flex size-12 items-center justify-center rounded-2xl border bg-white/80 shadow-lg backdrop-blur"><Sparkles className="size-5 text-amber-500" /></span>
        </div>
        <div aria-hidden className="v4-float pointer-events-none absolute bottom-12 left-12 hidden lg:block motion-reduce:animate-none" style={{ animationDelay: '2.1s' }}>
          <span className="border-border/70 flex size-12 items-center justify-center rounded-2xl border bg-white/80 shadow-lg backdrop-blur"><ScrollText className="size-5 text-teal-600" /></span>
        </div>
        <div aria-hidden className="v4-float pointer-events-none absolute right-14 bottom-9 hidden lg:block motion-reduce:animate-none" style={{ animationDelay: '3s' }}>
          <span className="border-border/70 flex size-12 items-center justify-center rounded-2xl border bg-white/80 shadow-lg backdrop-blur"><Moon className="size-5 text-rose-500" /></span>
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <Kicker className="justify-center">{t('home.kicker')}</Kicker>
          <p className="v4-gradient-text font-display mt-6 text-7xl leading-none font-bold tracking-tight drop-shadow-sm sm:text-8xl" aria-label="165">165</p>
          <p className="font-arabic mt-3 text-2xl text-[var(--brass)]" dir="rtl" lang="ar" aria-hidden>مَعْدِنُ العِلْمِ وَالحِفْظِ الرَّقَمِيِّ</p>
          <h1 className="font-display mt-4 text-xl leading-snug font-semibold sm:text-2xl">
            {t('home.subtitle')}
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed">
            {t('home.lede')}
          </p>
          <p className="text-muted-foreground mt-3 text-[13px]">
            {t('home.foundedBy')} <strong className="text-foreground font-bold">Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi</strong>, {t('home.founderRole')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => onNavigate('explore')} className="bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground v4-glow inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-95">
              <Compass className="size-4" aria-hidden /> {t('home.ctaExplore')}
            </button>
            <button onClick={() => onNavigate('trust')} className="border-border bg-card/90 inline-flex h-11 items-center gap-2 rounded-full border px-6 text-sm font-semibold shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brass)]/50 hover:shadow-md active:translate-y-0 active:scale-95">
              <ShieldCheck className="size-4 text-[var(--brass)]" aria-hidden /> {t('home.ctaHow')}
            </button>
            <button onClick={() => onNavigate('contribute')} className="border-border bg-card/90 inline-flex h-11 items-center gap-2 rounded-full border px-6 text-sm font-semibold shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brass)]/50 hover:shadow-md active:translate-y-0 active:scale-95">
              {t('home.ctaContribute')}
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- trust strip ---------------- */}
      {/* Snapshot counts are the structural floor: even if the API is
          unreachable (serverless), the real numbers are always displayed — 0 is impossible. */}
      <section aria-label="Institutional statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: t('home.statRecords'), value: data?.stats.total ?? counts.entities, icon: Layers, hue: HUES[0] },
          { label: t('home.statRelations'), value: data?.stats.relations ?? counts.relations, icon: Link2, hue: HUES[1] },
          { label: t('home.statSanad'), value: data?.stats.sanadChains ?? counts.sanadChains, icon: ScrollText, hue: HUES[2], note: t('home.statSanadNoteRecorded') },
          { label: t('home.statEvidence'), value: 6, icon: Scale, hue: HUES[3], note: 'A – F' },
        ].map((s) => (
          <div key={s.label} className="v4-card v4-lift rounded-2xl border border-border bg-card p-4 sm:p-5">
            {s.icon && (
              <span className={cn('flex size-10 items-center justify-center rounded-2xl', s.hue)}>
                <s.icon className="size-5" aria-hidden />
              </span>
            )}
            <p className="font-display mt-3 text-2xl font-bold sm:text-3xl">{s.value}</p>
            <span aria-hidden className="bg-gradient-to-r from-primary to-[var(--brass)] mt-1.5 block h-1 w-9 rounded-full" />
            <p className="text-muted-foreground mt-1.5 text-[12px] leading-tight">{s.label}{s.note ? ` · ${s.note}` : ''}</p>
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
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {IDENTITY.map((it, i) => (
            <li key={it.title} className="v4-card v4-lift group rounded-2xl border border-border bg-card p-4 hover:border-[var(--brass)]/50 sm:p-5">
              <span className={cn('flex size-10 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6', HUES[i % HUES.length])}>
                <it.icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-display mt-3 text-[15px] font-semibold">{it.title}</h3>
              <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">{it.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- master principle ---------------- */}
      <section className="v4-mesh border-[var(--brass)]/30 shadow-emerald-950/5 relative overflow-hidden rounded-[2rem] border bg-card px-5 py-12 text-center shadow-lg sm:px-10">
        <div aria-hidden className="v4-float pointer-events-none absolute top-6 left-8 hidden text-amber-400 sm:block motion-reduce:animate-none"><Sparkles className="size-5" /></div>
        <div aria-hidden className="v4-float pointer-events-none absolute right-8 bottom-6 hidden text-emerald-500 sm:block motion-reduce:animate-none" style={{ animationDelay: '1.6s' }}><Sparkles className="size-5" /></div>
        <Kicker className="justify-center">{t('home.principleKicker')}</Kicker>
        <p className="font-display mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">{t('home.principleTitle')}</p>
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
      <div className="border-[var(--brass)]/40 v4-card from-[var(--brass-soft)]/80 via-card to-emerald-100/70 rounded-[1.75rem] border bg-gradient-to-r p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="v4-glow-gold bg-gradient-to-br from-[var(--brass)] to-amber-600 flex size-11 shrink-0 items-center justify-center rounded-2xl text-white">
              <BookOpenText className="size-5" aria-hidden />
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
            className="bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground v4-glow inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full px-5 text-[13px] font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-95 sm:self-center"
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

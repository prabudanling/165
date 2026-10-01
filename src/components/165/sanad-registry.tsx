'use client'

// 165 — Sanad Registry Global (Task 26): DISPLAY-ONLY and safety-gated.
// Permintaan Founder (2025): seluruh sanad TQN QN se-dunia — termasuk
// Abah Anom, Abah Krawanggana, dan Abah Sukanta — direkam sebagai
// koleksi spesial. Doktrin tetap: sistem tidak pernah membuat, menggabung,
// atau memprediksi sanad; setiap mata rantai membawa sumber + statusnya;
// segmen yang belum bersumber tampil sebagai MATA BLOK yang jujur.
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown, Landmark, Library, Link2, MapPin, ScrollText, ShieldAlert, Star, User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EntitySummaryDTO } from '@/lib/165'
import { dateLabel } from '@/lib/165'
import type { SanadRegistryDTO } from '@/lib/queries'
import type { CatalogKey } from '@/lib/i18n/catalog'
import { EvidenceBadge, HonestNote, StatusBadge, useApi } from './ui'
import { useI18n } from '@/lib/i18n'

type SanadProps = { onOpenEntity?: (slug: string) => void }

function FigureCard({ e, onOpen, spotlight }: { e: EntitySummaryDTO; onOpen?: (slug: string) => void; spotlight?: boolean }) {
  const dates = dateLabel(e.startDate, e.startDatePrecision, e.endDate, e.endDatePrecision)
  return (
    <button
      type="button"
      onClick={() => onOpen?.(e.slug)}
      className={cn(
        'group v4-card v4-lift flex w-full flex-col items-start gap-2 rounded-2xl border bg-card p-4 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:p-5',
        spotlight
          ? 'border-[var(--brass)]/60 shadow-[0_8px_30px_-12px] shadow-[var(--brass)]/40 ring-1 ring-[var(--brass)]/30'
          : 'border-border hover:border-[var(--brass)]/60',
      )}
      aria-label={`${spotlight ? 'Murshid spesial: ' : 'Buka profil: '}${e.primaryName}`}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <EvidenceBadge level={e.evidenceLevel} />
          <StatusBadge status={e.verificationStatus} withLabel={false} />
        </div>
        {spotlight && (
          <span className="from-[var(--brass)] to-amber-600 inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
            <Star className="size-3" aria-hidden /> Spesial
          </span>
        )}
      </div>
      <div className="flex w-full items-start gap-3">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6',
            spotlight ? 'from-primary to-[var(--brass)] bg-gradient-to-br text-white' : 'bg-secondary text-foreground',
          )}
          aria-hidden
        >
          <User className="size-4.5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[15px] leading-snug font-semibold group-hover:underline sm:text-base">
            {e.primaryName}
          </h3>
          {e.subtitle && <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs sm:text-[13px]">{e.subtitle}</p>}
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        {dates ? <p className="text-muted-foreground font-mono text-[11px] tracking-wide">{dates}</p> : <span />}
        <span className="text-muted-foreground/70 font-mono text-[10px]">{e.globalId}</span>
      </div>
    </button>
  )
}

function SmallCard({ e, onOpen, icon: Icon }: { e: EntitySummaryDTO; onOpen?: (slug: string) => void; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(e.slug)}
      className="v4-card v4-lift hover:border-[var(--brass)]/50 flex w-full items-start gap-3 rounded-2xl border border-border bg-card p-3.5 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:p-4"
      aria-label={`Buka profil: ${e.primaryName}`}
    >
      <span className="bg-secondary text-foreground flex size-9 shrink-0 items-center justify-center rounded-2xl" aria-hidden>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[13.5px] leading-snug font-semibold group-hover:underline">{e.primaryName}</h3>
        {e.subtitle && <p className="text-muted-foreground mt-0.5 line-clamp-2 text-[11.5px] leading-snug">{e.subtitle}</p>}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <EvidenceBadge level={e.evidenceLevel} />
          <StatusBadge status={e.verificationStatus} withLabel={false} />
          <span className="text-muted-foreground/70 font-mono text-[9.5px]">{e.globalId}</span>
        </div>
      </div>
    </button>
  )
}

function isBlockLink(context?: string | null) {
  return !!context && context.startsWith('MATA BLOK')
}

function ChainBlock({ chain, onOpenEntity, t, reduce }: {
  chain: SanadRegistryDTO['chains'][number]
  onOpenEntity?: (slug: string) => void
  t: (k: CatalogKey, vars?: Record<string, string | number>) => string
  reduce: boolean
}) {
  const c = chain.entity
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="border-border bg-card/60 overflow-hidden rounded-[1.5rem] border"
    >
      <div className="border-border/70 flex flex-wrap items-center gap-2 border-b px-4 py-3.5 sm:px-5">
        <ScrollText className="size-4.5 shrink-0 text-[var(--brass)]" aria-hidden />
        <h3 className="font-display min-w-0 flex-1 text-[15px] leading-snug font-semibold sm:text-base">{c.primaryName}</h3>
        <EvidenceBadge level={c.evidenceLevel} />
        <StatusBadge status={c.verificationStatus} withLabel={false} />
      </div>
      {c.subtitle && <p className="text-muted-foreground px-4 pt-3 text-[12.5px] leading-relaxed sm:px-5">{c.subtitle}</p>}
      <ol className="px-4 py-4 sm:px-5">
        {chain.links.map((l, i) => {
          const block = isBlockLink(l.context)
          return (
            <li key={l.id} className="relative">
              {/* connector */}
              {i > 0 && <span aria-hidden className="bg-border/70 absolute -top-3 left-[13px] h-3 w-px" />}
              <div
                className={cn(
                  'rounded-2xl border px-3.5 py-3',
                  block ? 'border-dashed border-amber-600/50 bg-amber-50/60 dark:bg-amber-950/20' : 'border-border bg-background/60',
                )}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={cn(
                    'inline-flex size-6 items-center justify-center rounded-full text-[10.5px] font-bold',
                    block ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' : 'bg-primary/10 text-primary',
                  )} aria-hidden>{l.order}</span>
                  <EvidenceBadge level={l.evidenceLevel} />
                  <StatusBadge status={l.verificationStatus} withLabel={false} />
                  {l.eraNote && <span className="text-muted-foreground font-mono text-[10.5px]">{l.eraNote}</span>}
                  {block && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-600/40 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase dark:bg-amber-950/40 dark:text-amber-200">
                      <ShieldAlert className="size-3" aria-hidden /> {t('sanad.blockNote').split('—')[0].trim()}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <p className="text-[13.5px] leading-snug font-semibold">{l.fromName}</p>
                  <ArrowDown className="text-muted-foreground size-3.5 shrink-0" aria-hidden />
                  <p className="text-[13.5px] leading-snug font-semibold">{l.toName}</p>
                </div>
                {l.context && (
                  <p className={cn('mt-1.5 text-[12px] leading-relaxed', block ? 'text-amber-900/80 dark:text-amber-200/80' : 'text-muted-foreground')}>
                    {l.context}
                  </p>
                )}
                {l.personSlug && l.personName && (
                  <button
                    type="button"
                    onClick={() => onOpenEntity?.(l.personSlug!)}
                    className="text-muted-foreground hover:text-foreground hover:border-[var(--brass)]/60 mt-2 inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold transition-colors"
                  >
                    <User className="size-3" aria-hidden /> {t('sanad.openProfile')} · {l.personName}
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </motion.li>
  )
}

export function SanadRegistry({ onOpenEntity }: SanadProps) {
  const { data, loading } = useApi<SanadRegistryDTO>('/api/sanad')
  const { t } = useI18n()
  const reduce = useReducedMotion()

  const featured = data?.featured ?? []
  const chains = data?.chains ?? []
  const figures = data?.figures ?? []
  const network = data?.network ?? []
  const sources = data?.sources ?? []

  // tiga tokoh yang ditandai khusus Founder muncul lebih dulu di koleksi
  const spotlight = featured.slice(0, 3)
  const rest = featured.slice(3)

  return (
    <section aria-labelledby="sanad-h">
      <div className="max-w-3xl">
        <p className="border-[var(--brass)]/35 bg-[var(--brass-soft)]/60 text-[var(--brass)] inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase">
          <span aria-hidden className="bg-[var(--brass)] inline-block size-1.5 rounded-full" />
          {t('sanad.kicker')}
        </p>
        <h2 id="sanad-h" className="font-display mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          <Link2 className="size-5 text-[var(--brass)]" aria-hidden /> {t('sanad.title')}
        </h2>
        <p className="text-muted-foreground mt-3 text-[14.5px] leading-relaxed sm:text-[15px]">{t('sanad.lede')}</p>
      </div>

      <HonestNote className="mt-4" tone="green">
        <strong>Safety policy.</strong> {t('sanad.displayOnly')}
      </HonestNote>

      {loading ? (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl border border-border bg-card" />)}
        </div>
      ) : (
        <>
          {/* ---------------- koleksi spesial ---------------- */}
          {featured.length > 0 && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-6"
              aria-labelledby="sanad-featured-h"
            >
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.12em] text-[var(--brass)] uppercase">{t('sanad.featured')}</p>
                  <h3 id="sanad-featured-h" className="font-display mt-1 text-lg font-semibold sm:text-xl">{t('sanad.featuredLede')}</h3>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {spotlight.map((e) => <FigureCard key={e.id} e={e} onOpen={onOpenEntity} spotlight />)}
              </div>
              {rest.length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((e) => <FigureCard key={e.id} e={e} onOpen={onOpenEntity} />)}
                </div>
              )}
            </motion.div>
          )}

          {/* ---------------- rantai sanad ---------------- */}
          {chains.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display text-lg font-semibold sm:text-xl">{t('sanad.chains')}</h3>
              <ul className="mt-4 space-y-4">
                {chains.map((ch) => (
                  <ChainBlock key={ch.entity.id} chain={ch} onOpenEntity={onOpenEntity} t={t} reduce={reduce ?? false} />
                ))}
              </ul>
            </div>
          )}

          {/* ---------------- jaringan majlis & tempat ---------------- */}
          {network.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display text-lg font-semibold sm:text-xl">{t('sanad.network')}</h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {network.map((e) => (
                  <SmallCard key={e.id} e={e} onOpen={onOpenEntity} icon={e.type === 'INSTITUTION' ? Landmark : MapPin} />
                ))}
              </div>
            </div>
          )}

          {/* ---------------- catatan referensi ---------------- */}
          <HonestNote className="mt-8" tone="amber">
            {t('sanad.referenceNote')}
          </HonestNote>

          {/* ---------------- sumber ---------------- */}
          {sources.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display text-lg font-semibold sm:text-xl">{t('sanad.sources')}</h3>
              <ul className="border-border mt-3 divide-y divide-border overflow-hidden rounded-2xl border bg-card">
                {sources.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => onOpenEntity?.(s.slug)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60 focus-visible:bg-secondary/60 focus-visible:outline-none"
                    >
                      <Library className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden />
                      <span className="min-w-0">
                        <span className="text-[13.5px] leading-snug font-medium underline decoration-dotted underline-offset-4">{s.primaryName}</span>
                        {s.subtitle && <span className="text-muted-foreground block text-[11.5px] leading-snug">{s.subtitle}</span>}
                      </span>
                      <span className="ml-auto flex shrink-0 items-center gap-1.5">
                        <EvidenceBadge level={s.evidenceLevel} />
                        <StatusBadge status={s.verificationStatus} withLabel={false} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  )
}

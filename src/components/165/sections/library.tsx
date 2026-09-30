'use client'

// 165 — LIBRARY: Books, Manuscripts, Digital Library, Collections
// Honesty policy: no works are fabricated. The catalogues begin when the
// Founder's archive is deposited. Collections are live data.
import { BookOpen, Layers, ScrollText } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import type { EntityProfileDTO, EntitySummaryDTO } from '@/lib/165'
import { EntityCard } from '../entity-card'
import { EmptyState, HonestNote, Kicker, SectionHeading, SkeletonCard, useApi } from '../ui'

export function LibrarySection({ onOpenEntity, onNavigate }: { onOpenEntity: (slug: string) => void; onNavigate: (s: string) => void }) {
  const [tab, setTab] = useState<'books' | 'manuscripts' | 'collections'>('books')
  const { data, loading } = useApi<{ entities: EntitySummaryDTO[] }>('/api/entities?limit=200')
  const { t } = useI18n()

  const books = (data?.entities ?? []).filter((e) => e.type === 'BOOK')
  const manuscripts = (data?.entities ?? []).filter((e) => e.type === 'MANUSCRIPT')
  const collections = (data?.entities ?? []).filter((e) => e.type === 'COLLECTION')

  return (
    <div className="space-y-6">
      <SectionHeading
        kicker={t('sec.library.kicker')}
        title={t('sec.library.title')}
        lede={t('sec.library.lede')}
      />
      <div role="tablist" aria-label="Library views" className="flex flex-wrap gap-1.5">
        {([['books', 'Books', BookOpen], ['manuscripts', 'Manuscripts', ScrollText], ['collections', 'Collections', Layers]] as const).map(([k, label, Icon]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={cn('inline-flex h-9 items-center gap-1.5 rounded-sm border px-3.5 text-[13px] font-medium transition-colors',
              tab === k ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-[var(--brass)]/50')}>
            <Icon className="size-3.5" aria-hidden /> {label}
          </button>
        ))}
      </div>

      {loading && <SkeletonCard />}

      {!loading && tab === 'books' && (
        books.length === 0 ? (
          <EmptyState icon={BookOpen} title="The book catalogue opens with the archive">
            <p>
              165 does not fabricate bibliographic records. When the Founder&apos;s archive and reviewed sources are deposited,
              works will appear here with authors, years, languages and full provenance.{' '}
              <button onClick={() => onNavigate('contribute')} className="underline underline-offset-2">Propose a work for cataloguing</button>
            </p>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((e) => <EntityCard key={e.id} entity={e} onOpen={onOpenEntity} />)}
          </div>
        )
      )}

      {!loading && tab === 'manuscripts' && (
        manuscripts.length === 0 ? (
          <EmptyState icon={ScrollText} title="Manuscript registry awaits deposit">
            <p>
              Manuscripts will be registered with holding institutions, condition notes and digitisation status —
              each as a Level A primary source when verified. Until then this registry stands deliberately empty.
            </p>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {manuscripts.map((e) => <EntityCard key={e.id} entity={e} onOpen={onOpenEntity} />)}
          </div>
        )
      )}

      {!loading && tab === 'collections' && (
        collections.length === 0 ? (
          <EmptyState icon={Layers} title="No collections yet" />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((e) => <EntityCard key={e.id} entity={e} onOpen={onOpenEntity} />)}
          </div>
        )
      )}
    </div>
  )
}

// ---------------- ARCHIVE ----------------
export function ArchiveSection({ onOpenEntity, onNavigate }: { onOpenEntity: (slug: string) => void; onNavigate: (s: string) => void }) {
  const { t } = useI18n()
  const { data, loading } = useApi<{ entities: EntitySummaryDTO[] }>('/api/entities?limit=200')
  const documents = (data?.entities ?? []).filter((e) => e.type === 'DOCUMENT')

  return (
    <div className="space-y-6">
      <SectionHeading
        kicker={t('sec.archive.kicker')}
        title={t('sec.archive.title')}
        lede={t('sec.archive.lede')}
      />

      <section aria-labelledby="arch-docs">
        <Kicker>Document registry</Kicker>
        {loading ? <SkeletonCard /> : documents.length === 0 ? (
          <EmptyState icon={ScrollText} title="No documents registered yet">
            Founding documents await deposit and review.{' '}
            <button onClick={() => onNavigate('contribute')} className="underline underline-offset-2">Submit a document</button>
          </EmptyState>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((e) => <EntityCard key={e.id} entity={e} onOpen={onOpenEntity} />)}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EmptyState icon={ScrollText} title="Oral history programme — planned (Phase 5)">
          <p>Interview collections will carry Level D evidence status: preserved as testimony, never silently promoted to documentary fact. Contribution pipeline opens with the editorial workflow.</p>
        </EmptyState>
        <EmptyState icon={Layers} title="Heritage archive — planned (Phase 5 & 10)">
          <p>Immutability, version snapshots, audit trails, 3-2-1 backups and long-term migration are part of the preservation charter, already modelled in the database layer.</p>
        </EmptyState>
      </div>

      <HonestNote tone="green">
        <strong>Preservation by design.</strong> Every entity change writes a version snapshot and an audit entry before it becomes visible. Knowledge is never deleted silently — corrections are additive and traceable.
      </HonestNote>
    </div>
  )
}

// ---------------- MEDIA ----------------
export function MediaSection({ onNavigate }: { onOpenEntity: (slug: string) => void; onNavigate: (s: string) => void }) {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <SectionHeading
        kicker={t('sec.media.kicker')}
        title={t('sec.media.title')}
        lede={t('sec.media.lede')}
      />
      <EmptyState icon={ScrollText} title="Media registry — reserved, not padded">
        <p>
          No media items are registered yet, and 165 will not invent placeholders. Documentaries, interviews and
          photography enter only with rights, sources and subjects recorded.{' '}
          <button onClick={() => onNavigate('contribute')} className="underline underline-offset-2">Propose media for registration</button>
        </p>
      </EmptyState>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {['Video', 'Audio', 'Documentary', 'Interviews', 'Photography', 'Articles'].map((k) => (
          <div key={k} className="rounded-md border border-border bg-card p-4 text-center">
            <p className="font-display text-sm font-semibold">{k}</p>
            <p className="text-muted-foreground mt-1 text-[12px]">0 registered</p>
          </div>
        ))}
      </div>
    </div>
  )
}

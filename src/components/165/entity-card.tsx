'use client'

import { cn } from '@/lib/utils'
import { dateLabel, type EntitySummaryDTO } from '@/lib/165'
import { EvidenceBadge, StatusBadge, TypeBadge } from './ui'

export function EntityCard({
  entity,
  onOpen,
  className,
  compact,
}: {
  entity: EntitySummaryDTO
  onOpen: (slug: string) => void
  className?: string
  compact?: boolean
}) {
  const dates = dateLabel(entity.startDate, entity.startDatePrecision, entity.endDate, entity.endDatePrecision)
  return (
    <button
      type="button"
      onClick={() => onOpen(entity.slug)}
      className={cn(
        'group v4-card v4-lift flex w-full flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left hover:border-[var(--brass)]/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:p-5',
        className,
      )}
      aria-label={`Open profile: ${entity.primaryName}`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <TypeBadge type={entity.type} />
        <EvidenceBadge level={entity.evidenceLevel} />
        <StatusBadge status={entity.verificationStatus} />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-[15px] leading-snug font-semibold group-hover:underline sm:text-base">
          {entity.primaryName}
        </h3>
        {entity.subtitle && !compact && (
          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs sm:text-[13px]">{entity.subtitle}</p>
        )}
      </div>
      {dates && (
        <p className="text-muted-foreground font-mono text-[11px] tracking-wide">{dates}</p>
      )}
      <span className="text-muted-foreground/70 font-mono text-[10px]">{entity.globalId}</span>
    </button>
  )
}

export function EntityCardGrid({ entities, onOpen, className }: { entities: EntitySummaryDTO[]; onOpen: (slug: string) => void; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {entities.map((e) => <EntityCard key={e.id} entity={e} onOpen={onOpen} />)}
    </div>
  )
}

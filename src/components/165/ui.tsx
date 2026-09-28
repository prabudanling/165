'use client'

// 165 — institutional UI primitives: trust badges, labels, empty states, hooks
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { EVIDENCE_LEVELS, VERIFICATION_STATUSES, ENTITY_TYPES, type EvidenceLevelKey, type VerificationStatusKey } from '@/lib/165'

// ---------- tone maps (tailwind classes, institutional palette) ----------
const TONE: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-900', border: 'border-emerald-700/30' },
  green: { bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-700/30' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-900', border: 'border-teal-700/30' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-700/30' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-900', border: 'border-orange-700/30' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-900', border: 'border-rose-700/30' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-900', border: 'border-sky-700/30' },
  slate: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-400/40' },
  stone: { bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-400/40' },
  brass: { bg: 'bg-[var(--brass-soft)]', text: 'text-[#6b4f18]', border: 'border-[var(--brass)]/40' },
}

// entity type colors (graph + badges) — muted scholarly hues, no blue/indigo
export const TYPE_HUE: Record<string, string> = {
  PERSON: '#3E6B4F',
  INSTITUTION: '#2F4A3C',
  ORGANIZATION: '#5E7360',
  PLACE: '#7C8A4D',
  BOOK: '#8A6D3B',
  MANUSCRIPT: '#A08040',
  DOCUMENT: '#6E6A57',
  MEDIA: '#7A6248',
  EVENT: '#946B2D',
  SANAD: '#5B5443',
  RESEARCH: '#4E6E58',
  SOURCE: '#71583E',
  CLAIM: '#8C4A3C',
  TRADITION: '#6B7F3A',
  COLLECTION: '#565F4B',
  TERM: '#71785E',
}

export function EvidenceBadge({ level, className, withLabel }: { level: string; className?: string; withLabel?: boolean }) {
  const def = EVIDENCE_LEVELS[level as EvidenceLevelKey] ?? EVIDENCE_LEVELS.F
  const tone = TONE[def.tone] ?? TONE.slate
  return (
    <span
      title={def.desc}
      className={cn('inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px] font-medium leading-none', tone.bg, tone.text, tone.border, className)}
    >
      <span aria-hidden className="font-display">{level}</span>
      {withLabel && <span className="hidden sm:inline">{def.label.split('— ')[1]}</span>}
    </span>
  )
}

export function StatusBadge({ status, className, withLabel = true }: { status: string; className?: string; withLabel?: boolean }) {
  const def = VERIFICATION_STATUSES[status as VerificationStatusKey] ?? VERIFICATION_STATUSES.UNVERIFIED
  const tone = TONE[def.tone] ?? TONE.slate
  return (
    <span
      title={def.desc}
      className={cn('inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-[11px] font-medium leading-none', tone.bg, tone.text, tone.border, className)}
    >
      <span aria-hidden className="inline-block size-1.5 rounded-full bg-current opacity-70" />
      {withLabel ? def.label : status}
    </span>
  )
}

export function TypeBadge({ type, className }: { type: string; className?: string }) {
  const def = ENTITY_TYPES[type as keyof typeof ENTITY_TYPES]
  const hue = TYPE_HUE[type] ?? '#666'
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-[11px] font-medium leading-none', className)}
      style={{ backgroundColor: `${hue}14`, borderColor: `${hue}55`, color: hue }}
    >
      <span aria-hidden className="inline-block size-1.5 rounded-full" style={{ backgroundColor: hue }} />
      {def ? def.label : type}
    </span>
  )
}

// ---------- layout primitives ----------
export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('label-caps text-[13px] text-muted-foreground', className)}>{children}</p>
}

export function SectionHeading({ kicker, title, lede, className }: { kicker: string; title: string; lede?: string; className?: string }) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <Kicker>{kicker}</Kicker>
      <h1 className="font-display mt-2 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {lede && <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed sm:text-base">{lede}</p>}
      <div className="rule-double mt-5 max-w-[120px]" aria-hidden />
    </div>
  )
}

export function EmptyState({ icon: Icon, title, children, className }: { icon?: React.ComponentType<{ className?: string }>; title: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-md border border-dashed border-border bg-card/60 px-6 py-10 text-center', className)}>
      {Icon && (
        <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-border bg-secondary">
          <Icon className="size-4.5 text-muted-foreground" aria-hidden />
        </div>
      )}
      <h3 className="font-display mt-3 text-base font-semibold">{title}</h3>
      {children && <div className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-relaxed">{children}</div>}
    </div>
  )
}

export function HonestNote({ children, tone = 'amber', className }: { children: React.ReactNode; tone?: 'amber' | 'green' | 'rose'; className?: string }) {
  const t = TONE[tone] ?? TONE.amber
  return (
    <div className={cn('rounded-md border px-4 py-3 text-sm leading-relaxed', t.bg, t.text, t.border, className)}>
      {children}
    </div>
  )
}

// ---------- data hook (TanStack Query — server state standard) ----------
export function useApi<T>(url: string | null) {
  const q = useQuery<T, Error>({
    queryKey: ['api', url],
    queryFn: async () => {
      const r = await fetch(url!)
      const json = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error((json as { error?: string })?.error ?? `Request failed (${r.status})`)
      return json as T
    },
    enabled: !!url,
  })
  return {
    data: (q.data ?? null) as T | null,
    loading: !!url && q.isPending,
    error: q.isError ? q.error.message : null,
    ref: () => { void q.refetch() },
  }
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-md border border-border bg-card p-5">
      <div className="h-3 w-24 rounded bg-muted" />
      <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
      <div className="mt-2 h-3 w-full rounded bg-muted" />
      <div className="mt-1.5 h-3 w-5/6 rounded bg-muted" />
    </div>
  )
}

'use client'

// 165 — Pemilih bahasa dunia: ~165 bahasa, dicari & dikelompokkan per region,
// label tier jujur (kurasi / AI / antarmuka Indonesia). Default: Bahasa Indonesia.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Globe, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { effectiveTier, setLanguage, useI18n, type EffectiveTier } from '@/lib/i18n'
import { LANGUAGES, REGION_ORDER, type LanguageDef } from '@/lib/i18n/languages'

const TIER_DOT: Record<EffectiveTier, string> = {
  curated: 'bg-emerald-600',
  ai: 'bg-amber-500',
  core: 'bg-stone-400',
}

export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const { lang, meta, t } = useI18n()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)
  // tier efektif yang jujur: hitung ulang tiap dialog dibuka — bila kamus AI
  // baru tergenerate di latar, dot & angka legenda ikut naik tanpa rebuild.
  const counts = useMemo(() => {
    let curated = 0
    let ai = 0
    let core = 0
    for (const l of LANGUAGES) {
      const tier = effectiveTier(l.code)
      if (tier === 'curated') curated++
      else if (tier === 'ai') ai++
      else core++
    }
    return { total: LANGUAGES.length, curated, ai, core }
  }, [open])

  // tutup saat klik di luar / tekan Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return LANGUAGES
    return LANGUAGES.filter(
      (l) =>
        l.native.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        l.code.includes(q),
    )
  }, [q])

  const grouped = useMemo(() => {
    const map = new Map<string, LanguageDef[]>()
    for (const region of REGION_ORDER) {
      const items = filtered.filter((l) => l.region === region)
      if (items.length > 0) map.set(region, items)
    }
    return map
  }, [filtered])

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`${t('header.language')}: ${meta?.native ?? lang}`}
        className={cn(
          'border-border bg-card hover:bg-accent inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-[12.5px] font-semibold transition-colors',
          compact && 'h-9 w-full justify-center px-3',
        )}
      >
        <Globe aria-hidden className="size-4 text-[var(--brass)]" />
        <span className="max-w-[7.5rem] truncate">{meta?.native ?? lang}</span>
        <ChevronDown aria-hidden className={cn('size-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t('lang.title')}
          className="border-border bg-card absolute right-0 top-full z-50 mt-2 w-[min(92vw,430px)] overflow-hidden rounded-md border shadow-[0_24px_60px_-24px_rgba(50,38,18,0.45)]"
        >
          <div className="border-border/70 flex items-center justify-between border-b px-4 py-2.5">
            <p className="label-caps text-[11px] text-muted-foreground">
              {t('lang.title')} · {counts.total} bahasa / languages
            </p>
            <button
              onClick={() => setOpen(false)}
              aria-label={t('c.close')}
              className="text-muted-foreground hover:text-foreground rounded-sm p-1"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>

          <div className="relative px-3 pt-3">
            <Search aria-hidden className="text-muted-foreground pointer-events-none absolute top-1/2 left-6 size-3.5 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('lang.search')}
              aria-label={t('lang.search')}
              className="border-border bg-secondary/40 focus:border-[var(--brass)]/60 h-9 w-full rounded-sm border pr-3 pl-8 text-[13px] outline-none transition-colors placeholder:text-muted-foreground/70"
            />
          </div>

          <div className="nice-scroll max-h-[52vh] overflow-y-auto px-2 py-2">
            {grouped.size === 0 && (
              <p className="text-muted-foreground px-3 py-6 text-center text-[13px]">—</p>
            )}
            {[...grouped.entries()].map(([region, items]) => (
              <div key={region} className="mb-2">
                <p className="label-caps bg-secondary/50 text-muted-foreground sticky top-0 z-10 px-2 py-1.5 text-[10px]">
                  {region} · {items.length}
                </p>
                <ul>
                  {items.map((l) => {
                    const active = l.code === lang
                    return (
                      <li key={l.code}>
                        <button
                          onClick={() => {
                            setLanguage(l.code)
                            setOpen(false)
                            setQuery('')
                          }}
                          aria-current={active ? 'true' : undefined}
                          className={cn(
                            'flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-left transition-colors',
                            active ? 'bg-secondary' : 'hover:bg-secondary/60',
                          )}
                        >
                          <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', TIER_DOT[effectiveTier(l.code)])} />
                          <span className="min-w-0 flex-1">
                            <span className={cn('block truncate text-[13.5px]', active ? 'text-primary font-semibold' : 'font-medium')} dir={l.dir}>
                              {l.native}
                            </span>
                            <span className="text-muted-foreground block truncate text-[11.5px]">{l.name} · {l.code}</span>
                          </span>
                          {l.code === 'id' && (
                            <span className="border-[var(--brass)]/50 text-[#6b4f18] shrink-0 rounded-sm border px-1.5 py-0.5 text-[10px] font-medium">
                              {t('lang.defaultBadge')}
                            </span>
                          )}
                          {active && (
                            <>
                              <span className="text-[var(--brass)] hidden shrink-0 text-[10px] font-medium sm:inline">{t('lang.activeBadge')}</span>
                              <Check aria-hidden className="text-primary size-4 shrink-0" />
                            </>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-border/70 bg-secondary/40 border-t px-4 py-3">
            <p className="text-muted-foreground text-[11.5px] leading-relaxed">
              <span className="mr-2 inline-flex items-center gap-1"><span aria-hidden className={cn('size-1.5 rounded-full', TIER_DOT.curated)} />{t('lang.tierCurated')}</span>
              <span className="mr-2 inline-flex items-center gap-1"><span aria-hidden className={cn('size-1.5 rounded-full', TIER_DOT.ai)} />{t('lang.tierAI')}</span>
              <span className="inline-flex items-center gap-1"><span aria-hidden className={cn('size-1.5 rounded-full', TIER_DOT.core)} />{t('lang.tierCore')}</span>
            </p>
            <p className="text-muted-foreground/90 mt-1.5 text-[11px] leading-relaxed">{t('lang.hint', { curated: counts.curated, ai: counts.ai })}</p>
          </div>
        </div>
      )}
    </div>
  )
}

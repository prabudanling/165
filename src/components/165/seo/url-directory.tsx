'use client'

// 165 — Url Directory: interactive, searchable, paginated map of the 1.200 planned
// Fase-1 sitemap URLs. Reads the shared SEO blueprint module — rows are never
// fabricated here, only rendered (planned pages, not live links).
import { useMemo, useState } from 'react'
import type { JSX } from 'react'
import { ChevronLeft, ChevronRight, Network, Search, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TEMPLATE_CATALOG, PAGE_MAP_TOTAL, generateUrlIndex, type TemplateKind } from '@/lib/seo-blueprint'
import { EmptyState } from '../ui'

const ROWS_PER_PAGE = 25

// same hue vocabulary as seo-templates.tsx — muted scholarly tones, no blue/indigo
const KIND_HUE: Record<TemplateKind, string> = {
  person: '#3E6B4F', term: '#71785E', book: '#8A6D3B', event: '#946B2D', place: '#7C8A4D',
  institution: '#2F4A3C', sanad: '#5B5443', collection: '#565F4B', article: '#6E6A57', faq: '#8C4A3C',
}

const KIND_LABEL: Record<TemplateKind, string> = Object.fromEntries(
  TEMPLATE_CATALOG.map((t) => [t.kind, t.label]),
) as Record<TemplateKind, string>

// ≤ 7 page numbers centered on the current page, with ellipses (e.g. 1 … 4 5 6 … 48)
function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

function KindBadge({ kind }: { kind: TemplateKind }) {
  const hue = KIND_HUE[kind]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-[11px] font-medium leading-none"
      style={{ backgroundColor: `${hue}14`, borderColor: `${hue}55`, color: hue }}
    >
      <span aria-hidden className="inline-block size-1.5 rounded-full" style={{ backgroundColor: hue }} />
      {KIND_LABEL[kind]}
    </span>
  )
}

export function UrlDirectory(): JSX.Element {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<'all' | TemplateKind>('all')
  const [page, setPage] = useState(1)

  // blueprint index computed exactly once for the lifetime of the component
  const allRows = useMemo(() => generateUrlIndex(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allRows.filter(
      (r) => (kind === 'all' || r.kind === kind) && (q === '' || r.path.toLowerCase().includes(q)),
    )
  }, [allRows, query, kind])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const current = Math.min(page, totalPages) // stays valid even if a filter shrinks the list
  const pageRows = filtered.slice((current - 1) * ROWS_PER_PAGE, current * ROWS_PER_PAGE)
  const start = filtered.length === 0 ? 0 : (current - 1) * ROWS_PER_PAGE + 1
  const end = Math.min(current * ROWS_PER_PAGE, filtered.length)

  return (
    <div>
      {/* header row */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-caps text-[12px] text-muted-foreground">Peta Sitemap — Fase 1</p>
          <p className="text-muted-foreground mt-1 text-[13px]">
            {PAGE_MAP_TOTAL.toLocaleString('id-ID')} URL · siap di-shard per tipe halaman
          </p>
        </div>
        <span className="border-border/70 bg-secondary/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[12px]">
          <Network className="text-[var(--brass)] size-3.5" aria-hidden />
          Sitemap index terencana
        </span>
      </div>

      {/* toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" aria-hidden />
          <Input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            placeholder="Cari URL atau slug…"
            aria-label="Cari URL atau slug"
            className="pl-8"
          />
        </div>
        <Select
          value={kind}
          onValueChange={(v) => { setKind(v as 'all' | TemplateKind); setPage(1) }}
        >
          <SelectTrigger className="w-full sm:w-[250px]" aria-label="Saring menurut tipe halaman">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua tipe · {PAGE_MAP_TOTAL.toLocaleString('id-ID')}</SelectItem>
            {TEMPLATE_CATALOG.map((t) => (
              <SelectItem key={t.kind} value={t.kind}>{t.label} · {t.count}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p aria-live="polite" className="text-muted-foreground ml-auto text-[12.5px]">
          Menampilkan{' '}
          <span className="text-foreground font-medium">
            {start.toLocaleString('id-ID')}–{end.toLocaleString('id-ID')}
          </span>{' '}
          dari <span className="text-foreground font-medium">{filtered.length.toLocaleString('id-ID')}</span> URL
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={SearchX} title="Tidak ada URL yang cocok dengan filter." className="mt-4">
          Coba kata kunci yang lebih pendek, atau pilih &ldquo;Semua tipe&rdquo; untuk melihat seluruh peta.
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setQuery(''); setKind('all'); setPage(1) }}
            >
              Bersihkan filter
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div className="mt-4 rounded-md border border-border bg-card">
          {/* scrollable body — only the 25-row page slice is ever rendered */}
          <div className="nice-scroll max-h-[460px] overflow-y-auto">
            <Table>
              <TableHeader className="bg-secondary sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-[12px]">URL</TableHead>
                  <TableHead className="text-[12px]">Tipe</TableHead>
                  <TableHead className="text-[12px]">Skema</TableHead>
                  <TableHead className="text-right text-[12px]">Prioritas</TableHead>
                  <TableHead className="hidden text-[12px] md:table-cell">Diperbarui</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.path}>
                    <TableCell className="max-w-[340px] truncate font-mono text-[12.5px]" title={r.path}>
                      {r.path}
                    </TableCell>
                    <TableCell><KindBadge kind={r.kind} /></TableCell>
                    <TableCell className="font-mono text-[12px]">{r.schema}</TableCell>
                    <TableCell className="text-right font-mono text-[12.5px]">{r.priority.toFixed(1)}</TableCell>
                    <TableCell className="hidden font-mono text-[12px] md:table-cell">
                      <time dateTime={r.lastmod}>{r.lastmod}</time>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* pagination */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                aria-label="Halaman sebelumnya"
                disabled={current <= 1}
                onClick={() => setPage(current - 1)}
              >
                <ChevronLeft className="size-3.5" aria-hidden />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                aria-label="Halaman berikutnya"
                disabled={current >= totalPages}
                onClick={() => setPage(current + 1)}
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="size-3.5" aria-hidden />
              </Button>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-1.5">
              <p className="text-muted-foreground text-[12.5px]">
                Halaman <span className="text-foreground font-medium">{current}</span> dari{' '}
                <span className="text-foreground font-medium">{totalPages.toLocaleString('id-ID')}</span>
              </p>
              <nav aria-label="Navigasi halaman direktori" className="flex items-center gap-1">
                {pageWindow(current, totalPages).map((p, i) =>
                  p === '…' ? (
                    <span key={`ellipsis-${i}`} aria-hidden className="text-muted-foreground px-1 text-[12px]">
                      …
                    </span>
                  ) : (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === current ? 'secondary' : 'ghost'}
                      aria-label={`Ke halaman ${p}`}
                      aria-current={p === current ? 'page' : undefined}
                      className="h-7 min-w-7 px-1.5 font-mono text-[12px]"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ),
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

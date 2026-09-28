'use client'

// 165 — SEO Template Gallery: renders each planned page type as a live preview,
// with SERP simulation, JSON-LD structured data and the SEO checklist.
import { useMemo, useState } from 'react'
import {
  BookOpen, CalendarDays, Check, Copy, FileText, Fingerprint, HelpCircle,
  Landmark, Languages, Layers, Link2, MapPin, ShieldCheck, User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EvidenceBadge, StatusBadge } from '../ui'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CHECKLIST_BASE, PREVIEW_ENTITIES, TEMPLATE_CATALOG, buildJsonLd, metaDescription, metaTitle,
  type PreviewEntity, type TemplateKind, type TemplateMeta,
} from '@/lib/seo-blueprint'

// ---------- local vocabulary ----------

const TEMPLATE_ICONS: Record<TemplateKind, React.ComponentType<{ className?: string }>> = {
  person: User, term: Languages, book: BookOpen, event: CalendarDays, place: MapPin,
  institution: Landmark, sanad: Link2, collection: Layers, article: FileText, faq: HelpCircle,
}

const KIND_HUE: Record<TemplateKind, string> = {
  person: '#3E6B4F', term: '#71785E', book: '#8A6D3B', event: '#946B2D', place: '#7C8A4D',
  institution: '#2F4A3C', sanad: '#5B5443', collection: '#565F4B', article: '#6E6A57', faq: '#8C4A3C',
}

function TemplateBadge({ kind }: { kind: TemplateKind }) {
  const hue = KIND_HUE[kind]
  const meta = TEMPLATE_CATALOG.find((t) => t.kind === kind)!
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-[11px] font-medium leading-none"
      style={{ backgroundColor: `${hue}14`, borderColor: `${hue}55`, color: hue }}
    >
      <span aria-hidden className="inline-block size-1.5 rounded-full" style={{ backgroundColor: hue }} />
      {meta.label}
    </span>
  )
}

// ---------- page preview (the "future production page") ----------

function CitationBox({ e }: { e: PreviewEntity }) {
  return (
    <div className="bg-secondary/60 mt-6 rounded-md border border-dashed border-border p-4">
      <p className="label-caps text-[12px] text-muted-foreground">Cara mengutip halaman ini</p>
      <p className="mt-2 text-[13px] leading-relaxed">
        165.web.id, &ldquo;{e.name},&rdquo; {e.globalId}, diperbarui {e.updated}, diakses [tanggal akses Anda].
      </p>
      <p className="text-muted-foreground mt-2 inline-flex items-center gap-1.5 text-[12px]">
        <Fingerprint className="text-[var(--brass)] size-3.5" aria-hidden />
        Global ID permanen — sitasi tetap valid meskipun tampilan halaman berubah.
      </p>
    </div>
  )
}

function SanadViz({ e }: { e: PreviewEntity }) {
  const nodes = e.sanadNodes ?? []
  return (
    <div className="mt-6">
      <div className="rounded-md border border-amber-700/30 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        <strong className="font-semibold">Peringatan metodologis.</strong> Halaman sanad selalu dibuka dengan peringatan
        ini sebelum konten. Rantai bervariasi antar kitab dan antar cabang — varian ditampilkan terpisah, tidak digabung.
      </div>
      <ol className="mt-5 space-y-0 border-l border-dashed border-[var(--brass)]/50 pl-5">
        {nodes.map((n, i) => (
          <li key={i} className="relative pb-4 last:pb-0">
            <span
              aria-hidden
              className={cn(
                'absolute top-1 -left-[26px] size-2.5 rounded-full border',
                n.pending ? 'border-muted-foreground/60 bg-background' : 'border-[var(--brass)] bg-[var(--brass)]',
              )}
            />
            <p className={cn('text-[14px] font-medium leading-snug', n.pending && 'text-muted-foreground italic')}>{n.name}</p>
            <p className="text-muted-foreground text-[12px]">{n.role}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function EntityPreview({ e }: { e: PreviewEntity }) {
  const meta = TEMPLATE_CATALOG.find((t) => t.kind === e.kind)!
  return (
    <article className="max-w-none">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-muted-foreground label-caps text-[12px]">
        Beranda <span aria-hidden className="mx-1">›</span> {meta.label} <span aria-hidden className="mx-1">›</span>{' '}
        <span className="text-foreground">{e.name}</span>
      </nav>

      {/* badges */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <TemplateBadge kind={e.kind} />
        <StatusBadge status={e.status} />
        <EvidenceBadge level={e.level} withLabel />
        <span className="border-border/70 text-muted-foreground inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px]">
          <Languages className="size-3" aria-hidden /> id · en · ar
        </span>
        <span className="border-border/70 text-muted-foreground inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-mono text-[11px]">
          <time dateTime={e.updated}>{e.updated}</time>
        </span>
      </div>

      {/* heading */}
      <header className="mt-4">
        <h1 className="font-display text-2xl leading-tight font-semibold tracking-tight sm:text-[28px]">{e.name}</h1>
        {e.arabic && (
          <p dir="rtl" lang="ar" className="font-arabic text-muted-foreground mt-1.5 text-xl">{e.arabic}</p>
        )}
        <p className="text-muted-foreground mt-1.5 text-[15px]">{e.subtitle}</p>
        {e.dates && (
          <p className="border-border/70 text-muted-foreground mt-3 inline-flex rounded-sm border px-2 py-1 text-[12px]">{e.dates}</p>
        )}
        {e.byline && (
          <p className="text-muted-foreground mt-3 text-[12px]">
            Oleh <span className="text-foreground font-medium">{e.byline}</span> · Direview Dewan Editorial
          </p>
        )}
      </header>

      {/* honest demo note */}
      <div className="rounded-md border border-amber-700/30 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900 dark:bg-amber-950/40 dark:text-amber-100 mt-4">
        {e.demoNote}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        {/* main column */}
        <div className="min-w-0">
          <p className="text-[15px] leading-relaxed">{e.summary}</p>

          {e.kind === 'sanad' && <SanadViz e={e} />}

          {e.faqs && e.faqs.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold">Pertanyaan & Jawaban</h2>
              <Accordion type="single" collapsible className="mt-2">
                {e.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-[14px] font-medium">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-[14px] leading-relaxed">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {e.sections.map((s, i) => (
            <section key={i} className="mt-6">
              <h2 className="font-display text-lg font-semibold">{s.heading}</h2>
              <p className="text-muted-foreground mt-2 text-[14px] leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>

        {/* infobox aside */}
        <aside className="h-fit rounded-md border border-border bg-secondary/40 p-4 lg:order-last">
          <p className="label-caps text-[12px] text-muted-foreground">Ringkasan data</p>
          <dl className="mt-2.5 space-y-2.5">
            {e.facts.map((f, i) => (
              <div key={i}>
                <dt className="label-caps text-[11px] text-muted-foreground">{f.label}</dt>
                <dd className="mt-0.5 text-[13px] leading-snug">{f.value}</dd>
              </div>
            ))}
            <div>
              <dt className="label-caps text-[11px] text-muted-foreground">Global ID</dt>
              <dd className="mt-0.5 font-mono text-[12px]">{e.globalId}</dd>
            </div>
          </dl>

          <div className="border-border/70 mt-4 border-t pt-3">
            <p className="label-caps text-[12px] text-muted-foreground">Tersambung (tautan internal)</p>
            <ul className="mt-2 space-y-1.5">
              {e.related.map((r, i) => {
                const Icon = TEMPLATE_ICONS[r.kind]
                return (
                  <li key={i}>
                    <span className="text-muted-foreground hover:text-foreground inline-flex cursor-default items-center gap-1.5 text-[13px] transition-colors">
                      <Icon className="size-3.5" aria-hidden /> {r.title}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </div>

      <CitationBox e={e} />
    </article>
  )
}

// ---------- SERP simulation ----------

function SerpPreview({ e }: { e: PreviewEntity }) {
  const title = metaTitle(e)
  const desc = metaDescription(e)
  const path = TEMPLATE_CATALOG.find((t) => t.kind === e.kind)!.path.replace(/\//g, ' › ').trim()
  return (
    <div>
      <p className="label-caps text-[12px] text-muted-foreground">Simulasi hasil pencarian (SERP)</p>
      <div className="bg-card mt-3 rounded-md border border-border p-4">
        <p className="text-muted-foreground font-mono text-[12px]">165.web.id {path ? `› ${path}` : ''} › {e.slug}</p>
        <p className="text-primary mt-1 text-[18px] leading-snug font-medium">{title}</p>
        <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">
          <span className="text-foreground/70">{e.updated}</span> — {desc}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="border-border/70 text-muted-foreground inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px]">
            <Check className="size-3 text-emerald-700" aria-hidden /> Skema terbaca:{' '}
            {TEMPLATE_CATALOG.find((t) => t.kind === e.kind)!.schema}
          </span>
          <span className="border-border/70 text-muted-foreground inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px]">
            <ShieldCheck className="size-3 text-[var(--brass)]" aria-hidden /> Status verifikasi tampil di hasil
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border p-3">
          <p className="label-caps text-[12px] text-muted-foreground">&lt;title&gt; — rekomendasi ≤ 60 karakter</p>
          <p className="mt-1.5 text-[13px] leading-snug">{title}</p>
          <p className="mt-2">
            <span
              className={cn(
                'inline-flex rounded-sm border px-1.5 py-0.5 text-[11px]',
                title.length <= 60
                  ? 'border-emerald-700/30 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100'
                  : 'border-amber-700/30 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100',
              )}
            >
              {title.length} / 60 karakter
            </span>
          </p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="label-caps text-[12px] text-muted-foreground">Meta description — rekomendasi 140–160</p>
          <p className="text-muted-foreground mt-1.5 text-[13px] leading-snug">{desc}</p>
          <p className="mt-2">
            <span
              className={cn(
                'inline-flex rounded-sm border px-1.5 py-0.5 text-[11px]',
                desc.length >= 140 && desc.length <= 160
                  ? 'border-emerald-700/30 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100'
                  : 'border-amber-700/30 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100',
              )}
            >
              {desc.length} karakter
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

// ---------- JSON-LD view ----------

function JsonLdView({ e }: { e: PreviewEntity }) {
  const [copied, setCopied] = useState(false)
  const json = useMemo(() => JSON.stringify(buildJsonLd(e), null, 2), [e])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard unavailable */ }
  }
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="label-caps text-[12px] text-muted-foreground">Data terstruktur yang dibaca mesin pencari</p>
        <Button type="button" variant="outline" size="sm" className="h-7 gap-1.5 text-[12px]" onClick={() => void copy()}>
          <Copy className="size-3" aria-hidden /> {copied ? 'Tersalin' : 'Salin JSON-LD'}
        </Button>
      </div>
      <pre className="nice-scroll mt-3 max-h-[420px] overflow-auto rounded-md border border-border bg-secondary/50 p-4 font-mono text-[12px] leading-relaxed">
        {json}
      </pre>
      <p className="text-muted-foreground mt-3 text-[12px] leading-relaxed">
        Skema <span className="font-mono">{TEMPLATE_CATALOG.find((t) => t.kind === e.kind)!.schema}</span> + BreadcrumbList
        disematkan otomatis pada setiap halaman produksi — Google, Bing, dan asisten AI membaca struktur ini tanpa menebak.
      </p>
    </div>
  )
}

// ---------- checklist view ----------

function ChecklistView({ meta }: { meta: TemplateMeta }) {
  const total = CHECKLIST_BASE.length + meta.gates.length
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="label-caps text-[12px] text-muted-foreground">Checklist SEO halaman &ldquo;{meta.label}&rdquo;</p>
        <span className="border-emerald-700/30 bg-emerald-50 text-emerald-900 inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[12px] font-medium dark:bg-emerald-950/40 dark:text-emerald-100">
          <Check className="size-3.5" aria-hidden /> {CHECKLIST_BASE.length}/{total} terpenuhi sejak rilis
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {CHECKLIST_BASE.map((c, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] leading-snug">
            <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-700" aria-hidden />
            <span>{c}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-md border border-amber-700/30 bg-amber-50 px-4 py-3 dark:bg-amber-950/40">
        <p className="label-caps text-[12px] text-amber-900 dark:text-amber-100">Gerbang publikasi — kebijakan yang menahan halaman sampai sumber siap</p>
        <ul className="mt-2 space-y-1.5">
          {meta.gates.map((g, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] leading-snug text-amber-900 dark:text-amber-100">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-muted-foreground mt-4 text-[12px] leading-relaxed">
        Prinsip: <span className="text-foreground font-medium">jumlah halaman tidak pernah mengalahkan kebenaran halaman.</span>{' '}
        Checklist menjamin kualitas teknis; gerbang menjamin kejujuran isi.
      </p>
    </div>
  )
}

// ---------- gallery ----------

export function TemplateGallery() {
  const [kind, setKind] = useState<TemplateKind>('person')
  const entity = PREVIEW_ENTITIES[kind]
  const meta = TEMPLATE_CATALOG.find((t) => t.kind === kind)!

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[270px_minmax(0,1fr)]">
      {/* selector */}
      <div role="tablist" aria-label="Pilih template halaman" className="nice-scroll flex max-h-full gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-y-auto lg:pb-0">
        {TEMPLATE_CATALOG.map((t) => {
          const Icon = TEMPLATE_ICONS[t.kind]
          const active = t.kind === kind
          return (
            <button
              key={t.kind}
              role="tab"
              aria-selected={active}
              onClick={() => setKind(t.kind)}
              className={cn(
                'flex min-w-[190px] shrink-0 items-center gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors lg:min-w-0',
                active ? 'border-primary/40 bg-secondary shadow-sm' : 'border-border bg-card hover:bg-secondary/60',
              )}
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-sm border"
                style={{ backgroundColor: `${KIND_HUE[t.kind]}14`, borderColor: `${KIND_HUE[t.kind]}55`, color: KIND_HUE[t.kind] }}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className={cn('block truncate text-[13px] font-medium', active ? 'text-primary' : '')}>{t.label}</span>
                <span className="text-muted-foreground block font-mono text-[11px]">
                  {t.count} hal · {t.schema}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* detail */}
      <div className="min-w-0">
        <p className="text-muted-foreground mb-4 text-[14px] leading-relaxed">{meta.why}</p>
        <Tabs defaultValue="preview" className="gap-4">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
            {[
              ['preview', 'Pratinjau Halaman'],
              ['serp', 'Hasil Pencarian'],
              ['jsonld', 'Data Terstruktur'],
              ['checklist', 'Checklist SEO'],
            ].map(([v, label]) => (
              <TabsTrigger
                key={v}
                value={v}
                className="border-border data-[state=active]:border-border data-[state=active]:bg-card hover:bg-secondary/60 h-8 rounded-sm border bg-transparent px-3 text-[12.5px] data-[state=active]:shadow-none"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="preview">
            {/* browser frame */}
            <div className="overflow-hidden rounded-md border border-border bg-card">
              <div className="border-border/80 bg-secondary/60 flex items-center gap-2 border-b px-3 py-2">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="bg-muted-foreground/30 size-2.5 rounded-full" />
                  <span className="bg-muted-foreground/30 size-2.5 rounded-full" />
                  <span className="bg-muted-foreground/30 size-2.5 rounded-full" />
                </span>
                <span className="border-border bg-background text-muted-foreground ml-1 flex-1 truncate rounded-sm border px-2.5 py-1 font-mono text-[11px]">
                  https://165.web.id{meta.path}{entity.slug}
                </span>
              </div>
              <div className="nice-scroll max-h-[560px] overflow-y-auto p-4 sm:p-6">
                <EntityPreview e={entity} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="serp" className="mt-0">
            <div className="rounded-md border border-border bg-background/40 p-4 sm:p-5">
              <SerpPreview e={entity} />
            </div>
          </TabsContent>

          <TabsContent value="jsonld" className="mt-0">
            <div className="rounded-md border border-border bg-background/40 p-4 sm:p-5">
              <JsonLdView e={entity} />
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="mt-0">
            <div className="rounded-md border border-border bg-background/40 p-4 sm:p-5">
              <ChecklistView meta={meta} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

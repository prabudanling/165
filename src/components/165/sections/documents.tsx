'use client'

// 165 — Ruang Dokumen Sistem
// Rak dokumen kendali/kanonik 165 (Master Control 000, Master Blueprint, Arsitektur,
// Governance 007, Konstitusi Editorial 008, Kebijakan Sumber & Sitasi 009).
// Konten dirender VERBATIM dari bundle (src/data/documents/canon.ts) — tanpa database,
// tanpa filesystem: tampil utuh di mana pun situs di-deploy (resilience doctrine).
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  FileSearch,
  FileText,
  Landmark,
  LibraryBig,
  ScrollText,
  Search,
  ShieldCheck,
  Stamp,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DOCUMENTS,
  corpusStats,
  docToc,
  docWords,
  getDocument,
  readingMinutes,
  searchDocuments,
  type CanonDocument,
  type TocItem,
} from '@/lib/documents'
import { HonestNote, SectionHeading } from '../ui'

const nf = new Intl.NumberFormat('id-ID')

// ---------- markdown helpers ----------
function childText(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(childText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: unknown } }).props
    return childText(props?.children)
  }
  return ''
}

const SCROLL_OFFSET = 96

function scrollToAnchor(id: string, smooth = true) {
  const el = document.getElementById(id)
  if (!el) return false
  const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
  window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' })
  return true
}

function HeadingTag({ tag, children }: { tag: 'h1' | 'h2' | 'h3'; children?: React.ReactNode }) {
  const id = docAnchorId(childText(children))
  const Tag = tag
  const cls =
    tag === 'h1'
      ? 'font-display mt-12 mb-4 scroll-mt-28 border-b border-border/60 pb-2 text-[22px] font-semibold leading-snug tracking-tight first:mt-0 sm:text-[26px]'
      : tag === 'h2'
        ? 'font-display mt-10 mb-3 scroll-mt-28 text-[19px] font-semibold leading-snug tracking-tight sm:text-[21px]'
        : 'font-display mt-8 mb-2 scroll-mt-28 text-[16.5px] font-semibold leading-snug'
  return (
    <div id={id} className="scroll-mt-28">
      <Tag className={cls}>{children}</Tag>
      {tag === 'h1' && <div aria-hidden className="mt-[-10px] mb-2 h-[2px] w-16 bg-gradient-to-r from-[var(--brass)] to-transparent" />}
    </div>
  )
}

/** deterministic anchor id — must match docToc() */
function docAnchorId(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80) || 'bagian'
  )
}

const MD_COMPONENTS: Components = {
  h1: ({ children }) => <HeadingTag tag="h1">{children}</HeadingTag>,
  h2: ({ children }) => <HeadingTag tag="h2">{children}</HeadingTag>,
  h3: ({ children }) => <HeadingTag tag="h3">{children}</HeadingTag>,
  h4: ({ children }) => <h4 className="font-display mt-6 mb-2 text-[15px] font-semibold">{children}</h4>,
  p: ({ children }) => <p className="text-foreground/90 my-4 text-[15px] leading-[1.85]">{children}</p>,
  ul: ({ children }) => <ul className="marker:text-[var(--brass)]/70 my-4 list-disc space-y-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="marker:text-[var(--brass)]/80 marker:font-medium my-4 list-decimal space-y-1 pl-6">{children}</ol>,
  li: ({ children }) => <li className="text-foreground/90 my-1.5 text-[14.5px] leading-[1.8]">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-[var(--brass)]/70 bg-secondary/40 text-foreground/85 my-5 border-l-2 px-4 py-2.5 text-[14.5px] leading-relaxed [&>p]:my-1">{children}</blockquote>
  ),
  hr: () => <div aria-hidden className="rule-double my-10" />,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer noopener" className="decoration-[var(--brass)]/60 hover:decoration-[var(--brass)] text-[#6b4f18] font-medium underline decoration-dotted underline-offset-2">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) =>
    className?.includes('language-') ? (
      <code className="font-mono text-[12.5px] leading-[1.7]">{children}</code>
    ) : (
      <code className="border-border/50 bg-secondary text-foreground/90 rounded-sm border px-1.5 py-0.5 font-mono text-[12.5px]">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="border-border bg-secondary/50 nice-scroll text-foreground/90 my-6 overflow-x-auto rounded-md border p-4 font-mono text-[12.5px] leading-[1.7]">{children}</pre>
  ),
  table: ({ children }) => (
    <div className="border-border nice-scroll my-6 overflow-x-auto rounded-md border">
      <table className="w-full border-collapse text-[13.5px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-secondary/70">{children}</thead>,
  th: ({ children }) => <th className="border-border label-caps border-b px-3 py-2 text-left text-[11px] leading-relaxed">{children}</th>,
  td: ({ children }) => <td className="border-border/60 text-foreground/90 border-t px-3 py-2 align-top leading-relaxed">{children}</td>,
}

// ---------- document kind icon ----------
function KindIcon({ kind, className }: { kind: CanonDocument['kind']; className?: string }) {
  const cls = 'size-4 text-[var(--brass)]'
  switch (kind) {
    case 'Dokumen Kendali':
      return <Landmark aria-hidden className={cn(cls, className)} />
    case 'Tata Kelola':
      return <ShieldCheck aria-hidden className={cn(cls, className)} />
    case 'Konstitusi':
      return <ScrollText aria-hidden className={cn(cls, className)} />
    case 'Kebijakan':
      return <FileSearch aria-hidden className={cn(cls, className)} />
    case 'Cetak Biru':
      return <LibraryBig aria-hidden className={cn(cls, className)} />
    default:
      return <FileText aria-hidden className={cn(cls, className)} />
  }
}

// ---------- TOC ----------
function TocList({ toc, active, onJump }: { toc: TocItem[]; active: string | null; onJump: (id: string) => void }) {
  return (
    <ul className="space-y-0.5">
      {toc.map((t) => (
        <li key={`${t.line}-${t.id}`}>
          <button
            onClick={() => onJump(t.id)}
            aria-current={active === t.id ? 'true' : undefined}
            className={cn(
              'block w-full border-l-2 py-1 pl-2.5 text-left leading-snug transition-colors',
              t.depth === 1 ? 'text-[12.5px] font-medium' : 'text-muted-foreground border-border/40 pl-5 text-[12px]',
              active === t.id ? 'border-[var(--brass)] text-primary' : 'border-transparent hover:border-border hover:text-foreground',
            )}
          >
            {t.text}
          </button>
        </li>
      ))}
    </ul>
  )
}

// ---------- highlight helper ----------
function Highlight({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[var(--brass-soft)] text-foreground rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ---------- main section ----------
export function DocumentsSection({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null)

  const doc = selectedKey ? getDocument(selectedKey) : undefined
  const stats = useMemo(() => corpusStats(), [])
  const toc = useMemo(() => (doc ? docToc(doc.content) : []), [doc])
  const hits = useMemo(() => (query.trim().length >= 2 ? searchDocuments(query) : []), [query])

  const openDoc = (key: string, anchor?: string | null) => {
    setSelectedKey(key)
    setQuery('')
    if (anchor) {
      setPendingAnchor(anchor)
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    setActiveAnchor(null)
    setProgress(0)
  }

  const backToShelf = () => {
    setSelectedKey(null)
    setActiveAnchor(null)
    setProgress(0)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const jump = (id: string) => {
    if (scrollToAnchor(id)) setActiveAnchor(id)
  }

  // open-with-anchor: after the reader mounts, jump to the target section
  useEffect(() => {
    if (!selectedKey || !pendingAnchor) return
    const t = window.setTimeout(() => {
      scrollToAnchor(pendingAnchor, false)
      setPendingAnchor(null)
    }, 150)
    return () => window.clearTimeout(t)
  }, [selectedKey, pendingAnchor])

  // reading progress + scroll-spy (single rAF-throttled listener)
  useEffect(() => {
    if (!doc) return
    let raf = 0
    const measure = () => {
      raf = 0
      const de = document.documentElement
      const max = de.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 1)
      let current: string | null = null
      for (const t of toc) {
        const el = document.getElementById(t.id)
        if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET + 34) current = t.id
      }
      setActiveAnchor(current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [doc, toc])

  // ---------------- reader ----------------
  if (doc) {
    const idx = DOCUMENTS.findIndex((d) => d.key === doc.key)
    const prev = idx > 0 ? DOCUMENTS[idx - 1] : null
    const next = idx < DOCUMENTS.length - 1 ? DOCUMENTS[idx + 1] : null
    return (
      <div>
        {/* reader header (sticky under site header) */}
        <div className="border-border/80 bg-background/95 sticky top-16 z-30 -mx-4 border-b px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <button
              onClick={backToShelf}
              className="border-border bg-card hover:bg-accent inline-flex h-8 shrink-0 items-center gap-1.5 rounded-sm border px-3 text-[13px] font-medium transition-colors"
            >
              <ArrowLeft aria-hidden className="size-3.5" /> Rak Dokumen
            </button>
            <p className="font-display min-w-0 flex-1 truncate text-[14.5px] font-semibold sm:text-[15.5px]">
              <span className="text-[var(--brass)] font-mono text-[12px] font-normal">{doc.code}</span>
              <span className="mx-2 text-border">|</span>
              {doc.title}
            </p>
            <div className="hidden items-center gap-2 text-[11px] text-muted-foreground md:flex">
              <span className="border-border bg-secondary rounded-sm border px-1.5 py-0.5 font-mono">{doc.docId}</span>
              <span className="border-border bg-secondary rounded-sm border px-1.5 py-0.5">{doc.version}</span>
            </div>
          </div>
          {/* reading progress */}
          <div aria-hidden className="border-border/60 absolute inset-x-0 bottom-[-1px] h-[2px] bg-transparent">
            <div className="h-full bg-[var(--brass)] transition-[width] duration-150 ease-out" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        </div>

        <div className="mt-7 flex gap-10">
          {/* TOC sidebar (desktop) */}
          <aside className="hidden w-64 shrink-0 xl:block" aria-label="Daftar isi dokumen">
            <div className="border-border/70 bg-card/40 sticky top-[9.5rem] max-h-[calc(100vh-11rem)] overflow-y-auto rounded-md border p-3 nice-scroll">
              <p className="label-caps px-1 pb-2 text-[11px] text-muted-foreground">Daftar Isi · {toc.length} bagian</p>
              <TocList toc={toc} active={activeAnchor} onJump={jump} />
            </div>
          </aside>

          {/* document body */}
          <article className="min-w-0 flex-1">
            {/* mobile TOC */}
            <details className="border-border bg-card/40 mb-6 rounded-md border xl:hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-medium">
                Daftar Isi · {toc.length} bagian
                <span aria-hidden className="text-muted-foreground float-right">buka/tutup</span>
              </summary>
              <div className="border-border/60 max-h-72 overflow-y-auto border-t px-3 py-2 nice-scroll">
                <TocList toc={toc} active={activeAnchor} onJump={jump} />
              </div>
            </details>

            {/* document front matter */}
            <header className="border-border/70 mb-8 border-b pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="border-[var(--brass)]/50 bg-[var(--brass-soft)] text-[#6b4f18] inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11.5px] font-semibold">
                  <Stamp aria-hidden className="size-3" /> {doc.kind}
                </span>
                <span className="border-border bg-secondary text-muted-foreground rounded-sm border px-2 py-0.5 font-mono text-[11px]">{doc.docId}</span>
                <span className="border-border bg-secondary text-muted-foreground rounded-sm border px-2 py-0.5 text-[11px]">{doc.version}</span>
                <span className="border-border bg-secondary text-muted-foreground rounded-sm border px-2 py-0.5 text-[11px]">{doc.status}</span>
              </div>
              <h1 className="font-display mt-4 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{doc.title}</h1>
              <p className="text-muted-foreground mt-1.5 text-[14.5px]">{doc.subtitle}</p>
              <p className="text-muted-foreground mt-4 max-w-3xl text-[13.5px] leading-relaxed">
                {doc.role}
              </p>
              <p className="text-muted-foreground mt-4 font-mono text-[11.5px]">
                {doc.layer} · {nf.format(docWords(doc.content))} kata · {toc.length} bagian · ± {readingMinutes(docWords(doc.content))} menit baca
              </p>
            </header>

            {/* verbatim markdown */}
            <div className="max-w-3xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
                {doc.content}
              </ReactMarkdown>
            </div>

            {/* prev / next */}
            <nav aria-label="Dokumen berikutnya" className="border-border/70 mt-14 grid gap-3 border-t pt-6 sm:grid-cols-2">
              {prev ? (
                <button
                  onClick={() => openDoc(prev.key)}
                  className="border-border bg-card hover:border-[var(--brass)]/60 hover:bg-accent group flex items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors"
                >
                  <ArrowLeft aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                  <span className="min-w-0">
                    <span className="label-caps block text-[10.5px] text-muted-foreground">Sebelumnya · {prev.code}</span>
                    <span className="block truncate text-[13.5px] font-medium">{prev.title}</span>
                  </span>
                </button>
              ) : (
                <span aria-hidden className="hidden sm:block" />
              )}
              {next && (
                <button
                  onClick={() => openDoc(next.key)}
                  className="border-border bg-card hover:border-[var(--brass)]/60 hover:bg-accent group flex items-center justify-end gap-3 rounded-md border px-4 py-3 text-right transition-colors"
                >
                  <span className="min-w-0">
                    <span className="label-caps block text-[10.5px] text-muted-foreground">Berikutnya · {next.code}</span>
                    <span className="block truncate text-[13.5px] font-medium">{next.title}</span>
                  </span>
                  <ArrowRight aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </nav>
          </article>
        </div>
      </div>
    )
  }

  // ---------------- shelf ----------------
  return (
    <div>
      <SectionHeading
        kicker="Dokumen Kanonik · Sumber Pertama"
        title="Ruang Dokumen Sistem 165"
        lede="Enam dokumen kendali yang menjadi fondasi seluruh sistem 165.web.id — Master Control, Master Blueprint, Arsitektur Sistem, Tata Kelola, Konstitusi Editorial, dan Kebijakan Sumber & Sitasi — kini terbuka untuk dibaca utuh oleh siapa pun."
      />

      <HonestNote tone="green" className="mt-6">
        <p className="flex items-start gap-2">
          <BookOpenText aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>Salinan verbatim.</strong> Apa yang Anda baca di sini adalah isi asli dokumennya — bukan ringkasan atau parafrasa. Setiap dokumen membawa ID kanonik, versi, dan status resminya sendiri; perubahan hanya lewat alur tata kelola, tidak pernah disunting diam-diam.
          </span>
        </p>
      </HonestNote>

      {/* stats strip */}
      <div className="border-border/80 bg-secondary/40 mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border sm:grid-cols-4">
        {[
          { label: 'Dokumen kanonik', value: nf.format(stats.documents) },
          { label: 'Total kata', value: nf.format(stats.words) },
          { label: 'Bagian tersusun', value: nf.format(stats.headings) },
          { label: 'Total waktu baca', value: `± ${nf.format(DOCUMENTS.reduce((s, d) => s + readingMinutes(docWords(d.content)), 0))} mnt` },
        ].map((s) => (
          <div key={s.label} className="bg-background/60 px-4 py-4 text-center sm:py-5">
            <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{s.value}</p>
            <p className="label-caps text-muted-foreground mt-1 text-[10.5px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* search */}
      <div className="mt-8">
        <div className="relative max-w-xl">
          <Search aria-hidden className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari di dalam keenam dokumen… mis. sanad, founder, Tier A"
            aria-label="Cari di dalam dokumen"
            className="border-border bg-card focus:border-[var(--brass)]/60 h-10 w-full rounded-sm border pr-9 pl-9 text-[14px] outline-none transition-colors placeholder:text-muted-foreground/70"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Bersihkan pencarian"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded-sm p-1"
            >
              <X aria-hidden className="size-4" />
            </button>
          )}
        </div>

        {/* search results */}
        {query.trim().length >= 2 && (
          <div className="mt-5" aria-live="polite">
            <p className="label-caps text-muted-foreground text-[11px]">
              {hits.length > 0 ? `${nf.format(hits.length)} potongan ditemukan` : 'Tidak ada hasil'}
            </p>
            {hits.length === 0 ? (
              <p className="text-muted-foreground mt-3 text-sm">Tidak ada bagian dokumen yang cocok dengan “{query}”. Coba kata kunci lain — mis. “sanad”, “evidence”, “founder”.</p>
            ) : (
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {hits.map((h, i) => (
                  <li key={`${h.docKey}-${h.line}-${i}`}>
                    <button
                      onClick={() => openDoc(h.docKey, h.anchorId)}
                      className="border-border bg-card hover:border-[var(--brass)]/60 hover:bg-accent h-full w-full rounded-md border px-4 py-3 text-left transition-colors"
                    >
                      <p className="text-muted-foreground flex items-center gap-2 text-[11px]">
                        <span className="text-[var(--brass)] font-mono font-semibold">{h.docCode}</span>
                        <span className="truncate">{h.anchorText ?? h.docTitle}</span>
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed">
                        <Highlight text={h.excerpt} query={query.trim()} />
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* document shelf (hidden while searching) */}
      {query.trim().length < 2 && (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCUMENTS.map((d) => (
            <li key={d.key}>
              <button
                onClick={() => openDoc(d.key)}
                aria-label={`Buka dokumen ${d.title}`}
                className="group border-border bg-card hover:border-[var(--brass)]/60 flex h-full w-full flex-col rounded-md border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-20px_rgba(60,45,20,0.45)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-[var(--brass)] text-3xl leading-none font-bold tracking-tight">{d.code}</span>
                  <span className="border-border bg-secondary text-muted-foreground inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-[10.5px] font-medium">
                    <KindIcon kind={d.kind} className="size-3" /> {d.kind}
                  </span>
                </div>
                <h3 className="font-display mt-3.5 text-[17px] leading-snug font-semibold">{d.title}</h3>
                <p className="text-muted-foreground mt-1 text-[12.5px] leading-relaxed">{d.subtitle}</p>
                <p className="text-muted-foreground mt-3 line-clamp-4 text-[13px] leading-relaxed">{d.role}</p>
                <div className="border-border/60 mt-auto w-full border-t pt-3.5">
                  <p className="text-muted-foreground font-mono text-[11px]">
                    {nf.format(docWords(d.content))} kata · ± {readingMinutes(docWords(d.content))} mnt · {d.version}
                  </p>
                  <p className="label-caps text-muted-foreground/80 mt-1.5 text-[10px]">{d.layer}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* closing note */}
      <div className="border-border/70 bg-secondary/40 mt-10 rounded-md border px-5 py-4">
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          Dokumen-dokumen ini adalah <strong className="text-foreground font-medium">sumber pertama</strong> seluruh tampilan situs: struktur entitas, sistem bukti A–F, aturan sanad, hingga disiplin editorial dihalaman lain semuanya lahir dari sini. Punya koreksi atau tambahan terhadap isi dokumen? Sampaikan lewat kanal kontribusi — setiap usulan akan ditelaah, tidak pernah mengubah dokumen secara langsung.
          {onNavigate && (
            <button onClick={() => onNavigate('contribute')} className="text-[#6b4f18] ml-1.5 font-medium underline decoration-dotted underline-offset-2">
              Ajukan usulan →
            </button>
          )}
        </p>
      </div>
    </div>
  )
}

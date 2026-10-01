'use client'

// 165 — Institution App Shell (single-route SPA per sandbox constraint)
// Header nav v.4 (floating glass pill + self-measuring overflow nav) · section router · entity profile overlay · sticky footer
import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, ShieldCheck, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { initLanguage, useI18n } from '@/lib/i18n'
import type { CatalogKey } from '@/lib/i18n/catalog'
import { LanguagePicker } from './language-picker'
import { EntityProfile } from './entity-profile'
import { QueryProvider } from './query-provider'
import { HomeSection } from './sections/home'
import { ExploreSection } from './sections/explore'
import { ArchiveSection, LibrarySection, MediaSection } from './sections/library'
import { ResearchSection } from './sections/research'
import { AcademySection } from './sections/academy'
import { TrustSection } from './sections/trust'
import { AboutSection } from './sections/about'
import { SeoSection } from './sections/seo'
import { DocumentsSection } from './sections/documents'
import { ContributeSection } from './sections/contribute'
import { AdminSection } from './admin/admin'

const NAV = [
  { key: 'home', label: 'Home' },
  { key: 'explore', label: 'Explore' },
  { key: 'library', label: 'Library' },
  { key: 'archive', label: 'Archive' },
  { key: 'research', label: 'Research' },
  { key: 'academy', label: 'Academy' },
  { key: 'media', label: 'Media' },
  { key: 'trust', label: 'Trust & Method' },
  { key: 'about', label: 'About 165' },
  { key: 'documents', label: 'Dokumen' },
  { key: 'seo', label: 'SEO' },
] as const

type SectionKey = (typeof NAV)[number]['key'] | 'contribute' | 'admin'

const VALID_SECTIONS: readonly string[] = [
  ...NAV.map((n) => n.key), 'contribute', 'admin',
]

export function InstitutionApp() {
  const [section, setSection] = useState<SectionKey>('home')
  const [entitySlug, setEntitySlug] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  // v.4 self-measuring nav: items that do not fit flow into the "···" pill
  const [navLimit, setNavLimit] = useState<number>(NAV.length)
  const pillRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const fixedRef = useRef<HTMLDivElement>(null)
  const moreWrapRef = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  // muat bahasa tersimpan (setelah hydration — bebas mismatch) + deep-link
  // standar internasional: #section (mis. /#documents) dan ?q= (SearchAction)
  useEffect(() => {
    initLanguage()
    // ditangguhkan satu tick: hindari setState sinkron di dalam efek (cascading render)
    const t = setTimeout(() => {
      try {
        const hash = window.location.hash.replace('#', '')
        const params = new URLSearchParams(window.location.search)
        const q = (params.get('q') ?? '').trim()
        if (hash && VALID_SECTIONS.includes(hash)) {
          setSection(hash as SectionKey)
        }
        if (q.length >= 2) {
          setSection('documents')
          try { history.replaceState(null, '', '#documents') } catch { /* noop */ }
          // DocumentsSection belum terpasang saat event ini ditulis — kirim
          // setelah mount agar listener-nya siap menerima query pencarian.
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('165:docs-search', { detail: q }))
          }, 400)
        }
      } catch {
        /* noop */
      }
    }, 0)
    return () => clearTimeout(t)
  }, [])

  const navigate = useCallback((s: string) => {
    setSection(s as SectionKey)
    setEntitySlug(null)
    setMenuOpen(false)
    setMoreOpen(false)
    try { history.replaceState(null, '', s === 'home' ? '#' : `#${s}`) } catch { /* noop */ }
  }, [])

  const openEntity = useCallback((slug: string) => {
    setEntitySlug(slug)
    setMenuOpen(false)
  }, [])

  // scroll to top on section/entity change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [section, entitySlug])

  // v.4 — measure how many nav pills fit; the rest collapse into "···"
  useEffect(() => {
    const measure = () => {
      const pill = pillRef.current
      const ghost = ghostRef.current
      const fixed = fixedRef.current
      if (!pill || !ghost || !fixed) return
      const moreReserve = 92 // "···" pill + safety
      const avail =
        pill.clientWidth - 12 /* pl */ - 8 /* pr */ - 40 /* logo */ - 8 /* gap */ - fixed.offsetWidth - moreReserve
      let acc = 0
      let limit: number = NAV.length
      for (let i = 0; i < NAV.length; i++) {
        const w = (ghost.children[i] as HTMLElement | undefined)?.offsetWidth ?? 0
        if (acc + w > avail) {
          limit = i
          break
        }
        acc += w + 2 // nav gap-0.5
      }
      setNavLimit(Math.max(limit, 2))
    }
    measure()
    // label widths change when the webfont finishes loading — re-measure
    document.fonts?.ready.then(measure).catch(() => {})
    const ro = new ResizeObserver(measure)
    if (pillRef.current) ro.observe(pillRef.current)
    return () => ro.disconnect()
    // no deps: re-measure after EVERY render (language switches, viewport, fonts)
  })

  // tutup menu "···" saat klik di luar / Escape
  useEffect(() => {
    if (!moreOpen) return
    const onDown = (e: MouseEvent) => {
      if (moreWrapRef.current && !moreWrapRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  // deep-link support: /#admin opens the admin room (deferred setState keeps hooks rules happy)
  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash.replace('#', '')
      if (h && VALID_SECTIONS.includes(h)) {
        setSection(h as SectionKey)
        setEntitySlug(null)
      }
    }
    const t = window.setTimeout(applyHash, 0)
    window.addEventListener('hashchange', applyHash)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('hashchange', applyHash)
    }
  }, [])

  return (
    <QueryProvider>
      <div className="bg-background text-foreground flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-sm focus:bg-primary focus:px-3 focus:py-1.5 focus:text-sm focus:text-primary-foreground">
        {t('header.skip')}
      </a>

      {/* ---------------- header v.4 — floating glass pill ---------------- */}
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
        <div ref={pillRef} className="border-border/60 bg-card/85 supports-[backdrop-filter]:bg-card/70 shadow-emerald-950/5 relative mx-auto flex h-16 max-w-7xl items-center gap-2 rounded-full border pr-2 pl-2.5 shadow-lg backdrop-blur-xl sm:pl-3">
          {/* ghost measurer — invisible twin row used to compute pill widths
              (clipped to 40px so it never widens the document on mobile) */}
          <div aria-hidden className="pointer-events-none invisible absolute top-0 left-0 size-10 overflow-hidden">
            <div ref={ghostRef} className="flex w-max items-center gap-0.5">
              {NAV.map((n) => (
                <span key={n.key} className="whitespace-nowrap rounded-full px-2 py-1.5 text-[12.5px] font-semibold">
                  {t(`nav.${n.key}` as CatalogKey)}
                </span>
              ))}
            </div>
          </div>

          {/* wordmark — gradient squircle (icon-only, kid-modern) */}
          <button type="button" onClick={() => navigate('home')} className="group flex shrink-0 items-center text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" aria-label="165 — home">
            <span className="bg-gradient-to-br from-primary via-emerald-500 to-[var(--brass)] v4-glow flex size-10 items-center justify-center rounded-2xl font-display text-[15px] font-bold tracking-tight text-white transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 group-active:scale-95">
              165
            </span>
          </button>

          {/* desktop nav — colored active pill, overflow collapses into ··· */}
          <nav className="ml-auto hidden min-w-0 items-center gap-0.5 xl:flex" aria-label="Primary">
            {NAV.slice(0, navLimit).map((n) => (
              <button
                key={n.key}
                onClick={() => navigate(n.key)}
                aria-current={section === n.key && !entitySlug ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap rounded-full px-2 py-1.5 text-[12.5px] font-semibold transition-all duration-200',
                  section === n.key && !entitySlug
                    ? 'bg-primary text-primary-foreground v4-glow scale-[1.03]'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95',
                )}
              >
                {t(`nav.${n.key}` as CatalogKey)}
              </button>
            ))}
            {navLimit < NAV.length && (
              <div ref={moreWrapRef} className="relative shrink-0">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                  aria-label={t('nav.more')}
                  className={cn(
                    'inline-flex h-8 items-center justify-center rounded-full px-2.5 text-[14px] font-bold tracking-widest transition-all duration-200 active:scale-90',
                    moreOpen ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  ···
                </button>
                {moreOpen && (
                  <div className="border-border/60 bg-card/95 animate-in fade-in-0 zoom-in-95 absolute right-0 top-full z-50 mt-2 flex w-52 flex-col gap-0.5 rounded-3xl border p-2 shadow-xl shadow-emerald-950/5 backdrop-blur-xl duration-150">
                    {NAV.slice(navLimit).map((n) => (
                      <button
                        key={n.key}
                        onClick={() => navigate(n.key)}
                        aria-current={section === n.key && !entitySlug ? 'page' : undefined}
                        className={cn(
                          'rounded-2xl px-3 py-2 text-left text-[13px] font-semibold whitespace-nowrap transition-colors',
                          section === n.key && !entitySlug ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-secondary',
                        )}
                      >
                        {t(`nav.${n.key}` as CatalogKey)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div ref={fixedRef} className="ml-1 flex shrink-0 items-center gap-1">
              <LanguagePicker />
              <button
                onClick={() => navigate('contribute')}
                className={cn(
                  'inline-flex h-9 items-center whitespace-nowrap rounded-full px-3.5 text-[13px] font-bold transition-all duration-200',
                  section === 'contribute' && !entitySlug
                    ? 'bg-primary text-primary-foreground v4-glow'
                    : 'bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground v4-glow hover:scale-[1.04] hover:shadow-xl active:scale-95',
                )}
              >
                {t('nav.contribute')}
              </button>
            </div>
          </nav>

          {/* mobile menu button */}
          <button
            className="border-border bg-secondary/70 text-foreground hover:bg-secondary ml-auto inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200 active:scale-90 xl:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}
          >
            {menuOpen ? <X className="size-4.5" aria-hidden /> : <Menu className="size-4.5" aria-hidden />}
          </button>
        </div>

        {/* mobile nav — rounded glass card */}
        {menuOpen && (
          <nav className="mx-auto mt-2 max-w-6xl xl:hidden" aria-label="Mobile">
            <ul className="border-border/60 bg-card/95 animate-in fade-in-0 zoom-in-95 flex flex-col gap-0.5 rounded-3xl border p-3 shadow-xl shadow-emerald-950/5 backdrop-blur-xl duration-200">
              {[...NAV, { key: 'contribute' as const, label: 'Contribute' }].map((n) => (
                <li key={n.key}>
                  <button
                    onClick={() => navigate(n.key)}
                    aria-current={section === n.key && !entitySlug ? 'page' : undefined}
                    className={cn(
                      'w-full rounded-2xl px-3.5 py-2.5 text-left text-[14px] font-semibold transition-all duration-150 active:scale-[0.98]',
                      section === n.key && !entitySlug
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:bg-secondary active:bg-secondary',
                    )}
                  >
                    {t(`nav.${n.key}` as CatalogKey)}
                  </button>
                </li>
              ))}
              <li className="border-border/60 mt-1 border-t pt-2 pb-1">
                <LanguagePicker compact />
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* ---------------- main ---------------- */}
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {entitySlug ? (
          <EntityProfile slug={entitySlug} onBack={() => setEntitySlug(null)} onOpen={openEntity} />
        ) : (
          <>
            {section === 'home' && <HomeSection onOpenEntity={openEntity} onNavigate={navigate} />}
            {section === 'explore' && <ExploreSection onOpenEntity={openEntity} />}
            {section === 'library' && <LibrarySection onOpenEntity={openEntity} onNavigate={navigate} />}
            {section === 'archive' && <ArchiveSection onOpenEntity={openEntity} onNavigate={navigate} />}
            {section === 'research' && <ResearchSection onOpenEntity={openEntity} onNavigate={navigate} />}
            {section === 'academy' && <AcademySection onOpenEntity={openEntity} />}
            {section === 'media' && <MediaSection onOpenEntity={openEntity} onNavigate={navigate} />}
            {section === 'trust' && <TrustSection onOpenEntity={openEntity} />}
            {section === 'about' && <AboutSection onOpenEntity={openEntity} onNavigate={navigate} />}
            {section === 'documents' && <DocumentsSection onNavigate={navigate} />}
            {section === 'seo' && <SeoSection onNavigate={navigate} />}
            {section === 'contribute' && <ContributeSection />}
            {section === 'admin' && <AdminSection />}
          </>
        )}
      </main>

      {/* ---------------- footer (sticky bottom via mt-auto) — v.4 rounded crest ---------------- */}
      <footer className="bg-secondary/60 border-border/70 mt-14 overflow-hidden rounded-t-[2.5rem] border-t pb-[env(safe-area-inset-bottom)]">
        <div aria-hidden className="bg-gradient-to-r from-primary via-[var(--brass)] to-teal-600 h-1 w-full" />
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="bg-gradient-to-br from-primary via-emerald-500 to-[var(--brass)] flex size-9 items-center justify-center rounded-2xl font-display text-[13px] font-bold text-white">165</span>
                <p className="font-display text-lg font-semibold">165</p>
              </div>
              <p className="text-muted-foreground mt-2.5 text-[13px] leading-relaxed">
                {t('footer.desc')}
              </p>
              <p className="text-muted-foreground mt-3 inline-flex items-center gap-1.5 text-[12px]">
                <ShieldCheck className="size-3.5 text-[var(--brass)]" aria-hidden />
                {t('footer.everyStatement')}
              </p>
            </div>
            <nav aria-label="Footer — explore">
              <p className="label-caps text-[12px] text-muted-foreground">{t('footer.colExplore')}</p>
              <ul className="mt-2 space-y-1.5 text-[13px]">
                {['explore', 'library', 'archive', 'research'].map((k) => (
                  <li key={k}>
                    <button onClick={() => navigate(k)} className="text-muted-foreground hover:text-foreground transition-colors">{t(`nav.${k}` as CatalogKey)}</button>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Footer — institution">
              <p className="label-caps text-[12px] text-muted-foreground">{t('footer.colInstitution')}</p>
              <ul className="mt-2 space-y-1.5 text-[13px]">
                {[['about', 'nav.about'], ['trust', 'nav.trust'], ['documents', 'nav.documents'], ['academy', 'nav.academy'], ['media', 'nav.media'], ['seo', 'nav.seo']].map(([k, key]) => (
                  <li key={k}>
                    <button onClick={() => navigate(k)} className="text-muted-foreground hover:text-foreground transition-colors">{t(key as CatalogKey)}</button>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="label-caps text-[12px] text-muted-foreground">{t('footer.colParticipate')}</p>
              <ul className="mt-2 space-y-1.5 text-[13px]">
                <li><button onClick={() => navigate('contribute')} className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.contributeLink')}</button></li>
                <li><button onClick={() => navigate('contribute')} className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.correctionLink')}</button></li>
                <li>
                  <button
                    onClick={() => navigate('admin')}
                    className="text-muted-foreground inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    aria-label={t('footer.adminLink')}
                  >
                    <ShieldCheck className="size-3.5 text-[var(--brass)]" aria-hidden /> {t('footer.adminLink')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-border/70 mt-8 flex flex-col gap-1.5 border-t pt-5 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{t('footer.rightsPrefix')} <strong className="text-foreground font-medium">Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi</strong>, {t('footer.rightsRole')}.</p>
            <p className="font-mono">165.web.id</p>
          </div>
        </div>
      </footer>
      </div>
    </QueryProvider>
  )
}

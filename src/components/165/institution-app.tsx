'use client'

// 165 — Institution App Shell (single-route SPA per sandbox constraint)
// Header nav · section router · entity profile overlay · sticky footer
import { useCallback, useEffect, useState } from 'react'
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
  const { t } = useI18n()

  // muat bahasa tersimpan (setelah hydration — bebas mismatch)
  useEffect(() => {
    initLanguage()
  }, [])

  const navigate = useCallback((s: string) => {
    setSection(s as SectionKey)
    setEntitySlug(null)
    setMenuOpen(false)
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

      {/* ---------------- header ---------------- */}
      <header className="border-border/80 bg-background/95 supports-[backdrop-filter]:bg-background/85 sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          {/* wordmark */}
          <button type="button" onClick={() => navigate('home')} className="group flex items-center gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" aria-label="165 — home">
            <span className="border-[var(--brass)]/50 bg-secondary flex size-9 items-center justify-center rounded-sm border font-display text-[15px] font-bold tracking-tight">
              165
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="label-caps block text-[11px] leading-tight text-[var(--brass)]">{t('header.tagline')}</span>
              <span className="text-muted-foreground block text-[11px] leading-tight">{t('header.sub')}</span>
            </span>
          </button>

          {/* desktop nav */}
          <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => navigate(n.key)}
                aria-current={section === n.key && !entitySlug ? 'page' : undefined}
                className={cn(
                  'rounded-sm px-2.5 py-2 text-[13px] font-medium transition-colors',
                  section === n.key && !entitySlug ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t(`nav.${n.key}` as CatalogKey)}
              </button>
            ))}
            <LanguagePicker />
            <button
              onClick={() => navigate('contribute')}
              className={cn(
                'ml-1 inline-flex h-8 items-center rounded-sm px-3.5 text-[13px] font-medium transition-colors',
                section === 'contribute' && !entitySlug ? 'bg-primary text-primary-foreground' : 'bg-primary/90 text-primary-foreground hover:bg-primary',
              )}
            >
              {t('nav.contribute')}
            </button>
          </nav>

          {/* mobile menu button */}
          <button
            className="border-border ml-auto inline-flex size-10 items-center justify-center rounded-sm border lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}
          >
            {menuOpen ? <X className="size-4.5" aria-hidden /> : <Menu className="size-4.5" aria-hidden />}
          </button>
        </div>

        {/* mobile nav */}
        {menuOpen && (
          <nav className="border-border/70 border-t lg:hidden" aria-label="Mobile">
            <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
              {[...NAV, { key: 'contribute' as const, label: 'Contribute' }].map((n) => (
                <li key={n.key}>
                  <button
                    onClick={() => navigate(n.key)}
                    aria-current={section === n.key && !entitySlug ? 'page' : undefined}
                    className={cn(
                      'w-full rounded-sm px-2 py-2.5 text-left text-[14px] font-medium transition-colors',
                      section === n.key && !entitySlug ? 'text-primary' : 'text-foreground/80',
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
            {section === 'trust' && <TrustSection />}
            {section === 'about' && <AboutSection onOpenEntity={openEntity} onNavigate={navigate} />}
            {section === 'documents' && <DocumentsSection onNavigate={navigate} />}
            {section === 'seo' && <SeoSection onNavigate={navigate} />}
            {section === 'contribute' && <ContributeSection />}
            {section === 'admin' && <AdminSection />}
          </>
        )}
      </main>

      {/* ---------------- footer (sticky bottom via mt-auto) ---------------- */}
      <footer className="border-border/80 bg-secondary/50 border-t pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-display text-lg font-semibold">165</p>
              <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">
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

// 165 — Mesin i18n: bawaan Bahasa Indonesia, fallback berlapis, RTL, persistensi.
// Lapisan kamus: kamus bahasa aktif → Bahasa Indonesia (catalog) → kunci mentah.
// Kamus AI (src/data/i18n/{code}.json) dimuat dinamis saat bahasa dipilih.
import { useSyncExternalStore } from 'react'
import { CATALOG, type CatalogKey } from './catalog'
import { CURATED } from './dictionaries'
import { AI_DICT_LOADERS } from '@/data/i18n/registry'
import { DEFAULT_LANG, dirOf, getLanguage, isSupported, type LanguageDef } from './languages'

const STORAGE_KEY = '165-lang'

type Strings = Partial<Record<CatalogKey, string>>

let current: string = DEFAULT_LANG
/** strings bahasa aktif yang sudah siap (sinkron) */
let activeStrings: Strings = {}
/** versi store — naik setiap perubahan; dipakai sebagai snapshot agar React
 * selalu re-render saat kamus asinkron tiba (kode bahasa saja tidak cukup). */
let version = 0
const cache = new Map<string, Strings>()
const listeners = new Set<() => void>()

// seed awal: bahasa bawaan + kurasi yang tersedia
cache.set(DEFAULT_LANG, {})
for (const [code, dict] of Object.entries(CURATED)) cache.set(code, dict)

function emit() {
  version++
  for (const l of listeners) l()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): number {
  return version
}

/** SSR & hydration pertama SELALU versi bawaan → bebas hydration mismatch */
function getServerSnapshot(): number {
  return 0
}

function applyDocumentMeta(code: string) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = code
  document.documentElement.dir = dirOf(code)
}

async function loadDictionary(code: string): Promise<Strings> {
  if (cache.has(code)) return cache.get(code)!
  try {
    // loader statis yang digenerate (src/data/i18n/registry.ts) — Turbopack-safe
    const loader = AI_DICT_LOADERS[code]
    if (!loader) throw new Error('no dictionary for ' + code)
    const mod = (await loader()) as { default?: { strings?: Strings }; strings?: Strings }
    const raw = ((mod.default ?? mod) ?? {}) as { strings?: Strings } | Strings
    const strings = ('strings' in raw && raw.strings ? raw.strings : (raw as Strings)) as Strings
    cache.set(code, strings)
    return strings
  } catch {
    // kamus belum tersedia → antarmuka mengikuti Bahasa Indonesia (jujur)
    cache.set(code, {})
    return {}
  }
}

export function setLanguage(code: string) {
  if (!isSupported(code) || code === current) {
    applyDocumentMeta(code)
    return
  }
  current = code
  // sinkron dulu: bila kamus sudah ada (kurasi/bawaan/cache) langsung tampil
  activeStrings = cache.get(code) ?? {}
  emit()
  applyDocumentMeta(code)
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* noop */
  }
  // asinkron: muat kamus AI bila perlu, lalu tampilkan bila masih relevan
  void loadDictionary(code).then((strings) => {
    if (current !== code) return
    activeStrings = strings
    emit()
  })
}

/** dipanggil sekali dari app shell setelah hydration */
export function initLanguage() {
  applyDocumentMeta(current)
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isSupported(stored)) setLanguage(stored)
  } catch {
    /* noop */
  }
}

export function getActiveLanguage(): string {
  return current
}

export interface I18n {
  lang: string
  meta: LanguageDef | undefined
  dir: 'ltr' | 'rtl'
  t: (key: CatalogKey, vars?: Record<string, string | number>) => string
}

export function useI18n(): I18n {
  // snapshot = versi store: perubahan bahasa maupun kedatangan kamus asinkron
  // sama-sama memicu re-render deterministik di seluruh subscriber.
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return { lang: current, meta: getLanguage(current), dir: dirOf(current), t }
}

function fmt(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] !== undefined ? String(vars[k]) : m))
}

export function t(key: CatalogKey, vars?: Record<string, string | number>): string {
  const v = activeStrings[key]
  const base = (v !== undefined && v !== '' ? v : CATALOG[key][0]) as string
  return fmt(base, vars)
}

export const I18N_STORAGE_KEY = STORAGE_KEY

// GENERATED FILE — jangan sunting. Regenerate: bun scripts/gen-i18n.ts
// Loader statis per bahasa — dijamin ter-code-split per bahasa oleh bundler.
import type { CatalogKey } from '@/lib/i18n/catalog'

export type DictModule = { strings: Partial<Record<CatalogKey, string>> }

export const AI_DICT_LOADERS: Record<string, () => Promise<DictModule>> = {
  "de": () => import("./de.json"),
  "es": () => import("./es.json"),
  "fr": () => import("./fr.json"),
  "it": () => import("./it.json"),
  "ja": () => import("./ja.json"),
  "ko": () => import("./ko.json"),
  "pt": () => import("./pt.json"),
  "ru": () => import("./ru.json"),
  "uk": () => import("./uk.json"),
  "zh": () => import("./zh.json"),
}

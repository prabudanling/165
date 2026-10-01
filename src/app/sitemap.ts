import type { MetadataRoute } from 'next'

// 165 — sitemap (phase 0: only real, crawlable URLs are listed).
// Hreflang ?lang= alternates declare the international language surface —
// every listed language genuinely renders via the i18n engine (?lang= param).
const LANGS = ['en', 'ms', 'jv', 'su', 'ar', 'zh', 'ja', 'ko', 'hi', 'ur', 'fa', 'tr', 'ru', 'de', 'fr', 'es', 'pt', 'it', 'nl', 'sw'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://165.web.id'
  const languages: Record<string, string> = { id: `${base}/`, 'x-default': `${base}/` }
  for (const l of LANGS) languages[l] = `${base}/?lang=${l}`
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: { languages },
    },
  ]
}

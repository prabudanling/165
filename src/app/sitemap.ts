import type { MetadataRoute } from 'next'

// 165 — sitemap index (phase 0: only real, crawlable URLs are listed).
// In production this becomes a sitemap INDEX with one shard per page type
// (/sitemap-person.xml · 250, /sitemap-term.xml · 300, … see SEO section
// "Direktori URL" for the full 1.200-URL phase-1 map). A URL is only ever
// listed here once its entity page actually exists — no phantom URLs.

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://165.web.id'
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}

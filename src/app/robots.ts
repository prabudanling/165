import type { MetadataRoute } from 'next'

// 165 — robots policy: open to all knowledge pages, closed to internal search
// and preview surfaces (crawl budget goes to permanent knowledge, not queries).

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search'],
      },
    ],
    sitemap: 'https://165.web.id/sitemap.xml',
  }
}

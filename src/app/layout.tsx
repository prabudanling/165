import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 165 v.4 — Nunito: rounded, friendly, smooth UI face (self-hosted)
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const SITE = "https://165.web.id";

// hreflang sah: setiap bahasa punya URL ?lang= yang benar-benar
// merender bahasanya (mesin i18n membaca param pada initLanguage).
// 6 bahasa kurasi + bahasa utama dunia; x-default = Bahasa Indonesia.
const LANG_ALTERNATES: Record<string, string> = {
  id: "/",
  en: "/?lang=en",
  ms: "/?lang=ms",
  jv: "/?lang=jv",
  su: "/?lang=su",
  ar: "/?lang=ar",
  zh: "/?lang=zh",
  ja: "/?lang=ja",
  ko: "/?lang=ko",
  hi: "/?lang=hi",
  ur: "/?lang=ur",
  fa: "/?lang=fa",
  tr: "/?lang=tr",
  ru: "/?lang=ru",
  de: "/?lang=de",
  fr: "/?lang=fr",
  es: "/?lang=es",
  pt: "/?lang=pt",
  it: "/?lang=it",
  nl: "/?lang=nl",
  sw: "/?lang=sw",
  "x-default": "/",
};

export const metadata: Metadata = {
  title: {
    default: "165 — TQN Qodiriah Naqsabandiyah · Knowledge, Heritage & Digital Preservation",
    template: "%s · 165",
  },
  description:
    "165 is the global knowledge, heritage and digital preservation platform of TQN Qodiriah Naqsabandiyah — a data-first institution where every statement carries its evidence level, verification status and full provenance. Interface available in 178 languages, Indonesian by default. Founded by Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi.",
  keywords: [
    "165", "TQN", "Qodiriah Naqsabandiyah", "Qadiriyah Naqsyabandiyah", "tarekat",
    "digital preservation", "Islamic knowledge", "heritage archive", "sanad", "165.web.id",
    "thariqat", "murshid", "silsilah", "warisan digital",
  ],
  authors: [{ name: "165 — Founded by Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi" }],
  metadataBase: new URL(SITE),
  alternates: {
    canonical: "/",
    languages: LANG_ALTERNATES,
  },
  openGraph: {
    title: "165 — TQN Qodiriah Naqsabandiyah · Knowledge, Heritage & Digital Preservation",
    description:
      "An institutional knowledge infrastructure: archive, research base, global directory, knowledge graph and citation system. Every statement traceable to its evidence — in 178 languages.",
    url: SITE,
    siteName: "165",
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og-165.png",
        width: 1200,
        height: 630,
        alt: "165 — TQN Qodiriah Naqsabandiyah · Knowledge, Heritage & Digital Preservation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "165 — Knowledge, Heritage & Digital Preservation",
    description: "Every statement carries its evidence. Unknown is better than fabricated certainty.",
    images: ["/og-165.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "165",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  category: "education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f6ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1411" },
  ],
};

// sitewide structured data — read by Google, Bing & AI assistants without guessing
const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "165 — TQN Qodiriah Naqsabandiyah Knowledge Platform",
  alternateName: "165.web.id",
  url: SITE,
  logo: `${SITE}/icon-512.png`,
  slogan: "With sources, not claims — dengan sumber, bukan klaim.",
  description:
    "Global knowledge, heritage and digital preservation institution for TQN Qodiriah Naqsabandiyah — archive, research base, global directory, knowledge graph and citation system. Interface available in 178 languages (ISO 639), Indonesian by default.",
  founder: {
    "@type": "Person",
    name: "Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi",
    jobTitle: "Founder & Founding Steward of 165",
  },
  knowsLanguage: ["id", "en", "ar", "ms", "jv", "su"],
  availableLanguage: [
    { "@type": "Language", name: "Indonesian", alternateName: "Bahasa Indonesia" },
    { "@type": "Language", name: "English" },
    { "@type": "Language", name: "Arabic", alternateName: "العربية" },
    { "@type": "Language", name: "Malay", alternateName: "Bahasa Melayu" },
    { "@type": "Language", name: "Javanese", alternateName: "Basa Jawa" },
    { "@type": "Language", name: "Sundanese", alternateName: "Basa Sunda" },
  ],
};

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "165",
  alternateName: "165.web.id",
  url: SITE,
  inLanguage: ["id", "en", "ar", "ms", "jv", "su"],
  publisher: { "@type": "Organization", name: "165 — TQN Qodiriah Naqsabandiyah Knowledge Platform" },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Bahasa Indonesia adalah bawaan resmi 165 — SSR merender sebagai 'id';
    // mesin i18n klien menyetel ulang html[lang]/html[dir] saat bahasa diganti.
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_LD) }}
        />
        <Toaster />
      </body>
    </html>
  );
}

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

export const metadata: Metadata = {
  title: {
    default: "165 — TQN Qodiriah Naqsabandiyah · Knowledge, Heritage & Digital Preservation",
    template: "%s · 165",
  },
  description:
    "165 is the global knowledge, heritage and digital preservation platform of TQN Qodiriah Naqsabandiyah — a data-first institution where every statement carries its evidence level, verification status and full provenance. Founded by Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi.",
  keywords: [
    "165", "TQN", "Qodiriah Naqsabandiyah", "Qadiriyah Naqsyabandiyah", "tarekat",
    "digital preservation", "Islamic knowledge", "heritage archive", "sanad", "165.web.id",
  ],
  authors: [{ name: "165 — Founded by Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi" }],
  metadataBase: new URL("https://165.web.id"),
  alternates: {
    canonical: "/",
    languages: { id: "/", en: "/", ar: "/", "x-default": "/" },
  },
  openGraph: {
    title: "165 — TQN Qodiriah Naqsabandiyah · Knowledge, Heritage & Digital Preservation",
    description:
      "An institutional knowledge infrastructure: archive, research base, global directory, knowledge graph and citation system. Every statement traceable to its evidence.",
    url: "https://165.web.id",
    siteName: "165",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "165 — Knowledge, Heritage & Digital Preservation",
    description: "Every statement carries its evidence. Unknown is better than fabricated certainty.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f9f6ec",
};

// sitewide structured data — read by Google, Bing & AI assistants without guessing
const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "165 — TQN Qodiriah Naqsabandiyah Knowledge Platform",
  alternateName: "165.web.id",
  url: "https://165.web.id",
  description:
    "Global knowledge, heritage and digital preservation institution for TQN Qodiriah Naqsabandiyah — archive, research base, global directory, knowledge graph and citation system.",
  founder: {
    "@type": "Person",
    name: "Tuan Haji Gugun Gunara — Muhammad Lutfi Azmi",
    jobTitle: "Founder & Founding Steward of 165",
  },
  knowsLanguage: ["id", "en", "ar"],
};

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "165",
  url: "https://165.web.id",
  inLanguage: ["id", "en", "ar"],
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://165.web.id/?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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

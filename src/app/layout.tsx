import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  alternates: { canonical: "/" },
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
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

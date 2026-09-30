'use client'

// 165 — SEO & Page Architecture section: the plan that turns the knowledge base
// into 1.200+ search-engine-ready permanent pages (ONE SOURCE, MANY EXPERIENCES).
import {
  Award, Bot, Braces, CheckCircle2, Fingerprint, Gauge, Globe, History, Infinity as InfinityIcon,
  Languages, Network, Quote, Server, ShieldCheck, ListTree as SitemapIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { HonestNote, SectionHeading } from '../ui'
import { useI18n } from '@/lib/i18n'
import { TemplateGallery } from '../seo/seo-templates'
import { UrlDirectory } from '../seo/url-directory'
import { PAGE_MAP_TOTAL, RELEASE_PHASES, TEMPLATE_CATALOG } from '@/lib/seo-blueprint'

const PILLARS = [
  {
    icon: Braces,
    title: 'Data terstruktur (JSON-LD)',
    body: 'Setiap halaman mendeklarasikan jenisnya: Person, Book, DefinedTerm, Event, Place, FAQPage. Google, Bing, dan asisten AI tidak perlu menebak — mereka membaca struktur.',
  },
  {
    icon: Network,
    title: 'Mesh tautan internal',
    body: 'Guru↔murid, kitab↔penulis, peristiwa↔tempat: ribuan tautan bermakna menyebarkan otoritas antar halaman dan mempercepat pengindeksan seluruh domain.',
  },
  {
    icon: Award,
    title: 'E-E-A-T penuh',
    body: 'Byline penyusun, kredensial yang tervalidasi dewan, tanggal pembaruan, dan jejak editorial tampil pada setiap entri — bukti pengalaman dan keahlian yang bisa dibaca mesin.',
  },
  {
    icon: Fingerprint,
    title: 'URL stabil + Global ID',
    body: '165-PERSON-000001 tidak pernah berubah. Nama bisa dikoreksi, URL tetap. Alias lama menjadi redirect permanen — tidak ada tautan yang mati.',
  },
  {
    icon: Languages,
    title: 'Tiga bahasa, satu sumber',
    body: 'Indonesia · Inggris · Arab dengan hreflang yang benar: satu entitas mendapat tiga pintu masuk mesin pencari tanpa duplikasi konten.',
  },
  {
    icon: Server,
    title: 'HTML utuh sejak respons pertama',
    body: 'Di produksi, halaman entitas di-render di server — konten inti terbaca tanpa JavaScript. Perayap hemat, pengunjung cepat, peringkat sehat.',
  },
]

const FOUNDATIONS = [
  {
    icon: Fingerprint,
    title: 'URL & Global ID',
    body: 'URL mengikuti slug yang manusiawi; identitas permanen mengikuti Global ID.',
    code: 'https://165.web.id/person/abdul-qadir-al-jilani\nID: 165-PERSON-000001',
  },
  {
    icon: SitemapIcon,
    title: 'Sitemap ter-shard',
    body: 'Sitemap index dengan shard per tipe — mudah diaudit perayap per kategori.',
    code: '/sitemap.xml (index)\n├ /sitemap-person.xml · 250\n├ /sitemap-term.xml · 300\n└ …',
  },
  {
    icon: Bot,
    title: 'robots & crawl budget',
    body: 'Pencarian internal dan pratinjau diblokir; halaman pengetahuan publik dibuka penuh.',
    code: 'User-agent: *\nAllow: /person/ /glossary/ /library/\nDisallow: /search?*',
  },
  {
    icon: Gauge,
    title: 'Core Web Vitals',
    body: 'Target performa yang mengikat setiap template — kecepatan adalah bagian dari aksesibilitas.',
    code: 'LCP  < 2.0 s\nCLS  < 0.05\nINP  < 200 ms',
  },
  {
    icon: Globe,
    title: 'hreflang tiga bahasa',
    body: 'Setiap entitas memetakan tiga URL bahasa + x-default — tanpa duplikasi, tanpa kanibalisme kueri.',
    code: 'id-ID → /id/person/…\nen    → /person/…\nar    → /ar/person/…',
  },
  {
    icon: History,
    title: 'dateModified & versi',
    body: 'Setiap revisi memperbarui dateModified dan tetap tersimpan — mesin pencari melihat kegairahan yang sehat, arsip melihat semuanya.',
    code: 'v1 → v2 → v3 (tersimpan)\ndateModified: 2025-11-20',
  },
]

const EEAT = [
  {
    title: 'Experience',
    body: 'Kontributor dengan riwayat ijazah & sanad yang tervalidasi dewan — pengalaman nyata, bukan klaim.',
  },
  {
    title: 'Expertise',
    body: 'Review editorial per bidang: sejarah, naskah, tasawuf, arsip. Setiap bidang punya penjaganya.',
  },
  {
    title: 'Authoritativeness',
    body: 'Sitasi formal masuk dan keluar: 165 dapat dikutip lewat Global ID, bukan hanya mengutip orang lain.',
  },
  {
    title: 'Trust',
    body: 'Status verifikasi tampil publik · tanpa pay-to-verify · log koreksi terbuka · privasi tokoh hidup.',
  },
]

const ETERNITY = [
  {
    icon: History,
    title: 'Versioning',
    body: 'Setiap perubahan terekam: apa, siapa, kapan, mengapa. Sejarah halaman adalah bagian dari halaman.',
  },
  {
    icon: ShieldCheck,
    title: 'Tanpa penghapusan senyap',
    body: 'Konten yang ditarik tetap tercatat dan dapat dikutip lewat versi arsip — tidak ada lubang dalam catatan umat.',
  },
  {
    icon: Quote,
    title: 'Sitasi permanen',
    body: 'Global ID + tanggal akses = referensi ilmiah yang tidak pernah mati, layak untuk karya yang diwariskan.',
  },
  {
    icon: InfinityIcon,
    title: 'Preservasi 3-2-1',
    body: 'Tiga salinan, dua media, satu di lokasi terpisah. Halaman yang dicintai mesin pencari harus lebih dicintai arsipnya.',
  },
]

export function SeoSection({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const { t } = useI18n()
  return (
    <div>
      <SectionHeading
        kicker={t('sec.seo.kicker')}
        title={t('sec.seo.title')}
        lede={t('sec.seo.lede')}
      />

      {/* stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          [`${PAGE_MAP_TOTAL.toLocaleString('id-ID')}+`, 'halaman fase pertama'],
          ['10', 'template halaman master'],
          ['3', 'bahasa · id en ar hreflang'],
          ['12+', 'poin checklist + gerbang publikasi'],
        ].map(([n, label]) => (
          <div key={label} className="rounded-md border border-border bg-card p-4">
            <p className="font-display text-2xl font-semibold text-primary sm:text-3xl">{n}</p>
            <p className="text-muted-foreground mt-1 text-[12.5px] leading-snug">{label}</p>
          </div>
        ))}
      </div>

      {/* pillars */}
      <h2 className="font-display mt-12 text-xl font-semibold sm:text-2xl">Mengapa mesin pencari akan mencintai 165</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-md border border-border bg-card p-4">
            <p.icon className="text-[var(--brass)] size-5" aria-hidden />
            <h3 className="font-display mt-2.5 text-[15px] font-semibold">{p.title}</h3>
            <p className="text-muted-foreground mt-1.5 text-[13.5px] leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>

      {/* page map */}
      <h2 className="font-display mt-12 text-xl font-semibold sm:text-2xl">Peta halaman — fase pertama</h2>
      <p className="text-muted-foreground mt-2 max-w-3xl text-[14px] leading-relaxed">
        Sepuluh tipe halaman, satu mesin data: setiap entitas dirender ke template yang sama di semua bahasa dan semua pengalaman.
        Halaman dirilis bertahap mengikuti ketersediaan sumber terverifikasi.
      </p>
      <div className="mt-4 overflow-hidden rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipe halaman</TableHead>
              <TableHead className="hidden sm:table-cell">Jalur URL</TableHead>
              <TableHead className="hidden md:table-cell">Skema JSON-LD</TableHead>
              <TableHead className="text-right">Halaman</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TEMPLATE_CATALOG.map((t) => (
              <TableRow key={t.kind}>
                <TableCell className="font-medium">{t.label}</TableCell>
                <TableCell className="hidden font-mono text-[12.5px] sm:table-cell">{t.path}</TableCell>
                <TableCell className="hidden font-mono text-[12.5px] md:table-cell">{t.schema}</TableCell>
                <TableCell className="text-right font-mono">{t.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-display font-semibold" colSpan={3}>Total URL fase pertama</TableCell>
              <TableCell className="text-right font-mono font-semibold">{PAGE_MAP_TOTAL}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* release phases */}
      <div className="mt-3 flex flex-wrap gap-2">
        {RELEASE_PHASES.map((p) => (
          <span key={p.phase} className="border-border bg-secondary/60 inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[12px]">
            <span className="label-caps text-[var(--brass)]">{p.phase}</span>
            <span className="font-medium">{p.title}</span>
            <span className="text-muted-foreground">· {p.pages} hal · {p.detail}</span>
          </span>
        ))}
      </div>
      <HonestNote tone="amber" className="mt-3">
        Prinsip pengendali diri: <strong>jumlah halaman tidak pernah mengalahkan kebenaran halaman.</strong> Seribu halaman
        terverifikasi dibangun bertahap — bukan seribu halaman yang meminjam wibawa yang belum dimiliki sumbernya.
      </HonestNote>

      {/* template gallery */}
      <h2 className="font-display mt-12 text-xl font-semibold sm:text-2xl">Galeri template — pratinjau halaman produksi</h2>
      <p className="text-muted-foreground mt-2 max-w-3xl text-[14px] leading-relaxed">
        Setiap tipe halaman bisa dilihat sekarang: pratinjau halaman utuh, simulasi hasil pencarian, data terstruktur
        JSON-LD, dan checklist SEO — lengkap dengan gerbang publikasi yang menjaga kejujuran isi.
      </p>
      <div className="mt-5">
        <TemplateGallery />
      </div>

      {/* url directory */}
      <h2 className="font-display mt-12 text-xl font-semibold sm:text-2xl">Direktori URL — peta sitemap fase pertama</h2>
      <p className="text-muted-foreground mt-2 max-w-3xl text-[14px] leading-relaxed">
        Seluruh {PAGE_MAP_TOTAL.toLocaleString('id-ID')} URL fase pertama, siap di-shard menjadi sitemap per tipe. Cari,
        saring, dan jelajahi — setiap baris adalah halaman yang akan lahir.
      </p>
      <div className="mt-5">
        <UrlDirectory />
      </div>

      {/* technical foundations */}
      <h2 className="font-display mt-12 text-xl font-semibold sm:text-2xl">Fondasi teknis</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FOUNDATIONS.map((f) => (
          <div key={f.title} className="flex flex-col rounded-md border border-border bg-card p-4">
            <f.icon className="text-[var(--brass)] size-5" aria-hidden />
            <h3 className="font-display mt-2.5 text-[15px] font-semibold">{f.title}</h3>
            <p className="text-muted-foreground mt-1.5 flex-1 text-[13.5px] leading-relaxed">{f.body}</p>
            <pre className="nice-scroll mt-3 overflow-x-auto rounded-sm border border-border bg-secondary/50 p-2.5 font-mono text-[11.5px] leading-relaxed">
              {f.code}
            </pre>
          </div>
        ))}
      </div>

      {/* E-E-A-T */}
      <h2 className="font-display mt-12 text-xl font-semibold sm:text-2xl">E-E-A-T — sinyal kepercayaan yang tidak bisa dibeli</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {EEAT.map((c) => (
          <div key={c.title} className="rounded-md border border-border bg-card p-4">
            <p className="label-caps text-[13px] text-[var(--brass)]">{c.title}</p>
            <p className="text-muted-foreground mt-1.5 text-[13.5px] leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>

      {/* eternity strip */}
      <div className="bg-secondary/50 mt-12 rounded-md border border-border p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="text-primary size-5" aria-hidden />
          <h2 className="font-display text-lg font-semibold sm:text-xl">Dibangun untuk keabadian</h2>
        </div>
        <p className="text-muted-foreground mt-1.5 max-w-3xl text-[13.5px] leading-relaxed">
          Anda menyebutnya &ldquo;abadi&rdquo; — ini cara kami merekayasa kata itu. Keabadian bukan fitur, melainkan empat
          kebiasaan yang tidak pernah ditawar:
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ETERNITY.map((c) => (
            <div key={c.title} className="bg-card rounded-md border border-border p-4">
              <c.icon className="text-[var(--brass)] size-4.5" aria-hidden />
              <h3 className="font-display mt-2 text-[14px] font-semibold">{c.title}</h3>
              <p className="text-muted-foreground mt-1 text-[12.5px] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* live now + SPA note */}
      <HonestNote tone="green" className="mt-8">
        <strong>Sudah hidup hari ini:</strong> <span className="font-mono">/robots.txt</span> ·{' '}
        <span className="font-mono">/sitemap.xml</span> · JSON-LD <span className="font-mono">Organization</span> +{' '}
        <span className="font-mono">WebSite</span> di beranda · metadata OpenGraph lengkap. Catatan arsitektur: dalam
        pratinjau ini seluruh pengalaman berjalan sebagai satu aplikasi (satu rute, sesuai lingkungan pratinjau); di
        produksi, setiap entitas menjadi halaman server-rendered dengan URL sendiri mengikuti peta di atas — data dan
        template-nya sudah final sejak sekarang.
      </HonestNote>

      {/* CTA */}
      {onNavigate && (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-md border border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-[15px] font-semibold">Halaman pertama dimulai dari sumber pertama.</p>
            <p className="text-muted-foreground mt-1 text-[13.5px]">
              Kirim manuskrip, dokumen pendirian, atau catatan silsilah — halaman-halaman permanen akan lahir dari sana.
            </p>
          </div>
          <Button type="button" onClick={() => onNavigate('contribute')} className="shrink-0">
            Contribute — kirim sumber pertama
          </Button>
        </div>
      )}
    </div>
  )
}

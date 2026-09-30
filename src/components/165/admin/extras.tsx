'use client'

// ============================================================
// 165 — RUANG ADMIN · dasbor, moderasi kontribusi, terbitkan,
// dan panduan (database gratis & penggunaan gaya WordPress)
// ============================================================
import { useCallback, useEffect, useState } from 'react'
import {
  Layers, Link2, ScrollText, Inbox, CheckCircle2, XCircle, Database, Rocket, RefreshCw,
  ArrowRight, ShieldCheck, Lightbulb, ExternalLink, BookOpenCheck, KeyRound, Globe, Cloud, Server,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Kicker, EmptyState } from '../ui'
import { cn } from '@/lib/utils'
import type { SessionData } from './admin'
import { CONTRIBUTION_FLOW } from '@/lib/165'

// ============================================================
// DASBOR
// ============================================================
export function DashboardPanel({ session, onGoTo }: { session: SessionData; onGoTo: (t: 'dasbor' | 'registri' | 'kontribusi' | 'terbitkan' | 'panduan') => void }) {
  const cards = [
    { label: 'Catatan registri', value: session.stats.total, icon: Layers },
    { label: 'Relasi bertipe', value: session.stats.relations, icon: Link2 },
    { label: 'Rantai sanad', value: session.stats.sanadChains, icon: ScrollText, note: 'kosong secara desain' },
    { label: 'Kontribusi masuk', value: session.stats.contributions, icon: Inbox },
  ]
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="border-border/80">
            <CardContent className="p-4 sm:p-5">
              <c.icon className="size-4 text-[var(--brass)]" aria-hidden />
              <p className="font-display mt-2 text-2xl font-semibold sm:text-3xl">{c.value}</p>
              <p className="text-muted-foreground mt-0.5 text-[12px] leading-tight">
                {c.label}{c.note ? ` · ${c.note}` : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* status sistem — jujur */}
      <Card className={cn('border', session.dbAvailable ? 'border-emerald-700/30' : 'border-amber-700/30')}>
        <CardContent className="p-5">
          <Kicker>Status sistem</Kicker>
          <ul className="mt-3 space-y-2.5 text-[13.5px] leading-relaxed">
            <li className="flex items-start gap-2">
              {session.dbAvailable
                ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden />
                : <XCircle className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden />}
              <span>
                <strong>Database {session.dbAvailable ? 'hidup terhubung' : 'tidak terjangkau'}.</strong>{' '}
                {session.dbAvailable
                  ? 'Suntingan di tab Registri langsung tersimpan.'
                  : 'Di server ini (mis. Vercel tanpa database cloud) situs publik tetap tampil dari snapshot, tetapi suntingan tidak dapat disimpan. Jalankan lokal, atau hubungkan database gratis — lihat tab Panduan.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Globe className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden />
              <span><strong>Situs publik selalu tampil.</strong> Seluruh registri terkompilasi ke dalam paket situs (snapshot) — angka 0 di halaman depan sudah mustahil terjadi secara struktur.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* aksi cepat */}
      <div>
        <Kicker>Aksi cepat</Kicker>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { tab: 'registri' as const, title: 'Kelola registri', desc: 'Tambah, sunting, sembunyikan catatan pengetahuan.' },
            { tab: 'kontribusi' as const, title: 'Moderasi kontribusi', desc: 'Tinjau kiriman masyarakat dan majukan alur kerjanya.' },
            { tab: 'terbitkan' as const, title: 'Terbitkan snapshot', desc: 'Bekukan data terbaru agar situs daring memakainya.' },
            { tab: 'panduan' as const, title: 'Panduan (database gratis)', desc: 'Baca cara kerja & pilihan database gratis.' },
          ].map((a) => (
            <button
              key={a.tab}
              onClick={() => onGoTo(a.tab)}
              className="group rounded-md border border-border bg-card p-4 text-left transition-colors hover:border-[var(--brass)]/50"
            >
              <p className="flex items-center gap-1.5 text-[14px] font-semibold">
                {a.title}
                <ArrowRight className="size-3.5 text-[var(--brass)] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              </p>
              <p className="text-muted-foreground mt-1 text-[12.5px] leading-relaxed">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// KONTRIBUSI (moderasi)
// ============================================================
type ContributionRow = {
  id: string; reference: string; kind: string; title: string
  status: string; statusNote: string | null; reviewedBy: string | null
  submitterName: string; submitterContact: string | null
  payload: string; createdAt: string; updatedAt: string
}

const STATUS_OPTIONS_ID: Record<string, string> = {
  SUBMITTED: 'Masuk', SCREENING: 'Saringan awal', EDITORIAL_REVIEW: 'Tinjauan redaksi',
  SOURCE_REVIEW: 'Tinjauan sumber', VERIFICATION: 'Verifikasi', APPROVED: 'Disetujui',
  PUBLISHED: 'Diterbitkan', REJECTED: 'Ditolak', DISPUTED: 'Diperselisihkan',
}

function ContributionCard({ c, onSaved }: { c: ContributionRow; onSaved: () => void }) {
  const [status, setStatus] = useState(c.status)
  const [note, setNote] = useState(c.statusNote ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setBusy(true)
    setError(null)
    setSaved(false)
    try {
      const r = await fetch(`/api/admin/contributions/${c.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, statusNote: note }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) { setError(j.error ?? 'Gagal menyimpan status.'); return }
      setSaved(true)
      onSaved()
    } catch {
      setError('Tidak dapat menghubungi server.')
    } finally {
      setBusy(false)
    }
  }

  let payloadPretty = ''
  try { payloadPretty = JSON.stringify(JSON.parse(c.payload), null, 2) } catch { payloadPretty = c.payload }

  const stageIdx = CONTRIBUTION_FLOW.indexOf(c.status as (typeof CONTRIBUTION_FLOW)[number])

  return (
    <Card className="border-border/80">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-muted-foreground font-mono text-[11.5px]">{c.reference} · {c.kind}</p>
            <h3 className="font-display mt-0.5 text-[15px] font-semibold">{c.title}</h3>
            <p className="text-muted-foreground mt-0.5 text-[12.5px]">
              Dari <strong className="text-foreground font-medium">{c.submitterName}</strong>
              {c.submitterContact ? ` · ${c.submitterContact}` : ''}
              {' '}· {new Date(c.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0">
            {STATUS_OPTIONS_ID[c.status] ?? c.status}
            {stageIdx >= 0 ? ` (${stageIdx + 1}/${CONTRIBUTION_FLOW.length})` : ''}
          </Badge>
        </div>

        <details className="mt-3">
          <summary className="text-muted-foreground cursor-pointer text-[12.5px] hover:underline">Lihat isi kiriman</summary>
          <pre className="nice-scroll mt-2 max-h-44 overflow-auto rounded-sm border border-border bg-secondary/50 p-3 font-mono text-[11.5px] leading-relaxed">
            {payloadPretty}
          </pre>
        </details>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[200px_1fr_auto] sm:items-end">
          <div className="space-y-1">
            <Label className="text-[12px]">Status alur kerja</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger aria-label="Status kontribusi"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_OPTIONS_ID).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[12px]">Catatan (opsional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="mis. Menunggu salinan ijazah…" />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={save} disabled={busy || (status === c.status && note === (c.statusNote ?? ''))}>
              {busy ? 'Menyimpan…' : 'Simpan status'}
            </Button>
            {saved && <span className="inline-flex items-center gap-1 text-[12px] text-emerald-800"><CheckCircle2 className="size-3.5" aria-hidden />Tersimpan</span>}
          </div>
        </div>
        {error && <p role="alert" className="mt-2 text-[12.5px] text-rose-800">{error}</p>}
      </CardContent>
    </Card>
  )
}

export function ContributionsPanel({ dbAvailable }: { dbAvailable: boolean }) {
  const [rows, setRows] = useState<ContributionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch('/api/admin/contributions')
      const j = await r.json()
      if (!r.ok) throw new Error(j.error ?? 'Gagal memuat kontribusi.')
      setRows(j.contributions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat kontribusi.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(t)
  }, [load])

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-[13.5px] leading-relaxed">
        Kontribusi masyarakat <strong className="text-foreground">tidak pernah otomatis tayang</strong> — inilah pembeda
        dari WordPress biasa. Majukan statusnya hanya setelah sumber diperiksa.
      </p>

      {!dbAvailable && (
        <div className="rounded-md border border-amber-700/30 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
          Database tidak terjangkau — status tidak dapat disimpan dari server ini.
        </div>
      )}

      {loading ? (
        <div className="text-muted-foreground py-10 text-center text-sm">Memuat…</div>
      ) : error ? (
        <p role="alert" className="rounded-md border border-rose-700/30 bg-rose-50 px-4 py-3 text-[13px] text-rose-900">{error}</p>
      ) : rows.length === 0 ? (
        <EmptyState icon={Inbox} title="Belum ada kontribusi masuk">
          Ketika masyarakat mengirim pengetahuan melalui halaman Contribute, kiriman muncul di sini untuk ditinjau.
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {rows.map((c) => <ContributionCard key={c.id} c={c} onSaved={load} />)}
        </div>
      )}
    </div>
  )
}

// ============================================================
// TERBITKAN (snapshot)
// ============================================================
export function PublishPanel({ session, onRefreshSession }: { session: SessionData; onRefreshSession: () => Promise<void> }) {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const rebuild = async () => {
    setBusy(true)
    setResult(null)
    try {
      const r = await fetch('/api/admin/snapshot', { method: 'POST' })
      const j = await r.json().catch(() => ({}))
      if (r.ok) {
        setResult({ ok: true, message: `Snapshot berhasil dibangun: ${j.counts?.entities ?? '—'} entitas, ${j.counts?.relations ?? '—'} relasi, ${j.counts?.contributions ?? '—'} kontribusi.` })
        await onRefreshSession()
      } else {
        setResult({ ok: false, message: j.error ?? 'Gagal mengekspor snapshot.' })
      }
    } catch {
      setResult({ ok: false, message: 'Tidak dapat menghubungi server.' })
    } finally {
      setBusy(false)
    }
  }

  const exported = session.snapshot.exportedAt ? new Date(session.snapshot.exportedAt).toLocaleString('id-ID') : '—'

  return (
    <div className="space-y-4">
      <Card className="border-border/80">
        <CardContent className="p-5 sm:p-6">
          <Kicker>Kenapa perlu snapshot?</Kicker>
          <h2 className="font-display mt-1 text-xl font-semibold tracking-tight">Membekukan data terbaik ke dalam paket situs</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-[13.5px] leading-relaxed">
            Snapshot adalah salinan seluruh registri yang <strong className="text-foreground">terkompilasi bersama situs</strong>.
            Inilah sebabnya halaman depan Anda tidak pernah bisa menampilkan angka 0 lagi — bahkan di server gratis mana pun.
            Setelah selesai menyunting di tab Registri, bangun ulang snapshot di sini.
          </p>

          <ol className="mt-4 space-y-2.5 text-[13.5px]">
            {[
              'Sunting data di tab Registri (tersimpan ke database).',
              'Klik tombol di bawah — snapshot baru ditulis ke berkas proyek.',
              'Unggah proyek terbaru ke GitHub → Vercel otomatis menerbitkan versi terbaru.',
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="border-[var(--brass)]/50 bg-secondary text-[var(--brass)] font-display mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border text-[11px] font-bold">{i + 1}</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button onClick={rebuild} disabled={busy}>
              <Rocket className="size-4" aria-hidden /> {busy ? 'Membangun snapshot…' : 'Bangun ulang snapshot sekarang'}
            </Button>
            <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[12.5px]">
              <RefreshCw className="size-3.5" aria-hidden /> Snapshot aktif: {exported}
            </span>
          </div>

          {result && (
            <p
              role="status"
              className={cn(
                'mt-4 rounded-md border px-4 py-3 text-[13px] leading-relaxed',
                result.ok ? 'border-emerald-700/30 bg-emerald-50 text-emerald-900' : 'border-amber-700/30 bg-amber-50 text-amber-900',
              )}
            >
              {result.message}
              {result.ok && (
                <>
                  {' '}<strong>Langkah terakhir:</strong> unggah proyek ke GitHub agar versi daring memakai snapshot terbaru.
                </>
              )}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="rounded-md border border-border bg-secondary/40 px-4 py-3 text-[12.5px] leading-relaxed text-muted-foreground">
        <Lightbulb className="mr-1.5 inline size-3.5 text-[var(--brass)]" aria-hidden />
        Nanti, bila database cloud gratis sudah terhubung (lihat tab Panduan), setiap suntingan langsung tayang tanpa
        perlu membangun ulang snapshot — snapshot tetap berlaku sebagai jaring pengaman.
      </div>
    </div>
  )
}

// ============================================================
// PANDUAN (gaya WordPress & database gratis)
// ============================================================
export function GuidePanel({ dbAvailable }: { dbAvailable: boolean }) {
  return (
    <div className="space-y-5">
      {/* wordpress */}
      <Card className="border-border/80">
        <CardContent className="p-5 sm:p-6">
          <Kicker>Untuk pengguna WordPress</Kicker>
          <h2 className="font-display mt-1 text-xl font-semibold tracking-tight">Apakah ini seperti WordPress?</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-emerald-700/25 bg-emerald-50/60 p-4">
              <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-emerald-900">
                <CheckCircle2 className="size-4" aria-hidden /> Mirip dengan yang Anda biasa
              </p>
              <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-emerald-950">
                <li>• Halaman login privat — hanya Anda yang punya kata sandi.</li>
                <li>• Dasbor dengan ringkasan data & aksi cepat.</li>
                <li>• Klik entri → sunting di formulir → tombol Simpan.</li>
                <li>• Tombol &ldquo;Terbitkan&rdquo; agar perubahan tampil di situs.</li>
              </ul>
            </div>
            <div className="rounded-md border border-amber-700/25 bg-amber-50/60 p-4">
              <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-amber-900">
                <ShieldCheck className="size-4" aria-hidden /> Beda (dan lebih aman) dari WordPress
              </p>
              <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-amber-950">
                <li>• Setiap catatan membawa <em>tingkat bukti A–F</em> & status verifikasi.</li>
                <li>• Tidak ada plugin — tidak ada celah keamanan tambahan.</li>
                <li>• Versi lama selalu tersimpan; tidak ada penghapusan senyap.</li>
                <li>• Kontribusi publik masuk sebagai <em>draf</em>, bukan langsung tayang.</li>
              </ul>
            </div>
          </div>
          {!dbAvailable && (
            <p className="text-muted-foreground mt-4 text-[12.5px] leading-relaxed">
              <Database className="mr-1 inline size-3.5" aria-hidden />
              Saat ini server yang Anda pakai tidak menyediakan database hidup, jadi tombol Simpan hanya bekerja saat
              situs dijalankan dari komputer lokal. Solusinya di bawah — gratis.
            </p>
          )}
        </CardContent>
      </Card>

      {/* database gratis */}
      <Card className="border-border/80">
        <CardContent className="p-5 sm:p-6">
          <Kicker>Pertanyaan Anda: &ldquo;ada nggak database gratis?&rdquo;</Kicker>
          <h2 className="font-display mt-1 text-xl font-semibold tracking-tight">Ada — dan inilah pilihan terbaik</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-[13.5px] leading-relaxed">
            Bayangkan: situs yang di Vercel itu seperti <em>cabang perpustakaan</em>. Snapshot = rak buku yang selalu
            dikirim utuh ke cabang (sebab itu selalu tampil). Database cloud = <em>gudang pusat</em> yang bisa Anda tulisi
            dari mana saja, kapan saja.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {/* Turso */}
            <div className="rounded-md border-2 border-[var(--brass)]/50 bg-[var(--brass-soft)]/30 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[14px] font-semibold"><Cloud className="size-4 text-[var(--brass)]" aria-hidden /> Turso</p>
                <Badge className="bg-[var(--brass)] text-white hover:bg-[var(--brass)]/90">Rekomendasi</Badge>
              </div>
              <p className="text-muted-foreground mt-1.5 text-[12.5px] leading-relaxed">
                &ldquo;Saudara kandung&rdquo; database yang situs ini pakai (SQLite). Skema tidak perlu diubah apa pun.
              </p>
              <ul className="mt-2 space-y-1 text-[12.5px] leading-relaxed">
                <li>• Gratis: 9 GB penyimpanan, 500 database</li>
                <li>• Baca 1 miliar baris/bulan — jauh melebihi kebutuhan</li>
                <li>• Setelah terhubung: sunting dari HP pun langsung tayang</li>
              </ul>
              <ol className="mt-3 space-y-1.5 border-t border-[var(--brass)]/30 pt-3 text-[12.5px] leading-relaxed">
                <li><strong>1.</strong> Buka <span className="font-mono">app.turso.io</span> → daftar gratis (bisa akun GitHub).</li>
                <li><strong>2.</strong> Create Database → nama <span className="font-mono">db165</span> → pilih lokasi terdekat (Singapore).</li>
                <li><strong>3.</strong> Buka database itu → salin <em>Database URL</em> & buat <em>Token</em>.</li>
                <li><strong>4.</strong> Kirim dua teks itu kepada saya (asisten) — sisanya saya yang urus sampai tuntas.</li>
              </ol>
            </div>

            {/* Neon */}
            <div className="rounded-md border border-border bg-card p-4">
              <p className="flex items-center gap-1.5 text-[14px] font-semibold"><Server className="size-4 text-muted-foreground" aria-hidden /> Neon (Postgres)</p>
              <p className="text-muted-foreground mt-1.5 text-[12.5px] leading-relaxed">
                Paling mudah dipasangkan dengan Vercel: satu klik dari dasbor Vercel (tab <em>Storage</em>).
              </p>
              <ul className="mt-2 space-y-1 text-[12.5px] leading-relaxed">
                <li>• Gratis 0,5 GB — cukup untuk registri ini bertahun-tahun</li>
                <li>• Tapi: skema perlu dikonversi ke Postgres (saya yang kerjakan)</li>
                <li>• Cocok bila kelak ingin fitur database yang lebih besar</li>
              </ul>
            </div>

            {/* Supabase */}
            <div className="rounded-md border border-border bg-card p-4">
              <p className="flex items-center gap-1.5 text-[14px] font-semibold"><Server className="size-4 text-muted-foreground" aria-hidden /> Supabase (Postgres)</p>
              <p className="text-muted-foreground mt-1.5 text-[12.5px] leading-relaxed">
                Dashboard paling lengkap (tabel bisa dilihat seperti Excel), juga Postgres.
              </p>
              <ul className="mt-2 space-y-1 text-[12.5px] leading-relaxed">
                <li>• Gratis 0,5 GB, proyek &ldquo;tidur&rdquo; setelah 1 minggu tanpa akses</li>
                <li>• Konversi skema serupa Neon</li>
                <li>• Pilih ini bila ingin melihat data langsung di dashboard mereka</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-border bg-secondary/40 px-4 py-3 text-[13px] leading-relaxed">
            <strong>Saran saya yang jujur:</strong> pilih <strong>Turso</strong> — paling pas, paling gratis, dan tanpa
            konversi apa pun. Ikuti 4 langkah di kartu Turso di atas, kirimkan dua kuncinya, dan saya hubungkan
            sampai Anda bisa menyunting langsung dari situs yang tayang. Tidak tergesa: tanpa database cloud pun,
            situs publik tetap tampil sempurna lewat snapshot.
          </div>
        </CardContent>
      </Card>

      {/* keamanan */}
      <Card className="border-border/80">
        <CardContent className="p-5 sm:p-6">
          <Kicker>Keamanan</Kicker>
          <h2 className="font-display mt-1 text-xl font-semibold tracking-tight">Ganti kata sandi admin</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-[13.5px] leading-relaxed">
            Kata sandi Ruang Admin diatur lewat <em>environment variable</em>. Untuk pengembangan lokal, kata sandi
            bawaannya <span className="font-mono text-[12.5px]">qodiriyah165</span>.
            Begitu situs daring, segera ganti:
          </p>
          <ol className="mt-3 space-y-1.5 text-[13px] leading-relaxed">
            <li><strong>1.</strong> Buka proyek di Vercel → <em>Settings → Environment Variables</em>.</li>
            <li><strong>2.</strong> Tambah variabel bernama <span className="font-mono">ADMIN_PASSWORD</span> berisi kata sandi rahasia Anda.</li>
            <li><strong>3.</strong> (Opsional, lebih aman) tambah juga <span className="font-mono">ADMIN_SECRET</span> — kalimat acak panjang.</li>
            <li><strong>4.</strong> Deploy ulang. Selesai — hanya Anda yang tahu kata sandi itu.</li>
          </ol>
          <p className="text-muted-foreground mt-3 text-[12.5px] leading-relaxed">
            <KeyRound className="mr-1 inline size-3.5" aria-hidden />
            Percobaan login salah dibatasi 5 kali, lalu dikunci 10 menit.
          </p>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground mt-3 inline-flex items-center gap-1 text-[12.5px] underline decoration-dotted underline-offset-4 hover:text-foreground"
          >
            Buka dasbor Vercel <ExternalLink className="size-3" aria-hidden />
          </a>
        </CardContent>
      </Card>

      {/* workflow recap */}
      <Card className="border-border/80">
        <CardContent className="p-5 sm:p-6">
          <Kicker>Rangkuman ritme kerja</Kicker>
          <h2 className="font-display mt-1 flex items-center gap-2 text-xl font-semibold tracking-tight">
            <BookOpenCheck className="size-5 text-[var(--brass)]" aria-hidden /> Empat langkah, seperti kebiasaan Anda di WordPress
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: 1, t: 'Masuk', d: 'Footer situs → Ruang Admin → kata sandi.' },
              { n: 2, t: 'Sunting', d: 'Tab Registri → pilih entri → ubah → Simpan.' },
              { n: 3, t: 'Terbitkan', d: 'Tab Terbitkan → bangun ulang snapshot. (Nanti otomatis bila Turso terhubung.)' },
              { n: 4, t: 'Sampai ke publik', d: 'Unggah ke GitHub seperti kebiasaan Anda — situs langsung versi baru.' },
            ].map((s) => (
              <div key={s.n} className="rounded-md border border-border bg-card p-4">
                <span className="border-[var(--brass)]/50 bg-secondary text-[var(--brass)] font-display inline-flex size-6 items-center justify-center rounded-sm border text-[12px] font-bold">{s.n}</span>
                <p className="mt-2 text-[13.5px] font-semibold">{s.t}</p>
                <p className="text-muted-foreground mt-0.5 text-[12.5px] leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

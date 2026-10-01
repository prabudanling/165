'use client'

// ============================================================
// 165 — RUANG ADMIN · REGISTRI (kelola entitas)
// Tabel seluruh entitas (termasuk yang disembunyikan), pencarian,
// buat baru, sunting, dan hapus terjaga (guarded).
// ============================================================
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, RefreshCw, Trash2, EyeOff, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ENTITY_TYPES, EVIDENCE_LEVELS, VERIFICATION_STATUSES, type EntitySummaryDTO } from '@/lib/165'
import { EvidenceBadge, StatusBadge, TypeBadge, EmptyState, Kicker } from '../ui'

type AdminEntityRow = EntitySummaryDTO & {
  visibility: string
  updatedAt: string
  relations: number
  names: number
  versions: number
}

type FullEntity = {
  id: string; globalId: string; slug: string; type: string; primaryName: string
  subtitle: string | null; summary: string | null; summaryId: string | null; summaryAr: string | null
  evidenceLevel: string; verificationStatus: string; visibility: string
  startDate: string | null; startDatePrecision: string | null
  endDate: string | null; endDatePrecision: string | null
  region: string | null; detailsJson: string
  relations: number; versions: number
  deps: { relations: number; claims: number; sanadLinks: number; collections: number }
}

const TYPE_OPTIONS = Object.entries(ENTITY_TYPES).map(([key, v]) => ({ key, label: v.labelId }))
const EVIDENCE_OPTIONS = Object.entries(EVIDENCE_LEVELS).map(([key, v]) => ({ key, label: v.label }))
const STATUS_OPTIONS = Object.entries(VERIFICATION_STATUSES).map(([key, v]) => ({ key, label: v.label }))
const PRECISION_OPTIONS = ['DAY', 'MONTH', 'YEAR', 'DECADE', 'CENTURY', 'UNKNOWN'].map((p) => ({ key: p, label: p === 'DAY' ? 'Hari' : p === 'MONTH' ? 'Bulan' : p === 'YEAR' ? 'Tahun' : p === 'DECADE' ? 'Dekade' : p === 'CENTURY' ? 'Abad' : 'Tidak diketahui' }))
const VISIBILITY_OPTIONS = [
  { key: 'PUBLIC', label: 'Publik (tampil di situs)' },
  { key: 'RESTRICTED', label: 'Terbatas' },
  { key: 'PRIVATE', label: 'Privat (disembunyikan)' },
]

type FormState = {
  type: string
  primaryName: string
  subtitle: string
  summary: string
  summaryId: string
  summaryAr: string
  evidenceLevel: string
  verificationStatus: string
  visibility: string
  startDate: string
  startDatePrecision: string
  endDate: string
  endDatePrecision: string
  region: string
  detailsJson: string
}

const EMPTY_FORM: FormState = {
  type: 'TERM', primaryName: '', subtitle: '', summary: '', summaryId: '', summaryAr: '',
  evidenceLevel: 'F', verificationStatus: 'UNVERIFIED', visibility: 'PUBLIC',
  startDate: '', startDatePrecision: 'YEAR', endDate: '', endDatePrecision: 'YEAR',
  region: '', detailsJson: '',
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12.5px]">{label}</Label>
      {children}
      {hint && <p className="text-muted-foreground text-[11.5px] leading-snug">{hint}</p>}
    </div>
  )
}

function prettyJson(v: string): string {
  if (!v.trim()) return ''
  try { return JSON.stringify(JSON.parse(v), null, 2) } catch { return v }
}

// ---------------- editor dialog (create + edit) ----------------
function EntityDialog({ mode, id, open, onOpenChange, onSaved }: {
  mode: 'create' | 'edit'
  id?: string
  open: boolean
  onOpenChange: (v: boolean) => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [meta, setMeta] = useState<{ globalId: string; slug: string; deps: FullEntity['deps'] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  const set = (k: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    if (!open) { setError(null); setConfirmDelete(false); setMeta(null); return }
    if (mode === 'create') { setForm(EMPTY_FORM); return }
    let alive = true
    setLoading(true)
    void (async () => {
      try {
        const r = await fetch(`/api/admin/entities/${id}`)
        const j = await r.json()
        if (!alive) return
        if (!r.ok) throw new Error(j.error ?? 'Gagal memuat.')
        const e = j.entity as FullEntity
        setForm({
          type: e.type, primaryName: e.primaryName, subtitle: e.subtitle ?? '',
          summary: e.summary ?? '', summaryId: e.summaryId ?? '', summaryAr: e.summaryAr ?? '',
          evidenceLevel: e.evidenceLevel, verificationStatus: e.verificationStatus, visibility: e.visibility,
          startDate: e.startDate ?? '', startDatePrecision: e.startDatePrecision ?? 'YEAR',
          endDate: e.endDate ?? '', endDatePrecision: e.endDatePrecision ?? 'YEAR',
          region: e.region ?? '', detailsJson: prettyJson(e.detailsJson ?? ''),
        })
        setMeta({ globalId: e.globalId, slug: e.slug, deps: e.deps })
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : 'Gagal memuat.')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [open, mode, id])

  const save = async () => {
    if (form.detailsJson.trim()) {
      try { JSON.parse(form.detailsJson) } catch {
        setDetailsError('JSON tidak sah — periksa tanda kurung/kutip.')
        return
      }
    }
    setDetailsError(null)
    setBusy(true)
    setError(null)
    try {
      const payload = {
        ...form,
        detailsJson: form.detailsJson.trim() || null,
        subtitle: form.subtitle || null, summary: form.summary || null,
        summaryId: form.summaryId || null, summaryAr: form.summaryAr || null,
        startDate: form.startDate || null, endDate: form.endDate || null, region: form.region || null,
      }
      const r = mode === 'create'
        ? await fetch('/api/admin/entities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch(`/api/admin/entities/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        setError(j.error ?? 'Gagal menyimpan.')
        return
      }
      onSaved()
      onOpenChange(false)
    } catch {
      setError('Tidak dapat menghubungi server.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!id) return
    setBusy(true)
    setError(null)
    try {
      const r = await fetch(`/api/admin/entities/${id}`, { method: 'DELETE' })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        setError(j.error ?? 'Gagal menghapus.')
        setConfirmDelete(false)
        return
      }
      onSaved()
      onOpenChange(false)
    } catch {
      setError('Tidak dapat menghubungi server.')
    } finally {
      setBusy(false)
    }
  }

  const deps = meta?.deps
  const hasRefs = !!deps && (deps.relations + deps.claims + deps.sanadLinks + deps.collections > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-2xl flex-col overflow-hidden sm:w-full">
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === 'create' ? 'Tambah entitas baru' : 'Sunting entitas'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' && meta ? (
              <span className="font-mono text-[12px]">{meta.globalId} · /{meta.slug}</span>
            ) : (
              'Global ID dan URL akan dibuat otomatis dari nama utama.'
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-muted-foreground py-10 text-center text-sm">Memuat…</div>
        ) : (
          <div className="nice-scroll -mx-1 grid max-h-[52vh] grid-cols-1 gap-4 overflow-y-auto px-1 py-1 sm:grid-cols-2">
            <Field label="Tipe entitas">
              <Select value={form.type} onValueChange={set('type')}>
                <SelectTrigger aria-label="Tipe entitas"><SelectValue /></SelectTrigger>
                <SelectContent>{TYPE_OPTIONS.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Nama utama *">
              <Input value={form.primaryName} onChange={(e) => set('primaryName')(e.target.value)} placeholder="mis. Kitab Al-Hikam" />
            </Field>
            <Field label="Subjudul (gelar / peran)">
              <Input value={form.subtitle} onChange={(e) => set('subtitle')(e.target.value)} placeholder="mis. Mujaddid abad ke-…" />
            </Field>
            <Field label="Wilayah / kawasan">
              <Input value={form.region} onChange={(e) => set('region')(e.target.value)} placeholder="mis. Southeast Asia" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Ringkasan (Inggris)" hint="Ditampilkan pada profil publik.">
                <Textarea rows={3} value={form.summary} onChange={(e) => set('summary')(e.target.value)} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Ringkasan (Indonesia)">
                <Textarea rows={3} value={form.summaryId} onChange={(e) => set('summaryId')(e.target.value)} />
              </Field>
            </div>
            <Field label="Tingkat bukti" hint="A = sumber primer · F = belum terverifikasi">
              <Select value={form.evidenceLevel} onValueChange={set('evidenceLevel')}>
                <SelectTrigger aria-label="Tingkat bukti"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EVIDENCE_OPTIONS.map((t) => <SelectItem key={t.key} value={t.key}>{t.key} — {t.label.split('— ')[1]}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status verifikasi">
              <Select value={form.verificationStatus} onValueChange={set('verificationStatus')}>
                <SelectTrigger aria-label="Status verifikasi"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Visibilitas" hint="Sembunyikan dari publik tanpa menghapus pengetahuan.">
              <Select value={form.visibility} onValueChange={set('visibility')}>
                <SelectTrigger aria-label="Visibilitas"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tanggal mulai">
                <Input value={form.startDate} onChange={(e) => set('startDate')(e.target.value)} placeholder="mis. 1905" />
              </Field>
              <Field label="Presisi">
                <Select value={form.startDatePrecision} onValueChange={set('startDatePrecision')}>
                  <SelectTrigger aria-label="Presisi tanggal mulai"><SelectValue /></SelectTrigger>
                  <SelectContent>{PRECISION_OPTIONS.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tanggal selesai">
                <Input value={form.endDate} onChange={(e) => set('endDate')(e.target.value)} />
              </Field>
              <Field label="Presisi">
                <Select value={form.endDatePrecision} onValueChange={set('endDatePrecision')}>
                  <SelectTrigger aria-label="Presisi tanggal selesai"><SelectValue /></SelectTrigger>
                  <SelectContent>{PRECISION_OPTIONS.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Details (JSON lanjutan)" hint="Kolom khusus per tipe. Kosongkan bila tidak yakin — biarkan AI/arsitek yang mengelola.">
                <Textarea
                  rows={4}
                  value={form.detailsJson}
                  onChange={(e) => { set('detailsJson')(e.target.value); setDetailsError(null) }}
                  className="font-mono text-[12px]"
                  spellCheck={false}
                />
              </Field>
              {detailsError && <p role="alert" className="text-[12px] text-rose-800">{detailsError}</p>}
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-sm border border-rose-700/30 bg-rose-50 px-3 py-2 text-[13px] leading-relaxed text-rose-900">
            <AlertTriangle className="mr-1.5 inline size-3.5" aria-hidden />{error}
          </div>
        )}

        <DialogFooter className="mt-1 items-center gap-2 sm:justify-between">
          {mode === 'edit' ? (
            hasRefs ? (
              <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[12px]">
                <EyeOff className="size-3.5" aria-hidden />
                Masih dirujuk ({deps?.relations} relasi) — gunakan visibilitas untuk menyembunyikan.
              </span>
            ) : confirmDelete ? (
              <Button variant="destructive" size="sm" onClick={remove} disabled={busy}>
                <Trash2 className="size-3.5" aria-hidden /> Klik lagi: hapus permanen
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)} disabled={busy} className="text-rose-900 hover:bg-rose-50">
                <Trash2 className="size-3.5" aria-hidden /> Hapus…
              </Button>
            )
          ) : <span />}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={busy}>Batal</Button>
            <Button size="sm" onClick={save} disabled={busy || loading || !form.primaryName.trim()}>
              {busy ? 'Menyimpan…' : 'Simpan'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------- list panel ----------------
export function RegistryPanel({ dbAvailable }: { dbAvailable: boolean }) {
  const [rows, setRows] = useState<AdminEntityRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [type, setType] = useState<string>('ALL')
  const [editingId, setEditingId] = useState<string | undefined>(undefined)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [dialogOpen, setDialogOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (q.trim()) params.set('q', q.trim())
      if (type !== 'ALL') params.set('type', type)
      const r = await fetch(`/api/admin/entities?${params.toString()}`)
      const j = await r.json()
      if (!r.ok) throw new Error(j.error ?? 'Gagal memuat registri.')
      setRows(j.entities)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat registri.')
    } finally {
      setLoading(false)
    }
  }, [q, type])

  useEffect(() => {
    const t = window.setTimeout(() => { void load() }, 250)
    return () => window.clearTimeout(t)
  }, [load])

  const openEdit = (id: string) => {
    setDialogMode('edit')
    setEditingId(id)
    setDialogOpen(true)
  }

  const total = useMemo(() => rows.length, [rows])

  return (
    <div className="space-y-4">
      {!dbAvailable && (
        <div className="rounded-md border border-amber-700/30 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
          <strong>Jujur di depan:</strong> database tidak terjangkau di server ini, jadi penyimpanan tidak akan berhasil.
          Situs publik tetap tampil dari snapshot — untuk mengedit, jalankan situs secara lokal atau hubungkan database cloud
          (lihat tab <strong>Panduan</strong>).
        </div>
      )}

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" aria-hidden />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama, Global ID, atau URL…"
            className="pl-8"
            aria-label="Cari entitas"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[170px]" aria-label="Filter tipe">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua tipe</SelectItem>
            {TYPE_OPTIONS.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => { void load() }} aria-label="Muat ulang" title="Muat ulang">
          <RefreshCw className="size-4" aria-hidden />
        </Button>
        <Button onClick={() => { setDialogMode('create'); setEditingId(undefined); setDialogOpen(true) }} className="shrink-0">
          <Plus className="size-4" aria-hidden /> Tambah entitas
        </Button>
      </div>

      {/* table */}
      <div className="rounded-md border border-border bg-card">
        <div className="nice-scroll max-h-[520px] overflow-y-auto">
          <Table>
            <TableHeader className="bg-card sticky top-0 z-10 shadow-[0_1px_0_hsl(var(--border))]">
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead className="hidden sm:table-cell">Bukti</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Visibilitas</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Relasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && rows.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-muted-foreground py-10 text-center text-sm">Memuat registri…</TableCell></TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <EmptyState icon={Search} title="Tidak ada entitas yang cocok" className="border-0 bg-transparent">
                      Coba kata kunci lain, atau tambah entitas baru.
                    </EmptyState>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((e) => (
                  <TableRow key={e.id} className="cursor-pointer" onClick={() => openEdit(e.id)}>
                    <TableCell className="max-w-[240px] py-2.5">
                      <p className="truncate text-[13.5px] font-medium">{e.primaryName}</p>
                      <p className="text-muted-foreground truncate font-mono text-[11px]">{e.globalId}</p>
                    </TableCell>
                    <TableCell className="py-2.5"><TypeBadge type={e.type} /></TableCell>
                    <TableCell className="hidden py-2.5 sm:table-cell"><EvidenceBadge level={e.evidenceLevel} /></TableCell>
                    <TableCell className="hidden py-2.5 md:table-cell"><StatusBadge status={e.verificationStatus} withLabel={false} /></TableCell>
                    <TableCell className="hidden py-2.5 lg:table-cell">
                      {e.visibility === 'PUBLIC'
                        ? <span className="text-[12px] text-emerald-800">Publik</span>
                        : <span className="inline-flex items-center gap-1 text-[12px] text-amber-800"><EyeOff className="size-3" aria-hidden />{e.visibility === 'PRIVATE' ? 'Privat' : 'Terbatas'}</span>}
                    </TableCell>
                    <TableCell className="hidden py-2.5 text-right font-mono text-[12px] sm:table-cell">{e.relations}</TableCell>
                    <TableCell className="py-2.5 text-right">
                      <Button
                        variant="outline" size="sm"
                        onClick={(ev) => { ev.stopPropagation(); openEdit(e.id) }}
                        aria-label={`Sunting ${e.primaryName}`}
                      >
                        <Pencil className="size-3.5" aria-hidden /> <span className="hidden sm:inline">Sunting</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="text-muted-foreground border-t border-border px-4 py-2.5 text-[12px]">
          {total} entitas · setiap penyimpanan membuat versi baru (versi lama tetap tersimpan)
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-rose-700/30 bg-rose-50 px-4 py-3 text-[13px] leading-relaxed text-rose-900">
          {error}
        </p>
      )}

      <EntityDialog
        mode={dialogMode}
        id={editingId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={load}
      />
    </div>
  )
}

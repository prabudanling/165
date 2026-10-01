'use client'

// ============================================================
// 165 — RUANG ADMIN (shell)
// Panel pengelolaan bergaya WordPress: login → dasbor → kelola
// registri → moderasi kontribusi → terbitkan snapshot → panduan.
// Seluruh antarmuka dalam Bahasa Indonesia untuk pendiri.
// ============================================================
import { useCallback, useEffect, useState } from 'react'
import {
  KeyRound, LogOut, LayoutDashboard, LibraryBig, Inbox, Rocket, BookOpenCheck,
  ShieldCheck, Database, RefreshCw, Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SkeletonCard, Kicker } from '../ui'
import { cn } from '@/lib/utils'
import { RegistryPanel } from './registry'
import { ContributionsPanel, PublishPanel, GuidePanel, DashboardPanel } from './extras'

export type AdminStats = {
  total: number; byType: Record<string, number>
  relations: number; sanadChains: number; contributions: number
}
export type SessionData = {
  authenticated: boolean
  dbAvailable: boolean
  stats: AdminStats
  snapshot: { exportedAt: string; counts: { entities: number; relations: number; sanadChains: number; contributions: number } }
}

const TABS = [
  { key: 'dasbor', label: 'Dasbor', icon: LayoutDashboard },
  { key: 'registri', label: 'Registri', icon: LibraryBig },
  { key: 'kontribusi', label: 'Kontribusi', icon: Inbox },
  { key: 'terbitkan', label: 'Terbitkan', icon: Rocket },
  { key: 'panduan', label: 'Panduan', icon: BookOpenCheck },
] as const
type TabKey = (typeof TABS)[number]['key']

// ---------------- login ----------------
function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        setError(j.error ?? 'Login gagal.')
      } else {
        setPassword('')
        onSuccess()
      }
    } catch {
      setError('Tidak dapat menghubungi server.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md py-6 sm:py-10">
      <Card className="border-border/80">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center">
            <div className="border-[var(--brass)]/50 bg-secondary mx-auto flex size-14 items-center justify-center rounded-sm border">
              <Lock className="size-5 text-[var(--brass)]" aria-hidden />
            </div>
            <Kicker className="mt-4 justify-center">Ruang privat pendiri</Kicker>
            <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight">Ruang Admin 165</h1>
            <p className="text-muted-foreground mt-2 text-[13px] leading-relaxed">
              Masuk untuk mengelola registri pengetahuan, memoderasi kontribusi, dan menerbitkan snapshot —
              seperti dasbor WordPress yang biasa Anda pakai.
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Kata sandi admin</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <p role="alert" className="rounded-sm border border-rose-700/30 bg-rose-50 px-3 py-2 text-[13px] text-rose-900">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={busy || password.length === 0}>
              <KeyRound className="size-4" aria-hidden /> {busy ? 'Memeriksa…' : 'Masuk ke Ruang Admin'}
            </Button>
          </form>

          <p className="text-muted-foreground mt-5 border-t border-border/60 pt-4 text-center text-[12px] leading-relaxed">
            <ShieldCheck className="mr-1 inline size-3.5 text-[var(--brass)]" aria-hidden />
            Semua perubahan tercatat: versi lama disimpan, tidak ada penghapusan senyap.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ---------------- shell ----------------
export function AdminSection() {
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabKey>('dasbor')

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const r = await fetch('/api/admin/session')
      setSession((await r.json()) as SessionData)
    } catch {
      setSession(null)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const r = await fetch('/api/admin/session')
        if (alive) setSession((await r.json()) as SessionData)
      } catch {
        if (alive) setSession(null)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [load])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    await load()
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md space-y-3 py-10">
        <SkeletonCard /><SkeletonCard />
      </div>
    )
  }

  if (!session?.authenticated) {
    return <LoginCard onSuccess={load} />
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Kicker>Ruang privat pendiri</Kicker>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Ruang Admin 165</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5',
                session.dbAvailable
                  ? 'border-emerald-700/30 bg-emerald-50 text-emerald-900'
                  : 'border-amber-700/30 bg-amber-50 text-amber-900',
              )}
            >
              <Database className="size-3" aria-hidden />
              {session.dbAvailable ? 'Database hidup terhubung' : 'Database tidak terjangkau — mode snapshot'}
            </span>
            <span className="text-muted-foreground inline-flex items-center gap-1.5">
              <RefreshCw className="size-3" aria-hidden />
              Snapshot terakhir: {session.snapshot.exportedAt ? new Date(session.snapshot.exportedAt).toLocaleString('id-ID') : '—'}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="shrink-0">
          <LogOut className="size-3.5" aria-hidden /> Keluar
        </Button>
      </div>

      {/* tabs */}
      <div className="border-border/80 flex gap-1 overflow-x-auto border-b" role="tablist" aria-label="Menu admin">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-t-sm border-b-2 px-3.5 py-2.5 text-[13px] font-medium transition-colors',
              tab === t.key
                ? 'border-[var(--brass)] text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <t.icon className="size-4" aria-hidden /> {t.label}
            {t.key === 'kontribusi' && session.stats.contributions > 0 && (
              <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 text-[10px] leading-4">
                {session.stats.contributions}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* panels */}
      {tab === 'dasbor' && <DashboardPanel session={session} onGoTo={setTab} />}
      {tab === 'registri' && <RegistryPanel dbAvailable={session.dbAvailable} />}
      {tab === 'kontribusi' && <ContributionsPanel dbAvailable={session.dbAvailable} />}
      {tab === 'terbitkan' && <PublishPanel session={session} onRefreshSession={() => load(true)} />}
      {tab === 'panduan' && <GuidePanel dbAvailable={session.dbAvailable} />}
    </div>
  )
}

'use client'

// 165 — Sanad Registry: DISPLAY-ONLY and safety-gated.
// Per the Master Directive (§15): the system never creates, merges, predicts,
// or legitimizes sanad. Chains appear only when recorded with
// Source → Relationship → Evidence → Context → Verification Status.
// The registry ships EMPTY BY DESIGN — this is policy, not a missing feature.
import { Link2, ShieldAlert } from 'lucide-react'
import { EmptyState, HonestNote, Kicker, useApi } from './ui'

type SanadRecord = { slug: string; primaryName: string; globalId: string }

export function SanadRegistry() {
  const { data, loading } = useApi<{ entities: SanadRecord[] }>('/api/entities?type=SANAD&limit=50')
  const chains = data?.entities ?? []

  return (
    <section aria-labelledby="sanad-h">
      <Kicker>Sanad safety</Kicker>
      <h2 id="sanad-h" className="font-display mt-1.5 flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
        <Link2 className="size-4.5 text-[var(--brass)]" aria-hidden /> Sanad registry — display-only
      </h2>

      <HonestNote className="mt-3" tone="green">
        <strong>Safety policy.</strong> The system does not create sanad, merge sanad without basis, predict
        transmission links, convert tradition into fact, or confer spiritual legitimacy automatically.
        A recorded chain requires <span className="font-mono text-[12px]">Source → Relationship → Evidence → Context → Verification Status</span>.
      </HonestNote>

      {loading ? (
        <div className="mt-4 h-24 animate-pulse rounded-md border border-border bg-card" />
      ) : chains.length === 0 ? (
        <EmptyState icon={ShieldAlert} title="No sanad chains are recorded — by design" className="mt-4">
          <p>
            This emptiness is an institutional statement: until chains are deposited with their sources and reviewed,
            165 will display nothing — and will never generate a chain to fill the silence.
          </p>
        </EmptyState>
      ) : (
        <ul className="mt-4 space-y-2">
          {chains.map((c) => (
            <li key={c.globalId} className="rounded-md border border-border bg-card px-4 py-3 font-mono text-[13px]">
              {c.globalId} — {c.primaryName}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

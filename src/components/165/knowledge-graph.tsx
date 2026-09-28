'use client'

// 165 — Knowledge Graph: radial SVG layout, typed edges, clickable nodes.
// Deliberately dependency-free (no physics lib) for a dignified, stable view.
import { useMemo, useState } from 'react'
import { Network } from 'lucide-react'
import type { RelationshipDTO } from '@/lib/165'
import { SkeletonCard, TYPE_HUE } from './ui'

type Node = { id: string; globalId: string; slug: string; type: string; label: string }
type Edge = { id: string; from: string; to: string; predicate: string; verificationStatus: string }

export function KnowledgeGraph({
  nodes,
  edges,
  onOpen,
  className,
}: {
  nodes: Node[]
  edges: Edge[]
  onOpen: (slug: string) => void
  className?: string
}) {
  const [hover, setHover] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const layout = useMemo(() => {
    const W = 920, H = 560
    const cx = W / 2, cy = H / 2
    // prioritize hub entities to center rings
    const degree = new Map<string, number>()
    for (const e of edges) {
      degree.set(e.from, (degree.get(e.from) ?? 0) + 1)
      degree.set(e.to, (degree.get(e.to) ?? 0) + 1)
    }
    const sorted = [...nodes].sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0))
    const pos = new Map<string, { x: number; y: number }>()
    const innerCount = Math.min(6, sorted.length)
    sorted.slice(0, innerCount).forEach((n, i) => {
      const a = (2 * Math.PI * i) / innerCount - Math.PI / 2
      pos.set(n.id, { x: cx + 120 * Math.cos(a), y: cy + 100 * Math.sin(a) })
    })
    const rest = sorted.slice(innerCount)
    const rings = Math.max(1, Math.ceil(rest.length / 14))
    rest.forEach((n, i) => {
      const ring = Math.floor(i / 14)
      const idxInRing = i % 14
      const inRing = Math.min(14, rest.length - ring * 14)
      const a = (2 * Math.PI * idxInRing) / inRing - Math.PI / 2 + (ring % 2 ? Math.PI / inRing : 0)
      const r = 210 + ring * 65
      pos.set(n.id, { x: cx + r * Math.cos(a), y: cy + (r * 0.82) * Math.sin(a) })
    })
    return { W, H, pos }
  }, [nodes, edges])

  const focus = selected ?? hover
  const connected = useMemo(() => {
    if (!focus) return null
    const s = new Set<string>([focus])
    for (const e of edges) {
      if (e.from === focus) s.add(e.to)
      if (e.to === focus) s.add(e.from)
    }
    return s
  }, [focus, edges])

  if (nodes.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border bg-card/60 px-6 py-16 text-center">
        <Network className="text-muted-foreground mx-auto size-8" aria-hidden />
        <p className="text-muted-foreground mt-3 text-sm">The graph renders as relationships are recorded.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <svg viewBox={`0 0 ${layout.W} ${layout.H}`} className="h-auto w-full" role="img" aria-label="Knowledge graph of 165 records">
          {/* edges */}
          {edges.map((e) => {
            const a = layout.pos.get(e.from), b = layout.pos.get(e.to)
            if (!a || !b) return null
            const active = !connected || (connected.has(e.from) && connected.has(e.to))
            return (
              <g key={e.id} opacity={active ? 0.75 : 0.12} className="transition-opacity">
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={e.verificationStatus === 'TRADITIONAL_ACCOUNT' ? '#B08A3E' : e.verificationStatus === 'UNVERIFIED' ? '#9CA3AF' : '#3E6B4F'}
                  strokeWidth={1.1}
                  strokeDasharray={e.verificationStatus === 'TRADITIONAL_ACCOUNT' ? '4 3' : undefined}
                />
              </g>
            )
          })}
          {/* nodes */}
          {nodes.map((n) => {
            const p = layout.pos.get(n.id)
            if (!p) return null
            const dim = connected && !connected.has(n.id)
            const hue = TYPE_HUE[n.type] ?? '#666'
            const isSel = focus === n.id
            return (
              <g key={n.id}
                transform={`translate(${p.x},${p.y})`}
                opacity={dim ? 0.25 : 1}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setSelected((s) => (s === n.id ? null : n.id))}
                onDoubleClick={() => onOpen(n.slug)}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => { if (ev.key === 'Enter') onOpen(n.slug) }}
                aria-label={`${n.type}: ${n.label}`}
              >
                <circle r={isSel ? 9 : 6} fill={hue} stroke="#F7F4ED" strokeWidth={2} />
                {isSel && <circle r={15} fill="none" stroke={hue} strokeWidth={1} opacity={0.6} />}
                <text x={0} y={-12} textAnchor="middle" fontSize={9.5}
                  fill={isSel ? '#1C2A21' : '#4a5a4f'}
                  style={{ fontWeight: isSel ? 600 : 400 }}
                >
                  {n.label.length > 26 ? `${n.label.slice(0, 24)}…` : n.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <p className="text-muted-foreground mt-2 text-[12px] leading-relaxed">
        Click a node to isolate its neighbourhood; double-click (or Enter) to open its profile.
        <span className="ml-2 inline-flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-0 w-5 border-t-2 border-dashed border-[#B08A3E]" /> traditional-account edge
          <span aria-hidden className="ml-2 inline-block h-0 w-5 border-t-2 border-[#3E6B4F]" /> documented edge
        </span>
      </p>
    </div>
  )
}

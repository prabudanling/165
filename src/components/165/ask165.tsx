'use client'

// 165 — Ask 165 (Preview): retrieval-grounded, uncertainty-aware, non-fabricating.
// Answers are composed ONLY from database records; silence is answered honestly.
import { useState } from 'react'
import { BookOpenCheck, CircleHelp, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EvidenceBadge, StatusBadge } from './ui'

type AskRef = {
  globalId: string; slug: string; type: string; primaryName: string
  evidenceLevel: string; evidenceLabel: string; verificationStatus: string; statusLabel: string
  summary?: string | null
}
type AskResponse = {
  answer?: string; answerId?: string; found?: boolean
  references?: AskRef[]; policy?: string; sanadNotice?: string; error?: string
}

export function Ask165({ className }: { className?: string }) {
  const [question, setQuestion] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [res, setRes] = useState<AskResponse | null>(null)

  async function ask(q?: string) {
    const query = (q ?? question).trim()
    if (!query) return
    setState('loading')
    try {
      const r = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      })
      const json = (await r.json()) as AskResponse
      setRes(json)
    } catch {
      setRes({ error: 'Ask 165 is temporarily unavailable.' })
    }
    setState('done')
  }

  const samples = ['What is TQN?', 'Who founded 165?', 'Where was the sanad chain recorded?', 'Who was Baha\'uddin Naqshband?']

  return (
    <div className={cn('rounded-md border border-border bg-card p-5 sm:p-6', className)}>
      <div className="flex items-center gap-2">
        <CircleHelp className="size-4 text-[var(--brass)]" aria-hidden />
        <h3 className="font-display text-lg font-semibold">Ask 165 <span className="text-muted-foreground text-[12px] font-normal tracking-wide uppercase">(preview)</span></h3>
      </div>
      <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">
        Answers are retrieved from 165&apos;s records only — with evidence levels attached.
        When the records are silent, 165 says so. <strong>Unknown is better than fabricated certainty.</strong>
      </p>
      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => { e.preventDefault(); ask() }}
      >
        <label htmlFor="ask-input" className="sr-only">Ask 165 a question</label>
        <input
          id="ask-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What is TQN? Who founded 165?"
          className="border-input bg-background ring-offset-background focus-visible:ring-ring h-10 flex-1 rounded-sm border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
          maxLength={300}
        />
        <button
          type="submit"
          disabled={state === 'loading' || !question.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-sm px-5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {state === 'loading' ? 'Consulting records…' : 'Ask'}
        </button>
      </form>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {samples.map((s) => (
          <button key={s} type="button" onClick={() => { setQuestion(s); ask(s) }}
            className="text-muted-foreground hover:border-[var(--brass)]/50 hover:text-foreground rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[12px] transition-colors">
            {s}
          </button>
        ))}
      </div>

      {state === 'done' && res && (
        <div className="nice-scroll mt-4 max-h-96 overflow-y-auto rounded-md border border-border bg-secondary/40 p-4" aria-live="polite">
          {res.error ? (
            <p className="text-sm text-[#8C4A3C]">{res.error}</p>
          ) : (
            <>
              <p className="text-sm leading-relaxed">{res.found ? res.answer : (
                <span className="flex items-start gap-2">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden />
                  <span><strong>Not verified.</strong> {res.answerId ?? res.answer}</span>
                </span>
              )}</p>
              {res.sanadNotice && (
                <p className="mt-2 rounded-sm border border-amber-700/30 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">{res.sanadNotice}</p>
              )}
              {res.references && res.references.length > 0 && (
                <div className="mt-3">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase">
                    <BookOpenCheck className="size-3.5" aria-hidden /> Records consulted ({res.references.length})
                  </p>
                  <ul className="mt-1.5 space-y-2">
                    {res.references.map((r) => (
                      <li key={r.globalId} className="rounded-sm border border-border bg-card px-3 py-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[13px] font-medium">{r.primaryName}</span>
                          <EvidenceBadge level={r.evidenceLevel} />
                          <StatusBadge status={r.verificationStatus} />
                        </div>
                        <p className="text-muted-foreground mt-1 font-mono text-[10px]">{r.globalId}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {res.policy && <p className="text-muted-foreground mt-3 text-[11px] tracking-wide">{res.policy}</p>}
            </>
          )}
        </div>
      )}
    </div>
  )
}

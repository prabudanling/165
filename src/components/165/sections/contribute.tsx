'use client'

// 165 — CONTRIBUTE: submission workflow (Contribution ≠ Publication) + status lookup
import { ArrowRight, CheckCircle2, Search, Send } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CONTRIBUTION_FLOW, CONTRIBUTION_KINDS, CONTRIBUTION_TERMINAL } from '@/lib/165'
import { HonestNote, Kicker, SectionHeading } from '../ui'

const FLOW_LABELS: Record<string, string> = {
  SUBMITTED: 'Submitted', SCREENING: 'Screening', EDITORIAL_REVIEW: 'Editorial Review',
  SOURCE_REVIEW: 'Source Review', VERIFICATION: 'Verification', APPROVED: 'Approved', PUBLISHED: 'Published',
  REJECTED: 'Rejected', DISPUTED: 'Disputed',
}

type SubmitState =
  | { phase: 'idle' }
  | { phase: 'sending' }
  | { phase: 'sent'; reference: string; message: string }
  | { phase: 'error'; message: string }

export function ContributeSection() {
  const [state, setState] = useState<SubmitState>({ phase: 'idle' })
  const [refQuery, setRefQuery] = useState('')
  const [refResult, setRefResult] = useState<{ status: string; statusNote?: string | null; title: string; kind: string } | null | 'notfound'>(null)

  const [form, setForm] = useState({
    kind: 'KNOWLEDGE', title: '', description: '', sourceNote: '', submitterName: '', submitterContact: '', consent: false,
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters.'
    if (form.description.trim().length < 20) e.description = 'Please describe the submission in at least 20 characters.'
    if (form.submitterName.trim().length < 2) e.submitterName = 'Name is required.'
    if (!form.consent) e.consent = 'Please confirm you understand the review workflow.'
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setState({ phase: 'sending' })
    try {
      const r = await fetch('/api/contribute', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const json = await r.json()
      if (!r.ok) setState({ phase: 'error', message: json?.error ?? 'Submission failed.' })
      else setState({ phase: 'sent', reference: json.reference, message: json.message })
    } catch {
      setState({ phase: 'error', message: 'Network error — please try again.' })
    }
  }

  async function lookup(ev: React.FormEvent) {
    ev.preventDefault()
    setRefResult(null)
    if (!refQuery.trim()) return
    const r = await fetch(`/api/contribute?ref=${encodeURIComponent(refQuery.trim())}`)
    const json = await r.json()
    setRefResult(r.ok ? json.contribution : 'notfound')
  }

  return (
    <div className="space-y-10">
      <SectionHeading
        kicker="Contribute"
        title="Add to the record — through review, not around it"
        lede="The public may submit knowledge, sources, biographies, institutions, manuscripts, oral history and corrections. Contribution is not publication: every submission is reviewed before it enters the record."
      />

      {/* workflow */}
      <section aria-labelledby="flow-h">
        <Kicker>The editorial workflow</Kicker>
        <h2 id="flow-h" className="font-display mt-1.5 mb-4 text-xl font-semibold tracking-tight">From submission to record</h2>
        <ol className="flex flex-wrap items-center gap-1.5">
          {CONTRIBUTION_FLOW.map((s, i) => (
            <li key={s} className="flex items-center gap-1.5">
              <span className="border-border bg-card inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[12px] font-medium">
                <span className="text-muted-foreground font-mono text-[10px]">{String(i + 1).padStart(2, '0')}</span>
                {FLOW_LABELS[s]}
              </span>
              {i < CONTRIBUTION_FLOW.length - 1 && <ArrowRight className="text-muted-foreground size-3.5" aria-hidden />}
            </li>
          ))}
          {CONTRIBUTION_TERMINAL.map((s) => (
            <li key={s}>
              <span className={cn('ml-2 inline-flex items-center rounded-sm border px-2.5 py-1.5 text-[12px] font-medium',
                s === 'REJECTED' ? 'border-rose-700/30 bg-rose-50 text-rose-900' : 'border-amber-700/30 bg-amber-50 text-amber-900')}>
                {FLOW_LABELS[s]}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* form / success */}
      <section aria-labelledby="form-h" className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {state.phase === 'sent' ? (
            <div className="rounded-md border border-emerald-700/30 bg-emerald-50 p-6 text-emerald-950" role="status">
              <CheckCircle2 className="size-6" aria-hidden />
              <h3 className="font-display mt-2 text-lg font-semibold">Submission received</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed">{state.message}</p>
              <p className="mt-3 text-[13px]">Keep this reference — it is your permanent tracking ID:</p>
              <p className="mt-1.5 rounded-sm border border-emerald-800/30 bg-card px-3 py-2 font-mono text-base font-semibold tracking-wide">{state.reference}</p>
              <button
                onClick={() => { setState({ phase: 'idle' }); setForm({ kind: 'KNOWLEDGE', title: '', description: '', sourceNote: '', submitterName: '', submitterContact: '', consent: false }) }}
                className="mt-4 text-[13px] underline underline-offset-2"
              >
                Submit another contribution
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="rounded-md border border-border bg-card p-5 sm:p-6" aria-labelledby="form-h">
              <h3 id="form-h" className="font-display text-lg font-semibold">Submission form</h3>
              {state.phase === 'error' && (
                <HonestNote tone="rose" className="mt-3">{state.message}</HonestNote>
              )}
              <div className="mt-4 space-y-4">
                <Field label="Submission type" htmlFor="c-kind" error={fieldErrors.kind}>
                  <select
                    id="c-kind" value={form.kind}
                    onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}
                    className="border-input bg-background h-10 w-full rounded-sm border px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {Object.entries(CONTRIBUTION_KINDS).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
                  </select>
                </Field>
                <Field label="Title" htmlFor="c-title" error={fieldErrors.title} hint="A short headline for your submission.">
                  <input id="c-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-sm border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none" maxLength={200} />
                </Field>
                <Field label="Description" htmlFor="c-desc" error={fieldErrors.description} hint="What do you know, and how? Include dates, places, names, and anything uncertain — honesty about uncertainty helps review.">
                  <textarea id="c-desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={6} maxLength={8000}
                    className="border-input bg-background focus-visible:ring-ring nice-scroll w-full rounded-sm border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none" />
                </Field>
                <Field label="Sources (if any)" htmlFor="c-src" error={fieldErrors.sourceNote} hint="Documents, books, witnesses, links — or state that it is oral/family account.">
                  <input id="c-src" value={form.sourceNote} onChange={(e) => setForm((f) => ({ ...f, sourceNote: e.target.value }))}
                    className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-sm border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none" maxLength={2000} />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Your name" htmlFor="c-name" error={fieldErrors.submitterName}>
                    <input id="c-name" value={form.submitterName} onChange={(e) => setForm((f) => ({ ...f, submitterName: e.target.value }))}
                      className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-sm border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none" maxLength={120} />
                  </Field>
                  <Field label="Contact (optional)" htmlFor="c-contact" error={fieldErrors.submitterContact} hint="Only used to follow up on this submission.">
                    <input id="c-contact" value={form.submitterContact} onChange={(e) => setForm((f) => ({ ...f, submitterContact: e.target.value }))}
                      className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-sm border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none" maxLength={200} />
                  </Field>
                </div>
                <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed">
                  <input type="checkbox" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                    className="accent-[var(--primary)] mt-0.5 size-4" />
                  <span>
                    I understand that <strong>contribution is not publication</strong>: this submission enters the editorial
                    workflow and may be reviewed, corrected, disputed or declined — and that I cannot pay to change that outcome.
                  </span>
                </label>
                {fieldErrors.consent && <p className="text-[12px] text-rose-800">{fieldErrors.consent}</p>}
                <button
                  type="submit" disabled={state.phase === 'sending'}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-sm px-6 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Send className="size-4" aria-hidden /> {state.phase === 'sending' ? 'Submitting…' : 'Submit for review'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* side: privacy + lookup */}
        <div className="space-y-5 lg:col-span-2">
          <HonestNote tone="green">
            <strong>Privacy by design.</strong> Your contact details are used only to follow up on this submission and are
            never published. Living persons mentioned in submissions receive protection by default.
          </HonestNote>

          <div className="rounded-md border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Search className="size-4 text-[var(--brass)]" aria-hidden />
              <h3 className="font-display text-[15px] font-semibold">Track a submission</h3>
            </div>
            <p className="text-muted-foreground mt-1.5 text-[13px]">Enter a reference (e.g. <span className="font-mono">165-SUB-2025-00001</span>).</p>
            <form onSubmit={lookup} className="mt-3 flex gap-2">
              <label htmlFor="ref-input" className="sr-only">Submission reference</label>
              <input id="ref-input" value={refQuery} onChange={(e) => setRefQuery(e.target.value)} placeholder="165-SUB-…"
                className="border-input bg-background focus-visible:ring-ring h-10 flex-1 rounded-sm border px-3 font-mono text-[13px] focus-visible:ring-2 focus-visible:outline-none" />
              <button type="submit" className="border-border bg-secondary hover:bg-accent h-10 rounded-sm border px-4 text-[13px] font-medium transition-colors">
                Check
              </button>
            </form>
            {refResult === 'notfound' && <p className="mt-3 text-[13px] text-rose-800">Reference not found. Check the ID and try again.</p>}
            {refResult && refResult !== 'notfound' && (
              <div className="mt-3 rounded-sm border border-border bg-secondary/50 p-3 text-[13px]">
                <p className="font-medium">{refResult.title}</p>
                <p className="text-muted-foreground mt-0.5">{CONTRIBUTION_KINDS[refResult.kind as keyof typeof CONTRIBUTION_KINDS] ?? refResult.kind}</p>
                <p className="mt-2 inline-flex items-center gap-1.5">
                  <span className={cn('inline-block size-1.5 rounded-full bg-current',
                    refResult.status === 'PUBLISHED' || refResult.status === 'APPROVED' ? 'text-emerald-700'
                      : refResult.status === 'REJECTED' || refResult.status === 'DISPUTED' ? 'text-rose-700' : 'text-amber-700')} />
                  <strong>{FLOW_LABELS[refResult.status] ?? refResult.status}</strong>
                </p>
                {refResult.statusNote && <p className="text-muted-foreground mt-1.5 leading-relaxed">{refResult.statusNote}</p>}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function Field({ label, htmlFor, children, hint, error }: { label: string; htmlFor: string; children: React.ReactNode; hint?: string; error?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-[13px] font-medium">{label}</label>
      {hint && <p className="text-muted-foreground mt-0.5 text-[12px]">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-[12px] text-rose-800" role="alert">{error}</p>}
    </div>
  )
}

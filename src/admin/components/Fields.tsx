import { ReactNode, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react'
import { uid } from '../../lib/defaults'

export function Field({ label, hint, children, className = '' }: { label?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      {label && <label className="admin-label">{label}</label>}
      {children}
      {hint && <p className="text-[11px] text-[color:var(--text-faint)] mt-1.5 leading-snug">{hint}</p>}
    </div>
  )
}

export function Card({ title, desc, children, actions }: { title?: string; desc?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="glass rounded-xl p-4 sm:p-5 space-y-4">
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-sm font-semibold text-[color:var(--text)]">{title}</h3>}
            {desc && <p className="text-xs text-[color:var(--text-faint)] mt-0.5 leading-snug">{desc}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}

export function Toggle({ checked, onChange, label, hint, disabled }: { checked: boolean; onChange: (v: boolean) => void; label?: string; hint?: string; disabled?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${disabled ? 'opacity-50' : ''}`}>
      {(label || hint) && (
        <div className="min-w-0">
          {label && <p className="text-sm text-[color:var(--text)]">{label}</p>}
          {hint && <p className="text-[11px] text-[color:var(--text-faint)] leading-snug">{hint}</p>}
        </div>
      )}
      <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)} className="switch" />
    </div>
  )
}

export function Segmented<T extends string>({ value, options, onChange, size = 'md' }: {
  value: T; options: { value: T; label: ReactNode; title?: string }[]; onChange: (v: T) => void; size?: 'sm' | 'md'
}) {
  return (
    <div className="inline-flex flex-wrap border border-[color:var(--border)] rounded-lg overflow-hidden" role="group">
      {options.map(o => (
        <button key={o.value} type="button" title={o.title} onClick={() => onChange(o.value)} aria-pressed={value === o.value}
          className={`${size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} font-medium transition-colors ${value === o.value ? 'bg-[color:var(--accent)] text-[color:var(--accent-ink)]' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-white/5'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function TagInput({ value, onChange, placeholder = 'Type and press Enter' }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [txt, setTxt] = useState('')
  const add = (raw: string) => {
    const parts = raw.split(',').map(s => s.trim()).filter(Boolean)
    if (!parts.length) return
    onChange(Array.from(new Set([...(value || []), ...parts])))
    setTxt('')
  }
  return (
    <div className="admin-input !p-1.5 flex flex-wrap gap-1.5 items-center focus-within:border-[color:var(--accent)]">
      {(value || []).map(t => (
        <span key={t} className="inline-flex items-center gap-1 bg-white/10 text-xs px-2 py-1 rounded-md text-[color:var(--text)]">
          {t}
          <button type="button" onClick={() => onChange(value.filter(x => x !== t))} aria-label={`Remove ${t}`} className="opacity-60 hover:opacity-100"><X size={11} /></button>
        </span>
      ))}
      <input value={txt} onChange={e => setTxt(e.target.value)} placeholder={value?.length ? '' : placeholder}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(txt) } else if (e.key === 'Backspace' && !txt && value?.length) onChange(value.slice(0, -1)) }}
        onBlur={() => add(txt)}
        className="flex-1 min-w-[8rem] bg-transparent outline-none text-sm px-1.5 py-1 text-[color:var(--text)] placeholder:text-[color:var(--text-faint)]" />
    </div>
  )
}

/** Reorderable list of small sub-forms (CTAs, facts, stats, ribbon items, links…). */
export function ArrayEditor<T extends { id: string }>({ items, onChange, render, blank, addLabel = 'Add', max, empty }: {
  items: T[]; onChange: (v: T[]) => void; render: (item: T, update: (p: Partial<T>) => void) => ReactNode
  blank: () => Omit<T, 'id'>; addLabel?: string; max?: number; empty?: string
}) {
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="space-y-2.5">
      {items.length === 0 && empty && <p className="text-xs text-[color:var(--text-faint)] border border-dashed border-[color:var(--border)] rounded-lg p-4 text-center">{empty}</p>}
      {items.map((it, i) => (
        <div key={it.id} className="rounded-lg border border-[color:var(--border)] bg-white/[0.02] p-3 flex gap-3">
          <div className="flex-1 min-w-0">{render(it, p => onChange(items.map(x => (x.id === it.id ? { ...x, ...p } : x))))}</div>
          <div className="flex flex-col gap-1 shrink-0">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-md text-[color:var(--text-muted)] hover:bg-white/10 disabled:opacity-25" aria-label="Move up"><ArrowUp size={13} /></button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1.5 rounded-md text-[color:var(--text-muted)] hover:bg-white/10 disabled:opacity-25" aria-label="Move down"><ArrowDown size={13} /></button>
            <button type="button" onClick={() => onChange(items.filter(x => x.id !== it.id))} className="p-1.5 rounded-md text-red-400/80 hover:bg-red-500/10" aria-label="Remove"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
      {(!max || items.length < max) && (
        <button type="button" onClick={() => onChange([...items, { ...blank(), id: uid() } as T])}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-[color:var(--border-hover)] py-2.5 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-colors">
          <Plus size={14} />{addLabel}
        </button>
      )}
    </div>
  )
}

export const Spinner = () => (
  <div className="flex items-center justify-center h-48"><div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin" /></div>
)
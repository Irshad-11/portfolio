import { useEffect, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { BRAND_CATALOG, DynamicIcon, ICON_KEYS } from '../../lib/icons'

/** Choose a lucide icon, a brand icon (simple-icons) or type an emoji. */
export default function IconPicker({ value, onChange, allowNone = false, allowEmoji = false, compact = false }: {
  value: string; onChange: (v: string) => void; allowNone?: boolean; allowEmoji?: boolean; compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'icons' | 'brands'>('icons')
  const [q, setQ] = useState('')
  const [slug, setSlug] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const pick = (v: string) => { onChange(v); setOpen(false) }
  const icons = ICON_KEYS.filter(k => k.includes(q.toLowerCase()))
  const brands = BRAND_CATALOG.filter(b => `${b.slug} ${b.label}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} aria-haspopup="dialog" aria-expanded={open}
        className={`admin-input flex items-center gap-2.5 text-left ${compact ? '!py-1.5' : ''}`}>
        <span className="w-6 h-6 flex items-center justify-center text-[color:var(--accent)] shrink-0">
          {value ? <DynamicIcon name={value} size={18} /> : <span className="text-[color:var(--text-faint)] text-xs">—</span>}
        </span>
        <span className="flex-1 truncate text-xs text-[color:var(--text-muted)]">{value ? value.replace('si:', 'brand: ') : 'No icon'}</span>
        <ChevronDown size={14} className="text-[color:var(--text-faint)]" />
      </button>

      {open && (
        <div className="absolute z-[70] mt-1.5 w-[min(22rem,calc(100vw-2rem))] max-sm:fixed max-sm:inset-x-4 max-sm:bottom-4 max-sm:w-auto rounded-xl border border-[color:var(--border-hover)] bg-[#101112] shadow-2xl shadow-black/60 p-3" role="dialog" aria-label="Choose icon">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="inline-flex border border-[color:var(--border)] rounded-md overflow-hidden text-xs">
              {(['icons', 'brands'] as const).map(t => (
                <button key={t} type="button" onClick={() => setTab(t)} className={`px-3 py-1.5 capitalize ${tab === t ? 'bg-[color:var(--accent)] text-[color:var(--accent-ink)]' : 'text-[color:var(--text-muted)]'}`}>{t}</button>
              ))}
            </div>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="admin-input !py-1.5 !text-xs flex-1" />
            <button type="button" onClick={() => setOpen(false)} className="sm:hidden text-[color:var(--text-muted)]" aria-label="Close"><X size={16} /></button>
          </div>

          <div className="grid grid-cols-6 gap-1.5 max-h-56 overflow-y-auto pr-1">
            {allowNone && <button type="button" onClick={() => pick('')} className="h-10 rounded-md border border-dashed border-[color:var(--border-hover)] text-[10px] text-[color:var(--text-faint)] hover:border-[color:var(--accent)]">none</button>}
            {tab === 'icons' && icons.map(k => (
              <button key={k} type="button" title={k} onClick={() => pick(k)}
                className={`h-10 rounded-md flex items-center justify-center hover:bg-white/10 ${value === k ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent)] ring-1 ring-[color:var(--accent)]' : 'text-[color:var(--text)]'}`}>
                <DynamicIcon name={k} size={17} />
              </button>
            ))}
            {tab === 'brands' && brands.map(b => (
              <button key={b.slug} type="button" title={b.label} onClick={() => pick(`si:${b.slug}`)}
                className={`h-10 rounded-md flex items-center justify-center hover:bg-white/10 ${value === `si:${b.slug}` ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent)] ring-1 ring-[color:var(--accent)]' : 'text-[color:var(--text)]'}`}>
                <DynamicIcon name={`si:${b.slug}`} size={17} />
              </button>
            ))}
          </div>

          {tab === 'brands' && (
            <div className="mt-3 pt-3 border-t border-[color:var(--border)]">
              <p className="text-[11px] text-[color:var(--text-faint)] mb-1.5">Any brand from simpleicons.org — enter its slug (e.g. <code>figma</code>)</p>
              <div className="flex gap-2">
                <input value={slug} onChange={e => setSlug(e.target.value.trim().toLowerCase())} placeholder="slug" className="admin-input !py-1.5 !text-xs" />
                <button type="button" disabled={!slug} onClick={() => pick(`si:${slug}`)} className="btn-outline !h-8 !px-3 !text-xs !rounded-md !normal-case !tracking-normal !font-sans">Use</button>
              </div>
            </div>
          )}
          {allowEmoji && (
            <div className="mt-3 pt-3 border-t border-[color:var(--border)] flex items-center gap-2">
              <span className="text-[11px] text-[color:var(--text-faint)] shrink-0">Or emoji</span>
              <input value={/^[\w-]+$|^si:/.test(value) ? '' : value} onChange={e => onChange(e.target.value)} placeholder="🏆" className="admin-input !py-1.5 !text-sm !w-20 text-center" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
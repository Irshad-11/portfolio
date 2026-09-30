import { ReactNode, useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowUp, Eye, EyeOff, Loader2, Pencil, Plus, Save, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCollection } from '../hooks/useCollection'
import EditorShell from './EditorShell'
import { Card, Spinner, Toggle } from './Fields'
import type { RawPortfolio } from '../../lib/types'
import type { PreviewSpec } from '../lib'

type Row = { id: string; sort_order?: number; visible?: boolean }

export interface RowView {
  title: string
  meta?: string
  thumb?: string | null
  badges?: ReactNode
}

interface Props<T extends Row> {
  table: string
  title: string
  singular: string
  description?: string
  order?: string
  ascending?: boolean
  reorder?: boolean
  blank: () => Partial<T>
  row: (item: T) => RowView
  form: (ctx: { draft: Partial<T>; set: (p: Partial<T>) => void; isNew: boolean }) => ReactNode
  previews: (draft: Partial<T>, items: T[]) => PreviewSpec[]
  validate?: (d: Partial<T>) => string | null
  prepare?: (d: Partial<T>) => Partial<T>
  publishLabel?: string
  publishHint?: string
  /** Extra boolean toggles shown in the "Visibility" card */
  toggles?: { field: keyof T & string; label: string; hint?: string }[]
}

export type { RawPortfolio }

/** Generic list → two-pane editor (form + live preview) for any content table. */
export default function CollectionWorkspace<T extends Row>(props: Props<T>) {
  const { table, title, singular, description, order, ascending, reorder = true, blank, row, form, previews, validate, prepare, toggles = [] } = props
  const col = useCollection<T>(table, order, ascending)
  const [draft, setDraft] = useState<Partial<T> | null>(null)
  const [initial, setInitial] = useState('')
  const [saving, setSaving] = useState(false)

  const isNew = !!draft && (!draft.id || draft.id === 'draft')
  const dirty = draft ? JSON.stringify(draft) !== initial : false
  const set = (p: Partial<T>) => setDraft(d => ({ ...(d as Partial<T>), ...p }))

  const open = (d: Partial<T>) => { setDraft(d); setInitial(JSON.stringify(d)) }
  const close = () => {
    if (dirty && !window.confirm('Discard unsaved changes?')) return
    setDraft(null)
  }

  const save = async () => {
    if (!draft) return
    const err = validate?.(draft)
    if (err) return toast.error(err)
    setSaving(true)
    const out = await col.save(prepare ? prepare(draft) : draft)
    setSaving(false)
    if (out) { toast.success(`${singular} saved`); setDraft(out as Partial<T>); setInitial(JSON.stringify(out)) }
  }

  const del = async (id: string, name: string) => {
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return
    await col.remove(id)
    if (draft?.id === id) setDraft(null)
  }

  const specs = useMemo(() => (draft ? previews(draft, col.items) : []), [draft, col.items, previews])

  if (col.loading) return <Spinner />

  /* ---------- editor ---------- */
  if (draft) {
    const vis = draft.visible !== false
    return (
      <EditorShell
        title={isNew ? `New ${singular}` : `Edit ${singular}`}
        subtitle={dirty ? 'Unsaved changes' : isNew ? 'Not saved yet' : 'All changes saved'}
        previews={specs}
        actions={
          <>
            <button onClick={close} className="btn-outline !h-9 !px-3 !text-xs !rounded-lg !normal-case !tracking-normal !font-sans gap-1.5"><ArrowLeft size={14} />Back</button>
            {!isNew && <button onClick={() => del(draft.id as string, row(draft as T).title)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10" aria-label="Delete"><Trash2 size={16} /></button>}
            <button onClick={save} disabled={saving || (!dirty && !isNew)} className="btn-primary !h-9 !px-4 !text-xs !rounded-lg !normal-case !tracking-normal !font-sans gap-1.5">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
        form={
          <>
            {form({ draft, set, isNew })}
            <Card title="Visibility">
              <Toggle checked={vis} onChange={v => set({ visible: v } as Partial<T>)} label={props.publishLabel || 'Show on site'} hint={props.publishHint || 'Hidden items stay saved but are not shown to visitors.'} />
              {toggles.map(t => (
                <Toggle key={t.field} checked={!!(draft as Record<string, unknown>)[t.field]} onChange={v => set({ [t.field]: v } as Partial<T>)} label={t.label} hint={t.hint} />
              ))}
            </Card>
          </>
        }
      />
    )
  }

  /* ---------- list ---------- */
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text)]">{title}</h1>
          {description && <p className="text-sm text-[color:var(--text-faint)] mt-1 max-w-xl">{description}</p>}
        </div>
        <button onClick={() => open(blank())} className="btn-primary !h-10 !px-4 !text-sm !rounded-lg !normal-case !tracking-normal !font-sans gap-2 shrink-0"><Plus size={16} />New {singular}</button>
      </div>

      {col.items.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-[color:var(--text-muted)] mb-4">No {title.toLowerCase()} yet.</p>
          <button onClick={() => open(blank())} className="btn-primary !h-10 !px-4 !text-sm !rounded-lg !normal-case !tracking-normal !font-sans gap-2"><Plus size={16} />Add your first {singular.toLowerCase()}</button>
        </div>
      ) : (
        <ul className="space-y-2">
          {col.items.map((it, i) => {
            const r = row(it)
            const vis = it.visible !== false
            return (
              <li key={it.id} className={`glass rounded-xl flex items-center gap-3 p-2.5 sm:p-3 transition-opacity ${vis ? '' : 'opacity-55'}`}>
                {r.thumb !== undefined && (
                  <button onClick={() => open(it)} className="w-14 h-11 sm:w-16 sm:h-12 shrink-0 rounded-md overflow-hidden bg-white/5 border border-[color:var(--border)] flex items-center justify-center text-[color:var(--text-faint)]" aria-label={`Edit ${r.title}`}>
                    {r.thumb ? <img src={r.thumb} alt="" className="w-full h-full object-cover" loading="lazy" /> : <Pencil size={15} />}
                  </button>
                )}
                <button onClick={() => open(it)} className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-[color:var(--text)] truncate">{r.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 min-w-0">
                    {r.meta && <p className="text-xs text-[color:var(--text-faint)] truncate">{r.meta}</p>}
                    {r.badges}
                  </div>
                </button>
                <div className="flex items-center gap-0.5 shrink-0">
                  {reorder && (
                    <div className="hidden sm:flex flex-col">
                      <button onClick={() => col.move(it.id, -1)} disabled={i === 0} className="p-0.5 text-[color:var(--text-muted)] hover:text-[color:var(--text)] disabled:opacity-20" aria-label="Move up"><ArrowUp size={14} /></button>
                      <button onClick={() => col.move(it.id, 1)} disabled={i === col.items.length - 1} className="p-0.5 text-[color:var(--text-muted)] hover:text-[color:var(--text)] disabled:opacity-20" aria-label="Move down"><ArrowDown size={14} /></button>
                    </div>
                  )}
                  <button onClick={() => col.patch(it.id, { visible: !vis })} className="p-2 rounded-lg text-[color:var(--text-muted)] hover:bg-white/10" aria-label={vis ? 'Hide' : 'Show'} title={vis ? 'Visible — click to hide' : 'Hidden — click to show'}>{vis ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                  <button onClick={() => open(it)} className="p-2 rounded-lg text-[color:var(--text-muted)] hover:bg-white/10" aria-label="Edit"><Pencil size={16} /></button>
                  <button onClick={() => del(it.id, r.title)} className="p-2 rounded-lg text-red-400/70 hover:bg-red-500/10 hover:text-red-400" aria-label="Delete"><Trash2 size={16} /></button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCollection } from '../hooks/useCollection'
import { supabase } from '../../lib/supabase'
import { useData } from '../../context/DataContext'
import EditorShell from '../components/EditorShell'
import { Field, Spinner } from '../components/Fields'
import IconPicker from '../components/IconPicker'
import { SkillIcon } from '../../lib/icons'
import { CATEGORY_ORDER, orderedCategories } from '../../lib/skillUtils'
import type { Skill } from '../../lib/types'

const blank = (category: string): Partial<Skill> => ({ name: '', category, icon: 'si:', icon_url: '', visible: true })

export default function SkillsPage() {
  const col = useCollection<Skill>('skills', 'category')
  const { refetch } = useData()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [edit, setEdit] = useState<Partial<Skill> | null>(null)
  const [onlyOn, setOnlyOn] = useState(false)

  const cats = useMemo(() => orderedCategories(col.items), [col.items])
  const shown = col.items.filter(s =>
    (cat === 'All' || s.category === cat) && (!onlyOn || s.visible) && (!q || s.name.toLowerCase().includes(q.toLowerCase())))
  const groups = (cat === 'All' ? cats : [cat]).map(c => ({ c, list: shown.filter(s => s.category === c) })).filter(g => g.list.length)
  const onCount = col.items.filter(s => s.visible).length

  const bulk = async (category: string, visible: boolean) => {
    const ids = col.items.filter(s => s.category === category).map(s => s.id)
    col.setItems(p => p.map(s => (s.category === category ? { ...s, visible } : s)))
    const { error } = await supabase.from('skills').update({ visible }).in('id', ids)
    if (error) { toast.error(error.message); col.load() } else refetch()
  }

  const saveEdit = async () => {
    if (!edit?.name?.trim()) return toast.error('Give the skill a name')
    if (!edit.category?.trim()) return toast.error('Choose a category')
    const icon = edit.icon === 'si:' ? '' : edit.icon
    const out = await col.save({ ...edit, icon, icon_url: edit.icon_url || null } as Partial<Skill>)
    if (out) { toast.success('Skill saved'); setEdit(null) }
  }

  if (col.loading) return <Spinner />

  // Live preview shows what is currently switched on
  const patch = { skills: col.items }

  return (
    <EditorShell
      title="Skills" subtitle={`${onCount} of ${col.items.length} shown on your site`}
      previews={[{ label: 'Skills section', view: 'skills', patch }]}
      actions={<button onClick={() => setEdit(blank(cat === 'All' ? 'Tools & Platforms' : cat))} className="btn-primary !h-9 !px-3 !text-xs !rounded-lg !normal-case !tracking-normal !font-sans gap-1.5"><Plus size={14} />Add skill</button>}
      form={
        <>
          <div className="glass rounded-xl p-3 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-faint)]" />
                <input className="admin-input !pl-9" placeholder="Search skills…" value={q} onChange={e => setQ(e.target.value)} />
              </label>
              <label className="flex items-center gap-2 text-xs text-[color:var(--text-muted)] px-2 shrink-0"><input type="checkbox" className="accent-[color:var(--accent)]" checked={onlyOn} onChange={e => setOnlyOn(e.target.checked)} />Only shown</label>
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {['All', ...cats].map(c => (
                <button key={c} onClick={() => setCat(c)} className={`shrink-0 text-xs px-3 py-1.5 rounded-md border transition-colors ${cat === c ? 'border-[color:var(--accent)] bg-[color:var(--accent-subtle)] text-[color:var(--accent)]' : 'border-[color:var(--border)] text-[color:var(--text-muted)] hover:text-[color:var(--text)]'}`}>
                  {c} <span className="opacity-60">{c === 'All' ? col.items.length : col.items.filter(s => s.category === c).length}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[color:var(--text-faint)]">Tap a skill to switch it on or off. Changes save instantly and appear in the preview.</p>
          </div>

          {groups.length === 0 && <p className="text-sm text-[color:var(--text-faint)] text-center py-10">No skills match.</p>}
          {groups.map(({ c, list }) => (
            <section key={c}>
              <div className="flex items-center gap-3 mb-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">{c}</h3>
                <span className="text-[11px] text-[color:var(--text-faint)]">{list.filter(s => s.visible).length}/{col.items.filter(s => s.category === c).length} on</span>
                <span className="flex-1 h-px bg-[color:var(--border)]" />
                <button onClick={() => bulk(c, true)} className="text-[11px] text-[color:var(--text-muted)] hover:text-[color:var(--accent)]">All on</button>
                <button onClick={() => bulk(c, false)} className="text-[11px] text-[color:var(--text-muted)] hover:text-[color:var(--accent)]">All off</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {list.map(s => (
                  <div key={s.id} className={`group relative flex items-center gap-2.5 rounded-lg border pl-2.5 pr-1 py-2 transition-colors ${s.visible ? 'border-[color:var(--accent)] bg-[color:var(--accent-subtle)]' : 'border-[color:var(--border)] bg-white/[0.02]'}`}>
                    <button onClick={() => col.patch(s.id, { visible: !s.visible })} className="flex items-center gap-2.5 flex-1 min-w-0 text-left" aria-pressed={s.visible} aria-label={`${s.visible ? 'Hide' : 'Show'} ${s.name}`}>
                      <span className={`w-6 h-6 shrink-0 flex items-center justify-center ${s.visible ? 'text-[color:var(--text)]' : 'text-[color:var(--text-faint)]'}`}><SkillIcon icon={s.icon} iconUrl={s.icon_url} name={s.name} size={20} /></span>
                      <span className={`text-xs truncate ${s.visible ? 'text-[color:var(--text)] font-medium' : 'text-[color:var(--text-muted)]'}`}>{s.name}</span>
                    </button>
                    <button onClick={() => setEdit(s)} className="p-1.5 rounded text-[color:var(--text-faint)] hover:text-[color:var(--text)] sm:opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label={`Edit ${s.name}`}><Pencil size={12} /></button>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {edit && (
            <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
              <div className="absolute inset-0 bg-black/70" onClick={() => setEdit(null)} />
              <div className="relative w-full sm:max-w-md bg-[#0e0f10] border border-[color:var(--border-hover)] rounded-t-2xl sm:rounded-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[color:var(--text)]">{edit.id ? 'Edit skill' : 'Add skill'}</h3>
                  <button onClick={() => setEdit(null)} className="text-[color:var(--text-muted)]" aria-label="Close"><X size={18} /></button>
                </div>
                <Field label="Name"><input autoFocus className="admin-input" value={edit.name || ''} onChange={e => setEdit({ ...edit, name: e.target.value })} placeholder="e.g. Rust" /></Field>
                <Field label="Category">
                  <input className="admin-input" list="skill-cats" value={edit.category || ''} onChange={e => setEdit({ ...edit, category: e.target.value })} />
                  <datalist id="skill-cats">{Array.from(new Set([...CATEGORY_ORDER, ...cats])).map(c => <option key={c} value={c} />)}</datalist>
                </Field>
                <Field label="Icon" hint="Pick a brand icon, or use a lucide icon.">
                  <IconPicker value={edit.icon === 'si:' ? '' : edit.icon || ''} onChange={v => setEdit({ ...edit, icon: v, icon_url: '' })} allowNone />
                </Field>
                <Field label="…or custom image URL" hint="Overrides the icon above."><input className="admin-input" value={edit.icon_url || ''} onChange={e => setEdit({ ...edit, icon_url: e.target.value })} placeholder="https://…/logo.svg" /></Field>
                <div className="flex items-center gap-2 pt-1">
                  {edit.id && (
                    <button onClick={async () => { if (window.confirm(`Delete “${edit.name}”?`)) { await col.remove(edit.id!); setEdit(null) } }} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10" aria-label="Delete"><Trash2 size={16} /></button>
                  )}
                  <button onClick={() => setEdit(null)} className="btn-outline !h-10 !px-4 !text-sm !rounded-lg !normal-case !tracking-normal !font-sans ml-auto">Cancel</button>
                  <button onClick={saveEdit} className="btn-primary !h-10 !px-4 !text-sm !rounded-lg !normal-case !tracking-normal !font-sans">Save</button>
                </div>
              </div>
            </div>
          )}
        </>
      }
    />
  )
}
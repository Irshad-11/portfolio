import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { Achievement } from '../../lib/types'
import AdminSplitPanel from '../components/AdminSplitPanel'
import {
  ACHIEVEMENT_ICON_MAP,
  getAchievementIcon,
} from '../../sections/Achievements'

const ICON_OPTIONS = Object.keys(ACHIEVEMENT_ICON_MAP)

type F = Partial<Achievement>
const EMPTY: F = { title: '', description: '', icon: 'Trophy', date: '', sort_order: 0, visible: true }

export default function AchievementsPage() {
  const [items, setItems]       = useState<Achievement[]>([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState<F>(EMPTY)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving]     = useState(false)

  const load = async () => {
    const { data } = await supabase.from('achievements').select('*').order('sort_order')
    setItems(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openAdd   = () => { setForm({ ...EMPTY }); setFormOpen(true) }
  const openEdit  = (a: Achievement) => { setForm({ ...a }); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    if (!form.title) return toast.error('Title is required')
    setSaving(true)
    const { error } = form.id
      ? await supabase.from('achievements').update(form).eq('id', form.id)
      : await supabase.from('achievements').insert([form])
    if (error) toast.error(error.message)
    else { toast.success(form.id ? 'Updated!' : 'Added!'); closeForm(); load() }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this achievement?')) return
    await supabase.from('achievements').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  const toggleVisible = async (a: Achievement) => {
    await supabase.from('achievements').update({ visible: !a.visible }).eq('id', a.id)
    load()
  }

  const SelectedIcon = getAchievementIcon(form.icon ?? 'Trophy')

  const FormContent = (
    <>
      <div>
        <label className="admin-label">Title *</label>
        <input className="admin-input" value={form.title ?? ''}
               onChange={e => f('title', e.target.value)} placeholder="Hackathon Winner" />
      </div>

      <div>
        <label className="admin-label">Description</label>
        <textarea rows={3} className="admin-input resize-none" value={form.description ?? ''}
                  onChange={e => f('description', e.target.value)} placeholder="Won 1st place at DevHacks..." />
      </div>

      {/* Icon picker */}
      <div>
        <label className="admin-label">
          Icon
          {form.icon && <span className="ml-2 font-normal accent">— {form.icon}</span>}
        </label>

        {/* Preview */}
        <div className="mb-3 flex items-center gap-3 glass rounded-lg px-4 py-2.5">
          <div className="w-9 h-9 accent-subtle rounded-xl flex items-center justify-center">
            <SelectedIcon size={20} style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
          </div>
          <span className="text-sm text-[color:var(--text)]">{form.icon ?? 'Trophy'}</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-6 gap-1.5 max-h-52 overflow-y-auto pr-1">
          {ICON_OPTIONS.map(name => {
            const Icon = getAchievementIcon(name)
            const active = form.icon === name
            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => f('icon', name)}
                className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-150 ${
                  active
                    ? 'accent-subtle border border-[color:var(--accent)]'
                    : 'glass hover:bg-white/5'
                }`}
              >
                <Icon
                  size={17}
                  strokeWidth={1.75}
                  style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
                />
              </button>
            )
          })}
        </div>
        <p className="text-[10px] text-[color:var(--text-faint)] mt-1.5">
          Hover each icon to see its name. Color auto-matches your active theme.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="admin-label">Date</label>
          <input className="admin-input" value={form.date ?? ''}
                 onChange={e => f('date', e.target.value)} placeholder="2024" />
        </div>
        <div>
          <label className="admin-label">Sort Order</label>
          <input type="number" className="admin-input" value={form.sort_order ?? 0}
                 onChange={e => f('sort_order', Number(e.target.value))} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] cursor-pointer">
        <input type="checkbox" checked={form.visible ?? true}
               onChange={e => f('visible', e.target.checked)} className="w-4 h-4 rounded" />
        Visible on portfolio
      </label>

      <div className="flex gap-3 pt-2">
        <button onClick={closeForm} className="btn-outline flex-1 text-sm py-2">Cancel</button>
        <button onClick={save} disabled={saving}
                className="btn-primary flex-1 text-sm py-2 gap-1.5 disabled:opacity-50">
          <Save size={13} />{saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </>
  )

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Achievements</h1>
          <p className="text-xs text-[color:var(--text-faint)] mt-0.5">
            {items.length} total · {items.filter(i => i.visible).length} visible
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm py-2 px-4 gap-1.5">
          <Plus size={14} /> Add
        </button>
      </div>

      <AdminSplitPanel
        formOpen={formOpen}
        formTitle={form.id ? 'Edit Achievement' : 'New Achievement'}
        onClose={closeForm}
        form={FormContent}
      >
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="glass rounded-xl overflow-hidden">
            {items.length === 0 ? (
              <p className="p-8 text-center text-[color:var(--text-faint)] text-sm">No achievements yet.</p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {items.map(a => {
                  const Icon = getAchievementIcon(a.icon)
                  return (
                    <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-9 h-9 rounded-xl accent-subtle flex items-center justify-center flex-shrink-0">
                        <Icon size={17} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${a.visible ? 'text-[color:var(--text)]' : 'text-[color:var(--text-faint)] line-through'}`}>
                          {a.title}
                        </p>
                        <p className="text-xs text-[color:var(--text-faint)] font-mono">
                          {a.icon}{a.date && ` · ${a.date}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => toggleVisible(a)}
                                className={`p-1.5 ${a.visible ? 'text-emerald-400' : 'text-[color:var(--text-faint)]'}`}
                                title={a.visible ? 'Hide' : 'Show'}>
                          {a.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                        <button onClick={() => openEdit(a)}
                                className="p-1.5 text-[color:var(--text-faint)] hover:text-[color:var(--text)]">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => del(a.id)}
                                className="p-1.5 text-[color:var(--text-faint)] hover:text-red-400">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </AdminSplitPanel>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { Skill } from '../../lib/types'
import AdminSplitPanel from '../components/AdminSplitPanel'

type F = Partial<Skill>
const EMPTY: F = { name: '', category: 'Languages', icon_url: '', sort_order: 0, visible: true }
const CATS = ['Languages', 'Frameworks & Libraries', 'Databases', 'Tools & Platforms', 'Other']

export default function SkillsPage() {
  const [items, setItems] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<F>(EMPTY)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('skills').select('*').order('category').order('sort_order')
    setItems(data ?? []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...EMPTY }); setFormOpen(true) }
  const openEdit = (s: Skill) => { setForm({ ...s }); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    if (!form.name || !form.category) return toast.error('Name and Category required')
    setSaving(true)
    const { error } = form.id
      ? await supabase.from('skills').update(form).eq('id', form.id)
      : await supabase.from('skills').insert([form])
    if (error) toast.error(error.message)
    else { toast.success(form.id ? 'Updated!' : 'Added!'); closeForm(); load() }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('skills').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  const toggleVisible = async (s: Skill) => {
    await supabase.from('skills').update({ visible: !s.visible }).eq('id', s.id)
    load()
  }

  const grouped = items.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  const FormContent = (
    <>
      <div>
        <label className="admin-label">Skill Name *</label>
        <input className="admin-input" value={form.name ?? ''} onChange={e => f('name', e.target.value)} placeholder="React" />
      </div>
      <div>
        <label className="admin-label">Category *</label>
        <select className="admin-input" value={form.category ?? 'Languages'} onChange={e => f('category', e.target.value)}>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="admin-label">Icon URL (devicon or simpleicons)</label>
        <input className="admin-input text-xs font-mono" value={form.icon_url ?? ''} onChange={e => f('icon_url', e.target.value)}
               placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" />
        {form.icon_url && (
          <img src={form.icon_url} alt="" className="mt-2 w-8 h-8 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        )}
      </div>
      <div>
        <label className="admin-label">Sort Order</label>
        <input type="number" className="admin-input" value={form.sort_order ?? 0} onChange={e => f('sort_order', Number(e.target.value))} />
      </div>
      <label className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] cursor-pointer">
        <input type="checkbox" checked={form.visible ?? true} onChange={e => f('visible', e.target.checked)} className="w-4 h-4 rounded" />
        Visible on portfolio
      </label>
      <div className="flex gap-3 pt-2">
        <button onClick={closeForm} className="btn-outline flex-1 text-sm py-2">Cancel</button>
        <button onClick={save} disabled={saving} className="btn-primary flex-1 text-sm py-2 gap-1.5 disabled:opacity-50">
          <Save size={13}/>{saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </>
  )

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Skills</h1>
          <p className="text-xs text-[color:var(--text-faint)] mt-0.5">{items.length} total · {items.filter(i => i.visible).length} visible</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm py-2 px-4 gap-1.5"><Plus size={14}/> Add Skill</button>
      </div>

      <AdminSplitPanel formOpen={formOpen} formTitle={form.id ? 'Edit Skill' : 'New Skill'} onClose={closeForm} form={FormContent}>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([cat, skills]) => (
              <div key={cat} className="glass rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[color:var(--border)] bg-white/[0.02]">
                  <p className="text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wide">{cat}</p>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {skills.map(s => (
                    <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                      {s.icon_url && (
                        <img src={s.icon_url} alt={s.name} className="w-5 h-5 object-contain flex-shrink-0"
                             onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      )}
                      <span className={`text-sm flex-1 ${s.visible ? 'text-[color:var(--text)]' : 'text-[color:var(--text-faint)] line-through'}`}>{s.name}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleVisible(s)} className={`p-1.5 transition-colors ${s.visible ? 'text-emerald-400' : 'text-[color:var(--text-faint)]'}`} title={s.visible ? 'Hide' : 'Show'}>
                          {s.visible ? <Eye size={13}/> : <EyeOff size={13}/>}
                        </button>
                        <button onClick={() => openEdit(s)} className="p-1.5 text-[color:var(--text-faint)] hover:text-[color:var(--text)]"><Pencil size={13}/></button>
                        <button onClick={() => del(s.id)} className="p-1.5 text-[color:var(--text-faint)] hover:text-red-400"><Trash2 size={13}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-center text-[color:var(--text-faint)] text-sm py-8">No skills yet.</p>}
          </div>
        )}
      </AdminSplitPanel>
    </div>
  )
}

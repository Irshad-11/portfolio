import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, Eye, EyeOff, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { Experience } from '../../lib/types'
import AdminSplitPanel from '../components/AdminSplitPanel'

type F = Partial<Omit<Experience, 'description' | 'tech_stack'> & { desc_raw: string; tech_raw: string }>
const EMPTY: F = { company: '', role: '', period: '', location: '', website: '', desc_raw: '', tech_raw: '', sort_order: 0, visible: true }

export default function ExperiencePage() {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<F>(EMPTY)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('experience').select('*').order('sort_order')
    setItems(data ?? []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...EMPTY }); setFormOpen(true) }
  const openEdit = (e: Experience) => {
    setForm({ ...e, desc_raw: e.description.join('\n'), tech_raw: e.tech_stack.join(', ') })
    setFormOpen(true)
  }
  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    if (!form.company || !form.role) return toast.error('Company and Role required')
    setSaving(true)
    const payload = {
      ...form,
      description: (form.desc_raw ?? '').split('\n').map(s => s.trim()).filter(Boolean),
      tech_stack: (form.tech_raw ?? '').split(',').map(s => s.trim()).filter(Boolean),
    }
    delete (payload as Record<string, unknown>).desc_raw
    delete (payload as Record<string, unknown>).tech_raw
    const { error } = form.id
      ? await supabase.from('experience').update(payload).eq('id', form.id)
      : await supabase.from('experience').insert([payload])
    if (error) toast.error(error.message)
    else { toast.success(form.id ? 'Updated!' : 'Added!'); closeForm(); load() }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('experience').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  const toggleVisible = async (e: Experience) => {
    await supabase.from('experience').update({ visible: !e.visible }).eq('id', e.id)
    load()
  }

  const FormContent = (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="admin-label">Company *</label><input className="admin-input" value={form.company ?? ''} onChange={e => f('company', e.target.value)} placeholder="Company Name"/></div>
        <div><label className="admin-label">Role *</label><input className="admin-input" value={form.role ?? ''} onChange={e => f('role', e.target.value)} placeholder="Senior Developer"/></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="admin-label">Period</label><input className="admin-input" value={form.period ?? ''} onChange={e => f('period', e.target.value)} placeholder="Jan 2024 – Present"/></div>
        <div><label className="admin-label">Location</label><input className="admin-input" value={form.location ?? ''} onChange={e => f('location', e.target.value)} placeholder="Dhaka, BD"/></div>
      </div>
      <div><label className="admin-label">Company Website</label><input className="admin-input" value={form.website ?? ''} onChange={e => f('website', e.target.value)} placeholder="https://..."/></div>
      <div>
        <label className="admin-label">Highlights (one per line)</label>
        <textarea rows={5} className="admin-input resize-none text-xs" value={form.desc_raw ?? ''} onChange={e => f('desc_raw', e.target.value)}
                  placeholder={"Led development of...\nImproved performance by 40%\nMentored 4 junior devs"} />
      </div>
      <div><label className="admin-label">Tech Stack (comma separated)</label><input className="admin-input" value={form.tech_raw ?? ''} onChange={e => f('tech_raw', e.target.value)} placeholder="React, TypeScript, Node.js"/></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="admin-label">Sort Order</label><input type="number" className="admin-input" value={form.sort_order ?? 0} onChange={e => f('sort_order', Number(e.target.value))}/></div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] cursor-pointer pb-1">
            <input type="checkbox" checked={form.visible ?? true} onChange={e => f('visible', e.target.checked)} className="w-4 h-4 rounded"/>Visible
          </label>
        </div>
      </div>
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
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Experience</h1>
          <p className="text-xs text-[color:var(--text-faint)] mt-0.5">{items.length} total · {items.filter(i => i.visible).length} visible</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm py-2 px-4 gap-1.5"><Plus size={14}/> Add</button>
      </div>

      <AdminSplitPanel formOpen={formOpen} formTitle={form.id ? 'Edit Experience' : 'New Experience'} onClose={closeForm} form={FormContent}>
        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin"/></div>
        ) : (
          <div className="glass rounded-xl overflow-hidden">
            {items.length === 0 ? <p className="p-8 text-center text-[color:var(--text-faint)] text-sm">No experience yet.</p> : (
              <div className="divide-y divide-white/[0.04]">
                {items.map(e => (
                  <div key={e.id} className="flex items-start gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${e.visible ? 'text-[color:var(--text)]' : 'text-[color:var(--text-faint)] line-through'}`}>{e.role}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs accent">{e.company}</span>
                        {e.website && <a href={e.website} target="_blank" rel="noopener noreferrer" className="text-[color:var(--text-faint)] hover:text-[color:var(--accent)]"><ExternalLink size={10}/></a>}
                        {e.period && <><span className="text-[color:var(--text-faint)] text-xs">·</span><span className="text-xs text-[color:var(--text-faint)] font-mono">{e.period}</span></>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => toggleVisible(e)} className={`p-1.5 ${e.visible ? 'text-emerald-400' : 'text-[color:var(--text-faint)]'}`}>{e.visible ? <Eye size={13}/> : <EyeOff size={13}/>}</button>
                      <button onClick={() => openEdit(e)} className="p-1.5 text-[color:var(--text-faint)] hover:text-[color:var(--text)]"><Pencil size={13}/></button>
                      <button onClick={() => del(e.id)} className="p-1.5 text-[color:var(--text-faint)] hover:text-red-400"><Trash2 size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </AdminSplitPanel>
    </div>
  )
}

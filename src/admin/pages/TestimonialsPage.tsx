import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { Testimonial } from '../../lib/types'
import AdminSplitPanel from '../components/AdminSplitPanel'

type F = Partial<Testimonial>
const EMPTY: F = { name: '', role: '', company: '', company_url: '', avatar_url: '', content: '', sort_order: 0, visible: true }

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<F>(EMPTY)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order')
    setItems(data ?? []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...EMPTY }); setFormOpen(true) }
  const openEdit = (t: Testimonial) => { setForm({ ...t }); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    if (!form.name || !form.content) return toast.error('Name and Content required')
    setSaving(true)
    const { error } = form.id
      ? await supabase.from('testimonials').update(form).eq('id', form.id)
      : await supabase.from('testimonials').insert([form])
    if (error) toast.error(error.message)
    else { toast.success(form.id ? 'Updated!' : 'Added!'); closeForm(); load() }
    setSaving(false)
  }

  const del = async (id: string) => { if (!confirm('Delete?')) return; await supabase.from('testimonials').delete().eq('id', id); toast.success('Deleted'); load() }
  const toggleVisible = async (t: Testimonial) => { await supabase.from('testimonials').update({ visible: !t.visible }).eq('id', t.id); load() }

  const FormContent = (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="admin-label">Name *</label><input className="admin-input" value={form.name ?? ''} onChange={e => f('name', e.target.value)} placeholder="John Doe" /></div>
        <div><label className="admin-label">Role</label><input className="admin-input" value={form.role ?? ''} onChange={e => f('role', e.target.value)} placeholder="CEO" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="admin-label">Company</label><input className="admin-input" value={form.company ?? ''} onChange={e => f('company', e.target.value)} placeholder="Acme Corp" /></div>
        <div><label className="admin-label">Company URL</label><input className="admin-input" value={form.company_url ?? ''} onChange={e => f('company_url', e.target.value)} placeholder="https://..." /></div>
      </div>
      <div><label className="admin-label">Avatar URL</label><input className="admin-input" value={form.avatar_url ?? ''} onChange={e => f('avatar_url', e.target.value)} placeholder="https://..." /></div>
      <div><label className="admin-label">Testimonial *</label><textarea rows={5} className="admin-input resize-none" value={form.content ?? ''} onChange={e => f('content', e.target.value)} placeholder="What they said..." /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="admin-label">Sort Order</label><input type="number" className="admin-input" value={form.sort_order ?? 0} onChange={e => f('sort_order', Number(e.target.value))} /></div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] cursor-pointer pb-1">
            <input type="checkbox" checked={form.visible ?? true} onChange={e => f('visible', e.target.checked)} className="w-4 h-4 rounded" />Visible
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={closeForm} className="btn-outline flex-1 text-sm py-2">Cancel</button>
        <button onClick={save} disabled={saving} className="btn-primary flex-1 text-sm py-2 gap-1.5 disabled:opacity-50">
          <Save size={13} />{saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </>
  )

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Testimonials</h1>
          <p className="text-xs text-[color:var(--text-faint)] mt-0.5">{items.length} total · {items.filter(i => i.visible).length} visible</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm py-2 px-4 gap-1.5"><Plus size={14} /> Add</button>
      </div>

      <AdminSplitPanel formOpen={formOpen} formTitle={form.id ? 'Edit Testimonial' : 'New Testimonial'} onClose={closeForm} form={FormContent}>
        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin" /></div>
        ) : (
          <div className="glass rounded-xl overflow-hidden">
            {items.length === 0 ? <p className="p-8 text-center text-[color:var(--text-faint)] text-sm">No testimonials yet.</p> : (
              <div className="divide-y divide-white/[0.04]">
                {items.map(t => (
                  <div key={t.id} className="flex items-start gap-3 px-4 py-3">
                    {t.avatar_url
                      ? <img src={t.avatar_url} alt={t.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      : <div className="w-9 h-9 rounded-full accent-bg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{t.name[0]}</div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${t.visible ? 'text-[color:var(--text)]' : 'text-[color:var(--text-faint)] line-through'}`}>{t.name}</p>
                      <p className="text-xs text-[color:var(--text-faint)]">{t.role}{t.company && ` · ${t.company}`}</p>
                      <p className="text-xs text-[color:var(--text-faint)] italic mt-0.5 line-clamp-1">"{t.content}"</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => toggleVisible(t)} className={`p-1.5 ${t.visible ? 'text-emerald-400' : 'text-[color:var(--text-faint)]'}`}>{t.visible ? <Eye size={13} /> : <EyeOff size={13} />}</button>
                      <button onClick={() => openEdit(t)} className="p-1.5 text-[color:var(--text-faint)] hover:text-[color:var(--text)]"><Pencil size={13} /></button>
                      <button onClick={() => del(t.id)} className="p-1.5 text-[color:var(--text-faint)] hover:text-red-400"><Trash2 size={13} /></button>
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

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, Eye, EyeOff, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { Certification } from '../../lib/types'
import AdminSplitPanel from '../components/AdminSplitPanel'
type F = Partial<Certification>
const EMPTY: F = { title: '', issuer: '', issue_date: '', credential_url: '', badge_url: '', description: '', sort_order: 0, visible: true }
export default function CertificationsPage() {
  const [items, setItems] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<F>(EMPTY)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const load = async () => { const { data } = await supabase.from('certifications').select('*').order('sort_order'); setItems(data ?? []); setLoading(false) }
  useEffect(() => { load() }, [])
  const openAdd = () => { setForm({ ...EMPTY }); setFormOpen(true) }
  const openEdit = (c: Certification) => { setForm({ ...c }); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }))
  const save = async () => {
    if (!form.title || !form.issuer) return toast.error('Title and Issuer required')
    setSaving(true)
    const { error } = form.id ? await supabase.from('certifications').update(form).eq('id', form.id) : await supabase.from('certifications').insert([form])
    if (error) toast.error(error.message); else { toast.success(form.id ? 'Updated!' : 'Added!'); closeForm(); load() }
    setSaving(false)
  }
  const del = async (id: string) => { if (!confirm('Delete?')) return; await supabase.from('certifications').delete().eq('id', id); toast.success('Deleted'); load() }
  const toggleVisible = async (c: Certification) => { await supabase.from('certifications').update({ visible: !c.visible }).eq('id', c.id); load() }
  const FormContent = (<>
    <div><label className="admin-label">Title *</label><input className="admin-input" value={form.title??''} onChange={e=>f('title',e.target.value)} placeholder="AWS Certified Solutions Architect"/></div>
    <div><label className="admin-label">Issuer *</label><input className="admin-input" value={form.issuer??''} onChange={e=>f('issuer',e.target.value)} placeholder="Amazon Web Services"/></div>
    <div className="grid grid-cols-2 gap-3">
      <div><label className="admin-label">Issue Date</label><input className="admin-input" value={form.issue_date??''} onChange={e=>f('issue_date',e.target.value)} placeholder="Jan 2024"/></div>
      <div><label className="admin-label">Sort Order</label><input type="number" className="admin-input" value={form.sort_order??0} onChange={e=>f('sort_order',Number(e.target.value))}/></div>
    </div>
    <div><label className="admin-label">Credential URL</label><input className="admin-input" value={form.credential_url??''} onChange={e=>f('credential_url',e.target.value)} placeholder="https://..."/></div>
    <div><label className="admin-label">Badge Image URL</label><input className="admin-input" value={form.badge_url??''} onChange={e=>f('badge_url',e.target.value)} placeholder="https://..."/></div>
    <div><label className="admin-label">Description</label><textarea rows={3} className="admin-input resize-none" value={form.description??''} onChange={e=>f('description',e.target.value)}/></div>
    <label className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] cursor-pointer"><input type="checkbox" checked={form.visible??true} onChange={e=>f('visible',e.target.checked)} className="w-4 h-4 rounded"/>Visible on portfolio</label>
    <div className="flex gap-3 pt-2"><button onClick={closeForm} className="btn-outline flex-1 text-sm py-2">Cancel</button><button onClick={save} disabled={saving} className="btn-primary flex-1 text-sm py-2 gap-1.5 disabled:opacity-50"><Save size={13}/>{saving?'Saving...':'Save'}</button></div>
  </>)
  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[color:var(--text)]">Certifications</h1><p className="text-xs text-[color:var(--text-faint)] mt-0.5">{items.length} total · {items.filter(i=>i.visible).length} visible</p></div>
        <button onClick={openAdd} className="btn-primary text-sm py-2 px-4 gap-1.5"><Plus size={14}/> Add</button>
      </div>
      <AdminSplitPanel formOpen={formOpen} formTitle={form.id?'Edit Certification':'New Certification'} onClose={closeForm} form={FormContent}>
        {loading ? <div className="flex items-center justify-center h-32"><div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin"/></div> : (
          <div className="glass rounded-xl overflow-hidden">
            {items.length===0 ? <p className="p-8 text-center text-[color:var(--text-faint)] text-sm">No certifications yet.</p> : (
              <div className="divide-y divide-white/[0.04]">
                {items.map(c=>(
                  <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                    {c.badge_url ? <img src={c.badge_url} alt="" className="w-8 h-8 object-contain rounded flex-shrink-0"/> : <div className="w-8 h-8 rounded accent-subtle flex items-center justify-center flex-shrink-0"><Award size={14} className="accent"/></div>}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${c.visible?'text-[color:var(--text)]':'text-[color:var(--text-faint)] line-through'}`}>{c.title}</p>
                      <p className="text-xs text-[color:var(--text-faint)]">{c.issuer}{c.issue_date&&` · ${c.issue_date}`}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={()=>toggleVisible(c)} className={`p-1.5 ${c.visible?'text-emerald-400':'text-[color:var(--text-faint)]'}`}>{c.visible?<Eye size={13}/>:<EyeOff size={13}/>}</button>
                      <button onClick={()=>openEdit(c)} className="p-1.5 text-[color:var(--text-faint)] hover:text-[color:var(--text)]"><Pencil size={13}/></button>
                      <button onClick={()=>del(c.id)} className="p-1.5 text-[color:var(--text-faint)] hover:text-red-400"><Trash2 size={13}/></button>
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

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, Eye, EyeOff, ExternalLink, Github } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { Project, ProjectStatus } from '../../lib/types'
import AdminSplitPanel from '../components/AdminSplitPanel'

type FormData = Partial<Omit<Project, 'tech_stack'> & { tech_stack_raw: string }>

const EMPTY: FormData = {
  title: '', slug: '', description: '', long_description: '',
  tech_stack_raw: '', live_url: '', github_url: '', npm_url: '',
  image_url: '', status: 'live', featured: false, sort_order: 0, visible: true,
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order')
    setItems(data ?? []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...EMPTY }); setFormOpen(true) }
  const openEdit = (p: Project) => {
    setForm({ ...p, tech_stack_raw: p.tech_stack.join(', ') })
    setFormOpen(true)
  }
  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }

  const save = async () => {
    if (!form.title || !form.slug) return toast.error('Title and Slug are required')
    setSaving(true)
    const payload = {
      ...form,
      tech_stack: (form.tech_stack_raw ?? '').split(',').map(t => t.trim()).filter(Boolean),
    }
    delete (payload as Record<string, unknown>).tech_stack_raw
    const { error } = form.id
      ? await supabase.from('projects').update(payload).eq('id', form.id)
      : await supabase.from('projects').insert([payload])
    if (error) toast.error(error.message)
    else { toast.success(form.id ? 'Updated!' : 'Added!'); closeForm(); load() }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  const toggleVisible = async (p: Project) => {
    await supabase.from('projects').update({ visible: !p.visible }).eq('id', p.id)
    load()
  }

  const f = (k: keyof FormData, v: unknown) => setForm(prev => ({ ...prev, [k]: v }))

  const FormContent = (
    <>
      <div>
        <label className="admin-label">Title *</label>
        <input className="admin-input" value={form.title ?? ''} onChange={e => {
          const t = e.target.value
          setForm(p => ({ ...p, title: t, slug: p.id ? p.slug : slugify(t) }))
        }} placeholder="My Awesome Project" />
      </div>
      <div>
        <label className="admin-label">Slug *</label>
        <input className="admin-input font-mono text-xs" value={form.slug ?? ''}
               onChange={e => f('slug', e.target.value)} placeholder="my-awesome-project" />
      </div>
      <div>
        <label className="admin-label">Short Description</label>
        <textarea rows={2} className="admin-input resize-none" value={form.description ?? ''}
                  onChange={e => f('description', e.target.value)} placeholder="Brief summary..." />
      </div>
      <div>
        <label className="admin-label">Full Description</label>
        <textarea rows={4} className="admin-input resize-none" value={form.long_description ?? ''}
                  onChange={e => f('long_description', e.target.value)} placeholder="Detailed description for the detail page..." />
      </div>
      <div>
        <label className="admin-label">Tech Stack (comma separated)</label>
        <input className="admin-input" value={form.tech_stack_raw ?? ''}
               onChange={e => f('tech_stack_raw', e.target.value)} placeholder="React, TypeScript, Node.js" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="admin-label">Live URL</label>
          <input className="admin-input" value={form.live_url ?? ''} onChange={e => f('live_url', e.target.value)} placeholder="https://" />
        </div>
        <div>
          <label className="admin-label">GitHub URL</label>
          <input className="admin-input" value={form.github_url ?? ''} onChange={e => f('github_url', e.target.value)} placeholder="https://github.com/..." />
        </div>
      </div>
      <div>
        <label className="admin-label">Image URL</label>
        <input className="admin-input" value={form.image_url ?? ''} onChange={e => f('image_url', e.target.value)} placeholder="https://..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="admin-label">Status</label>
          <select className="admin-input" value={form.status ?? 'live'} onChange={e => f('status', e.target.value as ProjectStatus)}>
            <option value="live">Live</option>
            <option value="wip">Work in Progress</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
        <div>
          <label className="admin-label">Sort Order</label>
          <input type="number" className="admin-input" value={form.sort_order ?? 0} onChange={e => f('sort_order', Number(e.target.value))} />
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] cursor-pointer">
          <input type="checkbox" checked={form.featured ?? false} onChange={e => f('featured', e.target.checked)}
                 className="w-4 h-4 rounded accent-bg" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] cursor-pointer">
          <input type="checkbox" checked={form.visible ?? true} onChange={e => f('visible', e.target.checked)}
                 className="w-4 h-4 rounded" />
          Visible on portfolio
        </label>
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
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Projects</h1>
          <p className="text-xs text-[color:var(--text-faint)] mt-0.5">{items.length} total · {items.filter(i => i.visible).length} visible</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm py-2 px-4 gap-1.5">
          <Plus size={14} /> Add Project
        </button>
      </div>

      <AdminSplitPanel
        formOpen={formOpen}
        formTitle={form.id ? 'Edit Project' : 'New Project'}
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
              <p className="p-8 text-center text-[color:var(--text-faint)] text-sm">No projects yet.</p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {items.map(p => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                    {p.image_url && (
                      <img src={p.image_url} alt={p.title}
                           className="w-10 h-8 object-cover rounded flex-shrink-0 opacity-70" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-medium ${p.visible ? 'text-[color:var(--text)]' : 'text-[color:var(--text-faint)] line-through'}`}>{p.title}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          p.status === 'live' ? 'badge-live' : p.status === 'wip' ? 'badge-wip' : 'badge-coming-soon'
                        }`}>{p.status}</span>
                        {p.featured && <span className="text-[10px] accent font-mono">★ featured</span>}
                      </div>
                      <p className="text-xs text-[color:var(--text-faint)] font-mono">/projects/{p.slug}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[color:var(--text-faint)] hover:text-[color:var(--accent)] transition-colors"><ExternalLink size={13}/></a>}
                      {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[color:var(--text-faint)] hover:text-[color:var(--accent)] transition-colors"><Github size={13}/></a>}
                      <button onClick={() => toggleVisible(p)} className={`p-1.5 transition-colors ${p.visible ? 'text-emerald-400' : 'text-[color:var(--text-faint)]'} hover:text-[color:var(--accent)]`} title={p.visible ? 'Hide' : 'Show'}>
                        {p.visible ? <Eye size={13}/> : <EyeOff size={13}/>}
                      </button>
                      <button onClick={() => openEdit(p)} className="p-1.5 text-[color:var(--text-faint)] hover:text-[color:var(--text)] transition-colors"><Pencil size={13}/></button>
                      <button onClick={() => del(p.id)} className="p-1.5 text-[color:var(--text-faint)] hover:text-red-400 transition-colors"><Trash2 size={13}/></button>
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

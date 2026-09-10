import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { BlogPost } from '../../lib/types'
import AdminSplitPanel from '../components/AdminSplitPanel'

type F = Partial<Omit<BlogPost, 'tags'> & { tags_raw: string }>
const EMPTY: F = { title: '', slug: '', excerpt: '', content: '', tags_raw: '', read_time: '5 min read', image_url: '', published: false, sort_order: 0, visible: true }

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function BlogPage() {
  const [items, setItems] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<F>(EMPTY)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('sort_order')
    setItems(data ?? []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...EMPTY }); setFormOpen(true) }
  const openEdit = (b: BlogPost) => { setForm({ ...b, tags_raw: b.tags.join(', ') }); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    if (!form.title || !form.slug) return toast.error('Title and Slug required')
    setSaving(true)
    const payload = { ...form, tags: (form.tags_raw ?? '').split(',').map(t => t.trim()).filter(Boolean) }
    delete (payload as Record<string, unknown>).tags_raw
    const { error } = form.id
      ? await supabase.from('blog_posts').update(payload).eq('id', form.id)
      : await supabase.from('blog_posts').insert([payload])
    if (error) toast.error(error.message)
    else { toast.success(form.id ? 'Updated!' : 'Added!'); closeForm(); load() }
    setSaving(false)
  }

  const del = async (id: string) => { if (!confirm('Delete?')) return; await supabase.from('blog_posts').delete().eq('id', id); toast.success('Deleted'); load() }
  const toggleVisible = async (b: BlogPost) => { await supabase.from('blog_posts').update({ visible: !b.visible }).eq('id', b.id); load() }
  const togglePublished = async (b: BlogPost) => { await supabase.from('blog_posts').update({ published: !b.published }).eq('id', b.id); load() }

  const FormContent = (
    <>
      <div>
        <label className="admin-label">Title *</label>
        <input className="admin-input" value={form.title ?? ''} onChange={e => {
          const t = e.target.value
          setForm(p => ({ ...p, title: t, slug: p.id ? p.slug : slugify(t) }))
        }} placeholder="My Blog Post" />
      </div>
      <div>
        <label className="admin-label">Slug *</label>
        <input className="admin-input font-mono text-xs" value={form.slug ?? ''} onChange={e => f('slug', e.target.value)} />
      </div>
      <div>
        <label className="admin-label">Excerpt</label>
        <textarea rows={2} className="admin-input resize-none" value={form.excerpt ?? ''} onChange={e => f('excerpt', e.target.value)} placeholder="Brief summary..." />
      </div>
      <div>
        <label className="admin-label">Content</label>
        <textarea rows={6} className="admin-input resize-none text-xs font-mono" value={form.content ?? ''} onChange={e => f('content', e.target.value)} placeholder="# My Post&#10;&#10;Write markdown here..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="admin-label">Tags (comma separated)</label>
          <input className="admin-input" value={form.tags_raw ?? ''} onChange={e => f('tags_raw', e.target.value)} placeholder="React, TypeScript" />
        </div>
        <div>
          <label className="admin-label">Read Time</label>
          <input className="admin-input" value={form.read_time ?? ''} onChange={e => f('read_time', e.target.value)} placeholder="5 min read" />
        </div>
      </div>
      <div>
        <label className="admin-label">Cover Image URL</label>
        <input className="admin-input" value={form.image_url ?? ''} onChange={e => f('image_url', e.target.value)} placeholder="https://..." />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] cursor-pointer">
          <input type="checkbox" checked={form.published ?? false} onChange={e => f('published', e.target.checked)} className="w-4 h-4 rounded" />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] cursor-pointer">
          <input type="checkbox" checked={form.visible ?? true} onChange={e => f('visible', e.target.checked)} className="w-4 h-4 rounded" />
          Visible
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
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Blog Posts</h1>
          <p className="text-xs text-[color:var(--text-faint)] mt-0.5">{items.length} total · {items.filter(i => i.published).length} published</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm py-2 px-4 gap-1.5"><Plus size={14} /> New Post</button>
      </div>

      <AdminSplitPanel formOpen={formOpen} formTitle={form.id ? 'Edit Post' : 'New Post'} onClose={closeForm} form={FormContent}>
        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin" /></div>
        ) : (
          <div className="glass rounded-xl overflow-hidden">
            {items.length === 0 ? <p className="p-8 text-center text-[color:var(--text-faint)] text-sm">No posts yet.</p> : (
              <div className="divide-y divide-white/[0.04]">
                {items.map(b => (
                  <div key={b.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${b.visible ? 'text-[color:var(--text)]' : 'text-[color:var(--text-faint)] line-through'}`}>{b.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${b.published ? 'text-emerald-400 bg-emerald-500/10' : 'text-[color:var(--text-faint)] bg-white/5'}`}>
                          {b.published ? 'published' : 'draft'}
                        </span>
                        <span className="text-xs text-[color:var(--text-faint)] font-mono">{b.read_time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => togglePublished(b)} title={b.published ? 'Unpublish' : 'Publish'} className={`p-1.5 ${b.published ? 'text-emerald-400' : 'text-[color:var(--text-faint)]'}`}>{b.published ? <Eye size={13} /> : <EyeOff size={13} />}</button>
                      <button onClick={() => toggleVisible(b)} className={`p-1.5 ${b.visible ? 'text-sky-400' : 'text-[color:var(--text-faint)]'}`} title="Toggle visibility">{b.visible ? <Eye size={13} /> : <EyeOff size={13} />}</button>
                      <button onClick={() => openEdit(b)} className="p-1.5 text-[color:var(--text-faint)] hover:text-[color:var(--text)]"><Pencil size={13} /></button>
                      <button onClick={() => del(b.id)} className="p-1.5 text-[color:var(--text-faint)] hover:text-red-400"><Trash2 size={13} /></button>
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

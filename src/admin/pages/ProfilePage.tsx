import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../lib/types'
import { useData } from '../../context/DataContext'

export default function ProfilePage() {
  const { refetch } = useData()
  const [form, setForm] = useState<Partial<Profile>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => {
      if (data) setForm(data)
      setLoading(false)
    })
  }, [])

  const f = (k: keyof Profile, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    const { error } = form.id
      ? await supabase.from('profile').update(form).eq('id', form.id)
      : await supabase.from('profile').insert([form])
    if (error) toast.error(error.message)
    else { toast.success('Profile saved!'); refetch() }
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-[color:var(--text)]">Profile</h1>

      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="admin-label">Full Name</label><input className="admin-input" value={form.name ?? ''} onChange={e => f('name', e.target.value)} /></div>
          <div><label className="admin-label">Title / Role</label><input className="admin-input" value={form.title ?? ''} onChange={e => f('title', e.target.value)} /></div>
        </div>
        <div>
          <label className="admin-label">Tagline</label>
          <input className="admin-input" value={form.tagline ?? ''} onChange={e => f('tagline', e.target.value)} placeholder="One-liner that appears in hero" />
        </div>
        <div>
          <label className="admin-label">Bio</label>
          <textarea rows={5} className="admin-input resize-none" value={form.bio ?? ''} onChange={e => f('bio', e.target.value)} placeholder="Full bio that appears in About section" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="admin-label">Email</label><input type="email" className="admin-input" value={form.email ?? ''} onChange={e => f('email', e.target.value)} /></div>
          <div><label className="admin-label">Location</label><input className="admin-input" value={form.location ?? ''} onChange={e => f('location', e.target.value)} /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className="admin-label">Years of Experience</label><input type="number" className="admin-input" value={form.years_experience ?? 0} onChange={e => f('years_experience', Number(e.target.value))} /></div>
          <div><label className="admin-label">Projects Count</label><input type="number" className="admin-input" value={form.projects_count ?? 0} onChange={e => f('projects_count', Number(e.target.value))} /></div>
          <div><label className="admin-label">Clients Count</label><input type="number" className="admin-input" value={form.clients_count ?? 0} onChange={e => f('clients_count', Number(e.target.value))} /></div>
        </div>

        <div className="pt-2 border-t border-[color:var(--border)]">
          <p className="text-xs font-semibold text-[color:var(--text-muted)] mb-3 uppercase tracking-wide">Social Links</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="admin-label">GitHub URL</label><input className="admin-input" value={form.github_url ?? ''} onChange={e => f('github_url', e.target.value)} placeholder="https://github.com/..." /></div>
            <div><label className="admin-label">LinkedIn URL</label><input className="admin-input" value={form.linkedin_url ?? ''} onChange={e => f('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
            <div><label className="admin-label">Twitter / X URL</label><input className="admin-input" value={form.twitter_url ?? ''} onChange={e => f('twitter_url', e.target.value)} placeholder="https://x.com/..." /></div>
            <div><label className="admin-label">Resume URL</label><input className="admin-input" value={form.resume_url ?? ''} onChange={e => f('resume_url', e.target.value)} placeholder="https://..." /></div>
          </div>
        </div>

        <div className="pt-2 border-t border-[color:var(--border)]">
          <label className="admin-label">Profile Photo URL</label>
          <input className="admin-input" value={form.avatar_url ?? ''} onChange={e => f('avatar_url', e.target.value)} placeholder="https://..." />
          {form.avatar_url && (
            <img src={form.avatar_url} alt="" className="mt-2 w-16 h-16 rounded-full object-cover border border-[color:var(--border)]"
                 onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          )}
        </div>

        <button onClick={save} disabled={saving} className="btn-primary w-full gap-2 py-3 disabled:opacity-50">
          <Save size={15} />{saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}

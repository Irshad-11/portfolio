import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { pruneUnused } from '../../lib/storage'
import { supabase } from '../../lib/supabase'
import { useData } from '../../context/DataContext'
import { buildConfig } from '../../lib/defaults'
import type { AboutConfig, HeroConfig, LinkItem, Profile, RibbonConfig, SectionsConfig, SiteSettings } from '../../lib/types'

const BLANK: Partial<Profile> = {
  name: 'Irshad Hossain', title: 'Software Engineering Student', tagline: '', bio: '', email: '', location: 'Mymensingh, Bangladesh',
  years_experience: 4, projects_count: 20, clients_count: 15,
}

/** Loads the single profile row and exposes typed setters for each JSON config block. */
export function useProfileEditor() {
  const { refetch } = useData()
  const [draft, setDraft] = useState<Profile | null>(null)
  const [initial, setInitial] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('profile').select('*').limit(1).maybeSingle()
    if (error) toast.error(error.message)
    const row = (data ?? { ...BLANK, id: 'draft' }) as Profile
    setDraft(row); setInitial(JSON.stringify(row)); setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const cfg = useMemo(() => buildConfig(draft), [draft])
  const dirty = !!draft && JSON.stringify(draft) !== initial

  const set = (p: Partial<Profile>) => setDraft(d => ({ ...(d as Profile), ...p }))
  const setHero = (p: Partial<HeroConfig>) => set({ hero: { ...cfg.hero, ...p } })
  const setAbout = (p: Partial<AboutConfig>) => set({ about: { ...cfg.about, ...p } })
  const setSite = (p: Partial<SiteSettings>) => set({ site: { ...cfg.site, ...p } })
  const setRibbon = (p: Partial<RibbonConfig>) => set({ ribbon: { ...cfg.ribbon, ...p } })
  const setSections = (p: Partial<SectionsConfig>) => set({ sections: { ...cfg.sections, ...p } })
  const setLinks = (links: LinkItem[]) => set({ links })

  const save = async () => {
    if (!draft) return
    setSaving(true)
    // persist fully-merged config blocks so defaults become explicit, editable data
    const { id, updated_at, ...rest } = draft
    void updated_at
    const payload = { ...rest, hero: cfg.hero, about: cfg.about, site: cfg.site, ribbon: cfg.ribbon, sections: cfg.sections, links: cfg.links, updated_at: new Date().toISOString() }
    const res = id && id !== 'draft'
      ? await supabase.from('profile').update(payload).eq('id', id).select().single()
      : await supabase.from('profile').insert([payload]).select().single()
    setSaving(false)
    if (res.error) return toast.error(res.error.message)
    toast.success('Saved')
    void pruneUnused(initial)
    setDraft(res.data as Profile); setInitial(JSON.stringify(res.data))
    refetch()
  }

  return { draft, cfg, loading, saving, dirty, set, setHero, setAbout, setSite, setRibbon, setSections, setLinks, save }
}
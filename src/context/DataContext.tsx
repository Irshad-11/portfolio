import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { PortfolioData, RawPortfolio } from '../lib/types'
import { buildData, EMPTY_RAW } from '../lib/defaults'

export interface DataContextValue extends PortfolioData {
  unreadMessages: number
  loading: boolean
  refetch: () => void
}

const CACHE_KEY = 'portfolio_cache_v3'

const empty = buildData(EMPTY_RAW)

export const DataContext = createContext<DataContextValue>({
  ...empty, unreadMessages: 0, loading: true, refetch: () => {},
})

function readCache(): RawPortfolio | null {
  try {
    const s = localStorage.getItem(CACHE_KEY)
    return s ? (JSON.parse(s) as RawPortfolio) : null
  } catch { return null }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const cached = useMemo(readCache, [])
  const [raw, setRaw] = useState<RawPortfolio>(cached ?? EMPTY_RAW)
  const [unreadMessages, setUnread] = useState(0)
  const [loading, setLoading] = useState(!cached)

  const fetchData = useCallback(async () => {
    const q = (t: string, order = 'sort_order') => supabase.from(t).select('*').order(order)
    const [profile, skills, expertise, certs, ach, projects, exp, blog, tests] = await Promise.all([
      supabase.from('profile').select('*').limit(1).maybeSingle(),
      q('skills'), q('expertise'), q('certifications'), q('achievements'),
      q('projects'), q('experience'), q('blog_posts', 'created_at'), q('testimonials'),
    ])
    const next: RawPortfolio = {
      profile: profile.data ?? null,
      skills: skills.data ?? [],
      expertise: expertise.data ?? [],
      certifications: certs.data ?? [],
      achievements: ach.data ?? [],
      projects: projects.data ?? [],
      experience: exp.data ?? [],
      blogPosts: blog.data ?? [],
      testimonials: tests.data ?? [],
    }
    setRaw(next)
    setLoading(false)
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(next)) } catch { /* quota */ }

    // Admin-only: unread messages (never blocks the public site)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('read', false)
        .then(({ count }) => setUnread(count ?? 0))
    })
  }, [])

  useEffect(() => {
    fetchData()
    const channel = supabase
      .channel('contact-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, () => setUnread(p => p + 1))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchData])

  const value = useMemo<DataContextValue>(
    () => ({ ...buildData(raw), unreadMessages, loading, refetch: fetchData }),
    [raw, unreadMessages, loading, fetchData],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
export const useConfig = () => useContext(DataContext).config
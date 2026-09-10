import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile, Skill, Certification, Achievement, Project, Experience, BlogPost, Testimonial } from '../lib/types'

interface DataContextValue {
  profile: Profile | null
  skills: Skill[]
  certifications: Certification[]
  achievements: Achievement[]
  projects: Project[]
  experience: Experience[]
  blogPosts: BlogPost[]
  testimonials: Testimonial[]
  unreadMessages: number
  loading: boolean
  refetch: () => void
}

const DataContext = createContext<DataContextValue>({
  profile: null,
  skills: [],
  certifications: [],
  achievements: [],
  projects: [],
  experience: [],
  blogPosts: [],
  testimonials: [],
  unreadMessages: 0,
  loading: true,
  refetch: () => {},
})

export function DataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    // Fetch all public portfolio data first
    const [
      profileRes, skillsRes, certsRes, achievementsRes,
      projectsRes, expRes, blogRes, testimonialsRes
    ] = await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('certifications').select('*').order('sort_order'),
      supabase.from('achievements').select('*').order('sort_order'),
      supabase.from('projects').select('*').order('sort_order'),
      supabase.from('experience').select('*').order('sort_order'),
      supabase.from('blog_posts').select('*').order('sort_order'),
      supabase.from('testimonials').select('*').order('sort_order'),
    ])

    if (profileRes.data) setProfile(profileRes.data)
    if (skillsRes.data) setSkills(skillsRes.data)
    if (certsRes.data) setCertifications(certsRes.data)
    if (achievementsRes.data) setAchievements(achievementsRes.data)
    if (projectsRes.data) setProjects(projectsRes.data)
    if (expRes.data) setExperience(expRes.data)
    if (blogRes.data) setBlogPosts(blogRes.data)
    if (testimonialsRes.data) setTestimonials(testimonialsRes.data)
    setLoading(false) // ✅ Unblock UI before attempting admin-only message count

    // Message count only works for authenticated admins — fetch separately so
    // a 403 here never blocks the public portfolio from loading
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      supabase
        .from('contact_messages')
        .select('id', { count: 'exact' })
        .eq('read', false)
        .then(({ count }) => setUnreadMessages(count ?? 0))
    })
  }

  useEffect(() => {
    fetchData()

    // Real-time subscription for new messages
    const channel = supabase
      .channel('contact-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, () => {
        setUnreadMessages(prev => prev + 1)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <DataContext.Provider value={{
      profile, skills, certifications, achievements, projects,
      experience, blogPosts, testimonials, unreadMessages, loading,
      refetch: fetchData,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)

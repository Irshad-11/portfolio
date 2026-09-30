import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { trackPageVisit } from '../lib/analytics'
import SiteShell from '../components/SiteShell'
import Ribbon from '../components/Ribbon'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Certifications from '../sections/Certifications'
import Achievements from '../sections/Achievements'
import Projects from '../sections/Projects'
import Experience from '../sections/Experience'
import Blog from '../sections/Blog'
import Testimonials from '../sections/Testimonials'
import Contact from '../sections/Contact'
import type { SectionKey } from '../lib/types'

const MAP: Record<SectionKey, () => JSX.Element | null> = {
  about: About, skills: Skills, certifications: Certifications, achievements: Achievements,
  projects: Projects, experience: Experience, blog: Blog, testimonials: Testimonials, contact: Contact,
}

/** Document title + description from profile / SEO settings. */
export function useSeo() {
  const { profile, config } = useData()
  useEffect(() => {
    if (!profile) return
    document.title = config.site.seo_title || `${profile.name} — ${profile.title}`
    const desc = config.site.seo_description || profile.tagline
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m) }
    if (desc) m.setAttribute('content', desc)
  }, [profile, config.site.seo_title, config.site.seo_description])
}

/** The full portfolio page body (also used by the admin live preview). */
export function HomeBody() {
  const { sections, config } = useData()
  const rb = config.ribbon
  return (
    <>
      <Hero />
      {rb.enabled && (rb.position === 'after_hero' || rb.position === 'both') && <Ribbon cfg={rb} />}
      {sections.map(s => {
        const C = MAP[s.key]
        return <C key={s.key} />
      })}
    </>
  )
}

export default function Home() {
  const { loading, profile } = useData()
  const { hash } = useLocation()
  useSeo()

  useEffect(() => { trackPageVisit() }, [])

  useEffect(() => {
    if (loading && !profile) return
    if (!hash) return
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 120)
    return () => clearTimeout(t)
  }, [hash, loading, profile])

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="mono text-faint flex items-center gap-3"><span className="pill-dot tone-open" />Loading</p>
      </div>
    )
  }

  return <SiteShell><HomeBody /></SiteShell>
}
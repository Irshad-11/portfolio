import { useEffect, useMemo, useState } from 'react'
import { DataContext, DataContextValue, useData } from '../context/DataContext'
import { ThemeProvider } from '../context/ThemeContext'
import { buildData } from '../lib/defaults'
import { PREVIEW_READY, PreviewMessage } from '../lib/preview'
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
import { HomeBody } from './Home'
import { ProjectView } from './ProjectDetail'
import { PostView } from './BlogDetail'
import { CertificateView } from './CertificationDetail'
import { AchievementView } from './AchievementDetail'

function Body({ view, focus }: { view: PreviewMessage['view']; focus?: string }) {
  const d = useData()
  const rb = d.config.ribbon
  const match = <T extends { id: string; slug?: string }>(list: T[]) => list.find(x => x.id === focus || x.slug === focus)

  const detail = () => {
    if (view === 'project') { const p = match(d.projects); return p ? <ProjectView project={p} all={d.projects} /> : null }
    if (view === 'post') { const p = match(d.blogPosts); return p ? <PostView post={p} all={d.blogPosts} /> : null }
    if (view === 'certificate') { const p = match(d.certifications); return p ? <CertificateView cert={p} all={d.certifications} /> : null }
    if (view === 'achievement') { const p = match(d.achievements); return p ? <AchievementView item={p} all={d.achievements} /> : null }
    return undefined
  }
  const det = detail()
  if (det !== undefined) return <SiteShell>{det ?? <p className="container-x page-top mono text-faint">Nothing to preview yet.</p>}</SiteShell>

  const one: Record<string, JSX.Element> = {
    about: <About />, skills: <Skills />, certifications: <Certifications />, achievements: <Achievements />,
    projects: <Projects />, experience: <Experience />, blog: <Blog />, testimonials: <Testimonials />, contact: <Contact />,
  }
  if (view === 'home') return <SiteShell><HomeBody /></SiteShell>
  if (view === 'hero' || view === 'ribbon') {
    return <SiteShell><Hero />{rb.enabled && (rb.position === 'after_hero' || rb.position === 'both') && <Ribbon cfg={rb} />}</SiteShell>
  }
  const el = one[view]
  return <SiteShell><div className="pt-10">{el}</div></SiteShell>
}

/** Rendered inside the admin panel's live-preview iframe. Receives draft data via postMessage. */
export default function PreviewPage() {
  const [msg, setMsg] = useState<PreviewMessage | null>(null)

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      const d = e.data as PreviewMessage
      if (d?.source === 'irshad-admin' && d.type === 'data') setMsg(d)
    }
    window.addEventListener('message', on)
    window.parent.postMessage(PREVIEW_READY, window.location.origin)

    // Nothing in the preview may navigate or submit for real
    const block = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('a')) e.preventDefault() }
    const stop = (e: Event) => { e.preventDefault(); e.stopPropagation() }
    document.addEventListener('click', block, true)
    document.addEventListener('submit', stop, true)
    return () => {
      window.removeEventListener('message', on)
      document.removeEventListener('click', block, true)
      document.removeEventListener('submit', stop, true)
    }
  }, [])

  const value = useMemo<DataContextValue | null>(
    () => (msg ? { ...buildData(msg.payload), unreadMessages: 0, loading: false, refetch: () => {} } : null),
    [msg],
  )

  if (!msg || !value) {
    return <div className="min-h-screen flex items-center justify-center"><p className="mono text-faint">Waiting for preview…</p></div>
  }
  return (
    <DataContext.Provider value={value}>
      <ThemeProvider forcedMode={msg.mode}>
        <Body view={msg.view} focus={msg.focus} />
      </ThemeProvider>
    </DataContext.Provider>
  )
}
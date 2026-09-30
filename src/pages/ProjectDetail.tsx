import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import SiteShell from '../components/SiteShell'
import RichContent from '../components/RichContent'
import Lightbox from '../components/Lightbox'
import { Crumbs, MetaGrid, NotFound, PrevNext } from '../components/DetailBits'
import { ProjectImage, ProjectLinks, StatusBadge } from '../sections/Projects'
import type { Project } from '../lib/types'
import { useEffect } from 'react'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { projects, loading } = useData()
  const p = projects.find(x => x.slug === slug)
  useEffect(() => { if (p) document.title = `${p.title} — Project` }, [p])
  return (
    <SiteShell>
      {p ? <ProjectView project={p} all={projects} /> : loading ? null : <NotFound what="Project" back="All projects" to="/projects" />}
    </SiteShell>
  )
}

export function ProjectView({ project: p, all }: { project: Project; all: Project[] }) {
  const [lb, setLb] = useState<number | null>(null)
  const i = all.findIndex(x => x.id === p.id)
  const prev = i > 0 ? all[i - 1] : null
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null
  const gallery = p.images || []

  return (
    <article className="container-x page-top pb-24">
      <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }, { label: p.title }]} />

      <header className="grid md:grid-cols-12 gap-x-10 gap-y-6 mb-12">
        <div className="md:col-span-9">
          <div className="flex items-center gap-3 mb-5"><StatusBadge status={p.status} />{p.featured && <span className="tag-flag">Featured</span>}</div>
          <h1 className="font-display font-semibold leading-tight text-ink text-2xl sm:text-4xl break-words">{p.title}</h1>
        </div>
        {p.description && <p className="md:col-span-8 text-xl text-muted leading-relaxed">{p.description}</p>}
      </header>

      <div className="marks border border-line overflow-hidden bg-soft mb-8">
        <button type="button" className="block w-full aspect-[16/9] cursor-zoom-in" onClick={() => p.image_url && setLb(-1)} aria-label="Enlarge image"><ProjectImage p={p} /></button>
      </div>

      <MetaGrid items={[
        { label: 'Date', value: p.project_date },
        { label: 'Status', value: p.status === 'live' ? 'Live' : p.status === 'wip' ? 'In progress' : 'Coming soon' },
        { label: 'Stack', value: p.tech_stack?.length ? p.tech_stack.join(', ') : '' },
        { label: 'Links', value: (p.live_url || p.github_url || p.npm_url) ? <ProjectLinks p={p} detail={false} /> : '' },
      ]} />

      {p.long_description && (
        <div className="grid lg:grid-cols-12 gap-10 mt-16">
          <div className="lg:col-span-8"><RichContent html={p.long_description} className="prose-lg" /></div>
          {p.tech_stack?.length > 0 && (
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 border border-line p-6" style={{ background: 'var(--bg)' }}>
                <p className="label mb-4">Built with</p>
                <div className="flex flex-wrap gap-2">{p.tech_stack.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            </aside>
          )}
        </div>
      )}

      {gallery.length > 0 && (
        <div className="mt-16">
          <p className="label mb-4">Gallery</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {gallery.map((g, k) => (
              <button key={g + k} type="button" onClick={() => setLb(k)} className="border border-line overflow-hidden bg-soft aspect-[16/10] cursor-zoom-in group">
                <img src={g} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </button>
            ))}
          </div>
        </div>
      )}

      <PrevNext
        prev={prev && { to: `/projects/${prev.slug}`, title: prev.title, label: 'Previous project' }}
        next={next && { to: `/projects/${next.slug}`, title: next.title, label: 'Next project' }}
      />
      <Lightbox images={lb === -1 ? [p.image_url || ''] : gallery} index={lb === -1 ? 0 : lb} onClose={() => setLb(null)} onIndex={setLb} />
    </article>
  )
}
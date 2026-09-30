import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import { SectionShell, pad, useHoverPreview } from '../components/ui'
import type { Project } from '../lib/types'

export const STATUS_LABEL: Record<string, string> = { live: 'Live', wip: 'In progress', coming_soon: 'Coming soon' }

export function StatusBadge({ status }: { status: string }) {
  const cls = status === 'live' ? 'badge-live' : status === 'wip' ? 'badge-wip' : 'badge-coming-soon'
  return <span className={cls}>{status === 'live' && <span className="pill-dot !w-1.5 !h-1.5" />}{STATUS_LABEL[status] || status}</span>
}

export function ProjectLinks({ p, detail = true }: { p: Project; detail?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mono">
      {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="link-arrow u-link">Live <ArrowUpRight size={14} /></a>}
      {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="link-arrow u-link">Source <ArrowUpRight size={14} /></a>}
      {p.npm_url && <a href={p.npm_url} target="_blank" rel="noopener noreferrer" className="link-arrow u-link">npm <ArrowUpRight size={14} /></a>}
      {detail && <Link to={`/projects/${p.slug}`} className="link-arrow !text-[color:var(--accent)]">Case study <ArrowRight size={14} /></Link>}
    </div>
  )
}

export function ProjectImage({ p, className = '' }: { p: Project; className?: string }) {
  return p.image_url
    ? <img src={p.image_url} alt={p.title} loading="lazy" decoding="async" className={`w-full h-full object-cover ${className}`} />
    : <div className={`placeholder-x w-full h-full flex items-center justify-center font-display font-semibold text-5xl text-faint ${className}`}>{p.title.slice(0, 2).toUpperCase()}</div>
}

function Feature({ p, n, flip }: { p: Project; n: number; flip: boolean }) {
  return (
    <article className="reveal grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
      <Link to={`/projects/${p.slug}`} className={`lg:col-span-7 block relative marks border border-line overflow-hidden group ${flip ? 'lg:order-2' : ''}`} aria-label={p.title}>
        <div className="corner-ribbon"><span>Featured</span></div>
        <div className="aspect-[16/10] overflow-hidden bg-soft">
          <ProjectImage p={p} className="transition-transform duration-700 group-hover:scale-[1.035]" />
        </div>
      </Link>
      <div className="lg:col-span-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="mono text-[color:var(--accent)]">No. {pad(n)}</span>
          {p.project_date && <span className="mono text-faint">/ {p.project_date}</span>}
          <StatusBadge status={p.status} />
        </div>
        <h3 className="font-display font-semibold leading-tight text-ink text-lg sm:text-2xl">
          <Link to={`/projects/${p.slug}`} className="u-link">{p.title}</Link>
        </h3>
        {p.description && <p className="mt-5 text-muted leading-relaxed">{p.description}</p>}
        {p.tech_stack?.length > 0 && (
          <p className="mt-5 mono !normal-case text-faint leading-loose">
            {p.tech_stack.map((t, i) => <span key={t}>{i > 0 && <span className="mx-2 text-[color:var(--accent)]">/</span>}<span className="text-muted">{t}</span></span>)}
          </p>
        )}
        <div className="mt-7"><ProjectLinks p={p} /></div>
      </div>
    </article>
  )
}

export default function Projects() {
  const { projects, sections } = useData()
  const sec = sections.find(s => s.key === 'projects')
  const hp = useHoverPreview()
  if (!sec) return null
  const featured = projects.filter(p => p.featured)
  const rest = projects.filter(p => !p.featured)
  const table = rest.slice(0, 7)

  return (
    <SectionShell id="projects" index={sec.index} title={sec.title} subtitle={sec.subtitle} aside={`${projects.length} projects`}>
      {hp.layer}
      {featured.length > 0 && (
        <div className="space-y-12 md:space-y-16">
          {featured.map((p, i) => <Feature key={p.id} p={p} n={i + 1} flip={i % 2 === 1} />)}
        </div>
      )}

      {table.length > 0 && (
        <div className={`reveal ${featured.length ? 'mt-14 md:mt-20' : ''}`}>
          <div className="flex items-center gap-4 mb-3">
            <p className="label">{featured.length ? 'More work' : 'Index'}</p><span className="rule flex-1" />
          </div>
          <div className="hidden md:grid grid-cols-[6rem_1.3fr_1.5fr_7.5rem_2rem] gap-6 px-3 py-3 label border-b border-line">
            <span>Date</span><span>Project</span><span>Stack</span><span>Status</span><span />
          </div>
          <ul className="divide-y divide-[color:var(--border)]">
            {table.map(p => (
              <li key={p.id}>
                <Link to={`/projects/${p.slug}`} onMouseEnter={() => hp.show(p.image_url)} onMouseLeave={hp.hide} onFocus={() => hp.show(p.image_url)} onBlur={hp.hide}
                  className="group grid grid-cols-[1fr_auto] md:grid-cols-[6rem_1.3fr_1.5fr_7.5rem_2rem] items-center gap-x-6 gap-y-2 px-3 py-5 transition-colors hover:bg-[color:var(--accent-subtle)]">
                  <span className="hidden md:block mono text-faint tabular">{p.project_date || '—'}</span>
                  <span className="min-w-0">
                    <span className="block font-display font-semibold text-ink text-xl group-hover:text-[color:var(--accent)] transition-colors">{p.title}</span>
                    {p.description && <span className="block text-sm text-muted line-clamp-1 mt-0.5">{p.description}</span>}
                  </span>
                  <span className="hidden md:block mono !normal-case text-faint truncate">{p.tech_stack?.join(' · ')}</span>
                  <span className="hidden md:block"><StatusBadge status={p.status} /></span>
                  <ArrowUpRight size={18} className="text-faint group-hover:text-[color:var(--accent)] justify-self-end transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="reveal mt-12">
        <Link to="/projects" className="btn btn-outline">All projects ({projects.length}) <ArrowRight size={15} /></Link>
      </div>
    </SectionShell>
  )
}
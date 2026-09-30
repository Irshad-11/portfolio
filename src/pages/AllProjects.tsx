import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useData } from '../context/DataContext'
import SiteShell from '../components/SiteShell'
import { Crumbs } from '../components/DetailBits'
import { Empty, pad } from '../components/ui'
import { ProjectImage, StatusBadge, ProjectLinks } from '../sections/Projects'
import { useSeo } from './Home'

export default function AllProjects() {
  useSeo()
  return <SiteShell><AllProjectsView /></SiteShell>
}

export function AllProjectsView() {
  const { projects } = useData()
  const [q, setQ] = useState('')
  const [tech, setTech] = useState('')
  const [status, setStatus] = useState('')

  const techs = useMemo(() => {
    const c = new Map<string, number>()
    projects.forEach(p => p.tech_stack?.forEach(t => c.set(t, (c.get(t) || 0) + 1)))
    return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).map(x => x[0])
  }, [projects])

  const list = projects.filter(p =>
    (!tech || p.tech_stack?.includes(tech)) &&
    (!status || p.status === status) &&
    (!q || `${p.title} ${p.description} ${p.tech_stack?.join(' ')}`.toLowerCase().includes(q.toLowerCase())),
  )

  return (
    <div className="container-x page-top pb-24">
      <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Projects' }]} />
      <div className="grid md:grid-cols-12 gap-6 mb-12">
        <h1 className="md:col-span-8 font-display font-semibold leading-tight text-ink text-2xl sm:text-4xl">All work<span className="text-[color:var(--accent)]">.</span></h1>
        <p className="md:col-span-4 self-end mono text-faint">{list.length} of {projects.length} projects</p>
      </div>

      <div className="flex flex-col gap-4 border-y border-line py-5 mb-12" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <span className="sr-only">Search projects</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects…" className="field !pl-11 !py-3" />
          </label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="field sm:!w-48 !py-3" aria-label="Status">
            <option value="">Any status</option><option value="live">Live</option><option value="wip">In progress</option><option value="coming_soon">Coming soon</option>
          </select>
        </div>
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setTech('')} className={`mono px-3 py-1.5 border transition-colors ${!tech ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--accent-ink)]' : 'border-line text-muted hover:text-ink'}`}>All</button>
            {techs.map(t => (
              <button key={t} onClick={() => setTech(tech === t ? '' : t)} className={`mono !normal-case px-3 py-1.5 border transition-colors ${tech === t ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--accent-ink)]' : 'border-line text-muted hover:text-ink'}`}>{t}</button>
            ))}
          </div>
        )}
      </div>

      {list.length === 0 ? <Empty>No projects match.</Empty> : (
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-14">
          {list.map((p, i) => (
            <article key={p.id} className="group">
              <Link to={`/projects/${p.slug}`} className="block relative border border-line overflow-hidden marks bg-soft" aria-label={p.title}>
                {p.featured && <div className="corner-ribbon"><span>Featured</span></div>}
                <div className="aspect-[16/10] overflow-hidden"><ProjectImage p={p} className="transition-transform duration-700 group-hover:scale-[1.04]" /></div>
              </Link>
              <div className="pt-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="mono text-[color:var(--accent)]">{pad(i + 1)}</span>
                  {p.project_date && <span className="mono text-faint">{p.project_date}</span>}
                  <span className="ml-auto"><StatusBadge status={p.status} /></span>
                </div>
                <h2 className="font-display font-semibold text-ink text-lg sm:text-2xl leading-snug"><Link to={`/projects/${p.slug}`} className="u-link">{p.title}</Link></h2>
                {p.description && <p className="mt-3 text-muted line-clamp-3">{p.description}</p>}
                {p.tech_stack?.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{p.tech_stack.slice(0, 6).map(t => <span key={t} className="tag">{t}</span>)}</div>}
                <div className="mt-5"><ProjectLinks p={p} /></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, Clock, Zap } from 'lucide-react'
import { useData } from '../context/DataContext'
import type { Project } from '../lib/types'

type Filter = 'all' | 'live' | 'wip' | 'coming_soon'

function StatusBadge({ status }: { status: Project['status'] }) {
  if (status === 'live') return <span className="badge-live"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"/>Live</span>
  if (status === 'wip') return <span className="badge-wip"><Zap size={10}/>In Progress</span>
  return <span className="badge-coming-soon"><Clock size={10}/>Coming Soon</span>
}

export default function AllProjects() {
  const { projects } = useData()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors mb-8">
          <ArrowLeft size={15} /> Back
        </button>

        <h1 className="text-4xl font-black text-[color:var(--text)] mb-2">All Projects</h1>
        <p className="text-[color:var(--text-muted)] mb-8">{projects.length} projects total</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {(['all', 'live', 'wip', 'coming_soon'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                filter === f
                  ? 'accent-bg text-white'
                  : 'glass text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
              }`}
            >
              {f === 'all' ? 'All' : f === 'coming_soon' ? 'Coming Soon' : f === 'wip' ? 'In Progress' : 'Live'}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => p.status !== 'coming_soon' && navigate(`/projects/${p.slug}`)}
              className={`glass rounded-xl overflow-hidden flex flex-col transition-all duration-300 ${
                p.status === 'coming_soon'
                  ? 'opacity-50 cursor-default'
                  : 'glass-hover cursor-pointer hover:-translate-y-1'
              }`}
            >
              <div className="aspect-video bg-[color:var(--accent-subtle)] relative overflow-hidden">
                {p.image_url
                  ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl font-black accent opacity-20">{p.title[0]}</div>
                }
                <div className="absolute top-2 left-2"><StatusBadge status={p.status} /></div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-[color:var(--text)] text-sm leading-snug">{p.title}</h3>
                <p className="text-xs text-[color:var(--text-muted)] mt-1.5 line-clamp-2 flex-1">{p.description}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {p.tech_stack.slice(0, 3).map(t => (
                    <span key={t} className="tech-badge text-[10px] py-0.5">{t}</span>
                  ))}
                </div>

                {p.status !== 'coming_soon' && (
                  <div className="mt-3 pt-3 border-t border-[color:var(--border)] flex gap-3" onClick={e => e.stopPropagation()}>
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                         className="text-xs text-[color:var(--text-faint)] hover:text-[color:var(--accent)] flex items-center gap-1">
                        <Github size={12}/> Code
                      </a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                         className="text-xs text-[color:var(--text-faint)] hover:text-[color:var(--accent)] flex items-center gap-1">
                        <ExternalLink size={12}/> Live
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[color:var(--text-faint)] py-20">No projects found.</p>
        )}
      </div>
    </div>
  )
}

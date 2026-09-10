import { useNavigate } from 'react-router-dom'
import { ExternalLink, Github, Clock, ArrowRight, Zap } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import SectionHeading from '../components/SectionHeading'
import type { Project } from '../lib/types'

const PREVIEW_COUNT = 4

function StatusBadge({ status }: { status: Project['status'] }) {
  if (status === 'live') return (
    <span className="badge-live"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />Live</span>
  )
  if (status === 'wip') return <span className="badge-wip"><Zap size={10} />In Progress</span>
  return <span className="badge-coming-soon"><Clock size={10} />Coming Soon</span>
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const isDisabled = project.status === 'coming_soon'

  return (
    <div
      onClick={onClick}
      className={`glass rounded-xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer group ${
        isDisabled
          ? 'opacity-50 cursor-default'
          : 'glass-hover hover:-translate-y-1'
      }`}
    >
      {/* Image */}
      <div className="aspect-video bg-gradient-to-br from-[color:var(--accent-subtle)] to-transparent relative overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-black text-[color:var(--accent)] opacity-20">
              {project.title[0]}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={project.status} />
        </div>
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full accent-bg text-white">Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[color:var(--text)] group-hover:text-[color:var(--accent)] transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-xs text-[color:var(--text-muted)] mt-2 leading-relaxed line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 3).map(t => (
            <span key={t} className="tech-badge text-[10px] py-0.5">{t}</span>
          ))}
          {project.tech_stack.length > 3 && (
            <span className="tech-badge text-[10px] py-0.5">+{project.tech_stack.length - 3}</span>
          )}
        </div>

        {/* Links row */}
        {!isDisabled && (
          <div className="mt-4 flex items-center gap-3 border-t border-[color:var(--border)] pt-3" onClick={e => e.stopPropagation()}>
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 text-xs text-[color:var(--text-faint)] hover:text-[color:var(--accent)] transition-colors">
                <Github size={13} /> Code
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 text-xs text-[color:var(--text-faint)] hover:text-[color:var(--accent)] transition-colors">
                <ExternalLink size={13} /> Live
              </a>
            )}
            <span className="ml-auto text-xs text-[color:var(--text-faint)] group-hover:text-[color:var(--accent)] transition-colors">
              Details →
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const { projects, loading } = useData()
  const ref = useScrollReveal('projects')
  const navigate = useNavigate()

  if (!loading && projects.length === 0) return null

  const preview = projects.slice(0, PREVIEW_COUNT)
  const hasMore = projects.length > PREVIEW_COUNT

  return (
    <section id="projects" ref={ref as React.RefObject<HTMLElement>} className="section-base">
      <div className="max-w-6xl mx-auto">
        <div className="reveal flex items-end justify-between mb-12">
          <SectionHeading title="Projects" subtitle="A selection of things I've built" align="left" />
          {hasMore && (
            <button
              onClick={() => navigate('/projects')}
              className="hidden sm:flex items-center gap-1.5 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors mb-4"
            >
              See all {projects.length} <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Grid: 2 col mobile, 4 col desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {preview.map((p, i) => (
            <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <ProjectCard
                project={p}
                onClick={() => p.status !== 'coming_soon' && navigate(`/projects/${p.slug}`)}
              />
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="reveal mt-8 text-center sm:hidden">
            <button onClick={() => navigate('/projects')} className="btn-outline gap-2">
              See all {projects.length} projects <ArrowRight size={14} />
            </button>
          </div>
        )}
        {hasMore && (
          <div className="reveal mt-8 text-center hidden sm:block">
            <button onClick={() => navigate('/projects')} className="btn-outline gap-2">
              View all {projects.length} projects <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

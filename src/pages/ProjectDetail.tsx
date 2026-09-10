import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, Package, Clock, Zap, CheckCircle } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { projects } = useData()
  const navigate = useNavigate()

  const project = projects.find(p => p.slug === slug)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[color:var(--text-faint)] mb-4">Project not found</p>
          <button onClick={() => navigate('/projects')} className="btn-outline">
            View all projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors mb-8">
          <ArrowLeft size={15} /> Back to projects
        </button>

        {/* Hero image */}
        {project.image_url && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 border border-[color:var(--border)]">
            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {project.status === 'live' && <span className="badge-live"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"/>Live</span>}
              {project.status === 'wip' && <span className="badge-wip"><Zap size={10}/>In Progress</span>}
              {project.status === 'coming_soon' && <span className="badge-coming-soon"><Clock size={10}/>Coming Soon</span>}
              {project.featured && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full accent-bg text-white">Featured</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[color:var(--text)] leading-tight">{project.title}</h1>
          </div>

          {/* Link buttons */}
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary gap-2 text-sm py-2.5 px-4">
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-outline gap-2 text-sm py-2.5 px-4">
                <Github size={14} /> Source
              </a>
            )}
            {project.npm_url && (
              <a href={project.npm_url} target="_blank" rel="noopener noreferrer" className="btn-outline gap-2 text-sm py-2.5 px-4">
                <Package size={14} /> npm
              </a>
            )}
          </div>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass rounded-xl p-6">
              <h2 className="text-sm font-semibold text-[color:var(--text-muted)] mb-3 uppercase tracking-wide">Overview</h2>
              <p className="text-[color:var(--text-muted)] leading-relaxed text-sm">
                {project.long_description ?? project.description}
              </p>
            </div>

            {/* Short description if both exist */}
            {project.long_description && project.description && project.long_description !== project.description && (
              <div className="glass rounded-xl p-6">
                <h2 className="text-sm font-semibold text-[color:var(--text-muted)] mb-3 uppercase tracking-wide">Summary</h2>
                <p className="text-[color:var(--text-muted)] text-sm leading-relaxed">{project.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Tech stack */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-xs font-semibold text-[color:var(--text-muted)] mb-3 uppercase tracking-wide">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map(t => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-xs font-semibold text-[color:var(--text-muted)] mb-3 uppercase tracking-wide">Links</h3>
              <div className="space-y-2">
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                    <CheckCircle size={13} className="accent" /> Live Site
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                    <Github size={13} className="accent" /> Source Code
                  </a>
                )}
                {project.npm_url && (
                  <a href={project.npm_url} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                    <Package size={13} className="accent" /> npm Package
                  </a>
                )}
                {!project.live_url && !project.github_url && !project.npm_url && (
                  <p className="text-xs text-[color:var(--text-faint)]">No links available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

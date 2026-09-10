import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, Cpu, Briefcase, FileText, Mail, Users, Eye, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useData } from '../../context/DataContext'

interface Stats {
  projects: number; skills: number; experience: number; blogs: number
  visitors: number; totalViews: number
}

export default function DashboardPage() {
  const { unreadMessages } = useData()
  const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, experience: 0, blogs: 0, visitors: 0, totalViews: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('skills').select('id', { count: 'exact', head: true }),
      supabase.from('experience').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('page_visits').select('visitor_id', { count: 'exact', head: true }),
      supabase.from('page_visits').select('id', { count: 'exact', head: true }),
    ]).then(([p, s, e, b, vis, views]) => {
      setStats({
        projects: p.count ?? 0, skills: s.count ?? 0,
        experience: e.count ?? 0, blogs: b.count ?? 0,
        visitors: vis.count ?? 0, totalViews: views.count ?? 0,
      })
      setLoading(false)
    })
  }, [])

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, to: '/admin/projects', color: 'text-blue-400' },
    { label: 'Skills', value: stats.skills, icon: Cpu, to: '/admin/skills', color: 'text-purple-400' },
    { label: 'Experience', value: stats.experience, icon: Briefcase, to: '/admin/experience', color: 'text-emerald-400' },
    { label: 'Blog Posts', value: stats.blogs, icon: FileText, to: '/admin/blog', color: 'text-amber-400' },
    { label: 'Unread Messages', value: unreadMessages, icon: Mail, to: '/admin/messages', color: 'text-red-400', highlight: unreadMessages > 0 },
    { label: 'Total Visitors', value: stats.totalViews, icon: Eye, to: '/admin/statistics', color: 'text-cyan-400' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[color:var(--text)]">Dashboard</h1>
        <p className="text-[color:var(--text-faint)] text-sm mt-1">Welcome back! Here's your portfolio overview.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, to, color, highlight }) => (
          <Link
            key={label}
            to={to}
            className={`glass glass-hover rounded-xl p-5 transition-all duration-200 ${
              highlight ? 'border-red-500/30 bg-red-500/5' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <Icon size={18} className={color} />
              {loading ? (
                <div className="w-8 h-6 bg-white/5 rounded animate-pulse" />
              ) : (
                <span className="text-2xl font-bold text-[color:var(--text)]">{value}</span>
              )}
            </div>
            <p className="text-xs text-[color:var(--text-muted)]">{label}</p>
          </Link>
        ))}
      </div>

      {/* Analytics summary teaser */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm text-[color:var(--text)]">Analytics Overview</h2>
          <Link to="/admin/statistics" className="text-xs accent hover:opacity-80 transition-opacity flex items-center gap-1">
            <TrendingUp size={12} /> Full Report →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="glass rounded-lg p-3">
            <p className="text-xs text-[color:var(--text-faint)] mb-1">Total Page Views</p>
            <p className="text-xl font-bold text-[color:var(--text)]">{loading ? '—' : stats.totalViews}</p>
          </div>
          <div className="glass rounded-lg p-3">
            <p className="text-xs text-[color:var(--text-faint)] mb-1">Unique Visitors</p>
            <p className="text-xl font-bold text-[color:var(--text)]">{loading ? '—' : stats.visitors}</p>
          </div>
          <div className="glass rounded-lg p-3">
            <p className="text-xs text-[color:var(--text-faint)] mb-1">New Messages</p>
            <p className={`text-xl font-bold ${unreadMessages > 0 ? 'text-red-400' : 'text-[color:var(--text)]'}`}>{unreadMessages}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass rounded-xl p-5">
        <h2 className="font-semibold text-sm text-[color:var(--text)] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '+ Add Project', to: '/admin/projects' },
            { label: '+ Add Blog Post', to: '/admin/blog' },
            { label: '+ Add Skill', to: '/admin/skills' },
            { label: 'View Messages', to: '/admin/messages' },
            { label: 'View Statistics', to: '/admin/statistics' },
          ].map(a => (
            <Link key={a.label} to={a.to} className="btn-outline text-xs py-2 px-4">{a.label}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}

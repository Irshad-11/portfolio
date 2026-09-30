import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, User, FolderKanban, Cpu, Award, Trophy, Briefcase, FileText, MessageSquare, Mail,
  BarChart2, LogOut, ExternalLink, Menu, X, Info, SlidersHorizontal, Brain,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useData } from '../context/DataContext'

const GROUPS = [
  { label: 'Overview', items: [{ to: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard }] },
  { label: 'Site', items: [
    { to: 'profile', label: 'Hero & identity', Icon: User },
    { to: 'about', label: 'About', Icon: Info },
    { to: 'site', label: 'Site & ribbon', Icon: SlidersHorizontal },
  ] },
  { label: 'Content', items: [
    { to: 'skills', label: 'Skills', Icon: Cpu },
    { to: 'expertise', label: 'Expertise', Icon: Brain },
    { to: 'projects', label: 'Projects', Icon: FolderKanban },
    { to: 'certifications', label: 'Certifications', Icon: Award },
    { to: 'achievements', label: 'Achievements', Icon: Trophy },
    { to: 'experience', label: 'Experience', Icon: Briefcase },
    { to: 'blog', label: 'Blog', Icon: FileText },
    { to: 'testimonials', label: 'Testimonials', Icon: MessageSquare },
  ] },
  { label: 'Inbox', items: [
    { to: 'messages', label: 'Messages', Icon: Mail, badge: true },
    { to: 'statistics', label: 'Statistics', Icon: BarChart2 },
  ] },
]

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { unreadMessages, profile } = useData()

  const logout = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out')
    navigate('/admin/login')
  }

  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  const brand = (profile?.name || 'Irshad').split(' ')[0]

  const Sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-4 border-b border-[color:var(--border)]">
        <p className="font-bold text-[color:var(--text)]">{brand}<span className="accent">.</span><span className="text-xs font-normal text-[color:var(--text-faint)] ml-2">Admin</span></p>
      </div>
      <nav className="flex-1 px-3 py-3 overflow-y-auto" aria-label="Admin">
        {GROUPS.map(g => (
          <div key={g.label} className="mb-4">
            <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text-faint)]">{g.label}</p>
            <div className="space-y-0.5">
              {g.items.map(({ to, label, Icon, ...rest }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'accent-bg font-medium' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-white/5'}`}>
                  <Icon size={16} className="flex-shrink-0" />{label}
                  {'badge' in rest && unreadMessages > 0 && (
                    <span className="ml-auto bg-[color:var(--accent)] text-[color:var(--accent-ink)] text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{unreadMessages > 9 ? '9+' : unreadMessages}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-[color:var(--border)] space-y-0.5">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-white/5"><ExternalLink size={16} />View portfolio</a>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[color:var(--text-muted)] hover:text-red-400 hover:bg-red-500/5"><LogOut size={16} />Sign out</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[color:var(--bg)] flex admin-root">
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-[color:var(--border)] h-screen overflow-hidden">{Sidebar}</aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[color:var(--bg)] border-b border-[color:var(--border)] px-4 flex items-center justify-between">
        <p className="font-bold text-[color:var(--text)]">{brand}<span className="accent">.</span> <span className="text-xs font-normal text-[color:var(--text-faint)]">Admin</span></p>
        <button onClick={() => setDrawerOpen(o => !o)} className="text-[color:var(--text-muted)] p-1" aria-label="Menu">{drawerOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-64 bg-[#0e0f10] border-r border-[color:var(--border)] h-full overflow-hidden">{Sidebar}</div>
        </div>
      )}

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 lg:h-screen lg:overflow-y-auto">
        <div className="p-4 sm:p-6 pb-24 lg:pb-6"><Outlet /></div>
      </main>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, User, FolderKanban, Cpu, Award, Trophy,
  Briefcase, FileText, MessageSquare, Mail, BarChart2,
  LogOut, ExternalLink, Menu, X, Palette
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useData } from '../context/DataContext'
import { useTheme, useAdminThemeEffect } from '../context/ThemeContext'
import { THEMES } from '../lib/types'

const NAV = [
  { to: 'dashboard',      label: 'Dashboard',      Icon: LayoutDashboard },
  { to: 'profile',        label: 'Profile',         Icon: User },
  { to: 'projects',       label: 'Projects',        Icon: FolderKanban },
  { to: 'skills',         label: 'Skills',          Icon: Cpu },
  { to: 'certifications', label: 'Certifications',  Icon: Award },
  { to: 'achievements',   label: 'Achievements',    Icon: Trophy },
  { to: 'experience',     label: 'Experience',      Icon: Briefcase },
  { to: 'blog',           label: 'Blog',            Icon: FileText },
  { to: 'testimonials',   label: 'Testimonials',    Icon: MessageSquare },
  { to: 'messages',       label: 'Messages',        Icon: Mail,  badge: true },
  { to: 'statistics',     label: 'Statistics',      Icon: BarChart2 },
]

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { unreadMessages } = useData()
  const { adminTheme, setAdminTheme } = useTheme()

  // Apply admin theme on mount/change
  useAdminThemeEffect(adminTheme)

  const logout = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out')
    navigate('/admin/login')
  }

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [location])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-[color:var(--border)]">
        <p className="font-bold text-[color:var(--text)]">
          Irshad<span className="accent">.</span>
          <span className="text-xs font-normal text-[color:var(--text-faint)] ml-2">Admin</span>
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative ${
                isActive
                  ? 'accent-bg text-white font-medium'
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-white/5'
              }`
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            {label}
            {badge && unreadMessages > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[color:var(--border)] space-y-1">
        {/* Theme picker */}
        <div className="relative">
          <button
            onClick={() => setThemeOpen(o => !o)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-white/5 transition-all"
          >
            <Palette size={16} /> Theme
            <div className="ml-auto w-3 h-3 rounded-full flex-shrink-0" style={{ background: THEMES.find(t => t.name === adminTheme)?.accent }} />
          </button>

          {themeOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 glass rounded-xl p-2 z-50 border border-[color:var(--border)]">
              {THEMES.map(t => (
                <button
                  key={t.name}
                  onClick={() => { setAdminTheme(t.name); setThemeOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                    adminTheme === t.name
                      ? 'accent-subtle accent font-medium'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-white/5'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.accent }} />
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <a href="/" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-white/5 transition-all">
          <ExternalLink size={16} /> View Portfolio
        </a>
        <button onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[color:var(--text-muted)] hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[color:var(--bg)] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r border-[color:var(--border)] sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[color:var(--bg)] border-b border-[color:var(--border)] px-4 py-3 flex items-center justify-between">
        <p className="font-bold text-[color:var(--text)]">Irshad<span className="accent">.</span></p>
        <button onClick={() => setDrawerOpen(o => !o)} className="text-[color:var(--text-muted)]">
          {drawerOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-64 bg-[#0e0e0e] border-r border-[color:var(--border)] h-full overflow-hidden">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-14">
        <div className="p-4 sm:p-6 max-w-6xl">
          <Outlet />
        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: 'var(--accent)', secondary: '#fff' } },
        }}
      />
    </div>
  )
}

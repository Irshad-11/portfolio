import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu, X, Shield,
  User, Cpu, Award, Trophy, FolderKanban,
  Briefcase, FileText, MessageSquare, Mail
} from 'lucide-react'
import { useData } from '../context/DataContext'

const NAV_LINKS = [
  { href: '#about',          label: 'About',          short: 'About',    Icon: User          },
  { href: '#skills',         label: 'Skills',         short: 'Skills',   Icon: Cpu           },
  { href: '#certifications', label: 'Certifications', short: 'Certs',    Icon: Award         },
  { href: '#achievements',   label: 'Achievements',   short: 'Awards',   Icon: Trophy        },
  { href: '#projects',       label: 'Projects',       short: 'Projects', Icon: FolderKanban  },
  { href: '#experience',     label: 'Experience',     short: 'Exp.',     Icon: Briefcase     },
  { href: '#blog',           label: 'Blog',           short: 'Blog',     Icon: FileText      },
  { href: '#testimonials',   label: 'Testimonials',   short: 'Reviews',  Icon: MessageSquare },
  { href: '#contact',        label: 'Contact',        short: 'Contact',  Icon: Mail          },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive]         = useState('')
  const { unreadMessages }          = useData()
  const location                    = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { threshold: 0.25 }
    )
    sections.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [location])

  if (location.pathname.startsWith('/admin')) return null

  const linkCls = (id: string) =>
    `flex items-center transition-all duration-200 rounded-lg ${
      active === id
        ? 'text-[color:var(--accent)] bg-[color:var(--accent-subtle)]'
        : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-white/5'
    }`

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'glass border-b border-[color:var(--border)] py-2.5' : 'py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2">

        {/* Logo */}
        <Link to="/" className="font-bold text-base text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors flex-shrink-0">
          Irshad<span className="accent">.</span>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label, short, Icon }) => {
            const id = href.slice(1)
            return (
              <a key={href} href={href} title={label} className={`${linkCls(id)} px-2 py-1.5`}>
                {/* md → lg : icon only */}
                <span className="md:inline lg:hidden">
                  <Icon size={15} />
                </span>
                {/* lg → xl : abbreviated text */}
                <span className="hidden lg:inline xl:hidden text-[11px] font-medium tracking-wide">
                  {short}
                </span>
                {/* xl+ : full label */}
                <span className="hidden xl:inline text-sm">
                  {label}
                </span>
              </a>
            )
          })}
        </div>

        {/* Admin + mobile toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/admin/login"
            className="relative hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[color:var(--text-faint)] hover:text-[color:var(--text-muted)] transition-colors border border-[color:var(--border)] hover:border-[color:var(--border-hover)]"
          >
            <Shield size={12} />
            Admin
            {unreadMessages > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-[color:var(--text-muted)] p-1"
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-[color:var(--border)] mt-2 px-4 py-3">
          <div className="grid grid-cols-3 gap-1.5">
            {NAV_LINKS.map(({ href, label, Icon }) => {
              const id = href.slice(1)
              return (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-center transition-all ${
                    active === id
                      ? 'text-[color:var(--accent)] bg-[color:var(--accent-subtle)]'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-[10px] leading-tight">{label}</span>
                </a>
              )
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-[color:var(--border)]">
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[color:var(--text-faint)] hover:text-[color:var(--text-muted)] transition-all"
            >
              <Shield size={14} /> Admin
              {unreadMessages > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {unreadMessages}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
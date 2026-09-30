import UnreadDot from './UnreadDot'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Lock, Menu, X } from 'lucide-react'
import { useData } from '../context/DataContext'
import { ActionLink, pad } from './ui'
import ModeToggle from './ModeToggle'
import Ribbon from './Ribbon'
import { DynamicIcon } from '../lib/icons'

export default function Navbar() {
  const { sections, config, profile } = useData()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const bar = useRef<HTMLDivElement>(null)
  const home = pathname === '/'
  const site = config.site

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // scroll progress hairline
  useEffect(() => {
    let raf = 0
    const upd = () => {
      raf = 0
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(upd) }
    upd()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [pathname])

  // scroll-spy
  useEffect(() => {
    if (!home) { setActive(''); return }
    const els = sections.map(s => document.getElementById(s.key)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [home, sections])

  const initials = (profile?.name || 'IH').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const firstName = (profile?.name || 'Irshad Hossain')
  const ctaLinks = config.links.filter(l => l.hero)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full max-w-full overflow-hidden z-50" style={{ background: 'color-mix(in srgb, var(--bg) 90%, transparent)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
        {config.ribbon.enabled && config.ribbon.position === 'top' && <Ribbon cfg={config.ribbon} compact />}
        <div className="border-b border-line">
          <div className="container-x relative flex items-center justify-between gap-3 h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-3 group min-w-0 shrink" aria-label="Home">
              <span className="w-8 h-8 border border-[color:var(--accent)] flex items-center justify-center font-mono text-[0.72rem] font-semibold text-ink group-hover:bg-[color:var(--accent)] group-hover:text-[color:var(--accent-ink)] transition-colors">{initials}</span>
              <span className="hidden lg:block whitespace-nowrap font-display font-semibold text-ink">{firstName}</span>
            </Link>
            <Link to="/" className="lg:hidden absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-display font-semibold text-ink text-[0.95rem] sm:text-base" aria-label="Home">{firstName}</Link>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Sections">
              {sections.map(s => (
                <ActionLink key={s.key} href={`#${s.key}`}
                  className={`group relative px-3 py-2 mono transition-colors ${active === s.key ? 'text-[color:var(--accent)]' : 'text-muted hover:text-ink'}`}>
                  {s.nav}
                  <span className={`absolute left-3 right-3 -bottom-px h-px bg-[color:var(--accent)] origin-left transition-transform ${active === s.key ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </ActionLink>
              ))}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <ModeToggle />
              <Link to="/admin/login" className="btn btn-outline !h-10 !px-3 hidden sm:inline-flex relative" aria-label="Admin login" title="Admin login"><Lock size={14} /><span className="hidden xl:inline">Admin</span><UnreadDot /></Link>
              {site.nav_cta_enabled && site.nav_cta_label && (
                <ActionLink href={site.nav_cta_url} className="btn btn-solid !h-10 !px-4 hidden sm:inline-flex">{site.nav_cta_label}</ActionLink>
              )}
              <button className="icon-btn lg:hidden relative" onClick={() => setOpen(o => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
                {open ? <X size={18} /> : <Menu size={18} />}
                {!open && <UnreadDot className="!top-0.5 !right-0.5 sm:hidden" />}
              </button>
            </div>
          </div>
        </div>
        <div ref={bar} className="progress-bar !top-auto !bottom-0" style={{ transform: 'scaleX(0)' }} />
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden overflow-y-auto" style={{ background: 'var(--bg)', paddingTop: config.ribbon.enabled && config.ribbon.position === 'top' ? '5.5rem' : '4.5rem' }}>
          <nav className="container-x py-3" aria-label="Mobile sections">
            <ul className="ledger">
              {sections.map(s => (
                <li key={s.key}>
                  <ActionLink href={`#${s.key}`} onClick={() => setOpen(false)} className="flex items-baseline gap-3 py-3 group">
                    <span className="label !text-[color:var(--accent)] w-6">{pad(s.index)}</span>
                    <span className="font-display font-semibold text-base text-ink group-hover:text-[color:var(--accent)] transition-colors">{s.title.split(/[&,]/)[0].trim()}</span>
                  </ActionLink>
                </li>
              ))}
            </ul>
            {site.nav_cta_enabled && site.nav_cta_label && (
              <ActionLink href={site.nav_cta_url} onClick={() => setOpen(false)} className="btn btn-solid w-full mt-5">{site.nav_cta_label}</ActionLink>
            )}
            <Link to="/admin/login" onClick={() => setOpen(false)} className="btn btn-outline w-full mt-3 relative"><Lock size={15} />Admin login<UnreadDot className="!top-1.5 !right-2" /></Link>
            {ctaLinks.length > 0 && (
              <div className="flex gap-2 mt-6">
                {ctaLinks.map(l => (
                  <ActionLink key={l.id} href={l.url} className="icon-btn" aria-label={l.label}><DynamicIcon name={l.icon} size={17} /></ActionLink>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
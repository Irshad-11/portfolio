import UnreadDot from './UnreadDot'
import { useData } from '../context/DataContext'
import { ActionLink, pad } from './ui'
import Ribbon from './Ribbon'
import { DynamicIcon } from '../lib/icons'
import { ArrowUp, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { profile, config, sections } = useData()
  const links = config.links.filter(l => l.footer)
  const rb = config.ribbon
  const showRibbon = rb.enabled && (rb.position === 'before_footer' || rb.position === 'both')
  const name = profile?.name || 'Irshad Hossain'

  return (
    <footer className="relative z-10 mt-8">
      {showRibbon && <Ribbon cfg={rb} />}
      <div className="border-t border-line" style={{ background: 'var(--bg)' }}>
        <div className="container-x py-14 md:py-20">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-6">
              <p className="label mb-4">Colophon</p>
              <p className="font-display font-semibold text-lg sm:text-2xl leading-snug text-ink max-w-md">
                {config.site.footer_text || `${name}. ${profile?.title || ''}`}
              </p>
            </div>
            <nav className="md:col-span-3" aria-label="Footer sections">
              <p className="label mb-4">Index</p>
              <ul className="space-y-2">
                {sections.map(s => (
                  <li key={s.key}>
                    <ActionLink href={`#${s.key}`} className="mono text-muted hover:text-[color:var(--accent)] transition-colors">
                      <span className="text-faint mr-2">{pad(s.index)}</span>{s.title}
                    </ActionLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="md:col-span-3">
              <p className="label mb-4">Elsewhere</p>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l.id}>
                    <ActionLink href={l.url} className="inline-flex items-center gap-2.5 text-muted hover:text-[color:var(--accent)] transition-colors">
                      <DynamicIcon name={l.icon} size={15} />{l.label}
                    </ActionLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="container-x h-14 flex items-center justify-between gap-4">
            <p className="mono text-faint">© {new Date().getFullYear()} {name}</p>
            <Link to="/admin/login" className="mono relative flex items-center gap-1.5 text-faint hover:text-[color:var(--accent)] transition-colors ml-auto mr-5"><Lock size={12} />Admin login<UnreadDot className="!-top-1 !-right-3" /></Link>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mono flex items-center gap-2 text-muted hover:text-[color:var(--accent)] transition-colors">
              Top <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
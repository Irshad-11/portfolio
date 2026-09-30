import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { useData } from '../context/DataContext'
import { ActionLink } from '../components/ui'
import { DynamicIcon } from '../lib/icons'
import type { CtaStyle } from '../lib/types'

const CTA_CLASS: Record<CtaStyle, string> = {
  solid: 'btn btn-solid', outline: 'btn btn-outline', ghost: 'btn btn-ghost', link: 'btn btn-link', ticket: 'btn btn-ticket',
}

function useClock(tz: string, on: boolean) {
  const [t, setT] = useState('')
  useEffect(() => {
    if (!on) return
    const fmt = () => {
      try {
        const d = new Date()
        const time = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(d)
        const zone = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }).formatToParts(d).find(p => p.type === 'timeZoneName')?.value || ''
        setT(`${time} ${zone}`.trim())
      } catch { setT('') }
    }
    fmt()
    const id = setInterval(fmt, 20000)
    return () => clearInterval(id)
  }, [tz, on])
  return t
}

export default function Hero() {
  const { profile, config } = useData()
  const h = config.hero
  const name = (profile?.name || 'Irshad Hossain').trim()
  const words = name.split(/\s+/)
  const last = words.length > 1 ? words[words.length - 1] : ''
  const first = words.length > 1 ? words.slice(0, -1).join(' ') : name
  const contacts = config.links.filter(l => l.hero)
  const clock = useClock(h.timezone, h.show_clock)
  const split = h.layout === 'split'
  const initials = words.map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const ctas = h.ctas.filter(c => c.enabled && c.label && (c.url !== '@resume' || profile?.resume_url))
  const resolve = (u: string) => (u === '@resume' ? profile?.resume_url || '' : u)

  return (
    <section id="top" className="relative z-[1] pt-[4.75rem] sm:pt-24 md:pt-28 pb-8 lg:pt-[5rem] lg:pb-4 lg:h-[100svh] lg:min-h-[30rem] lg:flex lg:flex-col lg:justify-center">
      <div className="container-x lg:w-full">
        {/* meta strip */}
        {(h.show_status || (h.show_clock && clock)) && (
          <div className="fade-up flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-2 mb-4 sm:pb-3 sm:mb-8 lg:pb-2 lg:mb-4" style={{ '--d': '0ms' } as React.CSSProperties}>
            {h.show_status ? (
              <span className={`mono !normal-case inline-flex items-center gap-3 tone-${h.status_tone}`}>
                <span className="pill-dot" /><span className="text-ink">{h.status_text}</span>
              </span>
            ) : <span />}
            {h.show_clock && clock && (
              <span className="mono text-faint tabular hidden sm:inline">
                {h.clock_label && <>{h.clock_label} <span className="mx-1">·</span></>}<span className="text-ink">{clock}</span>
              </span>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-center">
          <div className={split && h.show_specs ? 'lg:col-span-8' : 'lg:col-span-12'}>
            <div className="flex items-center gap-4 mb-3 sm:mb-6 lg:mb-4 fade-up" style={{ '--d': '80ms' } as React.CSSProperties}>
              {!split && h.show_avatar && (
                <span className="w-16 h-16 shrink-0 border border-line overflow-hidden marks">
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" /> : <span className="placeholder-x w-full h-full flex items-center justify-center font-display font-semibold text-ink">{initials}</span>}
                </span>
              )}
              {h.eyebrow && (
                <p className="label !text-[color:var(--accent)] flex items-center gap-3">
                  <span className="w-8 h-px bg-[color:var(--accent)]" />{h.eyebrow}
                </p>
              )}
            </div>

            <h1 className="font-display font-semibold leading-tight text-ink text-[clamp(1.6rem,7.4vw,3.4rem)] sm:whitespace-nowrap" aria-label={name}>
              <span className="line-mask"><span className="line-in" style={{ '--d': '150ms' } as React.CSSProperties}>{name}<span className="text-[color:var(--accent)]">.</span></span></span>
            </h1>

            {profile?.tagline && (
              <p className="fade-up mt-3 sm:mt-5 md:mt-6 lg:mt-4 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-muted" style={{ '--d': '480ms' } as React.CSSProperties}>{profile.tagline}</p>
            )}

            {(ctas.length > 0 || (h.show_contacts && contacts.length > 0)) && (
              <div className="fade-up mt-4 sm:mt-7 lg:mt-5 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-5" style={{ '--d': '580ms' } as React.CSSProperties}>
                {ctas.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-4">
                    {ctas.map(c => (
                      <ActionLink key={c.id} href={resolve(c.url)} newTab={c.new_tab} className={CTA_CLASS[c.style]}>
                        {c.icon && c.style !== 'link' && <DynamicIcon name={c.icon} size={15} />}
                        {c.label}
                        {c.icon && c.style === 'link' && <DynamicIcon name={c.icon} size={14} />}
                      </ActionLink>
                    ))}
                  </div>
                )}
                {h.show_contacts && contacts.length > 0 && (
                  <>
                    {ctas.length > 0 && <span className="hidden sm:block w-px h-8 bg-[color:var(--border-hover)]" />}
                    <ul className="flex flex-wrap gap-2" aria-label="Contact links">
                      {contacts.map(l => (
                        <li key={l.id}>
                          <ActionLink href={l.url} className="icon-btn" aria-label={l.label} title={l.label}><DynamicIcon name={l.icon} size={17} /></ActionLink>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          {/* spec sheet: on phones a compact photo + facts card, on desktop a tall card whose photo fills the free height */}
          {split && h.show_specs && (
            <aside className="lg:col-span-4 fade-up lg:justify-self-end w-full lg:w-[min(21rem,100%)]" style={{ '--d': '420ms' } as React.CSSProperties}>
              <div className="border border-line flex lg:flex-col lg:h-[min(calc(100svh-11rem),34rem)]" style={{ background: 'var(--bg)' }}>
                {h.show_avatar && (
                  <div className="relative w-[8.5rem] sm:w-48 shrink-0 min-h-[9rem] lg:w-auto lg:min-h-0 lg:flex-1 border-r lg:border-r-0 lg:border-b border-line overflow-hidden bg-soft">
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt={name} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} />
                      : <div className="placeholder-x absolute inset-0 flex items-center justify-center font-display font-semibold text-4xl lg:text-6xl text-faint">{initials}</div>}
                    <span className="absolute top-2 left-2 lg:top-3 lg:left-3 label !text-[0.65rem] bg-[var(--bg)] border border-line px-1.5 py-0.5 text-muted">ID / {initials}</span>
                  </div>
                )}
                {h.specs.length > 0 && (
                  <dl className="flex-1 min-w-0 lg:flex-none px-3 sm:px-4 py-1 self-center lg:self-auto">
                    {h.specs.map(s => (
                      <div key={s.id} className="flex items-baseline justify-between gap-3 py-1.5 lg:py-2 border-b border-dashed border-line last:border-0">
                        <dt className="label !text-[0.62rem] sm:!text-[0.68rem] shrink-0">{s.label}</dt>
                        <dd className="text-[0.78rem] sm:text-[0.85rem] leading-snug text-ink text-right">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {profile?.location && h.specs.length === 0 && (
                  <p className="p-5 flex items-center gap-2 text-sm text-ink"><MapPin size={14} className="text-[color:var(--accent)]" />{profile.location}</p>
                )}
              </div>
            </aside>
          )}
        </div>

        {h.show_scroll && (
          <div className="hidden md:flex items-center gap-4 mt-10 lg:mt-3 fade-up" style={{ '--d': '800ms' } as React.CSSProperties}>
            <span className="scroll-line" /><span className="label">Scroll</span>
          </div>
        )}
      </div>
    </section>
  )
}
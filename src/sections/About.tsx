import { MapPin, ArrowUpRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import { SectionShell, ActionLink, CountUp } from '../components/ui'
import Slideshow from '../components/Slideshow'
import RichContent from '../components/RichContent'
import { DynamicIcon } from '../lib/icons'

export default function About() {
  const { profile, config, sections } = useData()
  const sec = sections.find(s => s.key === 'about')
  if (!sec || !profile) return null
  const a = config.about
  const links = config.links.filter(l => l.about)
  const stats = a.stats.filter(s => s.enabled && (s.value || s.label))
  const hasImages = a.show_images && (a.images.length > 0 || !!profile.avatar_url)
  const right = a.image_side === 'right'
  const initials = profile.name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <SectionShell id="about" index={sec.index} title={sec.title} subtitle={sec.subtitle} aside={profile.location}>
      <div className={`grid gap-10 lg:gap-16 ${hasImages ? 'lg:grid-cols-12' : ''}`}>
        {hasImages && (
          <div className={`reveal-left lg:col-span-5 ${right ? 'lg:order-2' : ''}`}>
            <div className="lg:sticky lg:top-28">
              <Slideshow images={a.images} effect={a.effect} autoplay={a.autoplay} interval={a.interval} fallback={profile.avatar_url} initials={initials} />
            </div>
          </div>
        )}

        <div className={`reveal ${hasImages ? 'lg:col-span-7' : 'max-w-3xl'}`}>
          <RichContent html={profile.bio} className="prose-lg" />

          {a.show_facts && a.facts.length > 0 && (
            <dl className="mt-10 grid sm:grid-cols-2 gap-x-10 border-t border-line">
              {a.facts.map(f => (
                <div key={f.id} className="flex items-baseline justify-between gap-6 py-3.5 border-b border-line">
                  <dt className="label shrink-0">{f.label}</dt>
                  <dd className="text-sm text-ink text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {a.show_location && profile.location && (
            <div className="mt-8 flex items-center gap-3 text-ink">
              <span className="w-9 h-9 border border-line flex items-center justify-center text-[color:var(--accent)]"><MapPin size={16} /></span>
              {a.location_url ? (
                <ActionLink href={a.location_url} newTab className="link-arrow u-link">{profile.location}<ArrowUpRight size={15} /></ActionLink>
              ) : <span>{profile.location}</span>}
            </div>
          )}

          {a.show_links && links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3">
              {links.map(l => (
                <li key={l.id}>
                  <ActionLink href={l.url} className="btn btn-outline !h-11 !px-4 !normal-case !tracking-normal !text-[0.85rem]">
                    <DynamicIcon name={l.icon} size={16} />{l.label}
                  </ActionLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {a.show_stats && stats.length > 0 && (
        <div className="reveal mt-10 md:mt-14 stats-grid" style={{ '--n': stats.length } as React.CSSProperties} data-n={stats.length}>
          {stats.map(s => (
            <div key={s.id} className="p-4 sm:p-6">
              <p className="font-display font-semibold leading-none text-ink text-xl sm:text-3xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="label mt-3 sm:mt-4">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  )
}
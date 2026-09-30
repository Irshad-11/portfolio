import { ArrowUpRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import { SectionShell } from '../components/ui'

export default function Experience() {
  const { experience, sections } = useData()
  const sec = sections.find(s => s.key === 'experience')
  if (!sec) return null
  return (
    <SectionShell id="experience" index={sec.index} title={sec.title} subtitle={sec.subtitle}>
      <ol className="relative">
        {experience.map((e, i) => (
          <li key={e.id} className="reveal grid md:grid-cols-12 gap-x-8 gap-y-2 border-t border-line py-6 md:py-8 first:border-t-0 md:first:border-t">
            <div className="md:col-span-3">
              <p className="mono text-[color:var(--accent)] tabular">{e.period}</p>
              {e.location && <p className="mono !text-[0.75rem] text-faint mt-1.5">{e.location}</p>}
            </div>
            <div className="md:col-span-9">
              <h3 className="font-display font-semibold text-ink text-base sm:text-xl leading-tight">{e.role}</h3>
              <p className="mt-1.5 text-lg text-muted">
                {e.website
                  ? <a href={e.website} target="_blank" rel="noopener noreferrer" className="link-arrow u-link">{e.company}<ArrowUpRight size={15} /></a>
                  : e.company}
              </p>
              {e.description?.length > 0 && (
                <ul className="mt-5 space-y-2.5 max-w-2xl">
                  {e.description.map((d, k) => (
                    <li key={k} className="flex gap-3 text-muted text-base md:text-sm leading-relaxed"><span className="mt-[0.62rem] w-1.5 h-1.5 shrink-0 bg-[color:var(--accent)]" />{d}</li>
                  ))}
                </ul>
              )}
              {e.tech_stack?.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{e.tech_stack.map(t => <span key={t} className="tag">{t}</span>)}</div>}
              <span className="sr-only">Position {i + 1}</span>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
import { ExternalLink } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import SectionHeading from '../components/SectionHeading'

export default function Experience() {
  const { experience, loading } = useData()
  const ref = useScrollReveal('experience')

  if (!loading && experience.length === 0) return null

  return (
    <section id="experience" ref={ref as React.RefObject<HTMLElement>} className="section-base">
      <div className="max-w-4xl mx-auto">
        <div className="reveal">
          <SectionHeading title="Experience" subtitle="My professional journey so far" />
        </div>

        <div className="relative space-y-6">
          {/* Glowing timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[2px] timeline-line hidden sm:block" />

          {experience.map((exp, i) => (
            <div key={exp.id} className="reveal sm:pl-10 relative" style={{ transitionDelay: `${i * 80}ms` }}>
              {/* Timeline dot */}
              <div className="absolute left-0 top-4 hidden sm:block">
                <div className="w-4 h-4 rounded-full border-2 timeline-dot bg-[color:var(--bg)]" />
              </div>

              <div className="glass glass-hover rounded-xl p-6 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                  <h3 className="text-base font-semibold text-[color:var(--text)]">{exp.role}</h3>
                  <span className="text-xs text-[color:var(--text-faint)] font-mono flex-shrink-0">{exp.period}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {exp.website ? (
                    <a href={exp.website} target="_blank" rel="noopener noreferrer"
                       className="text-sm font-medium accent hover:opacity-80 transition-opacity inline-flex items-center gap-1">
                      {exp.company} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-sm font-medium accent">{exp.company}</span>
                  )}
                  {exp.location && (
                    <>
                      <span className="text-[color:var(--text-faint)]">·</span>
                      <span className="text-sm text-[color:var(--text-faint)]">{exp.location}</span>
                    </>
                  )}
                </div>

                <ul className="space-y-1.5 mb-4">
                  {exp.description.map((d, di) => (
                    <li key={di} className="text-sm text-[color:var(--text-muted)] leading-relaxed flex gap-2">
                      <span className="accent opacity-50 flex-shrink-0 mt-0.5">▸</span>
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tech_stack.map(t => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

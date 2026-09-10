import { useData } from '../context/DataContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import SectionHeading from '../components/SectionHeading'

export default function Skills() {
  const { skills, loading } = useData()
  const ref = useScrollReveal('skills')

  if (!loading && skills.length === 0) return null

  // Group by category
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <section id="skills" ref={ref as React.RefObject<HTMLElement>} className="section-base">
      <div className="max-w-5xl mx-auto">
        <div className="reveal">
          <SectionHeading title="Skills & Expertise" subtitle="Technologies I work with daily, from languages to cloud platforms" />
        </div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items], ci) => (
            <div key={category} className="reveal" style={{ transitionDelay: `${ci * 80}ms` }}>
              <h3 className="text-sm font-semibold text-[color:var(--text-muted)] mb-4 tracking-wide">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {items.map(skill => (
                  <div
                    key={skill.id}
                    className="glass glass-hover flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-default"
                  >
                    {skill.icon_url && (
                      <img
                        src={skill.icon_url}
                        alt={skill.name}
                        className="w-5 h-5 object-contain flex-shrink-0"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    )}
                    <span className="text-sm text-[color:var(--text-muted)]">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

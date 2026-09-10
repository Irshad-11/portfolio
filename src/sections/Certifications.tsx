import { ExternalLink, Award } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import SectionHeading from '../components/SectionHeading'

export default function Certifications() {
  const { certifications, loading } = useData()
  const ref = useScrollReveal('certifications')

  if (!loading && certifications.length === 0) return null

  return (
    <section id="certifications" ref={ref as React.RefObject<HTMLElement>} className="section-base">
      <div className="max-w-5xl mx-auto">
        <div className="reveal">
          <SectionHeading title="Certifications" subtitle="Professional credentials and completed courses" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, i) => (
            <div
              key={cert.id}
              className="reveal glass glass-hover rounded-xl p-5 transition-all duration-200"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {cert.badge_url ? (
                <img src={cert.badge_url} alt={cert.title} className="w-12 h-12 object-contain mb-3 rounded-lg" />
              ) : (
                <div className="w-12 h-12 rounded-xl accent-subtle flex items-center justify-center mb-3">
                  <Award size={22} className="accent" />
                </div>
              )}
              <h3 className="text-sm font-semibold text-[color:var(--text)] leading-snug">{cert.title}</h3>
              <p className="text-xs text-[color:var(--accent)] mt-1 font-medium">{cert.issuer}</p>
              {cert.issue_date && (
                <p className="text-xs text-[color:var(--text-faint)] mt-0.5">{cert.issue_date}</p>
              )}
              {cert.description && (
                <p className="text-xs text-[color:var(--text-muted)] mt-2 leading-relaxed line-clamp-2">{cert.description}</p>
              )}
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs accent hover:opacity-80 transition-opacity mt-3"
                >
                  View Credential <ExternalLink size={11} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

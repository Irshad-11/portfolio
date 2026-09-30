import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, ArrowUpRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import { SectionShell, useHoverPreview } from '../components/ui'
import type { Certification } from '../lib/types'

export function CertThumb({ c, className = '' }: { c: Certification; className?: string }) {
  const src = c.image_url || c.badge_url
  return (
    <span className={`relative shrink-0 border border-line overflow-hidden bg-soft flex items-center justify-center ${className}`}>
      {src ? <img src={src} alt="" loading="lazy" decoding="async" className={`w-full h-full ${c.image_url ? 'object-cover' : 'object-contain p-2'}`} /> : <Award size={20} className="text-faint" />}
    </span>
  )
}

export default function Certifications() {
  const { certifications, sections } = useData()
  const sec = sections.find(s => s.key === 'certifications')
  const [all, setAll] = useState(false)
  const hp = useHoverPreview()
  if (!sec) return null
  const list = all ? certifications : certifications.slice(0, 6)

  return (
    <SectionShell id="certifications" index={sec.index} title={sec.title} subtitle={sec.subtitle} aside={`${certifications.length} on record`}>
      {hp.layer}
      <ul className="ledger reveal">
        {list.map((c, i) => (
          <li key={c.id}>
            <Link to={`/certifications/${c.id}`}
              onMouseEnter={() => hp.show(c.image_url)} onMouseLeave={hp.hide} onFocus={() => hp.show(c.image_url)} onBlur={hp.hide}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6 py-4 sm:py-5 px-1 sm:px-3 -mx-1 sm:-mx-3 transition-colors hover:bg-[color:var(--accent-subtle)]">
              <CertThumb c={c} className="w-[4.5rem] h-14 sm:w-24 sm:h-[4.4rem]" />
              <div className="min-w-0">
                <p className="mono !text-[0.75rem] text-faint mb-1.5 flex items-center gap-2">
                  <span className="tabular">{String(i + 1).padStart(2, '0')}</span><span>{c.issuer}</span>
                  {c.credential_url && <span className="tag-flag !py-[1px]">Verified</span>}
                </p>
                <p className="font-display font-semibold text-ink text-[0.95rem] sm:text-lg leading-snug group-hover:text-[color:var(--accent)] transition-colors">{c.title}</p>
              </div>
              <div className="flex items-center gap-4 text-right">
                <span className="hidden sm:block mono text-muted tabular">{c.issue_date}</span>
                <ArrowUpRight size={20} className="text-faint group-hover:text-[color:var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {certifications.length > 6 && (
        <button onClick={() => setAll(a => !a)} className="btn btn-outline mt-8">{all ? 'Show fewer' : `Show all ${certifications.length}`}</button>
      )}
    </SectionShell>
  )
}
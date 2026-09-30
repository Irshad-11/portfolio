import { useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import { SectionShell, pad } from '../components/ui'
import RichContent from '../components/RichContent'

export default function Testimonials() {
  const { testimonials, sections } = useData()
  const sec = sections.find(s => s.key === 'testimonials')
  const [i, setI] = useState(0)
  if (!sec) return null
  const n = testimonials.length
  const cur = testimonials[Math.min(i, n - 1)]
  const initials = (s: string) => s.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <SectionShell id="testimonials" index={sec.index} title={sec.title} subtitle={sec.subtitle} aside={`${n} note${n === 1 ? '' : 's'}`}>
      <div className="reveal grid lg:grid-cols-12 gap-8 lg:gap-14">
        {n > 1 && (
          <div className="lg:col-span-4 order-2 lg:order-1">
            <ul className="flex lg:flex-col gap-2 lg:gap-0 overflow-x-auto no-scrollbar lg:overflow-visible -mx-5 px-5 lg:mx-0 lg:px-0 lg:ledger" role="tablist" aria-label="Testimonials">
              {testimonials.map((t, k) => (
                <li key={t.id} className="shrink-0">
                  <button role="tab" aria-selected={k === i} onClick={() => setI(k)}
                    className={`w-full text-left flex items-center gap-3 lg:py-4 px-4 lg:px-3 py-3 border lg:border-0 transition-colors ${k === i ? 'border-[color:var(--accent)] lg:bg-[color:var(--accent-subtle)]' : 'border-line hover:bg-[color:var(--bg-card-hover)]'}`}>
                    <span className={`mono tabular ${k === i ? 'text-[color:var(--accent)]' : 'text-faint'}`}>{pad(k + 1)}</span>
                    <span className="min-w-0">
                      <span className="block font-display font-semibold text-ink whitespace-nowrap lg:whitespace-normal">{t.name}</span>
                      <span className="block mono !text-[0.75rem] text-faint whitespace-nowrap lg:whitespace-normal">{[t.role, t.company].filter(Boolean).join(' · ')}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <figure key={cur.id} className={`fade-up ${n > 1 ? 'lg:col-span-8' : 'lg:col-span-10'} order-1 lg:order-2 relative`} style={{ '--d': '0ms' } as React.CSSProperties}>
          <span aria-hidden className="absolute -top-6 -left-1 font-display font-semibold text-[4rem] sm:text-[5rem] leading-none text-[color:var(--accent)] opacity-25 select-none">“</span>
          <blockquote className="relative pt-10 sm:pt-14">
            <RichContent html={cur.content} className="prose-quote !text-ink" />
          </blockquote>
          <figcaption className="mt-8 pt-6 border-t border-dashed border-[color:var(--border-hover)] flex items-center gap-4">
            {cur.avatar_url
              ? <img src={cur.avatar_url} alt="" className="w-14 h-14 object-cover border border-line" />
              : <span className="w-14 h-14 border border-line flex items-center justify-center font-display font-semibold text-ink placeholder-x">{initials(cur.name)}</span>}
            <div className="min-w-0">
              <p className="font-display font-semibold text-ink text-lg">{cur.name}</p>
              <p className="text-sm text-muted">
                {cur.role}{cur.role && cur.company && ', '}
                {cur.company_url
                  ? <a href={cur.company_url} target="_blank" rel="noopener noreferrer" className="link-arrow u-link">{cur.company}<ArrowUpRight size={13} /></a>
                  : cur.company}
              </p>
            </div>
            {n > 1 && (
              <div className="ml-auto hidden sm:flex gap-2">
                <button className="icon-btn" onClick={() => setI((i - 1 + n) % n)} aria-label="Previous"><ChevronLeft size={16} /></button>
                <button className="icon-btn" onClick={() => setI((i + 1) % n)} aria-label="Next"><ChevronRight size={16} /></button>
              </div>
            )}
          </figcaption>
        </figure>
      </div>
    </SectionShell>
  )
}
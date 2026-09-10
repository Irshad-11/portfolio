import { useState, useEffect, useRef, useCallback } from 'react'
import { ExternalLink } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import SectionHeading from '../components/SectionHeading'

/* Slight rotation per card — matches demo portfolio exactly */
const ROTATIONS = [-1.5, 1, -0.5, 1.5, -1, 0.8]
const AUTO_MS   = 3500

export default function Testimonials() {
  const { testimonials, loading } = useData()
  const ref                       = useScrollReveal('testimonials')
  const [active, setActive]       = useState(0)
  const [resetKey, setResetKey]   = useState(0) // increment to restart timer

  if (!loading && testimonials.length === 0) return null

  /* Auto-advance — resets whenever resetKey or data length changes */
  useEffect(() => {
    if (testimonials.length <= 1) return
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [testimonials.length, resetKey])

  /* Manual select — resets auto timer */
  const select = (idx: number) => {
    setActive(idx)
    setResetKey(k => k + 1)
  }

  return (
    <section
      id="testimonials"
      ref={ref as React.RefObject<HTMLElement>}
      className="section-base"
    >
      <div className="max-w-6xl mx-auto">
        <div className="reveal">
          <SectionHeading
            title="Testimonials"
            subtitle="What people say about working with me"
          />
        </div>

        {/* Card grid — 1:1 from demo portfolio */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              onClick={() => select(i)}
              className={`reveal rounded-[24px] p-6 cursor-pointer overflow-hidden
                transition-all duration-500
                ${i === 0 ? 'lg:col-span-2' : ''}
              `}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `2px solid ${active === i ? 'var(--accent)' : 'transparent'}`,
                boxShadow: active === i ? '0 0 32px var(--accent-glow)' : 'none',
                transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
                transitionDelay: `${i * 55}ms`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Large accent opening quote — exactly like demo */}
              <span
                className="text-5xl font-extrabold leading-none block -mb-4 select-none"
                style={{ color: 'var(--accent)', opacity: 0.3 }}
              >
                &ldquo;
              </span>

              <p className="text-[color:var(--text-muted)] text-sm leading-relaxed">
                {t.content}
              </p>

              {/* Avatar + name row */}
              <div className="mt-5 flex items-center gap-3">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-extrabold text-white accent-bg"
                  >
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-[color:var(--text)]">{t.name}</p>
                  <p className="text-xs text-[color:var(--text-faint)]">
                    {t.role && <>{t.role}</>}
                    {t.company && (
                      <>
                        {' '}at{' '}
                        {t.company_url ? (
                          <a
                            href={t.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 accent hover:opacity-80 transition-opacity"
                          >
                            {t.company}
                            <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="accent">{t.company}</span>
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots (auto-advance indicator) */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => select(i)}
                className={`h-1.5 rounded-full transition-all duration-400 ${
                  i === active
                    ? 'w-6 accent-bg'
                    : 'w-1.5 bg-[color:var(--border-hover)]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
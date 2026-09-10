import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Copy, Check, ArrowRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import GradientOrb from '../components/GradientOrb'

export default function Hero() {
  const { profile } = useData()
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    if (!profile?.email) return
    navigator.clipboard.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    let cancelled = false
    import('animejs').then(({ animate, stagger, utils }) => {
      if (cancelled || !nameRef.current) return

      // Split name into individual characters
      const name = nameRef.current
      const text = name.textContent ?? ''
      name.innerHTML = text
        .split('')
        .map(c => c === ' '
          ? `<span style="display:inline-block;width:0.3em"> </span>`
          : `<span style="display:inline-block;opacity:0;transform:translateY(40px) scale(0.8)">${c}</span>`)
        .join('')

      const chars = name.querySelectorAll('span')

      animate(chars, {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.8, 1],
        delay: stagger(40, { start: 200 }),
        duration: 700,
        easing: 'easeOutElastic(1, 0.6)',
      })

      // Subtitle words
      if (subtitleRef.current) {
        const sub = subtitleRef.current
        const words = sub.textContent ?? ''
        sub.innerHTML = words
          .split(' ')
          .map(w => `<span style="display:inline-block;opacity:0;transform:translateY(16px)">${w}&nbsp;</span>`)
          .join('')
        animate(sub.querySelectorAll('span'), {
          opacity: [0, 1],
          translateY: [16, 0],
          delay: stagger(60, { start: 800 }),
          duration: 500,
          easing: 'easeOutCubic',
        })
      }

      // CTA fade in
      if (ctaRef.current) {
        animate(ctaRef.current, {
          opacity: [0, 1],
          translateY: [20, 0],
          delay: 1200,
          duration: 600,
          easing: 'easeOutCubic',
        })
      }

      utils // keep import alive
    })
    return () => { cancelled = true }
  }, [profile])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <GradientOrb />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[color:var(--bg)] to-transparent pointer-events-none z-[1]" />

      <div className="relative z-10 max-w-4xl w-full text-center">
        {/* Intro */}
        <p className="text-[color:var(--text-muted)] text-lg mb-3 opacity-0 animate-[fadeIn_0.5s_0.1s_forwards]"
           style={{ animation: 'fadeIn 0.5s 0.1s forwards' }}>
          Hey, I'm
        </p>

        {/* Name — main focal point */}
        <h1
          ref={nameRef}
          className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-[color:var(--text)] leading-none text-glow mb-4"
        >
          {profile?.name ?? 'Irshad Ahmed'}
        </h1>

        {/* Title badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium text-white accent-bg">
            {profile?.title ?? 'Full Stack Developer'}
          </span>
        </div>

        {/* Tagline */}
        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl text-[color:var(--text-muted)] leading-relaxed max-w-2xl mx-auto mb-10"
        >
          {profile?.tagline ?? 'Building digital experiences that deliver real impact'}
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ opacity: 0 }}>
          <a href="#projects" className="btn-primary gap-2 px-6 py-3 text-base">
            View Projects <ArrowRight size={16} />
          </a>
          <button
            onClick={copyEmail}
            className="inline-flex items-center gap-2 text-[color:var(--text-muted)] text-sm hover:text-[color:var(--accent)] transition-colors"
          >
            {profile?.email}
            {copied
              ? <Check size={14} className="accent" />
              : <Copy size={14} />
            }
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[
            { v: `${profile?.years_experience ?? 4}+`, l: 'Years Exp.' },
            { v: `${profile?.projects_count ?? 20}+`, l: 'Projects' },
            { v: `${profile?.clients_count ?? 15}+`, l: 'Clients' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <p className="text-2xl font-bold accent">{s.v}</p>
              <p className="text-xs text-[color:var(--text-faint)] mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-[color:var(--text-faint)] hover:text-[color:var(--accent)] transition-colors animate-bounce"
      >
        <ArrowDown size={20} />
      </a>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      `}</style>
    </section>
  )
}

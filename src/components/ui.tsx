import { ReactNode, useEffect, useRef, useState, AnchorHTMLAttributes, CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

export const pad = (n: number) => String(n).padStart(2, '0')

export const isExternal = (u: string) => /^(https?:)?\/\//i.test(u) || /^(mailto:|tel:)/i.test(u)

/** Smart link: in-page anchors, router paths and external URLs. */
export function ActionLink({
  href, newTab, children, className, style, ...rest
}: { href: string; newTab?: boolean; children: ReactNode; className?: string; style?: CSSProperties } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const { pathname } = useLocation()
  if (!href) return <span className={className} style={style}>{children}</span>
  if (href.startsWith('#')) {
    if (pathname === '/') return <a href={href} className={className} style={style} {...rest}>{children}</a>
    return <Link to={`/${href}`} className={className} style={style} {...(rest as object)}>{children}</Link>
  }
  if (href.startsWith('/') && !href.startsWith('//')) {
    return <Link to={href} className={className} style={style} {...(rest as object)}>{children}</Link>
  }
  const ext = /^https?:/i.test(href)
  const target = newTab ?? ext ? '_blank' : undefined
  return (
    <a href={href} className={className} style={style} target={target} rel={target ? 'noopener noreferrer' : undefined} {...rest}>
      {children}
    </a>
  )
}

/** Section wrapper: banded background, numbered chip, drawn rule and a marker-highlighted title. */
export function SectionShell({
  id, index, title, subtitle, aside, children, className = '',
}: { id: string; index: number; title: string; subtitle?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  const ref = useScrollReveal(id)
  return (
    <section id={id} ref={ref as React.RefObject<HTMLElement>} className={`section scroll-mt-14 ${index % 2 === 0 ? 'section-alt' : ''} ${className}`}>
      <div className="container-x">
        <div className="reveal sec-head flex items-center gap-3 mb-4">
          <span className="sec-chip">{pad(index)}</span>
          <span className="rule sec-rule flex-1" />
          {aside && <span className="label">{aside}</span>}
        </div>
        <div className="reveal grid md:grid-cols-12 gap-x-8 gap-y-2 mb-6 md:mb-10">
          <h2 className="md:col-span-6 text-2xl sm:text-4xl leading-tight text-ink"><span className="mark-hl">{title}</span></h2>
          {subtitle && <p className="md:col-span-6 md:pt-2 text-sm sm:text-base text-muted leading-relaxed max-w-xl">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

/** Animated number that counts up when scrolled into view. */
export function CountUp({ value, suffix = '', className = '' }: { value: string; suffix?: string; className?: string }) {
  const target = parseFloat(value)
  const numeric = Number.isFinite(target) && /^[\d.,]+$/.test(value.trim())
  const [n, setN] = useState(numeric ? 0 : target)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!numeric) return
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const run = () => {
      if (reduce) { setN(target); return }
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1300)
        setN(target * (1 - Math.pow(1 - p, 3)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { run(); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value, numeric, target])
  const shown = numeric ? (Number.isInteger(target) ? Math.round(n).toString() : n.toFixed(1)) : value
  return <span ref={ref} className={`tabular ${className}`}>{shown}{suffix}</span>
}

/** Floating image that follows the pointer (desktop only). */
export function useHoverPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const x = Math.min(e.clientX + 28, window.innerWidth - 320)
      const y = Math.max(12, Math.min(e.clientY + 20, window.innerHeight - 250))
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  const layer = (
    <div ref={ref} className={`hover-preview ${src ? 'on' : ''}`} aria-hidden>
      {src && <img src={src} alt="" />}
    </div>
  )
  return { layer, show: (u?: string | null) => setSrc(u || null), hide: () => setSrc(null) }
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="border border-dashed border-line p-10 text-center text-faint mono">{children}</div>
}

export const fmtDate = (d?: string | null) => {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(+dt)) return d
  return dt.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const yearOf = (s?: string | null) => (s?.match(/(19|20)\d{2}/) || [''])[0]
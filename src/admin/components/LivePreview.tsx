import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Monitor, Smartphone, Sun, Moon, RefreshCw, X } from 'lucide-react'
import { useData } from '../../context/DataContext'
import type { RawPortfolio } from '../../lib/types'
import { PREVIEW_READY, PreviewMessage, PreviewView } from '../../lib/preview'

interface Props {
  view: PreviewView
  focus?: string
  patch?: Partial<RawPortfolio>
  onClose?: () => void
  className?: string
  header?: React.ReactNode
}

/**
 * Real, responsive preview: the actual public site rendered in an iframe, fed with the
 * draft you're editing via postMessage. Desktop mode renders at 1280px and scales to fit;
 * mobile mode renders at 390px so breakpoints behave exactly like a phone.
 */
export default function LivePreview({ view, focus, patch, onClose, className = '', header }: Props) {
  const base = useData()
  const frame = useRef<HTMLIFrameElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const ready = useRef(false)
  const [device, setDevice] = useState<'desktop' | 'mobile'>(() => (typeof window !== 'undefined' && window.innerWidth < 900 ? 'mobile' : 'desktop'))
  const [mode, setMode] = useState<'dark' | 'light'>(base.config.site.default_mode === 'light' ? 'light' : 'dark')
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [nonce, setNonce] = useState(0)

  const payload = useMemo<RawPortfolio>(() => ({
    profile: base.profile, skills: base.skills, expertise: base.expertise, certifications: base.certifications,
    achievements: base.achievements, projects: base.projects, experience: base.experience,
    blogPosts: base.blogPosts, testimonials: base.testimonials, ...patch,
  }), [base.profile, base.skills, base.expertise, base.certifications, base.achievements, base.projects, base.experience, base.blogPosts, base.testimonials, patch])

  const send = useCallback(() => {
    if (!ready.current) return
    const msg: PreviewMessage = { source: 'irshad-admin', type: 'data', view, focus, mode, payload }
    frame.current?.contentWindow?.postMessage(msg, window.location.origin)
  }, [view, focus, mode, payload])

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.source === PREVIEW_READY.source && e.data?.type === 'ready') { ready.current = true; send() }
    }
    window.addEventListener('message', on)
    return () => window.removeEventListener('message', on)
  }, [send])

  useEffect(() => { const t = setTimeout(send, 90); return () => clearTimeout(t) }, [send])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const fw = device === 'mobile' ? 390 : 1280
  const scale = size.w ? Math.min(1, size.w / fw) : 1
  const left = Math.max(0, (size.w - fw * scale) / 2)

  return (
    <div className={`flex flex-col rounded-xl border border-[color:var(--border-hover)] bg-[#0a0b0c] overflow-hidden min-h-0 ${className}`}>
      <div className="flex items-center gap-2 px-3 h-11 border-b border-[color:var(--border)] shrink-0">
        <span className="flex items-center gap-2 text-[11px] font-medium text-[color:var(--text-muted)] mr-auto">
          <span className="relative flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" /><span className="relative w-2 h-2 rounded-full bg-emerald-400" /></span>
          Live preview
        </span>
        {header}
        <div className="inline-flex border border-[color:var(--border)] rounded-md overflow-hidden">
          <button type="button" onClick={() => setDevice('desktop')} aria-pressed={device === 'desktop'} title="Desktop" className={`p-1.5 ${device === 'desktop' ? 'bg-[color:var(--accent)] text-[color:var(--accent-ink)]' : 'text-[color:var(--text-muted)]'}`}><Monitor size={14} /></button>
          <button type="button" onClick={() => setDevice('mobile')} aria-pressed={device === 'mobile'} title="Mobile" className={`p-1.5 ${device === 'mobile' ? 'bg-[color:var(--accent)] text-[color:var(--accent-ink)]' : 'text-[color:var(--text-muted)]'}`}><Smartphone size={14} /></button>
        </div>
        <button type="button" onClick={() => setMode(m => (m === 'dark' ? 'light' : 'dark'))} title="Toggle light / dark" className="p-1.5 border border-[color:var(--border)] rounded-md text-[color:var(--text-muted)] hover:text-[color:var(--text)]">{mode === 'dark' ? <Moon size={14} /> : <Sun size={14} />}</button>
        <button type="button" onClick={() => { ready.current = false; setNonce(n => n + 1) }} title="Reload preview" className="p-1.5 border border-[color:var(--border)] rounded-md text-[color:var(--text-muted)] hover:text-[color:var(--text)]"><RefreshCw size={14} /></button>
        {onClose && <button type="button" onClick={onClose} title="Close" className="p-1.5 border border-[color:var(--border)] rounded-md text-[color:var(--text-muted)] hover:text-[color:var(--text)] xl:hidden"><X size={14} /></button>}
      </div>

      <div ref={wrap} className="relative flex-1 min-h-0 overflow-hidden" style={{ background: device === 'mobile' ? 'repeating-linear-gradient(45deg,#0d0e0f,#0d0e0f 8px,#101112 8px,#101112 16px)' : undefined }}>
        <iframe key={nonce} ref={frame} title="Live preview" src="/__preview"
          style={{
            position: 'absolute', top: 0, left, width: fw, height: size.h && scale ? size.h / scale : '100%',
            transform: `scale(${scale})`, transformOrigin: '0 0', border: device === 'mobile' ? '1px solid rgba(255,255,255,.14)' : 0, background: 'transparent',
          }} />
      </div>
    </div>
  )
}
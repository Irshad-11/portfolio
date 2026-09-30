import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AboutImage, SlideEffect } from '../lib/types'

interface Props {
  images: AboutImage[]
  effect: SlideEffect
  autoplay: boolean
  interval: number
  fallback?: string | null
  initials?: string
}

const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Image slideshow with four transition effects: fade, slide, stack (card deck) and reveal (wipe).
 * Autoplay is timer based, pauses only while a mouse hovers it (never stuck after a touch), and
 * users who prefer reduced motion still get autoplay — with a plain cross-fade instead of movement.
 */
export default function Slideshow({ images, effect: wanted, autoplay, interval, fallback, initials = 'IH' }: Props) {
  const list = images.length ? images : fallback ? [{ id: 'fb', url: fallback, caption: '' }] : []
  const n = list.length
  const effect: SlideEffect = reducedMotion() && wanted !== 'fade' ? 'fade' : wanted
  const [idx, setIdx] = useState(0)
  const [prev, setPrev] = useState(0)
  const [hover, setHover] = useState(false)
  const idxRef = useRef(0)
  const drag = useRef<number | null>(null)

  useEffect(() => { idxRef.current = 0; setIdx(0); setPrev(0) }, [n, effect])

  const go = useCallback((to: number) => {
    if (n < 1) return
    const next = ((to % n) + n) % n
    setPrev(idxRef.current)
    idxRef.current = next
    setIdx(next)
  }, [n])

  useEffect(() => {
    if (!autoplay || hover || n < 2) return
    const t = window.setTimeout(() => go(idxRef.current + 1), Math.max(2, interval) * 1000)
    return () => window.clearTimeout(t)
  }, [autoplay, hover, n, idx, interval, go])

  if (!n) {
    return (
      <div className="ss flex items-center justify-center">
        <span className="font-display text-6xl text-faint">{initials}</span>
      </div>
    )
  }

  const slideStyle = (i: number): CSSProperties => {
    const d = ((i - idx) % n + n) % n // 0 = active, 1 = next…
    if (effect === 'fade') return { opacity: i === idx ? 1 : 0, zIndex: i === idx ? 2 : 1 }
    if (effect === 'slide') {
      let off = d
      if (off > n / 2) off -= n
      return { transform: `translateX(${off * 100}%)`, zIndex: 1 }
    }
    if (effect === 'stack') {
      if (d === 0) return { transform: 'none', zIndex: n + 1 }
      if (d === n - 1 && n > 1) return { transform: 'translateX(-108%) rotate(-6deg)', opacity: 0, zIndex: n + 2 }
      return {
        transform: `translate(${d * 10}px, ${d * 10}px) scale(${1 - d * 0.03})`,
        opacity: d > 3 ? 0 : 1 - d * 0.14,
        zIndex: n - d,
      }
    }
    // reveal (wipe)
    return { zIndex: i === idx ? 3 : i === prev ? 2 : 0, opacity: i === idx || i === prev ? 1 : 0, transition: 'none' }
  }

  const onDown = (e: React.PointerEvent) => { drag.current = e.clientX }
  const onUp = (e: React.PointerEvent) => {
    if (drag.current === null) return
    const dx = e.clientX - drag.current
    drag.current = null
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1))
  }
  const mouseOnly = (v: boolean) => (e: React.PointerEvent) => { if (e.pointerType === 'mouse') setHover(v) }

  return (
    <div onPointerEnter={mouseOnly(true)} onPointerLeave={mouseOnly(false)}>
      <div className="ss" style={effect === 'stack' ? { overflow: 'visible', background: 'transparent' } : undefined}
           onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => { drag.current = null }}>
        {list.map((im, i) => {
          const active = i === idx
          const cls = ['ss-slide']
          if (effect === 'reveal' && active && n > 1) cls.push('ss-wipe')
          return (
            <div key={effect === 'reveal' && active ? `${im.id}-${idx}` : im.id} className={cls.join(' ')} style={slideStyle(i)} aria-hidden={!active}>
              <img src={im.url} alt={im.caption || ''} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" draggable={false}
                   style={effect === 'stack' ? { border: '1px solid var(--border-hover)', borderRadius: 4, background: 'var(--bg-soft)' } : undefined} />
            </div>
          )
        })}

        {list[idx].caption && (
          <div className="absolute left-0 right-0 bottom-0 z-[20] p-3 pt-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,.6), transparent)' }}>
            <p className="text-[0.8rem] text-white/90">{list[idx].caption}</p>
          </div>
        )}
      </div>

      {n > 1 && (
        <div className="flex items-center gap-3 pt-3" style={effect === 'stack' ? { marginTop: 18 } : undefined}>
          <span className="text-xs tabular text-muted w-10">{idx + 1} / {n}</span>
          <div className="flex-1 flex gap-1.5">
            {list.map((im, i) => (
              <button key={im.id} onClick={() => go(i)} aria-label={`Show image ${i + 1}`} className="relative h-4 flex-1 flex items-center">
                <span className="block w-full h-[2px] bg-[var(--border-hover)] overflow-hidden relative">
                  {i === idx && (
                    autoplay && !hover
                      ? <span key={idx} className="ss-fill absolute inset-0 origin-left bg-[var(--accent)]" style={{ '--dur': `${Math.max(2, interval)}s` } as CSSProperties} />
                      : <span className="absolute inset-0 bg-[var(--accent)]" />
                  )}
                </span>
              </button>
            ))}
          </div>
          <button className="text-muted hover:text-[color:var(--accent)] p-1" onClick={() => go(idx - 1)} aria-label="Previous image"><ChevronLeft size={18} /></button>
          <button className="text-muted hover:text-[color:var(--accent)] p-1" onClick={() => go(idx + 1)} aria-label="Next image"><ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  )
}
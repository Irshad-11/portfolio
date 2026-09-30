import { CSSProperties, useEffect, useRef } from 'react'

/**
 * Very faint grid. On pointer devices the lines get slightly stronger in a small
 * area around the cursor. No crosshair, no labels — it should never compete with content.
 */
export default function GridBackground({ size = 48, interactive = true }: { size?: number; interactive?: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!interactive) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = root.current
    if (!el) return
    let raf = 0, x = 0, y = 0
    const apply = () => {
      raf = 0
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
    }
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY
      el.style.setProperty('--hot', '1')
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const leave = () => el.style.setProperty('--hot', '0')
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [size, interactive])

  return (
    <div ref={root} className="grid-bg" aria-hidden style={{ '--cell': `${size}px` } as CSSProperties}>
      <div className="g-lines g-base" />
      {interactive && <div className="g-lines g-hot" />}
    </div>
  )
}
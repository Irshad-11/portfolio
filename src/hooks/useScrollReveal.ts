import { useEffect, useRef } from 'react'
import { trackSectionVisit } from '../lib/analytics'

export function useScrollReveal(sectionName?: string) {
  const ref = useRef<HTMLElement>(null)
  const tracked = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const runReveal = () => {
      // ✅ Fix: select ALL three reveal variants
      const revealEls = el.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      revealEls.forEach((r, i) => {
        setTimeout(() => r.classList.add('visible'), i * 70)
      })
      if (sectionName && !tracked.current) {
        tracked.current = true
        trackSectionVisit(sectionName)
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) runReveal()
        })
      },
      { threshold: 0, rootMargin: '0px 0px -18% 0px' } // fire once the section top is comfortably inside the viewport
    )

    io.observe(el)

    // ✅ Fix: if already in viewport when component mounts, reveal immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.82 && rect.bottom > 0) {
      setTimeout(runReveal, 100)
    }

    return () => io.disconnect()
  }, [sectionName])

  return ref
}
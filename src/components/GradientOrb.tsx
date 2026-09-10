import { useEffect, useRef } from 'react'

export default function GradientOrb() {
  const orb = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!orb.current) return
      orb.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return <div ref={orb} className="gradient-orb" aria-hidden />
}

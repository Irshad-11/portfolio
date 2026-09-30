import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/** true while the admin has at least one unread contact message. Exposes a boolean only (no counts, no content). */
function useHasUnread() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    let dead = false
    const check = async () => {
      try {
        const { data } = await supabase.rpc('has_unread_messages')
        if (!dead) setOn(data === true)
      } catch { /* function not installed yet → no dot */ }
    }
    check()
    const id = setInterval(check, 45000)
    const vis = () => { if (document.visibilityState === 'visible') check() }
    document.addEventListener('visibilitychange', vis)
    return () => { dead = true; clearInterval(id); document.removeEventListener('visibilitychange', vis) }
  }, [])
  return on
}

/** Small notification dot. Place inside a `relative` parent (sits on its top-right corner). */
export default function UnreadDot({ className = '' }: { className?: string }) {
  const on = useHasUnread()
  if (!on) return null
  return (
    <span className={`absolute -top-1 -right-1 z-10 flex h-2.5 w-2.5 pointer-events-none ${className}`} role="status" aria-label="New message waiting">
      <span className="absolute inset-0 rounded-full bg-red-500 opacity-60 animate-ping" />
      <span className="relative h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[color:var(--bg)]" />
    </span>
  )
}
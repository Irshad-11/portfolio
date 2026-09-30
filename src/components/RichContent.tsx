import { useMemo } from 'react'
import { sanitize } from '../lib/richtext'

/** Renders editor HTML safely with the site's typography. */
export default function RichContent({ html, className = '', raw = false }: { html?: string | null; className?: string; raw?: boolean }) {
  const clean = useMemo(() => (raw ? html || '' : sanitize(html)), [html, raw])
  if (!clean) return null
  return <div className={`prose-rich ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />
}
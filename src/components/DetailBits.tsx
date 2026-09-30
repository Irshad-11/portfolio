import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export function Crumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mono flex flex-wrap items-center gap-2 text-faint mb-8">
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {c.to ? <Link to={c.to} className="hover:text-[color:var(--accent)] transition-colors">{c.label}</Link> : <span className="text-muted truncate max-w-[16rem]">{c.label}</span>}
        </span>
      ))}
    </nav>
  )
}

interface Nav { to: string; title: string; label: string }
export function PrevNext({ prev, next }: { prev?: Nav | null; next?: Nav | null }) {
  if (!prev && !next) return null
  return (
    <div className="grid sm:grid-cols-2 border border-line mt-20" style={{ background: 'var(--bg)' }}>
      {prev ? (
        <Link to={prev.to} className="group p-6 sm:p-8 hover:bg-[color:var(--accent-subtle)] transition-colors sm:border-r border-line">
          <p className="mono text-faint flex items-center gap-2 mb-3"><ArrowLeft size={13} />{prev.label}</p>
          <p className="font-display font-semibold text-ink text-xl group-hover:text-[color:var(--accent)] transition-colors">{prev.title}</p>
        </Link>
      ) : <span />}
      {next && (
        <Link to={next.to} className="group p-6 sm:p-8 hover:bg-[color:var(--accent-subtle)] transition-colors text-left sm:text-right border-t sm:border-t-0 border-line">
          <p className="mono text-faint flex items-center gap-2 mb-3 sm:justify-end">{next.label}<ArrowRight size={13} /></p>
          <p className="font-display font-semibold text-ink text-xl group-hover:text-[color:var(--accent)] transition-colors">{next.title}</p>
        </Link>
      )}
    </div>
  )
}

export function MetaGrid({ items }: { items: { label: string; value: ReactNode }[] }) {
  const rows = items.filter(i => i.value)
  return (
    <dl className="grid grid-cols-2 md:grid-cols-4 border border-line divide-x divide-y md:divide-y-0 divide-[color:var(--border)]" style={{ background: 'var(--bg)' }}>
      {rows.map(r => (
        <div key={r.label} className="p-4 sm:p-5">
          <dt className="label mb-2">{r.label}</dt>
          <dd className="text-ink text-sm sm:text-base break-words">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function NotFound({ what, back, to }: { what: string; back: string; to: string }) {
  return (
    <div className="container-x page-top pb-32 text-center">
      <p className="mono text-[color:var(--accent)] mb-4">404</p>
      <h1 className="font-display font-semibold text-ink text-3xl">{what} not found</h1>
      <Link to={to} className="btn btn-outline mt-8"><ArrowLeft size={15} />{back}</Link>
    </div>
  )
}
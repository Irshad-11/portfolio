import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowUpRight, Maximize2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import SiteShell from '../components/SiteShell'
import RichContent from '../components/RichContent'
import Lightbox from '../components/Lightbox'
import { Crumbs, MetaGrid, NotFound, PrevNext } from '../components/DetailBits'
import type { Certification } from '../lib/types'

export default function CertificationDetail() {
  const { id } = useParams()
  const { certifications, loading } = useData()
  const c = certifications.find(x => x.id === id)
  useEffect(() => { if (c) document.title = `${c.title} — ${c.issuer}` }, [c])
  return (
    <SiteShell>
      {c ? <CertificateView cert={c} all={certifications} /> : loading ? null : <NotFound what="Certificate" back="Back home" to="/#certifications" />}
    </SiteShell>
  )
}

export function CertificateView({ cert: c, all }: { cert: Certification; all: Certification[] }) {
  const [lb, setLb] = useState<number | null>(null)
  const i = all.findIndex(x => x.id === c.id)
  const prev = i > 0 ? all[i - 1] : null
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null

  return (
    <article className="container-x page-top pb-24">
      <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Certifications', to: '/#certifications' }, { label: c.title }]} />

      <header className="mb-12 max-w-4xl">
        <div className="flex items-center gap-4 mb-5">
          {c.badge_url && <img src={c.badge_url} alt="" className="h-10 w-auto object-contain" />}
          <p className="mono text-[color:var(--accent)]">{c.issuer}</p>
          {c.credential_url && <span className="tag-flag">Verified</span>}
        </div>
        <h1 className="font-display font-semibold leading-tight text-ink text-2xl sm:text-4xl break-words">{c.title}</h1>
      </header>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-7">
          {c.image_url ? (
            <button type="button" onClick={() => setLb(0)} className="group relative block w-full marks border border-line bg-soft cursor-zoom-in" aria-label="Enlarge certificate">
              <img src={c.image_url} alt={`${c.title} certificate`} className="w-full h-auto" />
              <span className="absolute bottom-3 right-3 mono bg-[var(--bg)] border border-line px-2.5 py-1.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={12} />Enlarge</span>
            </button>
          ) : <div className="placeholder-x aspect-[4/3] border border-line marks" />}
        </div>

        <div className="lg:col-span-5 space-y-8">
          <MetaGrid items={[
            { label: 'Issued', value: c.issue_date },
            { label: 'Expires', value: c.expiry_date },
            { label: 'Issuer', value: c.issuer },
            { label: 'Credential ID', value: c.credential_id ? <span className="font-mono text-sm">{c.credential_id}</span> : '' },
          ]} />
          {c.credential_url && (
            <a href={c.credential_url} target="_blank" rel="noopener noreferrer" className="btn btn-solid w-full sm:w-auto">Verify credential <ArrowUpRight size={15} /></a>
          )}
          {c.skills?.length > 0 && (
            <div><p className="label mb-3">Skills covered</p><div className="flex flex-wrap gap-2">{c.skills.map(s => <span key={s} className="tag">{s}</span>)}</div></div>
          )}
        </div>
      </div>

      {c.description && (
        <div className="mt-16 max-w-3xl"><p className="label mb-5">About this certification</p><RichContent html={c.description} className="prose-lg" /></div>
      )}

      <PrevNext
        prev={prev && { to: `/certifications/${prev.id}`, title: prev.title, label: 'Previous' }}
        next={next && { to: `/certifications/${next.id}`, title: next.title, label: 'Next' }}
      />
      <Lightbox images={c.image_url ? [c.image_url] : []} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </article>
  )
}
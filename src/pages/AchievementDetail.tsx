import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import SiteShell from '../components/SiteShell'
import RichContent from '../components/RichContent'
import Lightbox from '../components/Lightbox'
import { Crumbs, NotFound, PrevNext } from '../components/DetailBits'
import { DynamicIcon } from '../lib/icons'
import { achSummary } from '../sections/Achievements'
import type { Achievement } from '../lib/types'

export default function AchievementDetail() {
  const { id } = useParams()
  const { achievements, loading } = useData()
  const a = achievements.find(x => x.id === id)
  useEffect(() => { if (a) document.title = `${a.title} — Achievement` }, [a])
  return (
    <SiteShell>
      {a ? <AchievementView item={a} all={achievements} /> : loading ? null : <NotFound what="Achievement" back="Back home" to="/#achievements" />}
    </SiteShell>
  )
}

export function AchievementView({ item: a, all }: { item: Achievement; all: Achievement[] }) {
  const [lb, setLb] = useState<number | null>(null)
  const i = all.findIndex(x => x.id === a.id)
  const prev = i > 0 ? all[i - 1] : null
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null
  const imgs = [a.image_url, ...(a.images || [])].filter(Boolean) as string[]
  const sum = achSummary(a)

  return (
    <article className="container-x page-top pb-24">
      <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Achievements', to: '/#achievements' }, { label: a.title }]} />

      <header className="max-w-4xl mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="w-14 h-14 border border-[color:var(--accent)] text-[color:var(--accent)] flex items-center justify-center text-2xl"><DynamicIcon name={a.icon || '🏆'} size={28} /></span>
          {a.date && <p className="mono text-muted">{a.date}</p>}
        </div>
        <h1 className="font-display font-semibold leading-tight text-ink text-2xl sm:text-4xl break-words">{a.title}</h1>
        {sum && !a.content && <p className="mt-6 text-xl text-muted max-w-2xl leading-relaxed">{sum}</p>}
      </header>

      {a.image_url && (
        <button type="button" onClick={() => setLb(0)} className="block w-full marks border border-line bg-soft mb-14 cursor-zoom-in">
          <img src={a.image_url} alt="" className="w-full max-h-[70vh] object-cover" />
        </button>
      )}

      {(a.content || a.summary) && (
        <div className="max-w-3xl">
          {a.summary && a.content && <p className="text-xl text-ink leading-relaxed mb-8 font-display">{a.summary}</p>}
          <RichContent html={a.content} className="prose-lg" />
        </div>
      )}

      {a.images?.length > 0 && (
        <div className="mt-16">
          <p className="label mb-4">Gallery</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {a.images.map((g, k) => (
              <button key={g + k} type="button" onClick={() => setLb(a.image_url ? k + 1 : k)} className="border border-line overflow-hidden bg-soft aspect-[4/3] cursor-zoom-in group">
                <img src={g} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </button>
            ))}
          </div>
        </div>
      )}

      <PrevNext
        prev={prev && { to: `/achievements/${prev.id}`, title: prev.title, label: 'Previous' }}
        next={next && { to: `/achievements/${next.id}`, title: next.title, label: 'Next' }}
      />
      <Lightbox images={imgs} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </article>
  )
}
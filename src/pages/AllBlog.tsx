import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useData } from '../context/DataContext'
import SiteShell from '../components/SiteShell'
import { Crumbs } from '../components/DetailBits'
import { Empty } from '../components/ui'
import { PostLead, PostRow } from '../sections/Blog'
import { excerptOf } from '../lib/richtext'
import { useSeo } from './Home'

export default function AllBlog() {
  useSeo()
  return <SiteShell><AllBlogView /></SiteShell>
}

export function AllBlogView() {
  const { blogPosts } = useData()
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('')
  const tags = useMemo(() => Array.from(new Set(blogPosts.flatMap(p => p.tags || []))).sort(), [blogPosts])
  const list = blogPosts.filter(p =>
    (!tag || p.tags?.includes(tag)) &&
    (!q || `${p.title} ${p.excerpt || excerptOf(p.content, 400)} ${p.tags?.join(' ')}`.toLowerCase().includes(q.toLowerCase())),
  )
  const [lead, ...rest] = list

  return (
    <div className="container-x page-top pb-24">
      <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Writing' }]} />
      <div className="grid md:grid-cols-12 gap-6 mb-12">
        <h1 className="md:col-span-8 font-display font-semibold leading-tight text-ink text-2xl sm:text-4xl">Writing<span className="text-[color:var(--accent)]">.</span></h1>
        <p className="md:col-span-4 self-end mono text-faint">{list.length} article{list.length === 1 ? '' : 's'}</p>
      </div>

      <div className="flex flex-col gap-4 border-y border-line py-5 mb-14" style={{ background: 'var(--bg)' }}>
        <label className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
          <span className="sr-only">Search articles</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search articles…" className="field !pl-11 !py-3" />
        </label>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setTag('')} className={`mono px-3 py-1.5 border transition-colors ${!tag ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--accent-ink)]' : 'border-line text-muted hover:text-ink'}`}>All</button>
            {tags.map(t => (
              <button key={t} onClick={() => setTag(tag === t ? '' : t)} className={`mono !normal-case px-3 py-1.5 border transition-colors ${tag === t ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--accent-ink)]' : 'border-line text-muted hover:text-ink'}`}>#{t}</button>
            ))}
          </div>
        )}
      </div>

      {!lead ? <Empty>No articles found.</Empty> : (
        <>
          <PostLead p={lead} />
          {rest.length > 0 && <div className="mt-14 divide-y divide-[color:var(--border)] border-y border-line">{rest.map(p => <PostRow key={p.id} p={p} />)}</div>}
        </>
      )}
    </div>
  )
}
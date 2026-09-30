import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, Link2, Linkedin, Facebook, Twitter } from 'lucide-react'
import { useData } from '../context/DataContext'
import SiteShell from '../components/SiteShell'
import RichContent from '../components/RichContent'
import { Crumbs, NotFound, PrevNext } from '../components/DetailBits'
import { fmtDate } from '../components/ui'
import { postExcerpt, postRead } from '../sections/Blog'
import { sanitize, withToc } from '../lib/richtext'
import type { BlogPost } from '../lib/types'

export default function BlogDetail() {
  const { slug } = useParams()
  const { blogPosts, loading } = useData()
  const p = blogPosts.find(x => x.slug === slug)
  useEffect(() => {
    if (!p) return
    document.title = `${p.title} — Writing`
    document.querySelector('meta[name="description"]')?.setAttribute('content', postExcerpt(p))
  }, [p])
  return (
    <SiteShell>
      {p ? <PostView post={p} all={blogPosts} /> : loading ? null : <NotFound what="Article" back="All articles" to="/blog" />}
    </SiteShell>
  )
}

export function PostView({ post: p, all }: { post: BlogPost; all: BlogPost[] }) {
  const { html, toc } = useMemo(() => withToc(sanitize(p.content)), [p.content])
  const [active, setActive] = useState('')
  const [copied, setCopied] = useState(false)
  const i = all.findIndex(x => x.id === p.id)
  const newer = i > 0 ? all[i - 1] : null
  const older = i >= 0 && i < all.length - 1 ? all[i + 1] : null
  const url = typeof window !== 'undefined' ? window.location.origin + `/blog/${p.slug}` : ''

  useEffect(() => {
    if (!toc.length) return
    const els = toc.map(t => document.getElementById(t.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-15% 0px -75% 0px' })
    els.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [toc, html])

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* ignore */ }
  }
  const share = (base: string) => `${base}${encodeURIComponent(url)}`

  return (
    <article className="container-x page-top pb-24">
      <Crumbs items={[{ label: 'Home', to: '/' }, { label: 'Writing', to: '/blog' }, { label: p.title }]} />

      <header className="max-w-4xl">
        <p className="mono text-faint mb-5">{fmtDate(p.created_at)} <span className="mx-2 text-[color:var(--accent)]">/</span> {postRead(p)}</p>
        <h1 className="font-display font-semibold leading-tight text-ink text-2xl sm:text-4xl break-words">{p.title}</h1>
        {p.excerpt && <p className="mt-6 text-xl text-muted leading-relaxed max-w-3xl">{p.excerpt}</p>}
        {p.tags?.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{p.tags.map(t => <span key={t} className="tag">#{t}</span>)}</div>}
      </header>

      {p.image_url && (
        <div className="marks border border-line overflow-hidden bg-soft mt-12 mb-14">
          <img src={p.image_url} alt="" className="w-full aspect-[16/8] object-cover" />
        </div>
      )}

      <div className={`grid lg:grid-cols-12 gap-x-12 gap-y-10 ${p.image_url ? '' : 'mt-12'}`}>
        {toc.length > 1 && (
          <aside className="lg:col-span-3 order-first lg:order-none">
            <nav className="lg:sticky lg:top-28 border-l border-line pl-5" aria-label="Table of contents">
              <p className="label mb-4">On this page</p>
              <ol className="space-y-2.5">
                {toc.map(t => (
                  <li key={t.id} className={t.level === 3 ? 'pl-4' : ''}>
                    <a href={`#${t.id}`} onClick={e => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth' }) }}
                      className={`block text-sm leading-snug transition-colors ${active === t.id ? 'text-[color:var(--accent)]' : 'text-muted hover:text-ink'}`}>{t.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}

        <div className={toc.length > 1 ? 'lg:col-span-8' : 'lg:col-span-9 lg:col-start-1 max-w-3xl'}>
          <RichContent html={html} raw className="prose-lg prose-drop" />

          <div className="mt-14 pt-6 border-t border-line flex flex-wrap items-center gap-3">
            <span className="label mr-2">Share</span>
            <button onClick={copy} className="icon-btn" aria-label="Copy link">{copied ? <Check size={16} /> : <Link2 size={16} />}</button>
            <a className="icon-btn" aria-label="Share on X" target="_blank" rel="noopener noreferrer" href={share(`https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=`)}><Twitter size={16} /></a>
            <a className="icon-btn" aria-label="Share on LinkedIn" target="_blank" rel="noopener noreferrer" href={share('https://www.linkedin.com/sharing/share-offsite/?url=')}><Linkedin size={16} /></a>
            <a className="icon-btn" aria-label="Share on Facebook" target="_blank" rel="noopener noreferrer" href={share('https://www.facebook.com/sharer/sharer.php?u=')}><Facebook size={16} /></a>
          </div>
        </div>
      </div>

      <PrevNext
        prev={older && { to: `/blog/${older.slug}`, title: older.title, label: 'Older' }}
        next={newer && { to: `/blog/${newer.slug}`, title: newer.title, label: 'Newer' }}
      />
    </article>
  )
}
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import { SectionShell, fmtDate } from '../components/ui'
import { excerptOf, readingTime } from '../lib/richtext'
import type { BlogPost } from '../lib/types'

export const postExcerpt = (p: BlogPost) => p.excerpt || excerptOf(p.content, 170)
export const postRead = (p: BlogPost) => p.read_time || readingTime(p.content)

export function PostRow({ p }: { p: BlogPost }) {
  return (
    <div>
    <Link to={`/blog/${p.slug}`} className="group grid grid-cols-[1fr_auto] sm:grid-cols-[8rem_1fr_auto] items-center gap-x-6 gap-y-1 py-6 px-3 -mx-3 transition-colors hover:bg-[color:var(--accent-subtle)]">
      <span className="hidden sm:block mono text-faint tabular">{fmtDate(p.created_at)}</span>
      <span className="min-w-0">
        <span className="block font-display font-semibold text-ink text-base sm:text-xl leading-snug group-hover:text-[color:var(--accent)] transition-colors">{p.title}</span>
        <span className="block text-sm text-muted line-clamp-2 mt-1 max-w-2xl">{postExcerpt(p)}</span>
        <span className="block mono !text-[0.75rem] text-faint mt-2 sm:hidden">{fmtDate(p.created_at)} · {postRead(p)}</span>
      </span>
      <span className="flex items-center gap-4">
        <span className="hidden md:block mono text-faint">{postRead(p)}</span>
        <ArrowUpRight size={20} className="text-faint group-hover:text-[color:var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </span>
    </Link>
    </div>
  )
}

export function PostLead({ p }: { p: BlogPost }) {
  return (
    <Link to={`/blog/${p.slug}`} className="group grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
      <div className="lg:col-span-7 relative marks border border-line overflow-hidden bg-soft">
        <div className="corner-ribbon"><span>Latest</span></div>
        <div className="aspect-[16/10]">
          {p.image_url
            ? <img src={p.image_url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
            : <div className="placeholder-x w-full h-full flex items-center justify-center font-display font-semibold text-6xl text-faint">{p.title.slice(0, 2).toUpperCase()}</div>}
        </div>
      </div>
      <div className="lg:col-span-5">
        <p className="mono text-faint mb-4">{fmtDate(p.created_at)} <span className="mx-2 text-[color:var(--accent)]">/</span> {postRead(p)}</p>
        <h3 className="font-display font-semibold leading-snug text-ink text-lg sm:text-2xl group-hover:text-[color:var(--accent)] transition-colors">{p.title}</h3>
        <p className="mt-4 text-muted leading-relaxed">{postExcerpt(p)}</p>
        {p.tags?.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{p.tags.slice(0, 4).map(t => <span key={t} className="tag">#{t}</span>)}</div>}
        <span className="mt-6 inline-flex items-center gap-2 mono text-[color:var(--accent)] group-hover:gap-4 transition-all">Read article <ArrowRight size={14} /></span>
      </div>
    </Link>
  )
}

export default function Blog() {
  const { blogPosts, sections } = useData()
  const sec = sections.find(s => s.key === 'blog')
  if (!sec) return null
  const [lead, ...rest] = blogPosts
  return (
    <SectionShell id="blog" index={sec.index} title={sec.title} subtitle={sec.subtitle} aside={`${blogPosts.length} articles`}>
      <div className="reveal"><PostLead p={lead} /></div>
      {rest.length > 0 && (
        <div className="reveal mt-10 divide-y divide-[color:var(--border)] border-y border-line">
          {rest.slice(0, 3).map(p => <PostRow key={p.id} p={p} />)}
        </div>
      )}
      <div className="reveal mt-10"><Link to="/blog" className="btn btn-outline">All articles <ArrowRight size={15} /></Link></div>
    </SectionShell>
  )
}
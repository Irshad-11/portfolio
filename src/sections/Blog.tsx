import { useNavigate } from 'react-router-dom'
import { Clock, ArrowRight, Tag } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import SectionHeading from '../components/SectionHeading'

const PREVIEW_COUNT = 3

export default function Blog() {
  const { blogPosts, loading } = useData()
  const ref = useScrollReveal('blog')
  const navigate = useNavigate()

  const published = blogPosts.filter(p => p.published)
  if (!loading && published.length === 0) return null

  const preview = published.slice(0, PREVIEW_COUNT)
  const hasMore = published.length > PREVIEW_COUNT

  return (
    <section id="blog" ref={ref as React.RefObject<HTMLElement>} className="section-base">
      <div className="max-w-5xl mx-auto">
        <div className="reveal flex items-end justify-between mb-12">
          <SectionHeading title="Blog" subtitle="Thoughts, tutorials, and deep dives" align="left" />
          {hasMore && (
            <button
              onClick={() => navigate('/blog')}
              className="hidden sm:flex items-center gap-1.5 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors mb-4"
            >
              All posts <ArrowRight size={14} />
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {preview.map((post, i) => (
            <article
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="reveal glass glass-hover rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 flex flex-col"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {post.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-[color:var(--text-faint)] mb-3">
                  <span className="flex items-center gap-1"><Clock size={11} />{post.read_time}</span>
                  <span className="text-[color:var(--border-hover)]">·</span>
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h3 className="font-semibold text-[color:var(--text)] group-hover:text-[color:var(--accent)] transition-colors leading-snug text-sm mb-2 flex-1">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-xs text-[color:var(--text-muted)] leading-relaxed line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                )}

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {post.tags.slice(0, 3).map(t => (
                      <span key={t} className="inline-flex items-center gap-1 text-[10px] accent-subtle accent px-2 py-0.5 rounded-full">
                        <Tag size={8} />{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <div className="reveal mt-8 text-center">
            <button onClick={() => navigate('/blog')} className="btn-outline gap-2">
              View all {published.length} posts <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

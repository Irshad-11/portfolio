import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Tag } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function AllBlog() {
  const { blogPosts } = useData()
  const navigate = useNavigate()
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const published = blogPosts.filter(p => p.published)
  const allTags = Array.from(new Set(published.flatMap(p => p.tags)))
  const filtered = activeTag ? published.filter(p => p.tags.includes(activeTag)) : published

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors mb-8">
          <ArrowLeft size={15} /> Back
        </button>

        <h1 className="text-4xl font-black text-[color:var(--text)] mb-2">Blog</h1>
        <p className="text-[color:var(--text-muted)] mb-8">{published.length} posts</p>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${!activeTag ? 'accent-bg text-white' : 'glass text-[color:var(--text-muted)]'}`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${activeTag === tag ? 'accent-bg text-white' : 'glass text-[color:var(--text-muted)]'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {filtered.map(post => (
            <article
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="glass glass-hover rounded-xl p-5 cursor-pointer flex gap-5 items-start transition-all duration-200 hover:-translate-y-0.5"
            >
              {post.image_url && (
                <img src={post.image_url} alt={post.title}
                     className="w-20 h-16 object-cover rounded-lg flex-shrink-0 hidden sm:block" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-xs text-[color:var(--text-faint)] mb-2">
                  <span className="flex items-center gap-1"><Clock size={10}/>{post.read_time}</span>
                  <span>·</span>
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="font-semibold text-[color:var(--text)] mb-1.5 hover:text-[color:var(--accent)] transition-colors">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-[color:var(--text-muted)] leading-relaxed line-clamp-2">{post.excerpt}</p>}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 text-[10px] accent-subtle accent px-2 py-0.5 rounded-full">
                        <Tag size={8}/>{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

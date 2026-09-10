import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Tag } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { blogPosts } = useData()
  const navigate = useNavigate()

  const post = blogPosts.find(p => p.slug === slug && p.published)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[color:var(--text-faint)] mb-4">Post not found</p>
          <button onClick={() => navigate('/blog')} className="btn-outline">Browse all posts</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors mb-8">
          <ArrowLeft size={15} /> Back
        </button>

        {post.image_url && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 border border-[color:var(--border)]">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-[color:var(--text-faint)] mb-4 flex-wrap">
          <span className="flex items-center gap-1"><Clock size={13}/>{post.read_time}</span>
          <span>·</span>
          <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[color:var(--text)] leading-tight mb-4">{post.title}</h1>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-xs accent-subtle accent px-3 py-1 rounded-full">
                <Tag size={10}/>{t}
              </span>
            ))}
          </div>
        )}

        <div className="h-px bg-[color:var(--border)] mb-8" />

        {/* Content — rendered as pre-formatted for demo */}
        <div className="prose prose-sm max-w-none text-[color:var(--text-muted)] leading-relaxed">
          {post.content ? (
            <pre className="font-sans whitespace-pre-wrap text-sm leading-relaxed text-[color:var(--text-muted)]">
              {post.content}
            </pre>
          ) : (
            <p className="text-[color:var(--text-faint)] italic">Content coming soon...</p>
          )}
        </div>
      </div>
    </div>
  )
}

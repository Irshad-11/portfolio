import CollectionWorkspace from '../components/CollectionWorkspace'
import { Card, Field, TagInput } from '../components/Fields'
import { ImageField } from '../components/ImageField'
import RichTextEditor from '../components/RichTextEditor'
import { mergeDraft } from '../lib'
import { readingTime, slugify } from '../../lib/richtext'
import type { BlogPost } from '../../lib/types'

export default function BlogPage() {
  return (
    <CollectionWorkspace<BlogPost>
      table="blog_posts" title="Blog" singular="Article" order="created_at" ascending={false} reorder={false}
      description="Long-form writing with headings, images, code, tables and an automatic table of contents."
      blank={() => ({ title: '', slug: '', excerpt: '', content: '', tags: [], read_time: '1 min read', published: true, visible: true })}
      row={p => ({ title: p.title || 'Untitled', meta: new Date(p.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), thumb: p.image_url || null,
        badges: !p.published ? <span className="badge-coming-soon">Draft</span> : undefined })}
      validate={d => (!d.title?.trim() ? 'Give the article a title' : null)}
      prepare={d => ({ ...d, slug: slugify(d.slug || d.title || '') || `post-${Date.now()}`, tags: d.tags || [], read_time: readingTime(d.content) })}
      toggles={[{ field: 'published', label: 'Published', hint: 'Unpublished articles are saved as drafts.' }]}
      previews={(d, items) => {
        const list = mergeDraft(items, { slug: d.slug || slugify(d.title || '') || 'draft', ...d }, { published: true })
        return [
          { label: 'Article page', view: 'post', focus: d.id || 'draft', patch: { blogPosts: list } },
          { label: 'On the home page', view: 'blog', patch: { blogPosts: list } },
        ]
      }}
      form={({ draft, set }) => (
        <>
          <Card title="Article">
            <Field label="Title"><input className="admin-input !text-base !font-semibold" value={draft.title || ''} onChange={e => set({ title: e.target.value })} /></Field>
            <Field label="Excerpt" hint="Shown in lists and search results. Leave empty to use the first lines of the article."><textarea className="admin-input" rows={2} value={draft.excerpt || ''} onChange={e => set({ excerpt: e.target.value })} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="URL slug"><input className="admin-input font-mono" value={draft.slug || ''} onChange={e => set({ slug: slugify(e.target.value) })} placeholder={slugify(draft.title || '') || 'my-article'} /></Field>
              <Field label="Reading time" hint="Calculated automatically on save."><input className="admin-input" disabled value={readingTime(draft.content)} /></Field>
            </div>
            <Field label="Tags"><TagInput value={draft.tags || []} onChange={tags => set({ tags })} placeholder="react, notes, career…" /></Field>
            <ImageField label="Cover image" folder="blog" value={draft.image_url} onChange={v => set({ image_url: v })} />
          </Card>
          <Card title="Content" desc="H2 and H3 headings become the table of contents.">
            <RichTextEditor key={draft.id || 'new'} value={draft.content || ''} onChange={v => set({ content: v })} folder="blog" minHeight={420} placeholder="Write your article…" />
          </Card>
        </>
      )}
    />
  )
}
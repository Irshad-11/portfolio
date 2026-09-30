import CollectionWorkspace from '../components/CollectionWorkspace'
import { Card, Field, Segmented, TagInput } from '../components/Fields'
import { ImageField, StringGallery } from '../components/ImageField'
import RichTextEditor from '../components/RichTextEditor'
import { mergeDraft } from '../lib'
import { slugify } from '../../lib/richtext'
import { StatusBadge } from '../../sections/Projects'
import type { Project, ProjectStatus } from '../../lib/types'

export default function ProjectsPage() {
  return (
    <CollectionWorkspace<Project>
      table="projects" title="Projects" singular="Project"
      description="Featured projects get a large spread on the home page; the rest appear in the index. Everything gets its own case-study page."
      blank={() => ({ title: '', slug: '', description: '', long_description: '', tech_stack: [], images: [], status: 'live' as ProjectStatus, featured: false, project_date: '', visible: true })}
      row={p => ({ title: p.title || 'Untitled', meta: [p.project_date, p.tech_stack?.slice(0, 3).join(', ')].filter(Boolean).join(' · '), thumb: p.image_url || null,
        badges: <><StatusBadge status={p.status} />{p.featured && <span className="tag-flag !text-[0.55rem]">Featured</span>}</> })}
      validate={d => (!d.title?.trim() ? 'Give the project a title' : null)}
      prepare={d => ({ ...d, slug: slugify(d.slug || d.title || '') || `project-${Date.now()}`, tech_stack: d.tech_stack || [], images: d.images || [] })}
      toggles={[{ field: 'featured', label: 'Featured', hint: 'Shown as a large spread with a “Featured” ribbon.' }]}
      previews={(d, items) => {
        const list = mergeDraft(items, { slug: d.slug || slugify(d.title || '') || 'draft', ...d })
        return [
          { label: 'On the home page', view: 'projects', patch: { projects: list } },
          { label: 'Case-study page', view: 'project', focus: d.id || 'draft', patch: { projects: list } },
        ]
      }}
      form={({ draft, set }) => (
        <>
          <Card title="Basics">
            <Field label="Title"><input className="admin-input" value={draft.title || ''} onChange={e => set({ title: e.target.value })} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Date" hint="Free text — “Mar 2025”, “2024”, “Spring 2025”."><input className="admin-input" value={draft.project_date || ''} onChange={e => set({ project_date: e.target.value })} /></Field>
              <Field label="URL slug" hint="Auto-generated from the title if empty."><input className="admin-input font-mono" value={draft.slug || ''} onChange={e => set({ slug: slugify(e.target.value) })} placeholder={slugify(draft.title || '') || 'my-project'} /></Field>
            </div>
            <Field label="Status">
              <Segmented value={(draft.status || 'live') as ProjectStatus} onChange={status => set({ status })} options={[{ value: 'live', label: 'Live' }, { value: 'wip', label: 'In progress' }, { value: 'coming_soon', label: 'Coming soon' }]} />
            </Field>
            <Field label="Short description" hint="One or two lines for lists and previews."><textarea className="admin-input" rows={3} value={draft.description || ''} onChange={e => set({ description: e.target.value })} /></Field>
            <Field label="Technologies"><TagInput value={draft.tech_stack || []} onChange={tech_stack => set({ tech_stack })} placeholder="React, Supabase, Tailwind…" /></Field>
          </Card>

          <Card title="Media">
            <ImageField label="Cover image" folder="projects" value={draft.image_url} onChange={v => set({ image_url: v })} />
            <StringGallery label="Gallery (case-study page)" folder="projects" values={draft.images || []} onChange={images => set({ images })} />
          </Card>

          <Card title="Links">
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Live URL"><input className="admin-input" value={draft.live_url || ''} onChange={e => set({ live_url: e.target.value })} placeholder="https://" /></Field>
              <Field label="Source code"><input className="admin-input" value={draft.github_url || ''} onChange={e => set({ github_url: e.target.value })} placeholder="https://github.com/…" /></Field>
              <Field label="npm / package"><input className="admin-input" value={draft.npm_url || ''} onChange={e => set({ npm_url: e.target.value })} placeholder="https://npmjs.com/…" /></Field>
            </div>
          </Card>

          <Card title="Case study" desc="Full write-up shown on the project page.">
            <RichTextEditor key={draft.id || 'new'} value={draft.long_description || ''} onChange={v => set({ long_description: v })} folder="projects" placeholder="What is it, why did you build it, what was hard, what did you learn…" minHeight={260} />
          </Card>
        </>
      )}
    />
  )
}
import CollectionWorkspace from '../components/CollectionWorkspace'
import { Card, Field } from '../components/Fields'
import { ImageField } from '../components/ImageField'
import RichTextEditor from '../components/RichTextEditor'
import { mergeDraft } from '../lib'
import { htmlToText } from '../../lib/richtext'
import type { Testimonial } from '../../lib/types'

export default function TestimonialsPage() {
  return (
    <CollectionWorkspace<Testimonial>
      table="testimonials" title="Testimonials" singular="Testimonial"
      description="Quotes support bold, italics, lists, highlights and links."
      blank={() => ({ name: '', role: '', company: '', company_url: '', avatar_url: '', content: '', visible: true })}
      row={t => ({ title: t.name || 'Unnamed', meta: [t.role, t.company].filter(Boolean).join(', ') || htmlToText(t.content).slice(0, 60), thumb: t.avatar_url || null })}
      validate={d => (!d.name?.trim() ? 'Who said it?' : !d.content?.trim() ? 'Add the quote' : null)}
      previews={(d, items) => [{ label: 'Testimonials', view: 'testimonials', patch: { testimonials: mergeDraft(items, d) } }]}
      form={({ draft, set }) => (
        <>
          <Card title="Quote">
            <RichTextEditor key={draft.id || 'new'} compact value={draft.content || ''} onChange={v => set({ content: v })} minHeight={150} placeholder="What did they say?" />
          </Card>
          <Card title="Person">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name"><input className="admin-input" value={draft.name || ''} onChange={e => set({ name: e.target.value })} /></Field>
              <Field label="Role"><input className="admin-input" value={draft.role || ''} onChange={e => set({ role: e.target.value })} /></Field>
              <Field label="Company"><input className="admin-input" value={draft.company || ''} onChange={e => set({ company: e.target.value })} /></Field>
              <Field label="Company link"><input className="admin-input" value={draft.company_url || ''} onChange={e => set({ company_url: e.target.value })} placeholder="https://" /></Field>
            </div>
            <ImageField label="Photo" folder="testimonials" aspect="1 / 1" value={draft.avatar_url} onChange={v => set({ avatar_url: v })} />
          </Card>
        </>
      )}
    />
  )
}
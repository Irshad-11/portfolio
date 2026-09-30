import CollectionWorkspace from '../components/CollectionWorkspace'
import { Card, Field, TagInput } from '../components/Fields'
import { mergeDraft } from '../lib'
import type { Experience } from '../../lib/types'

export default function ExperiencePage() {
  return (
    <CollectionWorkspace<Experience>
      table="experience" title="Experience" singular="Position"
      description="Work, internships and volunteering. The section hides itself when there are no entries."
      blank={() => ({ company: '', role: '', period: '', location: '', website: '', description: [], tech_stack: [], visible: true })}
      row={e => ({ title: `${e.role || 'Role'} · ${e.company || 'Company'}`, meta: e.period || '' })}
      validate={d => (!d.role?.trim() || !d.company?.trim() ? 'Role and company are required' : null)}
      prepare={d => ({ ...d, description: (d.description || []).filter(Boolean), tech_stack: d.tech_stack || [] })}
      previews={(d, items) => [{ label: 'Experience', view: 'experience', patch: { experience: mergeDraft(items, d) } }]}
      form={({ draft, set }) => (
        <Card title="Position">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Role"><input className="admin-input" value={draft.role || ''} onChange={e => set({ role: e.target.value })} /></Field>
            <Field label="Company / organisation"><input className="admin-input" value={draft.company || ''} onChange={e => set({ company: e.target.value })} /></Field>
            <Field label="Period"><input className="admin-input" value={draft.period || ''} onChange={e => set({ period: e.target.value })} placeholder="2024 — Present" /></Field>
            <Field label="Location"><input className="admin-input" value={draft.location || ''} onChange={e => set({ location: e.target.value })} /></Field>
          </div>
          <Field label="Website"><input className="admin-input" value={draft.website || ''} onChange={e => set({ website: e.target.value })} placeholder="https://" /></Field>
          <Field label="Highlights" hint="One bullet per line.">
            <textarea className="admin-input" rows={5} value={(draft.description || []).join('\n')} onChange={e => set({ description: e.target.value.split('\n') })} />
          </Field>
          <Field label="Technologies"><TagInput value={draft.tech_stack || []} onChange={tech_stack => set({ tech_stack })} /></Field>
        </Card>
      )}
    />
  )
}
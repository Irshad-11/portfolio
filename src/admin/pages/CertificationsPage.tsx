import CollectionWorkspace from '../components/CollectionWorkspace'
import { Card, Field, TagInput } from '../components/Fields'
import { ImageField } from '../components/ImageField'
import RichTextEditor from '../components/RichTextEditor'
import { mergeDraft } from '../lib'
import type { Certification } from '../../lib/types'

export default function CertificationsPage() {
  return (
    <CollectionWorkspace<Certification>
      table="certifications" title="Certifications" singular="Certificate"
      description="Upload the certificate itself and add details. Visitors open each one on its own page."
      blank={() => ({ title: '', issuer: '', issue_date: '', expiry_date: '', credential_id: '', credential_url: '', description: '', skills: [], visible: true })}
      row={c => ({ title: c.title || 'Untitled', meta: [c.issuer, c.issue_date].filter(Boolean).join(' · '), thumb: c.image_url || c.badge_url || null })}
      validate={d => (!d.title?.trim() ? 'Give the certificate a title' : !d.issuer?.trim() ? 'Who issued it?' : null)}
      prepare={d => ({ ...d, skills: d.skills || [] })}
      previews={(d, items) => {
        const list = mergeDraft(items, d)
        return [
          { label: 'In the list', view: 'certifications', patch: { certifications: list } },
          { label: 'Detail page', view: 'certificate', focus: d.id || 'draft', patch: { certifications: list } },
        ]
      }}
      form={({ draft, set }) => (
        <>
          <Card title="Details">
            <Field label="Title"><input className="admin-input" value={draft.title || ''} onChange={e => set({ title: e.target.value })} placeholder="Responsive Web Design" /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Issuer"><input className="admin-input" value={draft.issuer || ''} onChange={e => set({ issuer: e.target.value })} placeholder="freeCodeCamp" /></Field>
              <Field label="Credential ID"><input className="admin-input font-mono" value={draft.credential_id || ''} onChange={e => set({ credential_id: e.target.value })} /></Field>
              <Field label="Issued"><input className="admin-input" value={draft.issue_date || ''} onChange={e => set({ issue_date: e.target.value })} placeholder="Jun 2025" /></Field>
              <Field label="Expires (optional)"><input className="admin-input" value={draft.expiry_date || ''} onChange={e => set({ expiry_date: e.target.value })} placeholder="Jun 2028" /></Field>
            </div>
            <Field label="Verification link" hint="Adds a “Verified” tag and a verify button."><input className="admin-input" value={draft.credential_url || ''} onChange={e => set({ credential_url: e.target.value })} placeholder="https://" /></Field>
            <Field label="Skills covered"><TagInput value={draft.skills || []} onChange={skills => set({ skills })} /></Field>
          </Card>
          <Card title="Images">
            <ImageField label="Certificate image" folder="certificates" aspect="4 / 3" value={draft.image_url} onChange={v => set({ image_url: v })} hint="The scanned certificate or screenshot. Visitors can enlarge it." />
            <ImageField label="Issuer logo / badge (optional)" folder="certificates" aspect="1 / 1" contain value={draft.badge_url} onChange={v => set({ badge_url: v })} />
          </Card>
          <Card title="Description" desc="Rich text — what you learned, the syllabus, project work…">
            <RichTextEditor key={draft.id || 'new'} value={draft.description || ''} onChange={v => set({ description: v })} folder="certificates" minHeight={200} />
          </Card>
        </>
      )}
    />
  )
}
import CollectionWorkspace from '../components/CollectionWorkspace'
import { Card, Field, Segmented, TagInput } from '../components/Fields'
import { mergeDraft } from '../lib'
import { LEVELS, CATEGORY_ORDER } from '../../lib/skillUtils'
import type { Expertise } from '../../lib/types'

const SUGGEST = ['Computer Science', 'Software Engineering', 'Web Engineering', 'Databases', 'Practices', 'Soft skills']

export default function ExpertisePage() {
  return (
    <CollectionWorkspace<Expertise>
      table="expertise" title="Expertise" singular="Concept"
      description="Conceptual knowledge — DSA, OOP, system design, testing and so on. Shown as an expandable index next to your tools."
      blank={() => ({ title: '', category: 'Computer Science', level: 3, note: '', tags: [], visible: true })}
      row={e => ({ title: e.title, meta: `${e.category} · ${LEVELS[(e.level || 1) - 1]}` })}
      validate={d => (!d.title?.trim() ? 'Give it a title' : null)}
      previews={(d, items) => [{ label: 'Skills section', view: 'skills', patch: { expertise: mergeDraft(items, d) } }]}
      form={({ draft, set }) => (
        <Card title="Concept">
          <Field label="Title"><input className="admin-input" value={draft.title || ''} onChange={e => set({ title: e.target.value })} placeholder="Data Structures & Algorithms" /></Field>
          <Field label="Group" hint="Concepts with the same group are listed together.">
            <input className="admin-input" list="ex-cats" value={draft.category || ''} onChange={e => set({ category: e.target.value })} />
            <datalist id="ex-cats">{Array.from(new Set([...SUGGEST, ...CATEGORY_ORDER])).map(c => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label={`Depth: ${LEVELS[(draft.level || 3) - 1]}`}>
            <Segmented value={String(draft.level || 3)} onChange={v => set({ level: Number(v) })} options={LEVELS.map((l, i) => ({ value: String(i + 1), label: `${i + 1} · ${l}` }))} />
          </Field>
          <Field label="Note" hint="Shown when a visitor expands the row — how you know it, where you used it."><textarea className="admin-input" rows={3} value={draft.note || ''} onChange={e => set({ note: e.target.value })} /></Field>
          <Field label="Related topics"><TagInput value={draft.tags || []} onChange={tags => set({ tags })} placeholder="Trees, Graphs, Dynamic programming…" /></Field>
        </Card>
      )}
    />
  )
}
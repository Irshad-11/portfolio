import CollectionWorkspace from '../components/CollectionWorkspace'
import { Card, Field } from '../components/Fields'
import { ImageField, StringGallery } from '../components/ImageField'
import IconPicker from '../components/IconPicker'
import RichTextEditor from '../components/RichTextEditor'
import { DynamicIcon } from '../../lib/icons'
import { mergeDraft } from '../lib'
import type { Achievement } from '../../lib/types'

export default function AchievementsPage() {
  return (
    <CollectionWorkspace<Achievement>
      table="achievements" title="Achievements" singular="Achievement"
      description="Add a cover image, a short summary and a full rich-text story. Visitors click through to read it all."
      blank={() => ({ title: '', summary: '', content: '', icon: '🏆', date: '', images: [], visible: true })}
      row={a => ({ title: a.title || 'Untitled', meta: a.date || '', thumb: a.image_url || null, badges: <span className="text-[color:var(--accent)]"><DynamicIcon name={a.icon} size={14} /></span> })}
      validate={d => (!d.title?.trim() ? 'Give it a title' : null)}
      prepare={d => ({ ...d, images: d.images || [], icon: d.icon || '🏆' })}
      previews={(d, items) => {
        const list = mergeDraft(items, d)
        return [
          { label: 'In the log', view: 'achievements', patch: { achievements: list } },
          { label: 'Detail page', view: 'achievement', focus: d.id || 'draft', patch: { achievements: list } },
        ]
      }}
      form={({ draft, set }) => (
        <>
          <Card title="Basics">
            <Field label="Title"><input className="admin-input" value={draft.title || ''} onChange={e => set({ title: e.target.value })} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Date" hint="The year is used to group the log."><input className="admin-input" value={draft.date || ''} onChange={e => set({ date: e.target.value })} placeholder="Nov 2025" /></Field>
              <Field label="Icon" hint="Pick an icon or type an emoji."><IconPicker value={draft.icon || ''} onChange={v => set({ icon: v })} allowEmoji /></Field>
            </div>
            <Field label="Summary" hint="One line shown in the list."><textarea className="admin-input" rows={2} value={draft.summary ?? draft.description ?? ''} onChange={e => set({ summary: e.target.value })} /></Field>
          </Card>
          <Card title="Images">
            <ImageField label="Cover image" folder="achievements" value={draft.image_url} onChange={v => set({ image_url: v })} />
            <StringGallery label="More photos" folder="achievements" values={draft.images || []} onChange={images => set({ images })} />
          </Card>
          <Card title="Full story" desc="Shown on the achievement page.">
            <RichTextEditor key={draft.id || 'new'} value={draft.content || ''} onChange={v => set({ content: v })} folder="achievements" minHeight={240} />
          </Card>
        </>
      )}
    />
  )
}
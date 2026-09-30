import { Loader2, Save } from 'lucide-react'
import { useProfileEditor } from '../hooks/useProfileEditor'
import EditorShell from '../components/EditorShell'
import { ArrayEditor, Card, Field, Segmented, Spinner, Toggle } from '../components/Fields'
import { GalleryField } from '../components/ImageField'
import RichTextEditor from '../components/RichTextEditor'
import { LinksEditor } from '../components/LinksEditor'
import type { AboutFact, AboutStat, SlideEffect } from '../../lib/types'

const EFFECTS: { v: SlideEffect; label: string; hint: string }[] = [
  { v: 'fade', label: 'Fade', hint: 'Soft cross-fade with a slow zoom' },
  { v: 'slide', label: 'Slide', hint: 'Horizontal carousel' },
  { v: 'stack', label: 'Stack', hint: 'Photos peel off a deck' },
  { v: 'reveal', label: 'Reveal', hint: 'Wipe from the right' },
]

export default function AboutPage() {
  const ed = useProfileEditor()
  if (ed.loading || !ed.draft) return <Spinner />
  const { draft, cfg } = ed
  const a = cfg.about

  return (
    <EditorShell
      title="About" subtitle={ed.dirty ? 'Unsaved changes' : 'All changes saved'}
      previews={[{ label: 'About', view: 'about', patch: { profile: draft } }]}
      actions={
        <button onClick={ed.save} disabled={ed.saving || !ed.dirty} className="btn-primary !h-9 !px-4 !text-xs !rounded-lg !normal-case !tracking-normal !font-sans gap-1.5">
          {ed.saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{ed.saving ? 'Saving…' : 'Save'}
        </button>
      }
      form={
        <>
          <Card title="Description" desc="Rich text — headings, lists, links, quotes and images all work.">
            <RichTextEditor key="bio" value={draft.bio || ''} onChange={v => ed.set({ bio: v })} placeholder="Tell your story…" minHeight={220} folder="about" />
          </Card>

          <Card title="Image slideshow" desc="Upload as many photos as you like. They rotate with the effect you pick.">
            <Toggle label="Show images" hint="With no images uploaded, your profile photo is used." checked={a.show_images} onChange={v => ed.setAbout({ show_images: v })} />
            {a.show_images && (
              <>
                <GalleryField captions label="Images" folder="about" items={a.images} onChange={images => ed.setAbout({ images: images.map(i => ({ id: i.id, url: i.url, caption: i.caption || '' })) })} />
                <Field label="Transition effect">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {EFFECTS.map(e => (
                      <button key={e.v} type="button" onClick={() => ed.setAbout({ effect: e.v })} aria-pressed={a.effect === e.v}
                        className={`text-left rounded-lg border p-2.5 transition-colors ${a.effect === e.v ? 'border-[color:var(--accent)] bg-[color:var(--accent-subtle)]' : 'border-[color:var(--border)] hover:border-[color:var(--border-hover)]'}`}>
                        <span className="block text-xs font-semibold text-[color:var(--text)]">{e.label}</span>
                        <span className="block text-[10px] text-[color:var(--text-faint)] leading-snug mt-0.5">{e.hint}</span>
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="grid sm:grid-cols-2 gap-4 items-end">
                  <Toggle label="Autoplay" checked={a.autoplay} onChange={v => ed.setAbout({ autoplay: v })} />
                  <Field label={`Seconds per image: ${a.interval}`}>
                    <input type="range" min={2} max={15} value={a.interval} onChange={e => ed.setAbout({ interval: Number(e.target.value) })} className="w-full accent-[color:var(--accent)]" />
                  </Field>
                </div>
                <Field label="Image position"><Segmented value={a.image_side} onChange={v => ed.setAbout({ image_side: v })} options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }]} /></Field>
              </>
            )}
          </Card>

          <Card title="Quick facts" desc="Label / value rows under your description.">
            <Toggle label="Show facts" checked={a.show_facts} onChange={v => ed.setAbout({ show_facts: v })} />
            {a.show_facts && (
              <ArrayEditor<AboutFact> items={a.facts} onChange={facts => ed.setAbout({ facts })} addLabel="Add fact" blank={() => ({ label: '', value: '' })}
                render={(f, up) => (
                  <div className="grid grid-cols-[8rem_1fr] gap-3">
                    <input className="admin-input" value={f.label} onChange={e => up({ label: e.target.value })} placeholder="Label" />
                    <input className="admin-input" value={f.value} onChange={e => up({ value: e.target.value })} placeholder="Value" />
                  </div>
                )} />
            )}
          </Card>

          <Card title="Location">
            <Toggle label="Show location" checked={a.show_location} onChange={v => ed.setAbout({ show_location: v })} />
            {a.show_location && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Location text"><input className="admin-input" value={draft.location || ''} onChange={e => ed.set({ location: e.target.value })} /></Field>
                <Field label="Map link (optional)" hint="Google Maps URL — makes the location clickable."><input className="admin-input" value={a.location_url} onChange={e => ed.setAbout({ location_url: e.target.value })} placeholder="https://maps.google.com/…" /></Field>
              </div>
            )}
          </Card>

          <Card title="Links" desc="One list for the whole site. Tick where each link should appear (Hero, About, Contact, Footer). Pick any icon.">
            <Toggle label="Show links in About" checked={a.show_links} onChange={v => ed.setAbout({ show_links: v })} />
            <LinksEditor links={cfg.links} onChange={ed.setLinks} />
          </Card>

          <Card title="Numbers" desc="The counters strip. This replaces the stats that used to be in the hero.">
            <Toggle label="Show numbers" checked={a.show_stats} onChange={v => ed.setAbout({ show_stats: v })} />
            {a.show_stats && (
              <ArrayEditor<AboutStat> items={a.stats} onChange={stats => ed.setAbout({ stats })} max={4} addLabel="Add number"
                blank={() => ({ value: '10', suffix: '+', label: 'Label', enabled: true })}
                render={(s, up) => (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-[5rem_4rem_1fr] gap-3">
                      <input className="admin-input" value={s.value} onChange={e => up({ value: e.target.value })} placeholder="4" aria-label="Value" />
                      <input className="admin-input" value={s.suffix} onChange={e => up({ suffix: e.target.value })} placeholder="+" aria-label="Suffix" />
                      <input className="admin-input" value={s.label} onChange={e => up({ label: e.target.value })} placeholder="Years Experience" aria-label="Label" />
                    </div>
                    <Toggle label="Visible" checked={s.enabled} onChange={v => up({ enabled: v })} />
                  </div>
                )} />
            )}
          </Card>
        </>
      }
    />
  )
}
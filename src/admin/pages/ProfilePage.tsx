import { Loader2, Save } from 'lucide-react'
import { useProfileEditor } from '../hooks/useProfileEditor'
import EditorShell from '../components/EditorShell'
import { ArrayEditor, Card, Field, Segmented, Spinner, Toggle } from '../components/Fields'
import { ImageField } from '../components/ImageField'
import IconPicker from '../components/IconPicker'
import { HeroLinkToggles } from '../components/LinksEditor'
import type { CtaStyle, HeroCta, HeroSpec, Profile } from '../../lib/types'

const STYLES: { v: CtaStyle; label: string; cls: string }[] = [
  { v: 'solid', label: 'Solid', cls: 'btn-solid' }, { v: 'outline', label: 'Outline', cls: 'btn-outline' },
  { v: 'ghost', label: 'Ghost', cls: 'btn-ghost' }, { v: 'link', label: 'Link', cls: 'btn-link' }, { v: 'ticket', label: 'Ticket', cls: 'btn-ticket' },
]
const QUICK = [['#projects', 'Projects'], ['#about', 'About'], ['#contact', 'Contact'], ['/projects', 'All projects'], ['/blog', 'Blog'], ['@resume', 'Resume file'], ['mailto:', 'Email']]

export default function ProfilePage() {
  const ed = useProfileEditor()
  if (ed.loading || !ed.draft) return <Spinner />
  const { draft, cfg } = ed
  const h = cfg.hero
  const f = <K extends keyof Profile>(k: K) => ({ value: (draft[k] as string) ?? '', onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => ed.set({ [k]: e.target.value } as Partial<Profile>) })

  return (
    <EditorShell
      title="Hero & identity" subtitle={ed.dirty ? 'Unsaved changes' : 'All changes saved'}
      previews={[{ label: 'Hero', view: 'hero', patch: { profile: draft } }]}
      actions={
        <button onClick={ed.save} disabled={ed.saving || !ed.dirty} className="btn-primary !h-9 !px-4 !text-xs !rounded-lg !normal-case !tracking-normal !font-sans gap-1.5">
          {ed.saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{ed.saving ? 'Saving…' : 'Save'}
        </button>
      }
      form={
        <>
          <Card title="Identity" desc="Used in the hero, navigation, footer and page title.">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name"><input className="admin-input" {...f('name')} /></Field>
              <Field label="Title / role"><input className="admin-input" {...f('title')} placeholder="Software Engineering Student" /></Field>
            </div>
            <Field label="Tagline" hint="One or two sentences under your name."><textarea className="admin-input" rows={2} {...f('tagline')} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email"><input className="admin-input" type="email" {...f('email')} /></Field>
              <Field label="Phone (optional)"><input className="admin-input" {...f('phone')} /></Field>
              <Field label="Location"><input className="admin-input" {...f('location')} /></Field>
              <Field label="Resume URL" hint='Use "@resume" as a button link to point to this file.'><input className="admin-input" {...f('resume_url')} placeholder="https://…/resume.pdf" /></Field>
            </div>
            <ImageField label="Profile photo" value={draft.avatar_url} onChange={v => ed.set({ avatar_url: v })} folder="profile" aspect="4 / 5" hint="Shown in the hero. The About section can use its own image slideshow." />
          </Card>

          <Card title="Hero layout">
            <Field label="Eyebrow text" hint="Small line above your name."><input className="admin-input" value={h.eyebrow} onChange={e => ed.setHero({ eyebrow: e.target.value })} /></Field>
            <Field label="Layout">
              <Segmented value={h.layout} onChange={v => ed.setHero({ layout: v })} options={[{ value: 'split', label: 'Split — with spec sheet' }, { value: 'stacked', label: 'Stacked — name only' }]} />
            </Field>
            <Toggle label="Show photo" checked={h.show_avatar} onChange={v => ed.setHero({ show_avatar: v })} />
            <Toggle label="Show scroll hint" checked={h.show_scroll} onChange={v => ed.setHero({ show_scroll: v })} />
          </Card>

          <Card title="Status & local time">
            <Toggle label="Availability status" hint="Pulsing dot + message at the top of the hero." checked={h.show_status} onChange={v => ed.setHero({ show_status: v })} />
            {h.show_status && (
              <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                <Field label="Message"><input className="admin-input" value={h.status_text} onChange={e => ed.setHero({ status_text: e.target.value })} /></Field>
                <Segmented value={h.status_tone} onChange={v => ed.setHero({ status_tone: v })} options={[{ value: 'open', label: 'Open' }, { value: 'busy', label: 'Busy' }, { value: 'off', label: 'Off' }]} />
              </div>
            )}
            <Toggle label="Live local clock" checked={h.show_clock} onChange={v => ed.setHero({ show_clock: v })} />
            {h.show_clock && (
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Label"><input className="admin-input" value={h.clock_label} onChange={e => ed.setHero({ clock_label: e.target.value })} /></Field>
                <Field label="Time zone (IANA)"><input className="admin-input" value={h.timezone} onChange={e => ed.setHero({ timezone: e.target.value })} placeholder="Asia/Dhaka" /></Field>
              </div>
            )}
          </Card>

          {h.layout === 'split' && (
            <Card title="Spec sheet" desc="The label / value rows beside your name.">
              <Toggle label="Show spec sheet" checked={h.show_specs} onChange={v => ed.setHero({ show_specs: v })} />
              {h.show_specs && (
                <ArrayEditor<HeroSpec> items={h.specs} onChange={specs => ed.setHero({ specs })} addLabel="Add row" blank={() => ({ label: '', value: '' })}
                  render={(s, up) => (
                    <div className="grid grid-cols-[7rem_1fr] gap-3">
                      <input className="admin-input" value={s.label} onChange={e => up({ label: e.target.value })} placeholder="Label" />
                      <input className="admin-input" value={s.value} onChange={e => up({ value: e.target.value })} placeholder="Value" />
                    </div>
                  )} />
              )}
            </Card>
          )}

          <Card title="Buttons" desc="Choose the text, destination and style of each call-to-action.">
            <ArrayEditor<HeroCta> items={h.ctas} onChange={ctas => ed.setHero({ ctas })} addLabel="Add button" max={4} empty="No buttons — the hero will show only your name."
              blank={() => ({ label: 'New button', url: '#contact', style: 'outline', icon: '', enabled: true, new_tab: false })}
              render={(c, up) => (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-[1fr_1.3fr] gap-3">
                    <Field label="Label"><input className="admin-input" value={c.label} onChange={e => up({ label: e.target.value })} /></Field>
                    <Field label="Link">
                      <input className="admin-input" value={c.url} onChange={e => up({ url: e.target.value })} placeholder="#contact, /blog, https://…" />
                    </Field>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK.map(([u, l]) => (
                      <button key={u} type="button" onClick={() => up({ url: u })} className={`text-[11px] px-2 py-1 rounded-md border ${c.url === u ? 'border-[color:var(--accent)] text-[color:var(--accent)]' : 'border-[color:var(--border)] text-[color:var(--text-muted)] hover:text-[color:var(--text)]'}`}>{l}</button>
                    ))}
                  </div>
                  <div>
                    <label className="admin-label">Style</label>
                    <div className="flex flex-wrap gap-3 items-center">
                      {STYLES.map(s => (
                        <button key={s.v} type="button" onClick={() => up({ style: s.v })} aria-pressed={c.style === s.v} className={`p-2 rounded-lg border ${c.style === s.v ? 'border-[color:var(--accent)] bg-[color:var(--accent-subtle)]' : 'border-transparent hover:border-[color:var(--border)]'}`}>
                          <span className={`btn ${s.cls} !h-8 !px-3 !text-[0.6rem] pointer-events-none`}>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[12rem_1fr] gap-3 items-end">
                    <Field label="Icon"><IconPicker value={c.icon} onChange={v => up({ icon: v })} allowNone /></Field>
                    <div className="flex gap-6 pb-1.5">
                      <label className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]"><input type="checkbox" className="accent-[color:var(--accent)]" checked={c.enabled} onChange={e => up({ enabled: e.target.checked })} />Enabled</label>
                      <label className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]"><input type="checkbox" className="accent-[color:var(--accent)]" checked={c.new_tab} onChange={e => up({ new_tab: e.target.checked })} />Open in new tab</label>
                    </div>
                  </div>
                </div>
              )} />
          </Card>

          <Card title="Contact links in hero" desc="Icon buttons beside your call-to-action. Add or edit the links themselves under About → Links.">
            <Toggle label="Show contact links" checked={h.show_contacts} onChange={v => ed.setHero({ show_contacts: v })} />
            {h.show_contacts && <HeroLinkToggles links={cfg.links} onChange={ed.setLinks} />}
          </Card>
        </>
      }
    />
  )
}
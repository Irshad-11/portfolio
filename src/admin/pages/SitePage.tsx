import { ArrowDown, ArrowUp, Loader2, Save } from 'lucide-react'
import { useProfileEditor } from '../hooks/useProfileEditor'
import EditorShell from '../components/EditorShell'
import { ArrayEditor, Card, Field, Segmented, Spinner, Toggle } from '../components/Fields'
import type { RibbonItem, SectionKey } from '../../lib/types'

const SWATCHES = ['#2f6bd8', '#0f766e', '#2f855a', '#6d28d9', '#b45309', '#be123c', '#c2410c', '#334155']

export default function SitePage() {
  const ed = useProfileEditor()
  if (ed.loading || !ed.draft) return <Spinner />
  const { draft, cfg } = ed
  const { site, ribbon, sections } = cfg

  const moveSection = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= sections.order.length) return
    const order = [...sections.order]; [order[i], order[j]] = [order[j], order[i]]
    ed.setSections({ order })
  }
  const upSection = (k: SectionKey, p: Partial<typeof sections.items[SectionKey]>) =>
    ed.setSections({ items: { ...sections.items, [k]: { ...sections.items[k], ...p } } })

  return (
    <EditorShell
      title="Site & ribbon" subtitle={ed.dirty ? 'Unsaved changes' : 'All changes saved'}
      previews={[{ label: 'Whole site', view: 'home', patch: { profile: draft } }, { label: 'Ribbon', view: 'ribbon', patch: { profile: draft } }]}
      actions={
        <button onClick={ed.save} disabled={ed.saving || !ed.dirty} className="btn-primary !h-9 !px-4 !text-xs !rounded-lg !normal-case !tracking-normal !font-sans gap-1.5">
          {ed.saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{ed.saving ? 'Saving…' : 'Save'}
        </button>
      }
      form={
        <>
          <Card title="Sections" desc="Turn sections on/off, reorder them and rename their headings. Empty sections hide themselves automatically.">
            <ul className="space-y-2">
              {sections.order.map((k, i) => {
                const s = sections.items[k]
                return (
                  <li key={k} className={`rounded-lg border border-[color:var(--border)] p-3 ${s.enabled ? '' : 'opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-[color:var(--text-faint)] w-16 uppercase">{k}</span>
                      <input className="admin-input flex-1 !py-1.5" value={s.title} onChange={e => upSection(k, { title: e.target.value })} aria-label={`${k} heading`} />
                      <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0} className="p-1.5 text-[color:var(--text-muted)] disabled:opacity-20" aria-label="Move up"><ArrowUp size={14} /></button>
                      <button type="button" onClick={() => moveSection(i, 1)} disabled={i === sections.order.length - 1} className="p-1.5 text-[color:var(--text-muted)] disabled:opacity-20" aria-label="Move down"><ArrowDown size={14} /></button>
                      <button type="button" role="switch" aria-checked={s.enabled} aria-label={`Show ${k}`} onClick={() => upSection(k, { enabled: !s.enabled })} className="switch" />
                    </div>
                    <input className="admin-input !py-1.5 !text-xs mt-2" value={s.subtitle} onChange={e => upSection(k, { subtitle: e.target.value })} placeholder="Short line under the heading (optional)" aria-label={`${k} subtitle`} />
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card title="Ribbon banner" desc="A scrolling ribbon that adds rhythm and emphasis between sections.">
            <Toggle label="Show ribbon" checked={ribbon.enabled} onChange={v => ed.setRibbon({ enabled: v })} />
            {ribbon.enabled && (
              <>
                <Field label="Position">
                  <Segmented value={ribbon.position} onChange={v => ed.setRibbon({ position: v })} options={[
                    { value: 'after_hero', label: 'Below hero' }, { value: 'before_footer', label: 'Above footer' }, { value: 'both', label: 'Both' }, { value: 'top', label: 'Top bar' },
                  ]} />
                </Field>
                <Field label="Style"><Segmented value={ribbon.style} onChange={v => ed.setRibbon({ style: v })} options={[{ value: 'accent', label: 'Accent' }, { value: 'ink', label: 'Inverted' }, { value: 'outline', label: 'Outline' }]} /></Field>
                <Field label="Separator"><Segmented value={ribbon.separator} onChange={v => ed.setRibbon({ separator: v })} options={[{ value: 'diamond', label: '◆' }, { value: 'star', label: '✦' }, { value: 'dot', label: '●' }, { value: 'slash', label: '/' }, { value: 'bar', label: '|' }]} /></Field>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  <Toggle label="Tilted" hint="Slight diagonal angle" checked={ribbon.tilt} onChange={v => ed.setRibbon({ tilt: v })} />
                  <Toggle label="Crossed ribbons" hint="Adds a second, opposite ribbon" checked={ribbon.double} onChange={v => ed.setRibbon({ double: v })} />
                  <Toggle label="Pause on hover" checked={ribbon.pause_on_hover} onChange={v => ed.setRibbon({ pause_on_hover: v })} />
                  <Field label="Direction"><Segmented size="sm" value={ribbon.direction} onChange={v => ed.setRibbon({ direction: v })} options={[{ value: 'left', label: '← Left' }, { value: 'right', label: 'Right →' }]} /></Field>
                </div>
                <Field label={`Seconds per loop: ${ribbon.speed}`} hint="Lower is faster.">
                  <input type="range" min={10} max={90} value={ribbon.speed} onChange={e => ed.setRibbon({ speed: Number(e.target.value) })} className="w-full accent-[color:var(--accent)]" />
                </Field>
                <ArrayEditor<RibbonItem> items={ribbon.items} onChange={items => ed.setRibbon({ items })} addLabel="Add phrase" empty="Add a few short phrases."
                  blank={() => ({ text: '' })}
                  render={(it, up) => <input className="admin-input" value={it.text} onChange={e => up({ text: e.target.value })} placeholder="e.g. Open to internships" />} />
              </>
            )}
          </Card>

          <Card title="Appearance">
            <Field label="Accent colour" hint="Used for links, buttons, highlights and the ribbon. Pick any colour — the whole site follows it.">
              <div className="flex flex-wrap items-center gap-2">
                {SWATCHES.map(c => (
                  <button key={c} type="button" onClick={() => ed.setSite({ accent: c })} aria-label={`Accent ${c}`} aria-pressed={site.accent.toLowerCase() === c}
                    className={`w-8 h-8 rounded-md border-2 ${site.accent.toLowerCase() === c ? 'border-white' : 'border-transparent'}`} style={{ background: c }} />
                ))}
                <input type="color" value={/^#[0-9a-f]{6}$/i.test(site.accent) ? site.accent : '#2f6bd8'} onChange={e => ed.setSite({ accent: e.target.value })} className="w-9 h-9 rounded-md bg-transparent border border-[color:var(--border)] cursor-pointer" aria-label="Custom colour" />
                <input className="admin-input !w-28 font-mono" value={site.accent} onChange={e => ed.setSite({ accent: e.target.value })} />
              </div>
            </Field>
            <Field label="Default colour mode"><Segmented value={site.default_mode} onChange={v => ed.setSite({ default_mode: v })} options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'system', label: 'Follow device' }]} /></Field>
            <Toggle label="Let visitors switch light / dark" checked={site.allow_toggle} onChange={v => ed.setSite({ allow_toggle: v })} />
          </Card>

          <Card title="Background grid" desc="Engineering-paper grid that reacts to the cursor on desktop.">
            <Toggle label="Show grid" checked={site.grid_enabled} onChange={v => ed.setSite({ grid_enabled: v })} />
            {site.grid_enabled && (
              <>
                <Field label="Cell size"><Segmented value={String(site.grid_size)} onChange={v => ed.setSite({ grid_size: Number(v) })} options={['32', '40', '48', '64', '80'].map(v => ({ value: v, label: `${v}px` }))} /></Field>
                <Toggle label="Interactive" hint="Highlights lines near the cursor and snaps a crosshair to the grid. Off on touch devices." checked={site.grid_interactive} onChange={v => ed.setSite({ grid_interactive: v })} />
              </>
            )}
          </Card>

          <Card title="Navigation button">
            <Toggle label="Show button in navbar" checked={site.nav_cta_enabled} onChange={v => ed.setSite({ nav_cta_enabled: v })} />
            {site.nav_cta_enabled && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Label"><input className="admin-input" value={site.nav_cta_label} onChange={e => ed.setSite({ nav_cta_label: e.target.value })} /></Field>
                <Field label="Link"><input className="admin-input" value={site.nav_cta_url} onChange={e => ed.setSite({ nav_cta_url: e.target.value })} placeholder="#contact" /></Field>
              </div>
            )}
          </Card>

          <Card title="Footer & search">
            <Field label="Footer statement" hint="Leave empty to use your name and title."><input className="admin-input" value={site.footer_text} onChange={e => ed.setSite({ footer_text: e.target.value })} /></Field>
            <Field label="Page title (SEO)" hint={`Empty = “${draft.name} — ${draft.title}”`}><input className="admin-input" value={site.seo_title} onChange={e => ed.setSite({ seo_title: e.target.value })} /></Field>
            <Field label="Meta description"><textarea className="admin-input" rows={2} value={site.seo_description} onChange={e => ed.setSite({ seo_description: e.target.value })} /></Field>
          </Card>
        </>
      }
    />
  )
}
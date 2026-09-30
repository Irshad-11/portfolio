import type { LinkItem } from '../../lib/types'
import { ArrayEditor, Field, Toggle } from './Fields'
import IconPicker from './IconPicker'

const PLACES: { key: 'hero' | 'about' | 'contact' | 'footer'; label: string }[] = [
  { key: 'hero', label: 'Hero' }, { key: 'about', label: 'About' }, { key: 'contact', label: 'Contact' }, { key: 'footer', label: 'Footer' },
]

/** Add / edit / order every link on the site, with an icon and per-place toggles. */
export function LinksEditor({ links, onChange }: { links: LinkItem[]; onChange: (l: LinkItem[]) => void }) {
  return (
    <ArrayEditor<LinkItem>
      items={links} onChange={onChange} addLabel="Add link"
      empty="No links yet — add your email, GitHub, LinkedIn…"
      blank={() => ({ label: '', url: '', icon: 'link', hero: false, about: true, contact: true, footer: true })}
      render={(l, up) => (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-[1fr_1.4fr_11rem] gap-3">
            <Field label="Label"><input className="admin-input" value={l.label} onChange={e => up({ label: e.target.value })} placeholder="GitHub" /></Field>
            <Field label="URL"><input className="admin-input" value={l.url} onChange={e => up({ url: e.target.value })} placeholder="https://… or mailto:…" /></Field>
            <Field label="Icon"><IconPicker value={l.icon} onChange={v => up({ icon: v })} /></Field>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span className="text-[11px] text-[color:var(--text-faint)] self-center">Show in:</span>
            {PLACES.map(p => (
              <label key={p.key} className="flex items-center gap-2 text-xs text-[color:var(--text-muted)] cursor-pointer">
                <input type="checkbox" checked={l[p.key]} onChange={e => up({ [p.key]: e.target.checked } as Partial<LinkItem>)} className="accent-[color:var(--accent)] w-3.5 h-3.5" />{p.label}
              </label>
            ))}
          </div>
        </div>
      )}
    />
  )
}

/** Compact per-link switch for the hero (edit the links themselves in About). */
export function HeroLinkToggles({ links, onChange }: { links: LinkItem[]; onChange: (l: LinkItem[]) => void }) {
  if (!links.length) return <p className="text-xs text-[color:var(--text-faint)]">No links yet. Add them in <b>About → Links</b>.</p>
  return (
    <div className="space-y-2.5">
      {links.map(l => (
        <Toggle key={l.id} label={l.label || l.url} hint={l.url} checked={l.hero} onChange={v => onChange(links.map(x => (x.id === l.id ? { ...x, hero: v } : x)))} />
      ))}
    </div>
  )
}
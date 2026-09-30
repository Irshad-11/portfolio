import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useData } from '../context/DataContext'
import { SectionShell, pad } from '../components/ui'
import { SkillIcon } from '../lib/icons'
import { orderedCategories, LEVELS } from '../lib/skillUtils'
import type { Expertise } from '../lib/types'

function Ticks({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-[3px]" role="img" aria-label={`${LEVELS[level - 1] || ''} level`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className="block w-[9px] h-[15px]" style={{ background: i <= level ? 'var(--accent)' : 'transparent', border: `1px solid ${i <= level ? 'var(--accent)' : 'var(--border-hover)'}` }} />
      ))}
    </span>
  )
}

function ConceptRow({ e, n }: { e: Expertise; n: number }) {
  const [open, setOpen] = useState(false)
  const more = !!e.note || e.tags?.length > 0
  const lvl = Math.min(5, Math.max(1, e.level || 1))
  return (
    <li>
      <button type="button" disabled={!more} onClick={() => setOpen(o => !o)} aria-expanded={more ? open : undefined}
        className={`w-full text-left group py-4 sm:py-5 flex items-center gap-3 sm:gap-5 ${more ? 'cursor-pointer' : 'cursor-default'}`}>
        <span className="mono tabular text-faint w-7 shrink-0 group-hover:text-[color:var(--accent)] transition-colors">{pad(n)}</span>
        <span className="font-display font-semibold text-ink text-base sm:text-xl group-hover:text-[color:var(--accent)] transition-colors leading-tight">{e.title}</span>
        <span className="hidden md:block flex-1 border-b border-dotted border-[color:var(--border-hover)] translate-y-2" />
        <span className="ml-auto md:ml-0 flex flex-col-reverse sm:flex-row items-end sm:items-center gap-1.5 sm:gap-4 shrink-0">
          <span className="mono !text-[0.75rem] text-faint w-20 text-right hidden sm:block">{LEVELS[lvl - 1]}</span>
          <Ticks level={lvl} />
        </span>
        <span className={`shrink-0 w-4 ${more ? 'text-muted' : 'opacity-0'}`}><Plus size={16} className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`} /></span>
      </button>
      {more && (
        <div className={`acc ${open ? 'open' : ''}`}>
          <div>
            <div className="pb-6 pl-10 sm:pl-12 pr-8 max-w-2xl">
              {e.note && <p className="text-muted leading-relaxed">{e.note}</p>}
              {e.tags?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{e.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>}
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

export default function Skills() {
  const { skills, expertise, sections } = useData()
  const sec = sections.find(s => s.key === 'skills')
  const cats = useMemo(() => orderedCategories(skills), [skills])
  const [cat, setCat] = useState('All')
  const active = cat === 'All' || cats.includes(cat) ? cat : 'All'
  const shown = active === 'All' ? skills : skills.filter(s => s.category === active)
  const conceptCats = useMemo(() => orderedCategories(expertise), [expertise])
  if (!sec) return null

  let counter = 0
  return (
    <SectionShell id="skills" index={sec.index} title={sec.title} subtitle={sec.subtitle} aside={`${skills.length + expertise.length} entries`}>
      {skills.length > 0 && (
        <div className="reveal">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <p className="label"><span className="text-[color:var(--accent)]">A</span> — Toolbox</p>
            <div role="tablist" aria-label="Skill categories" className="flex gap-1 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 max-w-full">
              {['All', ...cats].map(c => {
                const count = c === 'All' ? skills.length : skills.filter(s => s.category === c).length
                return (
                  <button key={c} role="tab" aria-selected={active === c} onClick={() => setCat(c)}
                    className={`mono whitespace-nowrap px-3 py-2 border transition-colors ${active === c ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--accent-ink)]' : 'border-line text-muted hover:text-ink hover:border-[color:var(--border-hover)]'}`}>
                    {c} <span className="opacity-60">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div key={active} className="tile-grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 fade-up" style={{ '--d': '0ms' } as React.CSSProperties}>
            {shown.map(s => (
              <div key={s.id} className="tile min-h-[4.6rem] py-2.5 sm:min-h-0 sm:aspect-square flex flex-col items-center justify-center gap-1.5 sm:gap-3 px-1 sm:p-2 text-center">
                <span className="tile-ico text-ink transition-colors"><SkillIcon icon={s.icon} iconUrl={s.icon_url} name={s.name} size={24} /></span>
                <span className="mono !text-[0.66rem] sm:!text-[0.75rem] text-muted leading-tight break-words">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {expertise.length > 0 && (
        <div className={`reveal ${skills.length ? 'mt-14 md:mt-20' : ''}`}>
          <div className="flex items-center gap-4 mb-2">
            <p className="label"><span className="text-[color:var(--accent)]">{skills.length ? 'B' : 'A'}</span> — Foundations &amp; concepts</p>
            <span className="rule flex-1" />
            <p className="label hidden sm:block">Tap a row for detail</p>
          </div>
          {conceptCats.map(c => (
            <div key={c} className="mt-5 md:mt-6 grid md:grid-cols-12 gap-x-8">
              <p className="md:col-span-3 mono text-[color:var(--accent)] md:pt-5 pb-2 md:pb-0">{c}</p>
              <ul className="md:col-span-9 ledger">
                {expertise.filter(e => e.category === c).map(e => <ConceptRow key={e.id} e={e} n={++counter} />)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  )
}
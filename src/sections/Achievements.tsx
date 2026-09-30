import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import { SectionShell, yearOf } from '../components/ui'
import { DynamicIcon } from '../lib/icons'
import { excerptOf } from '../lib/richtext'
import type { Achievement } from '../lib/types'

export const achSummary = (a: Achievement) => a.summary || a.description || excerptOf(a.content, 160)

export function AchievementRow({ a }: { a: Achievement }) {
  const sum = achSummary(a)
  return (
    <div>
    <Link to={`/achievements/${a.id}`} className="group flex items-center gap-4 sm:gap-6 py-5 px-1 sm:px-3 -mx-1 sm:-mx-3 transition-colors hover:bg-[color:var(--accent-subtle)]">
      <span className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 border border-line flex items-center justify-center text-xl text-[color:var(--accent)] group-hover:border-[color:var(--accent)] transition-colors">
        <DynamicIcon name={a.icon || '🏆'} size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display font-semibold text-ink text-[0.95rem] sm:text-lg leading-snug group-hover:text-[color:var(--accent)] transition-colors">{a.title}</span>
        {sum && <span className="block mt-1 text-sm text-muted line-clamp-2 max-w-xl">{sum}</span>}
        {a.date && <span className="block mono !text-[0.75rem] text-faint mt-2">{a.date}</span>}
      </span>
      {a.image_url && <img src={a.image_url} alt="" loading="lazy" decoding="async" className="hidden sm:block w-28 aspect-[4/3] object-cover border border-line shrink-0" />}
      <ArrowUpRight size={20} className="shrink-0 text-faint group-hover:text-[color:var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </Link>
    </div>
  )
}

export default function Achievements() {
  const { achievements, sections } = useData()
  const sec = sections.find(s => s.key === 'achievements')
  if (!sec) return null

  const groups: { year: string; items: Achievement[] }[] = []
  achievements.forEach(a => {
    const y = yearOf(a.date) || '—'
    const g = groups.find(x => x.year === y)
    g ? g.items.push(a) : groups.push({ year: y, items: [a] })
  })
  groups.sort((a, b) => b.year.localeCompare(a.year))

  return (
    <SectionShell id="achievements" index={sec.index} title={sec.title} subtitle={sec.subtitle} aside={`${achievements.length} logged`}>
      <div className="space-y-2">
        {groups.map(g => (
          <div key={g.year} className="reveal grid md:grid-cols-12 gap-x-8 border-t border-line pt-4 md:pt-6">
            <p className="md:col-span-2 font-display font-semibold text-2xl md:text-3xl text-faint md:sticky md:top-24 md:self-start leading-none pb-2 tabular">{g.year}</p>
            <div className="md:col-span-10 divide-y divide-[color:var(--border)]">
              {g.items.map(a => <AchievementRow key={a.id} a={a} />)}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
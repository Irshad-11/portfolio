import {
  Trophy, Star, Target, Rocket, Zap, Mic2, Flame,
  Award, Medal, Code2, Users, Globe, Shield, BookOpen,
  TrendingUp, GitFork, Package, Terminal, Cpu, BarChart2,
  Lightbulb, Wrench, Coffee, Music, Heart, BadgeCheck,
  Gamepad2, Camera, Pen, Layers, Gem,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import SectionHeading from '../components/SectionHeading'

export const ACHIEVEMENT_ICON_MAP: Record<string, LucideIcon> = {
  Trophy, Star, Target, Rocket, Zap, Mic2, Flame,
  Award, Medal, Code2, Users, Globe, Shield, BookOpen,
  TrendingUp, GitFork, Package, Terminal, Cpu, BarChart2,
  Lightbulb, Wrench, Coffee, Music, Heart, BadgeCheck,
  Gamepad2, Camera, Pen, Layers, Gem,
}

export function getAchievementIcon(name: string): LucideIcon {
  return ACHIEVEMENT_ICON_MAP[name] ?? Star
}

export default function Achievements() {
  const { achievements, loading } = useData()
  const ref = useScrollReveal('achievements')

  if (!loading && achievements.length === 0) return null

  return (
    <section id="achievements" ref={ref as React.RefObject<HTMLElement>} className="section-base">
      <div className="max-w-5xl mx-auto">
        <div className="reveal">
          <SectionHeading title="Achievements" subtitle="Milestones and highlights from my journey" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((a, i) => {
            const Icon = getAchievementIcon(a.icon)
            return (
              <div
                key={a.id}
                className="reveal glass glass-hover rounded-xl p-5 transition-all duration-200 text-center"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-xl accent-subtle flex items-center justify-center">
                    <Icon size={24} style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-[color:var(--text)] leading-snug">{a.title}</h3>
                {a.description && (
                  <p className="text-xs text-[color:var(--text-muted)] mt-2 leading-relaxed">{a.description}</p>
                )}
                {a.date && (
                  <span className="inline-block mt-3 text-xs text-[color:var(--text-faint)] font-mono">{a.date}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
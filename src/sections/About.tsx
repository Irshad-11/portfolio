import { MapPin, Mail, Github, Linkedin, Twitter } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import SectionHeading from '../components/SectionHeading'

export default function About() {
  const { profile } = useData()
  const ref = useScrollReveal('about')

  return (
    <section id="about" ref={ref as React.RefObject<HTMLElement>} className="section-base">
      <div className="max-w-5xl mx-auto">
        <div className="reveal">
          <SectionHeading title="About Me" subtitle="A bit about who I am and what I do" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile image */}
          <div className="reveal-left">
            <div className="relative aspect-square max-w-sm mx-auto md:mx-0 rounded-2xl overflow-hidden glass border border-[color:var(--border)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--accent-subtle)] to-transparent z-0" />
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="relative z-10 w-full h-full object-cover"
                />
              ) : (
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-24 h-24 rounded-full accent-bg flex items-center justify-center text-white text-4xl font-black">
                    {(profile?.name ?? 'I')[0]}
                  </div>
                  <p className="text-xs text-[color:var(--text-faint)]">Add photo in Admin → Profile</p>
                </div>
              )}
              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-24 h-24 accent-bg opacity-10 rounded-tl-[60px]" />
            </div>
          </div>

          {/* Info */}
          <div className="reveal-right space-y-5">
            <p className="text-[color:var(--text-muted)] leading-relaxed text-base">
              {profile?.bio ?? 'Passionate full-stack developer building scalable, high-quality digital products.'}
            </p>

            {/* Details */}
            <div className="space-y-2.5">
              {profile?.location && (
                <div className="flex items-center gap-2.5 text-sm text-[color:var(--text-muted)]">
                  <MapPin size={14} className="accent flex-shrink-0" />
                  {profile.location}
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-2.5 text-sm text-[color:var(--text-muted)]">
                  <Mail size={14} className="accent flex-shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:text-[color:var(--accent)] transition-colors">{profile.email}</a>
                </div>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                   className="glass p-2.5 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-all">
                  <Github size={18} />
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                   className="glass p-2.5 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-all">
                  <Linkedin size={18} />
                </a>
              )}
              {profile?.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
                   className="glass p-2.5 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-all">
                  <Twitter size={18} />
                </a>
              )}
              {profile?.resume_url && (
                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-2 px-4 ml-2">
                  Resume ↗
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[color:var(--border)]">
              {[
                { v: `${profile?.years_experience ?? 4}+`, l: 'Years Experience' },
                { v: `${profile?.projects_count ?? 20}+`, l: 'Projects Built' },
                { v: `${profile?.clients_count ?? 15}+`, l: 'Happy Clients' },
              ].map(s => (
                <div key={s.l}>
                  <p className="text-2xl font-bold accent">{s.v}</p>
                  <p className="text-xs text-[color:var(--text-faint)] mt-0.5 leading-tight">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

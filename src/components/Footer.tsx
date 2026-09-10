import { Github, Linkedin, Twitter, Heart } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function Footer() {
  const { profile } = useData()

  return (
    <footer className="border-t border-[color:var(--border)] py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="font-bold text-[color:var(--text)]">{profile?.name ?? 'Irshad'}<span className="accent">.</span></p>
          <p className="text-xs text-[color:var(--text-faint)] mt-1">{profile?.title}</p>
        </div>

        <div className="flex items-center gap-4">
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
              className="text-[color:var(--text-faint)] hover:text-[color:var(--accent)] transition-colors">
              <Github size={18} />
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="text-[color:var(--text-faint)] hover:text-[color:var(--accent)] transition-colors">
              <Linkedin size={18} />
            </a>
          )}
          {profile?.twitter_url && (
            <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
              className="text-[color:var(--text-faint)] hover:text-[color:var(--accent)] transition-colors">
              <Twitter size={18} />
            </a>
          )}
        </div>

        <p className="text-xs text-[color:var(--text-faint)] flex items-center gap-1">
          Built with <Heart size={11} className="accent" fill="currentColor" /> & React
        </p>
      </div>
    </footer>
  )
}

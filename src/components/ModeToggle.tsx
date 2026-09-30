import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useConfig } from '../context/DataContext'

export default function ModeToggle({ className = '' }: { className?: string }) {
  const { mode, toggle } = useTheme()
  const { site } = useConfig()
  if (!site.allow_toggle) return null
  return (
    <button onClick={toggle} className={`icon-btn ${className}`} aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`} title="Toggle light / dark">
      {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
import { useState } from 'react'
import { Palette, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { THEMES } from '../lib/types'

export default function ThemePicker() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Theme options */}
      {open && (
        <div className="glass rounded-2xl p-3 flex flex-col gap-2 shadow-2xl">
          <p className="text-xs text-[color:var(--text-faint)] text-center px-1 pb-1">Theme</p>
          {THEMES.map(t => (
            <button
              key={t.name}
              onClick={() => { setTheme(t.name); setOpen(false) }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                theme === t.name
                  ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent)]'
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-white/5'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                style={{ background: t.accent }}
              />
              {t.label}
              {theme === t.name && <span className="ml-auto text-[10px] opacity-60">✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle theme picker"
        className="w-11 h-11 rounded-full glass flex items-center justify-center text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-all hover:border-[color:var(--accent)] shadow-xl"
      >
        {open ? <X size={16} /> : <Palette size={16} />}
      </button>
    </div>
  )
}

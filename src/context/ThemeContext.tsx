import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useData } from './DataContext'

export type Mode = 'dark' | 'light'

interface ThemeContextValue {
  mode: Mode
  setMode: (m: Mode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'dark', setMode: () => {}, toggle: () => {} })

/** Perceived brightness → readable text colour on top of the accent. */
function inkFor(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return '#ffffff'
  const n = parseInt(m[1], 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? '#111111' : '#ffffff'
}
function rgba(hex: string, a: number) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return `rgba(47,107,216,${a})`
  const n = parseInt(m[1], 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

const toRgb = (hex: string): number[] | null => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const toHex = (c: number[]) => '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
const lum = ([r, g, b]: number[]) => {
  const f = (v: number) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4) }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const contrast = (a: number[], b: number[]) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) }
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t)

/**
 * Keep the chosen accent readable on the current background. On dark backgrounds a deep green/blue
 * is lightened until it clearly stands out (~7:1 contrast); on light backgrounds a pale colour is darkened.
 */
function rgbToHsl([r, g, b]: number[]): number[] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min, sat = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h * 60, sat, l]
}
function hslToRgb([h, s, l]: number[]): number[] {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255]
}

/**
 * Keep the chosen accent readable on the current background without washing it out:
 * lightness is moved (dark mode: up, light mode: down) while hue and saturation are kept vivid,
 * until the colour reaches a strong contrast against the page background.
 */
export function readableAccent(hex: string, mode: Mode): string {
  const rgb = toRgb(hex)
  if (!rgb) return hex
  const bg = mode === 'dark' ? [15, 17, 19] : [252, 252, 250]
  const need = mode === 'dark' ? 6.5 : 4.8
  if (contrast(rgb, bg) >= need) return hex
  const [h, s0, l0] = rgbToHsl(rgb)
  const s = Math.max(s0, 0.55)
  let l = l0
  const step = mode === 'dark' ? 0.01 : -0.01
  let c = hslToRgb([h, s, l])
  while (contrast(c, bg) < need && l > 0.05 && l < 0.95) { l += step; c = hslToRgb([h, s, l]) }
  return toHex(c)
}

export function applyAccent(hex: string, mode: Mode = 'light') {
  const fixed = readableAccent(hex, mode)
  const s = document.documentElement.style
  s.setProperty('--accent', fixed)
  s.setProperty('--accent-ink', inkFor(fixed))
  s.setProperty('--accent-glow', rgba(fixed, 0.3))
  s.setProperty('--accent-subtle', rgba(fixed, mode === 'dark' ? 0.16 : 0.09))
  s.setProperty('--accent-hover', `color-mix(in srgb, ${fixed} 84%, ${mode === 'dark' ? 'white' : 'black'})`)
}

export function ThemeProvider({ children, forcedMode }: { children: ReactNode; forcedMode?: Mode }) {
  const { config } = useData()
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const site = config.site

  const [stored, setStored] = useState<Mode | null>(() => {
    try { const m = localStorage.getItem('portfolio_mode'); return m === 'light' || m === 'dark' ? m : null } catch { return null }
  })

  const systemPref: Mode = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  const base: Mode = site.default_mode === 'system' ? systemPref : site.default_mode
  const mode: Mode = forcedMode ?? (isAdmin ? 'dark' : (site.allow_toggle && stored) || base)

  useEffect(() => { document.documentElement.setAttribute('data-mode', mode) }, [mode])
  useEffect(() => { applyAccent(site.accent, mode) }, [site.accent, mode])

  // keep browser chrome colour in sync
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#0f1113' : '#fcfcfa')
  }, [mode])

  const setMode = useCallback((m: Mode) => {
    setStored(m)
    try { localStorage.setItem('portfolio_mode', m) } catch { /* private mode */ }
  }, [])
  const toggle = useCallback(() => setMode(mode === 'dark' ? 'light' : 'dark'), [mode, setMode])

  return <ThemeContext.Provider value={{ mode, setMode, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
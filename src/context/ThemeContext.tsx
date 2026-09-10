import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { ThemeName } from '../lib/types'

interface ThemeContextValue {
  theme: ThemeName
  adminTheme: ThemeName
  setTheme: (t: ThemeName) => void
  setAdminTheme: (t: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark-red',
  adminTheme: 'dark-indigo',
  setTheme: () => {},
  setAdminTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() =>
    (localStorage.getItem('portfolio_theme') as ThemeName) ?? 'dark-red'
  )
  const [adminTheme, setAdminThemeState] = useState<ThemeName>(() =>
    (localStorage.getItem('admin_theme') as ThemeName) ?? 'dark-indigo'
  )

  const setTheme = (t: ThemeName) => {
    setThemeState(t)
    localStorage.setItem('portfolio_theme', t)
  }

  const setAdminTheme = (t: ThemeName) => {
    setAdminThemeState(t)
    localStorage.setItem('admin_theme', t)
  }

  // Apply theme to <html> when on portfolio pages
  useEffect(() => {
    const isAdmin = window.location.pathname.startsWith('/admin')
    const active = isAdmin ? adminTheme : theme
    document.documentElement.setAttribute('data-theme', active)
  }, [theme, adminTheme])

  return (
    <ThemeContext.Provider value={{ theme, adminTheme, setTheme, setAdminTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

// Helper used in AdminLayout to always apply admin theme
export function useAdminThemeEffect(adminTheme: ThemeName) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', adminTheme)
    return () => {
      // When leaving admin, restore portfolio theme
      const portfolioTheme = (localStorage.getItem('portfolio_theme') as ThemeName) ?? 'dark-red'
      document.documentElement.setAttribute('data-theme', portfolioTheme)
    }
  }, [adminTheme])
}

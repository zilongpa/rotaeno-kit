import { createContext, useContext, useEffect, useState } from 'react'
import { useMedia } from 'react-use'

type Theme = 'dark' | 'light' | 'system'
const THEMES = ['system', 'dark', 'light'] as const

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: typeof THEMES
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  themes: THEMES,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function updateSystemTheme() {
  const root = window.document.documentElement

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  root.classList.add(systemTheme)
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'rotaeno-kit-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const prefersDark = useMedia('(prefers-color-scheme: dark)')

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      updateSystemTheme()
    } else {
      root.classList.add(theme)
    }
  }, [prefersDark, theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    themes: THEMES,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

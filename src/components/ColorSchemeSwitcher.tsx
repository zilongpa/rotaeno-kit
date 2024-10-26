'use client'

import { Button } from '@/components/ui/button'
import { useCallback, useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'
import LineMdLightDark from '~icons/line-md/light-dark'
import LineMdMoonFilled from '~icons/line-md/moon'
import LineMdSunnyFilled from '~icons/line-md/sunny-filled'

const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light' | 'system'>(
    'rotaeno-kit-theme',
    'system',
    {
      raw: true,
    }
  )
  const themes = ['system', 'dark', 'light'] as const

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light')

    if (!theme) return

    if (theme !== 'system') {
      document.documentElement.classList.add(theme)
    } else {
      document.documentElement.classList.add(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      )
    }
  }, [theme])

  return { theme, setTheme, themes }
}

export function ColorSchemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, themes } = useTheme()

  const next = useCallback(() => {
    if (!theme) return
    const current = themes.indexOf(theme)
    const next = themes[(current + 1) % themes.length]
    if (!next) return
    setTheme(next)
  }, [theme, themes, setTheme])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button onClick={next} size="icon" variant="outline" className="absolute right-4 top-4">
      {theme === 'dark' ? (
        <LineMdMoonFilled />
      ) : theme === 'light' ? (
        <LineMdSunnyFilled />
      ) : (
        <LineMdLightDark />
      )}
    </Button>
  )
}

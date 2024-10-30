import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from '@/contexts/ThemeProvider'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import LineMdLightDark from '~icons/line-md/light-dark'
import LineMdMoonFilled from '~icons/line-md/moon'
import LineMdSunnyFilled from '~icons/line-md/sunny-filled'

export function ColorSchemeSwitcher() {
  const { t } = useTranslation()
  const { theme, setTheme, themes } = useTheme()

  const next = useCallback(() => {
    if (!theme) return
    const current = themes.indexOf(theme)
    const next = themes[(current + 1) % themes.length]
    if (!next) return
    setTheme(next)
  }, [theme, themes, setTheme])

  const Icon = {
    dark: LineMdMoonFilled,
    light: LineMdSunnyFilled,
    system: LineMdLightDark,
  }[theme]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={next} size="icon" variant="outline">
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('colorSchemeSwitcher.tooltip')}</p>
      </TooltipContent>
    </Tooltip>
  )
}

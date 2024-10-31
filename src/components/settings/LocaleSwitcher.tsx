import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SUPPORTED_LANGUAGES } from '@/i18n'
import clsx from 'clsx'
import { CheckIcon, LanguagesIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function LocaleSwitcher() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language)
  }, [i18n.language])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <LanguagesIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('localeSwitcher.tooltip')}</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => void i18n.changeLanguage(lang.value)}
            className={
              i18n.language === lang.value ? 'bg-accent text-accent-foreground' : undefined
            }
          >
            <CheckIcon
              className={clsx(
                'size-4 opacity-0 transition-opacity',
                i18n.language === lang.value && 'opacity-100'
              )}
            />

            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

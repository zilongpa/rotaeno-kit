import { AddChartRecord } from '@/components/AddChartRecord'
import { ChartRecords } from '@/components/ChartRecords'
import { ColorSchemeSwitcher } from '@/components/ColorSchemeSwitcher'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { RecordsSummary } from '@/components/RecordsSummary'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ChartRecordsProvider } from '@/contexts/ChartRecordsContext'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { InfoIcon } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'

const About = () => {
  const { t } = useTranslation()
  return (
    <Alert className="mt-4">
      <InfoIcon className="size-4" />
      <AlertTitle>{t('about.title')}</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc space-y-1">
          <li>{t('about.disclaimer')}</li>

          <li>{t('about.initial_data')}</li>

          <li>
            <Trans i18nKey="about.rating_calculation">
              Rating calculation is based on the work of Kown & Kiei & Eastown with{' '}
              <a
                className="underline"
                href="https://docs.qq.com/doc/DYnRienFUbG9NQmVh"
                target="_blank"
                rel="noreferrer"
              >
                Rotaeno Rating推分参考公式（B30）
              </a>
              .
            </Trans>
          </li>

          <li>
            <Trans i18nKey="about.wiki_data">
              Songs and charts data are now automatically fetched from the{' '}
              <a
                className="underline"
                href="https://wiki.rotaeno.cn/"
                target="_blank"
                rel="noreferrer"
              >
                Rotaeno Wiki
              </a>
              .
            </Trans>
          </li>

          <li>
            <Trans i18nKey="about.open_source">
              This project is open source and free to use. Feel free to collaborate on{' '}
              <a className="underline" href="https://github.com/GalvinGao/rotaeno-kit">
                GitHub (GalvinGao/rotaeno-kit)
              </a>
              .
            </Trans>
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}

function App() {
  const { t } = useTranslation()
  return (
    <TooltipProvider delayDuration={0}>
      <ThemeProvider>
        <ChartRecordsProvider>
          <div className="mx-auto mb-16 flex size-full w-[48rem] max-w-full flex-col items-center gap-8 p-4 md:p-8">
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <LocaleSwitcher />
              <ColorSchemeSwitcher />
            </div>

            <div className="mt-8 flex w-full flex-col items-start justify-center gap-2 py-8 lg:py-16">
              <h1 className="text-4xl font-bold">Rotaeno Kit</h1>
              <p className="text-lg text-muted-foreground">{t('site.description')}</p>

              <About />
            </div>

            <RecordsSummary />

            <AddChartRecord />

            <ChartRecords />
          </div>

          <Toaster />
        </ChartRecordsProvider>
      </ThemeProvider>
    </TooltipProvider>
  )
}

export default App

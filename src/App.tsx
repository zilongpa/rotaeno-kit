import { AddChartRecord } from '@/components/AddChartRecord'
import { ChartRecords } from '@/components/ChartRecords'
import { ColorSchemeSwitcher } from '@/components/ColorSchemeSwitcher'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Toaster } from '@/components/ui/sonner'
import { ChartRecordsProvider } from '@/contexts/ChartRecordsContext'
import { InfoIcon } from 'lucide-react'

function App() {
  return (
    <ChartRecordsProvider>
      <div className="mx-auto mb-16 flex size-full w-[48rem] max-w-full flex-col items-center gap-8 p-4 md:p-8">
        <ColorSchemeSwitcher />

        <div className="mt-8 flex w-full flex-col items-start justify-center gap-2 py-8 lg:py-16">
          <h1 className="text-4xl font-bold">Rotaeno Kit</h1>
          <p className="text-lg text-muted-foreground">Tools for fellow Rotaeno players.</p>

          {/* credits */}
          <div className="flex flex-col">
            <Alert>
              <InfoIcon className="size-4" />
              <AlertTitle>Credits and Acknowledgements</AlertTitle>
              <AlertDescription>
                <ul className="list-inside list-disc space-y-1">
                  <li>
                    This project is not affiliated with Rotaeno or its developers. All rights are
                    reserved to their respective owners.
                  </li>

                  <li>
                    Initial data comes from &quot;Rotaeno 次世代Rating分析表for rotaeno
                    ver2.3.0&quot; by Team Rhythematics.
                  </li>

                  <li>
                    Rating calculation is based on the work of Kown & Kiei & Eastown with{' '}
                    <a
                      className="underline"
                      href="https://docs.qq.com/doc/DYnRienFUbG9NQmVh"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Rotaeno Rating推分参考公式（B30）
                    </a>
                    {'.'}
                  </li>

                  <li>
                    Songs and charts data are now automatically fetched from the{' '}
                    <a
                      className="underline"
                      href="https://wiki.rotaeno.cn/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Rotaeno Wiki
                    </a>
                    {'.'}
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <AddChartRecord />

        <ChartRecords />
      </div>

      <Toaster />
    </ChartRecordsProvider>
  )
}

export default App

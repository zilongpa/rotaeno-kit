import { AddChartRecord } from '@/components/AddChartRecord'
import { ChartRecords } from '@/components/ChartRecords'
import { ColorSchemeSwitcher } from '@/components/ColorSchemeSwitcher'
import { ChartRecordsProvider } from '@/contexts/ChartRecordsContext'

function App() {
  return (
    <ChartRecordsProvider>
      <div className="mx-auto flex size-full w-[48rem] max-w-full flex-col items-center gap-8 p-4 md:p-8">
        <ColorSchemeSwitcher />

        <div className="mt-8 flex w-full flex-col items-start justify-center gap-2 py-8 lg:py-16">
          <h1 className="text-4xl font-bold">Rotaeno Kit</h1>
          <p className="text-lg text-muted-foreground">Tools for fellow Rotaeno players.</p>
        </div>

        <AddChartRecord />

        <ChartRecords />
      </div>
    </ChartRecordsProvider>
  )
}

export default App

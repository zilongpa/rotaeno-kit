import { AddChartRecord } from '@/components/AddChartRecord'
import { ChartRecords } from '@/components/ChartRecords'
import { ColorSchemeSwitcher } from '@/components/ColorSchemeSwitcher'
import { ChartRecordsProvider } from '@/contexts/ChartRecordsContext'

function App() {
  return (
    <ChartRecordsProvider>
      <div className="flex size-full flex-col items-center gap-8 p-4 md:p-8">
        <ColorSchemeSwitcher />

        <div className="mt-16 flex flex-col items-start justify-center gap-2 py-16 lg:py-32">
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

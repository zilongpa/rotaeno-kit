import { createContext, FC, ReactNode, useContext, useEffect, useMemo } from 'react'
import { useList, useLocalStorage } from 'react-use'
import { ListActions } from 'react-use/lib/useList'
import { z } from 'zod'

export const addChartRecordFormSchema = z.object({
  songSlug: z.string().refine((v) => v !== '', {
    message: 'You must select a song.',
  }),
  difficultyLevel: z.string().min(1, {
    message: 'You must select a difficulty level.',
  }),
  achievementRate: z.number().min(0).max(1010000),
})
export type AddChartRecordForm = z.infer<typeof addChartRecordFormSchema>

export type ChartRecord = AddChartRecordForm

const ChartRecordsContext = createContext<Readonly<[ChartRecord[], ListActions<ChartRecord>]>>(
  undefined as never
)

export const ChartRecordsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [storedRecords, setStoredRecords] = useLocalStorage<ChartRecord[]>(
    'rotaeno-kit-chart-records',
    []
  )

  const [records, modifyRecords] = useList<ChartRecord>(storedRecords)

  useEffect(() => {
    setStoredRecords(records)
  }, [records])

  const value = useMemo(() => [records, modifyRecords] as const, [records, modifyRecords])

  return <ChartRecordsContext.Provider value={value}>{children}</ChartRecordsContext.Provider>
}

export const useChartRecords = () => {
  return useContext(ChartRecordsContext)
}

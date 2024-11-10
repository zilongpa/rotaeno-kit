import { songs } from '@/data/songs'
import { calculateSongRating } from '@/lib/rating'
import { createContext, FC, ReactNode, useContext, useEffect, useMemo } from 'react'
import { useList, useLocalStorage } from 'react-use'
import { ListActions } from 'react-use/lib/useList'
import invariant from 'tiny-invariant'
import { z } from 'zod'

export const addChartRecordFormSchema = z.object({
  songSlug: z.string().refine((v) => v !== '', {
    message: 'You must select a song.',
  }),
  difficultyLevel: z.string().min(1, {
    message: 'You must select a difficulty level.',
  }),
  achievementRate: z
    .number()
    .min(1, {
      message: 'Achievement rate must be greater than 0.',
    })
    .max(1010000, {
      message: 'Achievement rate must be less than 1010000.',
    }),
})
export type AddChartRecordForm = z.infer<typeof addChartRecordFormSchema>

export type ChartRecord = AddChartRecordForm

export const isSameChart = (a: ChartRecord, b: ChartRecord) => {
  return a.songSlug === b.songSlug && a.difficultyLevel === b.difficultyLevel
}

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

export const useCalculatedChartRecords = () => {
  const [records] = useChartRecords()

  return useMemo(() => {
    const enriched = records.map((record) => {
      const song = songs.find((song) => song.id === record.songSlug)
      invariant(song, `song not found: ${record.songSlug}`)
      const chart = song.charts.find((chart) => chart.difficultyLevel === record.difficultyLevel)
      invariant(chart, `chart not found: ${record.songSlug} ${record.difficultyLevel}`)
      return {
        ...record,
        song,
        chart,
        rating: calculateSongRating(chart.difficultyDecimal, record.achievementRate),
        ratingIndex: false,
      }
    })

    const sorted = enriched.slice().sort((a, b) => {
      return b.rating - a.rating
    })

    const best30 = sorted.slice(0, 30)

    return enriched.map((record) => {
      return {
        ...record,
        ratingIndex: best30.findIndex((r) => isSameChart(r, record)),
      }
    })
  }, [records])
}

import { useChartRecords } from '@/contexts/ChartRecordsContext'
import { songs } from '@/data/songs'
import { calculateSongRating } from '@/lib/rating'
import { Slash } from 'lucide-react'
import { FC } from 'react'
import invariant from 'tiny-invariant'

export const ChartRecords: FC = () => {
  const [records] = useChartRecords()

  return (
    <div className="flex flex-col gap-2">
      {records.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
          <Slash className="size-5" />
          <span>No records</span>
        </div>
      )}
      {records.map((record) => {
        const song = songs.find((song) => song.slug === record.chartSlug)
        invariant(song, 'song not found')
        const chart = song.charts.find((chart) => chart.difficultyLevel === record.difficultyLevel)
        invariant(chart, 'chart not found')
        const rating = calculateSongRating(chart.difficultyDecimal, record.achievementRate)

        return (
          <div key={record.chartSlug}>
            {`${song.name} - ${chart.difficultyLevel} (${chart.difficultyDecimal}) @ ${record.achievementRate}: Song Rating = ${rating}`}
          </div>
        )
      })}
    </div>
  )
}

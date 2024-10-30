import { useCalculatedChartRecords } from '@/contexts/ChartRecordsContext'
import { useTranslation } from 'react-i18next'

import { RatingDisplay } from '@/components/rating-page/RatingDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartPieIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

// data is an array of numbers within 0 and about 16.67.
// adjust the bucket size as needed since there could be cases like
// [2, 2.1]; [2, 5]; [2, 16.67], but typically the max - min of all numbers will be within about 2.0
// use these knowledge to calculate the histogram for the chart to render beautifully
function calculateHistogram(data: number[]) {
  if (data.length === 0) return []

  const min = Math.floor(Math.min(...data) * 2) / 2
  const max = Math.ceil(Math.max(...data) * 2) / 2
  const bucketSize = 0.25
  const numBuckets = Math.ceil((max - min) / bucketSize)

  const histogram = Array.from({ length: numBuckets }, (_, i) => {
    const bucketStart = min + i * bucketSize
    return {
      bucketStart: Number(bucketStart.toFixed(2)),
      bucketEnd: Number((bucketStart + bucketSize).toFixed(2)),
      // Center point for the bar positioning
      center: Number((bucketStart + bucketSize / 2).toFixed(2)),
      count: data.filter((d) => d >= bucketStart && d < bucketStart + bucketSize).length,
    }
  })

  return histogram
}

export const RecordsSummary = () => {
  const { t } = useTranslation()

  const data = useCalculatedChartRecords()

  const summary = useMemo(() => {
    const b30Entries = data
      .filter((record) => record.ratingIndex !== -1)
      .slice()
      .sort((a, b) => b.rating - a.rating)
    // rating = best 10 average * 0.7 + better 20 average * 0.3
    const best10 = b30Entries.slice(0, 10)
    const better20 = b30Entries.slice(10, 30)

    const best10Rating = best10.reduce((acc, record) => acc + record.rating, 0) / 10
    const better20Rating = better20.reduce((acc, record) => acc + record.rating, 0) / 20
    const rating = best10Rating * 0.7 + better20Rating * 0.3

    const b30Ratings = b30Entries.map((record) => record.rating)

    const min = b30Ratings.length > 0 ? Math.min(...b30Ratings) : 0
    const max = b30Ratings.length > 0 ? Math.max(...b30Ratings) : 0
    const avg =
      b30Ratings.length > 0
        ? b30Ratings.reduce((acc, record) => acc + record, 0) / b30Ratings.length
        : 0

    const histogram = calculateHistogram(b30Ratings)

    return {
      rating,
      min,
      max,
      avg,
      histogram,
    }
  }, [data])

  const ticks = summary.histogram.map((h) => h.bucketStart)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{t('records.rating.title')}</CardTitle>
        <ChartPieIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <RatingDisplay rating={summary.rating} />

        <p className="text-xs text-muted-foreground">{t('records.rating.current')}</p>

        {summary.histogram.length > 0 && (
          <>
            <div className="mt-8 font-medium">{t('records.rating.distribution')}</div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="font-bold">{t('records.rating.stats.min')}</span>
                <span className="tabular-nums tracking-tight">{summary.min.toFixed(3)}</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="font-bold">{t('records.rating.stats.avg')}</span>
                <span className="tabular-nums tracking-tight">{summary.avg.toFixed(3)}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-bold">{t('records.rating.stats.max')}</span>
                <span className="tabular-nums tracking-tight">{summary.max.toFixed(3)}</span>
              </div>
            </div>
            <div className="mt-2 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={summary.histogram}
                  margin={{ left: 0, right: 0 }}
                  barCategoryGap={0}
                  barGap={0}
                >
                  <XAxis
                    dataKey="center"
                    scale="linear"
                    type="number"
                    domain={[
                      (dataMin: number) => dataMin - 0.25,
                      (dataMax: number) => dataMax + 0.25,
                    ]}
                    tickFormatter={(value: number) => value.toString()}
                    ticks={ticks}
                    interval={0}
                  />
                  <YAxis hide />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    label={{
                      position: 'insideTop',
                      fill: 'hsl(var(--foreground))',
                      fontSize: 12,
                      formatter: (value: number) => (value === 0 ? '' : value),
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

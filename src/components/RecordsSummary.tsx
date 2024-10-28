import { useCalculatedChartRecords } from '@/contexts/ChartRecordsContext'

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
  const bucketSize = 0.5
  const numBuckets = Math.ceil((max - min) / bucketSize)

  const histogram = Array.from({ length: numBuckets }, (_, i) => {
    const bucketStart = min + i * bucketSize
    return {
      bucketStart: Number(bucketStart.toFixed(1)),
      bucketEnd: Number((bucketStart + bucketSize).toFixed(1)),
      // Center point for the bar positioning
      center: Number((bucketStart + bucketSize / 2).toFixed(2)),
      count: data.filter((d) => d >= bucketStart && d < bucketStart + bucketSize).length,
    }
  })

  return histogram
}

export const RecordsSummary = () => {
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

    console.log({ best10, better20, best10Rating, better20Rating, rating })

    const min = b30Entries.length > 0 ? b30Entries[b30Entries.length - 1].rating : 0
    const max = b30Entries.length > 0 ? b30Entries[0].rating : 0
    const avg =
      b30Entries.length > 0
        ? b30Entries.reduce((acc, record) => acc + record.rating, 0) / b30Entries.length
        : 0

    const histogram = calculateHistogram(b30Entries.map((record) => record.rating))

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
        <CardTitle className="text-2xl font-bold">Rating</CardTitle>
        <ChartPieIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold tracking-tight">{summary.rating.toFixed(3)}</div>
        <p className="text-xs text-muted-foreground">Current rating</p>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="font-bold">Min</span>
            <span className="tabular-nums tracking-tight">{summary.min.toFixed(3)}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Max</span>
            <span className="tabular-nums tracking-tight">{summary.max.toFixed(3)}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Avg</span>
            <span className="tabular-nums tracking-tight">{summary.avg.toFixed(3)}</span>
          </div>
        </div>

        <div className="mt-8 font-medium">Distribution</div>
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
                domain={[(dataMin: number) => dataMin - 0.25, (dataMax: number) => dataMax + 0.5]}
                tickFormatter={(value: number) => value.toFixed(1)}
                ticks={ticks}
                interval={0}
              />
              <YAxis hide />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

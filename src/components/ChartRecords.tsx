import invariant from 'tiny-invariant'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChartRecord, isSameChart, useChartRecords } from '@/contexts/ChartRecordsContext'
import { songs } from '@/data/songs'
import { calculateSongRating } from '@/lib/rating'
import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table'
import { SlashIcon, TrashIcon } from 'lucide-react'
import { useMemo } from 'react'

interface TableRow extends ChartRecord {
  rating: number
}

const ChartRecordActions = ({ record }: { record: TableRow }) => {
  const [, { filter }] = useChartRecords()

  const handleDelete = () => {
    filter((r) => !isSameChart(r, record))
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="icon" onClick={handleDelete}>
        <TrashIcon className="size-4" />
      </Button>
    </div>
  )
}

const AchievementRateCell = ({ row }: { row: Row<TableRow> }) => {
  return (
    <span className="tabular-nums">
      {row.original.achievementRate < 1_000_000 && <span className="opacity-20">0</span>}
      {row.original.achievementRate.toString()}
    </span>
  )
}

const chartRecordsColumns: ColumnDef<TableRow>[] = [
  {
    accessorKey: 'songSlug',
    header: 'Song',
    cell: ({ row }) => {
      const song = songs.find((song) => song.slug === row.original.songSlug)
      invariant(song, 'song not found')
      return song.name
    },
  },
  {
    accessorKey: 'difficultyLevel',
    header: 'Difficulty',
  },
  {
    accessorKey: 'achievementRate',
    header: '%',
    cell: AchievementRateCell,
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      return <span className="tabular-nums">{row.original.rating.toString()}</span>
    },
  },
  {
    accessorKey: '_actions',
    header: 'Actions',
    cell: ({ row }) => {
      return <ChartRecordActions record={row.original} />
    },
  },
]

export const ChartRecords = () => {
  const [records, modifyRecords] = useChartRecords()

  const data = useMemo(() => {
    return records.map((record) => {
      const song = songs.find((song) => song.slug === record.songSlug)
      invariant(song, 'song not found')
      const chart = song.charts.find((chart) => chart.difficultyLevel === record.difficultyLevel)
      invariant(chart, 'chart not found')
      return {
        ...record,
        rating: calculateSongRating(chart.difficultyDecimal, record.achievementRate),
      }
    })
  }, [records])

  const table = useReactTable({
    data,
    columns: chartRecordsColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chart Records</h2>

        {records.length > 0 && (
          <Button variant="destructive" size="sm" onClick={() => modifyRecords.clear()}>
            Clear All
          </Button>
        )}
      </div>

      <div className="w-full rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} hoverable={false}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow hoverable={false}>
                <TableCell
                  colSpan={chartRecordsColumns.length}
                  className="h-48 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <SlashIcon className="size-4" />
                    <div>No records. Add some from above!</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

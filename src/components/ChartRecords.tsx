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
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { SlashIcon } from 'lucide-react'
import { FC } from 'react'

const ChartRecordActions = ({ record }: { record: ChartRecord }) => {
  const [, { filter }] = useChartRecords()

  const handleDelete = () => {
    filter((r) => !isSameChart(r, record))
  }

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  )
}

const chartRecordsColumns: ColumnDef<ChartRecord>[] = [
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
  },
  {
    accessorKey: '_chartRating',
    header: 'Chart Rating',
    cell: ({ row }) => {
      const song = songs.find((song) => song.slug === row.original.songSlug)
      invariant(song, 'song not found')
      const chart = song.charts.find(
        (chart) => chart.difficultyLevel === row.original.difficultyLevel
      )
      invariant(
        chart,
        'chart not found for song ' + row.original.songSlug + ' ' + row.original.difficultyLevel
      )
      return calculateSongRating(chart.difficultyDecimal, row.original.achievementRate)
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

interface DataTableProps {
  data: ChartRecord[]
}

function ChartRecordsDataTable({ data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns: chartRecordsColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
            <TableRow disabled>
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
  )
}

export const ChartRecords: FC = () => {
  const [records] = useChartRecords()

  return (
    <div className="flex w-full flex-col gap-2">
      <ChartRecordsDataTable data={records} />
    </div>
  )
}

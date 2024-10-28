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
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { CheckIcon, MinusIcon, SlashIcon, SortAscIcon, SortDescIcon, TrashIcon } from 'lucide-react'
import { ReactNode, useMemo, useState } from 'react'

interface TableRow extends ChartRecord {
  rating: number
  ratingEligibility: 'b30' | false
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

const SortableColumnHeaderCell = ({
  column,
  children,
}: {
  column: Column<TableRow>
  children: ReactNode
}) => {
  return (
    <button
      className="flex h-10 w-full items-center justify-between gap-2 px-2 hover:bg-muted/50"
      onClick={() => column.toggleSorting()}
    >
      {children}

      {column.getIsSorted() === 'asc' ? (
        <SortAscIcon className="size-4" />
      ) : column.getIsSorted() === 'desc' ? (
        <SortDescIcon className="size-4" />
      ) : (
        <div className="size-4" />
      )}
    </button>
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
    accessorKey: 'ratingEligibility',
    header: (props) => <SortableColumnHeaderCell {...props}>B30?</SortableColumnHeaderCell>,
    cell: ({ row }) => {
      return row.original.ratingEligibility ? (
        <CheckIcon className="size-4" />
      ) : (
        <MinusIcon className="size-4 opacity-20" />
      )
    },
    meta: { header: { inset: true } },
  },
  {
    accessorKey: 'achievementRate',
    header: (props) => <SortableColumnHeaderCell {...props}>%</SortableColumnHeaderCell>,
    cell: AchievementRateCell,
    meta: { header: { inset: true } },
  },
  {
    accessorKey: 'rating',
    header: (props) => <SortableColumnHeaderCell {...props}>Rating</SortableColumnHeaderCell>,
    cell: ({ row }) => {
      return <span className="tabular-nums">{row.original.rating.toString()}</span>
    },
    meta: { header: { inset: true } },
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return <ChartRecordActions record={row.original} />
    },
  },
]

export const ChartRecords = () => {
  const [records, modifyRecords] = useChartRecords()
  const [sorting, setSorting] = useState<SortingState>([])

  const data = useMemo(() => {
    const enriched = records.map((record) => {
      const song = songs.find((song) => song.slug === record.songSlug)
      invariant(song, 'song not found')
      const chart = song.charts.find((chart) => chart.difficultyLevel === record.difficultyLevel)
      invariant(chart, 'chart not found')
      return {
        ...record,
        rating: calculateSongRating(chart.difficultyDecimal, record.achievementRate),
        ratingEligibility: false,
      }
    })

    const sorted = enriched.slice().sort((a, b) => {
      return b.rating - a.rating
    })

    const first30 = sorted.slice(0, 30)

    return enriched.map((record) => {
      return {
        ...record,
        ratingEligibility: first30.includes(record) ? ('b30' as const) : (false as const),
      }
    })
  }, [records])

  const table = useReactTable({
    data,
    columns: chartRecordsColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
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
                    <TableHead
                      key={header.id}
                      inset={header.column.columnDef.meta?.header?.inset === true}
                      bordered
                    >
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

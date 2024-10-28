import invariant from 'tiny-invariant'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChartRecord, useChartRecords } from '@/contexts/ChartRecordsContext'
import { songs } from '@/data/songs'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { FC } from 'react'

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
    header: 'Achievement Rate',
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
    <div className="rounded-md border">
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
            <TableRow>
              <TableCell colSpan={chartRecordsColumns.length} className="h-24 text-center">
                No records.
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
    <div className="flex flex-col gap-2">
      <ChartRecordsDataTable data={records} />
    </div>
  )
}

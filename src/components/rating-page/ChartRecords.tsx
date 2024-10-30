import { SongJacket } from '@/components/entities/SongJacket'
import { NotIdealState } from '@/components/global/NotIdealState'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  isSameChart,
  useCalculatedChartRecords,
  useChartRecords,
} from '@/contexts/ChartRecordsContext'
import { songs } from '@/data/songs'
import { cn } from '@/lib/utils'
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowDown10Icon,
  ArrowDownZaIcon,
  ArrowUp01Icon,
  ArrowUpAZIcon,
  ArrowUpDownIcon,
  CheckIcon,
  DownloadIcon,
  MinusIcon,
  SortAscIcon,
  SortDescIcon,
  TrashIcon,
} from 'lucide-react'
import { ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type TableRow = ReturnType<typeof useCalculatedChartRecords>[number]

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

const PadZeroCell = ({ value, digits }: { value: number; digits: number }) => {
  const [whole, decimal] = value.toString().split('.')
  const needsPadding = whole === '0' ? digits : whole.length < digits

  return (
    <span className="text-base tabular-nums">
      {needsPadding && <span className="opacity-20">{'0'.repeat(digits - whole.length)}</span>}
      {whole}
      {decimal ? `.${decimal}` : ''}
    </span>
  )
}

const SortableColumnHeaderCell = ({
  column,
  sortStyle,
  className,
  children,
}: {
  column: Column<TableRow>
  sortStyle: 'numerical' | 'alphabetical' | 'logical'
  className?: string
  children: ReactNode
}) => {
  const AscIcon = {
    alphabetical: ArrowUpAZIcon,
    numerical: ArrowUp01Icon,
    logical: SortAscIcon,
  }[sortStyle]
  const DescIcon = {
    alphabetical: ArrowDownZaIcon,
    numerical: ArrowDown10Icon,
    logical: SortDescIcon,
  }[sortStyle]

  return (
    <button
      className={cn(
        'flex h-10 w-full items-center justify-between gap-2 px-2 hover:bg-muted/50',
        className
      )}
      onClick={() => column.toggleSorting()}
    >
      <div className="whitespace-nowrap">{children}</div>

      {column.getIsSorted() === 'asc' ? (
        <AscIcon className="size-4" />
      ) : column.getIsSorted() === 'desc' ? (
        <DescIcon className="size-4" />
      ) : (
        <ArrowUpDownIcon className="size-4 opacity-20" />
      )}
    </button>
  )
}

export const ChartRecords = () => {
  const { t } = useTranslation()
  const [records, modifyRecords] = useChartRecords()
  const [sorting, setSorting] = useState<SortingState>([])
  const data = useCalculatedChartRecords()

  const chartRecordsColumns: ColumnDef<TableRow>[] = useMemo(
    () => [
      {
        id: 'song',
        accessorKey: 'song.title_localized.default',
        sortingFn: 'textCaseSensitive',
        header: ({ column }) => (
          <SortableColumnHeaderCell
            column={column}
            sortStyle="alphabetical"
            className="min-w-[250px]"
          >
            {t('chartRecords.table.header.song')}
          </SortableColumnHeaderCell>
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <SongJacket
                song={row.original.song}
                difficultyLevel={row.original.chart.difficultyLevel}
                pictureClassName="shrink-0 sticky left-2"
              />
              <div>{row.original.song.title_localized.default}</div>
            </div>
          )
        },
        meta: { header: { inset: true } },
      },
      {
        id: 'difficulty',
        accessorKey: 'chart.difficultyDecimal',
        header: ({ column }) => (
          <SortableColumnHeaderCell column={column} sortStyle="logical">
            {t('chartRecords.table.header.difficulty')}
          </SortableColumnHeaderCell>
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-between gap-0.5">
              <div>{row.original.chart.difficultyLevel}</div>
              <div className="tabular-nums text-muted-foreground">
                {row.original.chart.difficultyDecimal.toFixed(1)}
              </div>
            </div>
          )
        },
        meta: { header: { inset: true } },
      },
      {
        accessorKey: 'ratingIndex',
        header: ({ column }) => (
          <SortableColumnHeaderCell column={column} sortStyle="logical">
            {t('chartRecords.table.header.b30')}
          </SortableColumnHeaderCell>
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-start gap-2">
              {row.original.ratingIndex !== -1 ? (
                <CheckIcon className="size-4" />
              ) : (
                <MinusIcon className="size-4 opacity-20" />
              )}

              {row.original.ratingIndex !== -1 && (
                <div className="text-sm tabular-nums leading-none">
                  #{row.original.ratingIndex + 1}
                </div>
              )}
            </div>
          )
        },
        // if sort by descending, it should be 0, 1, 2, ..., 30, -1
        sortingFn: (a, b) => {
          if (a.original.ratingIndex === -1) return 1
          if (b.original.ratingIndex === -1) return -1
          return a.original.ratingIndex - b.original.ratingIndex
        },
        invertSorting: true,
        meta: { header: { inset: true } },
      },
      {
        accessorKey: 'achievementRate',
        header: ({ column }) => (
          <SortableColumnHeaderCell column={column} sortStyle="numerical">
            {t('chartRecords.table.header.achievementRate')}
          </SortableColumnHeaderCell>
        ),
        cell: ({ row }) => <PadZeroCell value={row.original.achievementRate} digits={7} />,
        meta: { header: { inset: true } },
      },
      {
        accessorKey: 'rating',
        header: ({ column }) => (
          <SortableColumnHeaderCell column={column} sortStyle="numerical">
            {t('chartRecords.table.header.rating')}
          </SortableColumnHeaderCell>
        ),
        cell: ({ row }) => <PadZeroCell value={row.original.rating} digits={2} />,
        meta: { header: { inset: true } },
      },
      {
        id: 'actions',
        header: () => (
          <div className="whitespace-nowrap text-right">
            {t('chartRecords.table.header.actions')}
          </div>
        ),
        cell: ({ row }) => {
          return <ChartRecordActions record={row.original} />
        },
      },
    ],
    [t]
  )

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

  const handleDownloadCSV = () => {
    const csv = data
      .map((record) => {
        return `${JSON.stringify(songs.find((song) => song.id === record.songSlug)?.title_localized.default)},${record.difficultyLevel},${record.achievementRate},${record.rating}`
      })
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chart-records.csv'
    a.click()
  }

  return (
    <div className="flex w-full flex-col gap-2 pb-16">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-lg font-semibold">{t('chartRecords.title')}</h2>

        <div className="flex-1" />

        {records.length > 0 && (
          <>
            <Button variant="destructive" size="sm" onClick={() => modifyRecords.clear()}>
              {t('chartRecords.actions.clearAll')}
            </Button>

            <Button variant="outline" size="icon" onClick={handleDownloadCSV}>
              <DownloadIcon className="size-4" />
            </Button>
          </>
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
                  <NotIdealState>{t('chartRecords.table.empty')}</NotIdealState>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

import { SongJacket } from '@/components/entities/SongJacket'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  AddChartRecordForm,
  addChartRecordFormSchema,
  isSameChart,
  useChartRecords,
} from '@/contexts/ChartRecordsContext'
import { songs } from '@/data/songs'
import { safeParseImport } from '@/lib/import'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import Fuse from 'fuse.js'
import { Check, PlusIcon } from 'lucide-react'
import { FC, useMemo, useRef, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const useFuse = () => {
  return useMemo(() => {
    return new Fuse(songs, {
      keys: [
        {
          name: 'title_localized.default',
          weight: 1.5,
        },
        {
          name: 'artist',
          weight: 1,
        },
      ],
      shouldSort: true,
      threshold: 0.6,
    })
  }, [])
}

const SearchSongAutocomplete: FC<{
  value: string
  onValueChange: (value: string) => void
}> = ({ value, onValueChange }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()
  const [query, setQuery] = useState('')
  const fuse = useFuse()

  const searchResults = useMemo(() => {
    if (!query) {
      return songs
    }
    return fuse.search(query).map((result) => result.item)
  }, [query, fuse])

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        if (open) {
          startTransition(() => {
            setOpen(true)
          })
        } else {
          setOpen(false)
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full shrink justify-between"
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {value
              ? songs.find((song) => song.id === value)?.title_localized.default
              : t('addRecord.song.placeholder')}
          </span>
          <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] max-w-[100vw] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t('addRecord.song.searchPlaceholder')}
            onValueChange={(value) => {
              setQuery(value)
            }}
          />
          <CommandList>
            <CommandEmpty>{t('addRecord.song.empty')}</CommandEmpty>
            <CommandGroup>
              {searchResults.map((song) => (
                <CommandItem
                  key={song.id}
                  value={song.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue)
                    setOpen(false)
                  }}
                  className={clsx(
                    'flex items-center overflow-hidden text-ellipsis whitespace-nowrap',
                    value === song.id &&
                      'bg-foreground text-background data-[selected=true]:bg-foreground/80 data-[selected=true]:text-background/80'
                  )}
                >
                  {value === song.id && <Check className="size-4" />}

                  <SongJacket
                    song={song}
                    className="size-4 rounded-[1px]"
                    pictureClassName="shrink-0"
                  />

                  <span className="shrink overflow-hidden text-ellipsis whitespace-nowrap">
                    {song.title_localized.default}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export const AddChartRecord: FC = () => {
  const { t } = useTranslation()
  const [records, modifyRecords] = useChartRecords()

  const form = useForm<AddChartRecordForm>({
    resolver: zodResolver(addChartRecordFormSchema),
    defaultValues: {
      songSlug: '',
      difficultyLevel: '',
    },
  })

  const songSlug = form.watch('songSlug')
  const song = useMemo(() => {
    return songs.find((song) => song.id === songSlug)
  }, [songSlug])

  const onSubmit = (data: AddChartRecordForm) => {
    const existingRecord = records.find((r) => isSameChart(r, data))
    if (existingRecord && existingRecord.achievementRate < data.achievementRate) {
      // there exists an existing record that has a lower achievement rate than the new one. Update it.
      modifyRecords.updateFirst((r) => isSameChart(r, data), data)
    } else {
      // no existing record, or the existing record has a higher achievement rate than the new one. Add it.
      modifyRecords.push(data)
    }
    form.reset()
  }

  return (
    <div className="flex w-full flex-col">
      <Card className="w-full rounded-b-none rounded-t-lg">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(onSubmit)(e)
            }}
          >
            <CardHeader>
              <CardTitle>{t('addRecord.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="songSlug"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel>{t('addRecord.song.label')}</FormLabel>
                        <SearchSongAutocomplete
                          value={field.value}
                          onValueChange={(v) => {
                            field.onChange(v)
                            form.setValue('difficultyLevel', '')
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficultyLevel"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel>{t('addRecord.difficulty.label')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange} disabled={!song}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('addRecord.difficulty.placeholder')}>
                              {(() => {
                                const chart = song?.charts.find(
                                  (chart) => chart.difficultyLevel === field.value
                                )
                                return `${chart?.difficultyLevel} (${chart?.difficultyDecimal.toFixed(1)})`
                              })()}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {song?.charts.map((chart) => (
                              <SelectItem
                                key={chart.difficultyLevel}
                                value={chart.difficultyLevel}
                                className="flex w-full flex-1 flex-col items-start gap-1"
                                textValue={chart.difficultyLevel}
                              >
                                <SelectItemText asChild>
                                  <div className="text-base leading-none tracking-tight">
                                    {chart.difficultyLevel}
                                  </div>
                                </SelectItemText>
                                <div className="flex w-full items-center justify-between text-xs tabular-nums text-muted-foreground">
                                  <div>{chart.difficultyDecimal.toFixed(1)}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {t('addRecord.difficulty.chartBy', {
                                      designer: chart.chartDesigner,
                                    })}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="achievementRate"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>{t('addRecord.achievementRate.label')}</FormLabel>
                      <Input
                        type="number"
                        className="font-mono"
                        {...field}
                        min={0}
                        max={1010000}
                        placeholder={t('addRecord.achievementRate.placeholder')}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-row gap-2">
              <Button type="submit">
                <PlusIcon className="-ml-1 size-4" />
                {t('addRecord.button.add')}
              </Button>
              <Button variant="ghost" type="reset" onClick={() => form.reset()}>
                {t('addRecord.button.reset')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <ChartRecordImportForm />
    </div>
  )
}

const ChartRecordImportForm: FC = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [, modifyRecords] = useChartRecords()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const onImport = () => {
    const content = textareaRef.current?.value
    if (!content) {
      toast.error(t('addRecord.import.error.noContent'))
      return
    }

    const parsed = safeParseImport(content)
    if (parsed.isErr()) {
      toast.error(t('addRecord.import.error.parseFailed', { error: parsed.error }))
      return
    }

    const filtered = parsed.value.filter((record) => {
      return record.achievementRate !== 0
    })

    modifyRecords.set(filtered)
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addRecord.import.dialog.title')}</DialogTitle>
            <DialogDescription>
              <Trans
                i18nKey="addRecord.import.dialog.description"
                components={{
                  code: <code />,
                }}
              >
                Paste the JSON content of <code>CloudSave</code> or{' '}
                <code>GetAllFolloweeSocialData</code> (currently only will import the data of your
                first friend) api response here. Your current records will be overwritten.
              </Trans>
            </DialogDescription>
          </DialogHeader>

          <Textarea
            ref={textareaRef}
            className="scroll-pb-2 font-mono text-xs"
            rows={15}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={t('addRecord.import.dialog.placeholder')}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('addRecord.import.dialog.cancel')}
            </Button>
            <Button onClick={onImport}>{t('addRecord.import.dialog.confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full rounded-b-lg rounded-t-none border-t-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{t('addRecord.import.title')}</CardTitle>

          <Button variant="outline" onClick={() => setOpen(true)}>
            {t('addRecord.import.button')}
          </Button>
        </CardHeader>
      </Card>
    </>
  )
}

import rawSongs from '@/assets/songs.json'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import Fuse from 'fuse.js'
import { FC, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Check, ChevronsUpDown, PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const songs = rawSongs.filter((song) => {
  if (!song.slug) {
    console.warn('song has no slug', song)
    return false
  }
  return true
})

const addChartRecordFormSchema = z.object({
  chartSlug: z.string().refine((v) => v !== '', {
    message: 'You must select a song.',
  }),
  difficultyLevel: z.string().min(1, {
    message: 'You must select a difficulty level.',
  }),
  achievementRate: z.number().min(0).max(1010000),
})
type AddChartRecordForm = z.infer<typeof addChartRecordFormSchema>

const useFuse = () => {
  return useMemo(
    () =>
      new Fuse(songs, {
        keys: ['name', 'category'],
      }),
    []
  )
}

const SearchSongAutocomplete: FC<{
  value: string
  onValueChange: (value: string) => void
}> = ({ value, onValueChange }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const fuse = useFuse()

  const searchResults = useMemo(() => {
    if (!query) {
      return songs
    }
    return fuse.search(query).map((result) => result.item)
  }, [query])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full shrink justify-between"
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {value ? songs.find((song) => song.slug === value)?.name : 'Select song...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search song..."
            onValueChange={(value) => {
              setQuery(value)
            }}
          />
          <CommandList>
            <CommandEmpty>No chart found.</CommandEmpty>
            <CommandGroup>
              {searchResults.map((song) => (
                <CommandItem
                  key={song.slug}
                  value={song.slug}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === song.slug ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {song.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const AddChartRecord: FC = () => {
  const form = useForm<AddChartRecordForm>({
    resolver: zodResolver(addChartRecordFormSchema),
    defaultValues: {
      chartSlug: '',
      difficultyLevel: '',
    },
  })

  const chartSlug = form.watch('chartSlug')
  const song = useMemo(() => {
    return songs.find((song) => song.slug === chartSlug)
  }, [chartSlug])

  const onSubmit = (data: AddChartRecordForm) => {
    console.log(data)
  }

  return (
    <Card className="w-full max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Add Chart Record</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                <FormField
                  control={form.control}
                  name="chartSlug"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Song</FormLabel>
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
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={!song}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                        <SelectContent>
                          {song?.charts.map((chart) => (
                            <SelectItem key={chart.defaultIndex} value={chart.difficultyLevel}>
                              {chart.difficultyLevel}
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
                    <FormLabel>Achievement Rate</FormLabel>
                    <Input
                      type="number"
                      className="font-mono"
                      {...field}
                      min={0}
                      max={1000000}
                      placeholder="0995223"
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
              Add
            </Button>
            <Button variant="ghost" type="reset" onClick={() => form.reset()}>
              Reset
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

function App() {
  return (
    <div className="flex size-full flex-col items-center p-8">
      <div className="flex flex-col items-center justify-center py-32">
        <h1 className="text-4xl font-bold">Rotaeno Kit</h1>
        <p className="text-lg text-muted-foreground">
          A tool for Rotaeno players to track their progress.
        </p>
      </div>

      <AddChartRecord />
    </div>
  )
}

export default App

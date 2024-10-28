import rawSongs from '@/data/songs.json'

type DifficultyLevel = 'III' | 'IV' | 'IV-α'

interface Chart {
  defaultIndex: number
  updateIndex: number
  version: string
  difficultyLevel: DifficultyLevel
  difficultyDecimal: number
}

interface Song {
  name: string
  slug: string
  category: string
  charts: Chart[]
}

export const songs: Song[] = rawSongs.filter((song) => {
  if (!song.slug) {
    console.warn('song has no slug', song)
    return false
  }
  return true
}) as Song[]

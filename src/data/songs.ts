import rawSongs from '@/data/songs.json'

type DifficultyLevel = 'I' | 'II' | 'III' | 'IV' | 'IV-α'

export interface LocalizedString {
  default: string
  en?: string
  'zh-Hans'?: string
  'zh-Hant'?: string
  ja?: string
  ko?: string
}

interface Chart {
  difficultyLevel: DifficultyLevel
  difficultyDecimal: number
  chartDesigner: string
  jacketDesigner: string
}

export interface Song {
  id: string
  artist: string
  releaseVersion: string
  title_localized: LocalizedString
  source_localized?: LocalizedString
  charts: Chart[]
}

export const songs = rawSongs as Song[]

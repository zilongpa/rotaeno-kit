import fs from 'fs/promises'
import * as z from 'zod'

const ELocalizedSchema = z.object({
  default: z.string(),
  en: z.string().optional(),
  'zh-Hans': z.string().optional(),
  'zh-Hant': z.string().optional(),
  ja: z.string().optional(),
  ko: z.string().optional(),
})

const SongSchema = z.object({
  songs: z.array(
    z.object({
      id: z.string(),
      artist: z.string(),
      title_localized: ELocalizedSchema,
      difficulties: z.array(
        z.object({
          ratingClass: z.number(),
          ratingReal: z.number(),
          chartDesigner: z.string(),
          jacketDesigner: z.string(),
        })
      ),
      release_version: z.string(),
      source_localized: ELocalizedSchema.optional(),
      has_challenge_badge: z.boolean().optional(),
    })
  ),
})

const WIKI_TEMPLATE_ENDPOINT =
  'https://wiki.rotaeno.cn/api.php?action=query&prop=revisions&titles=Template:Songlist.json&rvslots=*&rvprop=content&format=json'

interface WikiTemplateEndpoint {
  query: { pages: Record<string, { revisions: { slots: { main: { '*': string } } }[] }> }
}

const fetchWikiTemplate = async () => {
  const response = await fetch(WIKI_TEMPLATE_ENDPOINT)
  const data = (await response.json()) as WikiTemplateEndpoint

  const content = data.query.pages[Object.keys(data.query.pages)[0]].revisions[0].slots.main['*']

  const songList = SongSchema.parse(JSON.parse(content))

  return songList
}

const RATING_CLASS_TO_DIFFICULTY_LEVEL = {
  0: 'I',
  1: 'II',
  2: 'III',
  3: 'IV',
  200: 'IV-α',
}

const IV_JACKET_ID_OVERRIDE: Record<string, string> = {
  'rush-e': 'rush-e_IV',
  epitaxy: 'epitaxy_IV',
}

const mappedSongs = (await fetchWikiTemplate()).songs.map((song) => {
  return {
    id: song.id,
    artist: song.artist,
    releaseVersion: song.release_version,
    title_localized: song.title_localized,
    source_localized: song.source_localized,
    charts: song.difficulties.map((difficulty) => {
      const difficultyLevel =
        RATING_CLASS_TO_DIFFICULTY_LEVEL[
          difficulty.ratingClass as keyof typeof RATING_CLASS_TO_DIFFICULTY_LEVEL
        ]
      return {
        difficultyLevel,
        difficultyDecimal: difficulty.ratingReal,
        overrideJacketId: difficultyLevel === 'IV' ? IV_JACKET_ID_OVERRIDE[song.id] : undefined,
        chartDesigner: difficulty.chartDesigner,
        jacketDesigner: difficulty.jacketDesigner,
      }
    }),
  }
})

await fs.writeFile('src/data/songs.json', JSON.stringify(mappedSongs, null, 2))

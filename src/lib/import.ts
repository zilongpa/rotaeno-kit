import { ChartRecord } from '@/contexts/ChartRecordsContext'
import { err, ok, Result } from 'neverthrow'
import { z } from 'zod'

const remoteCloudSaveSchema = z.object({
  results: z.array(
    z.object({
      cloudSave: z.object({
        data: z.object({
          data: z.object({
            // [songSlug: string]: {
            //   levels: {
            //     [difficultyLevel: string]: { score: number }
            //   }
            // }
            songs: z.object({
              songs: z.record(
                z.string(),
                z.object({
                  levels: z.record(
                    z.string(),
                    z.object({
                      Flag: z.string(),
                      IsCleared: z.boolean(),
                      Score: z.number(),
                    })
                  ),
                })
              ),
            }),
          }),
        }),
      }),
    })
  ),
})

const remoteSocialDataSchema = z.object({
  result: z.object({
    socialDatas: z.array(
      z.object({
        // [songSlug: string]: [difficultyLevel: string]: number
        scores: z.record(z.string(), z.record(z.string(), z.number())),
      })
    ),
  }),
})

const DIFFICULTY_LEVEL_MAP = {
  i: 'I',
  ii: 'II',
  iii: 'III',
  iv: 'IV',
  iv_alpha: 'IV-α',
  I: 'I',
  II: 'II',
  III: 'III',
  IV: 'IV',
  IV_Alpha: 'IV-α',
}
export const safeParseImport = (content: string): Result<ChartRecord[], string> => {
  const object = Result.fromThrowable(JSON.parse)(content)
  if (object.isErr()) {
    return err('Invalid JSON')
  }

  const parsedCloudSave = remoteCloudSaveSchema.safeParse(object.value)
  if (parsedCloudSave.success) {
    const songs = parsedCloudSave.data.results[0].cloudSave.data.data.songs.songs
    const chartRecords = Object.entries(songs)
      .map(([songSlug, song]) =>
        Object.entries(song.levels).map(([difficultyLevel, level]) => ({
          songSlug,
          difficultyLevel:
            DIFFICULTY_LEVEL_MAP[difficultyLevel as keyof typeof DIFFICULTY_LEVEL_MAP],
          achievementRate: level.Score,
        }))
      )
      .flat()
      .filter((record) => {
        const filter = record.difficultyLevel !== undefined
        if (!filter) {
          console.warn(`Invalid difficulty level: ${record.difficultyLevel}`)
        }
        return filter
      })
    return ok(chartRecords)
  }

  const parsedSocialData = remoteSocialDataSchema.safeParse(object.value)
  if (parsedSocialData.success) {
    const scores = parsedSocialData.data.result.socialDatas[0].scores
    const chartRecords = Object.entries(scores)
      .map(([songSlug, songScores]) =>
        Object.entries(songScores).map(([difficultyLevel, score]) => ({
          songSlug,
          difficultyLevel:
            DIFFICULTY_LEVEL_MAP[difficultyLevel as keyof typeof DIFFICULTY_LEVEL_MAP],
          achievementRate: score,
        }))
      )
      .flat()
      .filter((record) => {
        const filter = record.difficultyLevel !== undefined
        if (!filter) {
          console.warn(`Invalid difficulty level: ${record.difficultyLevel}`)
        }
        return filter
      })
    return ok(chartRecords)
  }

  return err('Invalid format: no valid data format found')
}

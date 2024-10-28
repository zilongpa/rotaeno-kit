import { DifficultyLevel, Song } from '@/data/songs'
import { FC, HTMLAttributes } from 'react'

export const SongJacket: FC<
  HTMLAttributes<HTMLImageElement> & { song: Song; difficultyLevel?: DifficultyLevel }
> = ({ song, difficultyLevel, ...props }) => {
  const jacketId = difficultyLevel
    ? (song.charts.find((chart) => chart.difficultyLevel === difficultyLevel)?.overrideJacketId ??
      song.id)
    : song.id

  const jpgSrc = `https://rotaenokit-assets.imgg.dev/images/jackets/thumbnail/${jacketId}.jpg`
  const webpSrc = `https://rotaenokit-assets.imgg.dev/images/jackets/thumbnail/${jacketId}.webp`

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={jpgSrc}
        className="size-8 rounded-sm"
        loading="lazy"
        decoding="async"
        alt={song.title_localized.default}
        {...props}
      />
    </picture>
  )
}

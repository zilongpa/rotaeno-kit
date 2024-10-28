import { Song } from '@/data/songs'
import { FC, HTMLAttributes } from 'react'

export const SongJacket: FC<HTMLAttributes<HTMLImageElement> & { song: Song }> = ({
  song,
  ...props
}) => {
  const jpgSrc = `https://rotaenokit-assets.imgg.dev/images/jackets/thumbnail/${song.id}.jpg`
  const webpSrc = `https://rotaenokit-assets.imgg.dev/images/jackets/thumbnail/${song.id}.webp`

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

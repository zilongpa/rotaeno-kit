import rawSongs from '@/data/songs.json'

export const songs = rawSongs.filter((song) => {
  if (!song.slug) {
    console.warn('song has no slug', song)
    return false
  }
  return true
})

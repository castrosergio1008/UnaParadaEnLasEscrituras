export interface Episode {
  id: string
  title: string
  description: string
  spotifyId: string
  duration: string
  date: string
}

export interface Series {
  id: string
  title: string
  description: string
  episodes: Episode[]
}

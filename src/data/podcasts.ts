import { readData, getSeries } from './store'
import type { Episode as Ep, Series as Ser } from './types'

export type Episode = Ep
export type Series = Ser

export const showId = "3NlOQmbSAy21EpKirDk8o0"

export { readData, getSeries }

export async function getAllEpisodes(): Promise<Episode[]> {
  const { seriesList } = await readData()
  return seriesList.flatMap(s => s.episodes)
}

export async function getSeriesList(): Promise<Series[]> {
  const { seriesList } = await readData()
  return seriesList.toSorted((a, b) => b.title.localeCompare(a.title))
}

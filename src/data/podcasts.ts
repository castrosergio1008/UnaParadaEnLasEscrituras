import { readData } from './store'
import type { Episode as Ep, Series as Ser } from './types'

export type Episode = Ep
export type Series = Ser

const data = readData()

export const seriesList = data.seriesList

export const showId = "3NlOQmbSAy21EpKirDk8o0"

export function getAllEpisodes(): Episode[] {
  return seriesList.flatMap(s => s.episodes)
}

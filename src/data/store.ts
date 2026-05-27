import fs from 'fs'
import path from 'path'
import type { Series, Episode } from './types'

const PROJECT_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'podcasts.json')
const TMP_DATA_PATH = '/tmp/podcasts.json'

function getWritablePath(): string {
  try {
    fs.accessSync(path.dirname(PROJECT_DATA_PATH), fs.constants.W_OK)
    return PROJECT_DATA_PATH
  } catch {
    return TMP_DATA_PATH
  }
}

function ensureTmpSeed(): void {
  if (!fs.existsSync(TMP_DATA_PATH)) {
    fs.copyFileSync(PROJECT_DATA_PATH, TMP_DATA_PATH)
  }
}

const writablePath = getWritablePath()
const isTmp = writablePath === TMP_DATA_PATH

export function readData(): { seriesList: Series[] } {
  if (isTmp) ensureTmpSeed()
  const raw = fs.readFileSync(isTmp ? TMP_DATA_PATH : PROJECT_DATA_PATH, 'utf-8')
  return JSON.parse(raw)
}

export function writeData(data: { seriesList: Series[] }): void {
  if (isTmp) ensureTmpSeed()
  fs.writeFileSync(writablePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function getSeries(id: string): Series | undefined {
  const { seriesList } = readData()
  return seriesList.find((s) => s.id === id)
}

export function addSeries(series: Series): void {
  const data = readData()
  data.seriesList.push(series)
  writeData(data)
}

export function updateSeries(id: string, updates: Partial<Omit<Series, 'id' | 'episodes'>>): Series | undefined {
  const data = readData()
  const idx = data.seriesList.findIndex((s) => s.id === id)
  if (idx === -1) return undefined
  data.seriesList[idx] = { ...data.seriesList[idx], ...updates }
  writeData(data)
  return data.seriesList[idx]
}

export function deleteSeries(id: string): boolean {
  const data = readData()
  const idx = data.seriesList.findIndex((s) => s.id === id)
  if (idx === -1) return false
  data.seriesList.splice(idx, 1)
  writeData(data)
  return true
}

export function addEpisode(seriesId: string, episode: Episode): Episode | undefined {
  const data = readData()
  const series = data.seriesList.find((s) => s.id === seriesId)
  if (!series) return undefined
  series.episodes.push(episode)
  writeData(data)
  return episode
}

export function updateEpisode(seriesId: string, episodeId: string, updates: Partial<Episode>): Episode | undefined {
  const data = readData()
  const series = data.seriesList.find((s) => s.id === seriesId)
  if (!series) return undefined
  const idx = series.episodes.findIndex((ep) => ep.id === episodeId)
  if (idx === -1) return undefined
  series.episodes[idx] = { ...series.episodes[idx], ...updates }
  writeData(data)
  return series.episodes[idx]
}

export function deleteEpisode(seriesId: string, episodeId: string): boolean {
  const data = readData()
  const series = data.seriesList.find((s) => s.id === seriesId)
  if (!series) return false
  const idx = series.episodes.findIndex((ep) => ep.id === episodeId)
  if (idx === -1) return false
  series.episodes.splice(idx, 1)
  writeData(data)
  return true
}

import { Redis } from "@upstash/redis"
import fs from "fs"
import path from "path"
import type { Series, Episode } from "./types"
import seedData from "./podcasts.json"

const KV_KEY = "podcast-data"
const PROJECT_DATA_PATH = path.join(process.cwd(), "src", "data", "podcasts.json")
const TMP_DATA_PATH = "/tmp/podcasts.json"

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ""
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ""
const useRedis = !!(redisUrl && redisToken)

let redis: Redis | null = null
if (useRedis) {
  redis = new Redis({ url: redisUrl, token: redisToken })
}

function readFileSync(): { seriesList: Series[] } {
  const p = fs.existsSync(TMP_DATA_PATH) ? TMP_DATA_PATH : PROJECT_DATA_PATH
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"))
  } catch {
    return seedData as { seriesList: Series[] }
  }
}

function writeFileSync(data: { seriesList: Series[] }): void {
  try {
    fs.writeFileSync(PROJECT_DATA_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch {
    fs.writeFileSync(TMP_DATA_PATH, JSON.stringify(data, null, 2), "utf-8")
  }
}

export async function readData(): Promise<{ seriesList: Series[] }> {
  if (redis) {
    const cached = await redis.get<{ seriesList: Series[] }>(KV_KEY)
    if (cached) return cached
    const fileData = readFileSync()
    await redis.set(KV_KEY, fileData)
    return fileData
  }
  return readFileSync()
}

export async function writeData(data: { seriesList: Series[] }): Promise<void> {
  if (redis) {
    await redis.set(KV_KEY, data)
  }
  writeFileSync(data)
}

export async function getSeries(id: string): Promise<Series | undefined> {
  const { seriesList } = await readData()
  return seriesList.find((s) => s.id === id)
}

export async function addSeries(series: Series): Promise<void> {
  const data = await readData()
  data.seriesList.push(series)
  await writeData(data)
}

export async function updateSeries(
  id: string,
  updates: Partial<Omit<Series, "id" | "episodes">>,
): Promise<Series | undefined> {
  const data = await readData()
  const idx = data.seriesList.findIndex((s) => s.id === id)
  if (idx === -1) return undefined
  data.seriesList[idx] = { ...data.seriesList[idx], ...updates }
  await writeData(data)
  return data.seriesList[idx]
}

export async function deleteSeries(id: string): Promise<boolean> {
  const data = await readData()
  const idx = data.seriesList.findIndex((s) => s.id === id)
  if (idx === -1) return false
  data.seriesList.splice(idx, 1)
  await writeData(data)
  return true
}

export async function addEpisode(
  seriesId: string,
  episode: Episode,
): Promise<Episode | undefined> {
  const data = await readData()
  const series = data.seriesList.find((s) => s.id === seriesId)
  if (!series) return undefined
  series.episodes.push(episode)
  await writeData(data)
  return episode
}

export async function updateEpisode(
  seriesId: string,
  episodeId: string,
  updates: Partial<Episode>,
): Promise<Episode | undefined> {
  const data = await readData()
  const series = data.seriesList.find((s) => s.id === seriesId)
  if (!series) return undefined
  const idx = series.episodes.findIndex((ep) => ep.id === episodeId)
  if (idx === -1) return undefined
  series.episodes[idx] = { ...series.episodes[idx], ...updates }
  await writeData(data)
  return series.episodes[idx]
}

export async function deleteEpisode(
  seriesId: string,
  episodeId: string,
): Promise<boolean> {
  const data = await readData()
  const series = data.seriesList.find((s) => s.id === seriesId)
  if (!series) return false
  const idx = series.episodes.findIndex((ep) => ep.id === episodeId)
  if (idx === -1) return false
  series.episodes.splice(idx, 1)
  await writeData(data)
  return true
}

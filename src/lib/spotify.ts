const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || ""
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ""

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  })

  if (!res.ok) throw new Error("Error autenticando con Spotify")

  const data = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 60000,
  }
  return data.access_token
}

export interface SpotifyEpisode {
  id: string
  name: string
  description: string
  duration_ms: number
  release_date: string
  images: { url: string; height: number; width: number }[]
  language: string
  external_urls: { spotify: string }
}

export async function fetchEpisode(spotifyId: string): Promise<SpotifyEpisode> {
  const token = await getAccessToken()
  const res = await fetch(`https://api.spotify.com/v1/episodes/${spotifyId}?market=ES`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || "Error al obtener el episodio de Spotify")
  }

  return res.json()
}

export function isConfigured(): boolean {
  return !!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET)
}

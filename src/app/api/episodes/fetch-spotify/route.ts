import { fetchEpisode, isConfigured } from "@/lib/spotify"

export async function GET(request: Request) {
  try {
    if (!isConfigured()) {
      return Response.json(
        { error: "Spotify API no configurada. Define SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET." },
        { status: 500 },
      )
    }

    const { searchParams } = new URL(request.url)
    const spotifyId = searchParams.get("id")

    if (!spotifyId) {
      return Response.json({ error: "Falta el parámetro id" }, { status: 400 })
    }

    const episode = await fetchEpisode(spotifyId)

    return Response.json({
      spotifyId: episode.id,
      title: episode.name,
      description: episode.description,
      duration: `${Math.round(episode.duration_ms / 60000)} min`,
      date: episode.release_date,
      image: episode.images?.[0]?.url || null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido"
    return Response.json({ error: message }, { status: 500 })
  }
}

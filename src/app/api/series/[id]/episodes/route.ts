import { getSeries, addEpisode } from "@/data/store"
import { authenticate } from "@/lib/auth"
import { slugify } from "@/lib/utils"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const series = getSeries(id)
    if (!series) {
      return Response.json({ error: "Serie no encontrada" }, { status: 404 })
    }
    return Response.json(series.episodes)
  } catch {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = authenticate(request)
    if (auth instanceof Response) return auth

    const { id } = await params
    const series = getSeries(id)
    if (!series) {
      return Response.json({ error: "Serie no encontrada" }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, spotifyId, duration, date } = body

    if (!title) {
      return Response.json({ error: "title es requerido" }, { status: 400 })
    }

    const episodeId = slugify(title)
    if (series.episodes.some((ep) => ep.id === episodeId)) {
      return Response.json({ error: "Ya existe un episodio con ese título" }, { status: 409 })
    }

    const episode = {
      id: episodeId,
      title,
      description: description || "",
      spotifyId: spotifyId || "",
      duration: duration || "",
      date: date || new Date().toISOString().split("T")[0],
    }

    addEpisode(id, episode)
    return Response.json(episode, { status: 201 })
  } catch {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

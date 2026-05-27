import { updateEpisode, deleteEpisode } from "@/data/store"
import { authenticate } from "@/lib/auth"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  try {
    const auth = authenticate(request)
    if (auth instanceof Response) return auth

    const { id, episodeId } = await params
    const body = await request.json()
    const { title, description, spotifyId, duration, date } = body

    const updated = updateEpisode(id, episodeId, {
      title,
      description,
      spotifyId,
      duration,
      date,
    })
    if (!updated) {
      return Response.json({ error: "Episodio no encontrado" }, { status: 404 })
    }
    return Response.json(updated)
  } catch {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  try {
    const auth = authenticate(request)
    if (auth instanceof Response) return auth

    const { id, episodeId } = await params
    const deleted = deleteEpisode(id, episodeId)
    if (!deleted) {
      return Response.json({ error: "Episodio no encontrado" }, { status: 404 })
    }
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

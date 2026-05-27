import { getSeries, updateSeries, deleteSeries } from "@/data/store"
import { authenticate } from "@/lib/auth"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const series = await getSeries(id)
    if (!series) {
      return Response.json({ error: "Serie no encontrada" }, { status: 404 })
    }
    return Response.json(series)
  } catch {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = authenticate(request)
    if (auth instanceof Response) return auth

    const { id } = await params
    const body = await request.json()
    const { title, description } = body

    const updated = await updateSeries(id, { title, description })
    if (!updated) {
      return Response.json({ error: "Serie no encontrada" }, { status: 404 })
    }
    return Response.json(updated)
  } catch {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = authenticate(request)
    if (auth instanceof Response) return auth

    const { id } = await params
    const deleted = await deleteSeries(id)
    if (!deleted) {
      return Response.json({ error: "Serie no encontrada" }, { status: 404 })
    }
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

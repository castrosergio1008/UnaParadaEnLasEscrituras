import { readData, addSeries } from "@/data/store"
import { authenticate } from "@/lib/auth"

export async function GET() {
  try {
    const { seriesList } = await readData()
    return Response.json(seriesList.toSorted((a, b) => b.title.localeCompare(a.title)))
  } catch {
    return Response.json({ error: "Error al leer los datos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = authenticate(request)
    if (auth instanceof Response) return auth

    const body = await request.json()
    const { id, title, description } = body

    if (!id || !title) {
      return Response.json({ error: "id y title son requeridos" }, { status: 400 })
    }

    const { seriesList } = await readData()
    if (seriesList.some((s) => s.id === id)) {
      return Response.json({ error: "Ya existe una serie con ese ID" }, { status: 409 })
    }

    const series = { id, title, description: description || "", episodes: [] }
    await addSeries(series)
    return Response.json(series, { status: 201 })
  } catch {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

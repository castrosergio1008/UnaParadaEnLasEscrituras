import { readData, addSeries } from "@/data/store"
import { authenticate } from "@/lib/auth"

export async function GET() {
  const { seriesList } = readData()
  return Response.json(seriesList)
}

export async function POST(request: Request) {
  const auth = authenticate(request)
  if (auth instanceof Response) return auth

  const body = await request.json()
  const { id, title, description } = body

  if (!id || !title) {
    return Response.json({ error: "id y title son requeridos" }, { status: 400 })
  }

  const { seriesList } = readData()
  if (seriesList.some((s) => s.id === id)) {
    return Response.json({ error: "Ya existe una serie con ese ID" }, { status: 409 })
  }

  const series = { id, title, description: description || "", episodes: [] }
  addSeries(series)
  return Response.json(series, { status: 201 })
}

import { readData, addSeries } from "@/data/store"
import { authenticate } from "@/lib/auth"

export async function GET() {
  try {
    const { seriesList } = readData()
    return Response.json(seriesList)
  } catch {
    return Response.json({ error: "Error al leer los datos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log("[series POST] start")
    const auth = authenticate(request)
    if (auth instanceof Response) {
      console.log("[series POST] auth failed")
      return auth
    }
    console.log("[series POST] auth ok")

    const body = await request.json()
    console.log("[series POST] body:", JSON.stringify(body))
    const { id, title, description } = body

    if (!id || !title) {
      console.log("[series POST] missing id or title")
      return Response.json({ error: "id y title son requeridos" }, { status: 400 })
    }

    const { seriesList } = readData()
    if (seriesList.some((s) => s.id === id)) {
      console.log("[series POST] duplicate id:", id)
      return Response.json({ error: "Ya existe una serie con ese ID" }, { status: 409 })
    }

    const series = { id, title, description: description || "", episodes: [] }
    console.log("[series POST] calling addSeries")
    addSeries(series)
    console.log("[series POST] done")
    return Response.json(series, { status: 201 })
  } catch (err) {
    console.error("[series POST] error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}

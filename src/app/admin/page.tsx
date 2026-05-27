'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, clearSession, authHeaders } from "@/lib/admin-auth"

interface Series {
  id: string
  title: string
  description: string
  episodes: { id: string; title: string; spotifyId: string; duration: string; date: string }[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
      return
    }

    fetch("/api/series")
      .then((res) => res.json())
      .then((data) => {
        setSeriesList(data)
        setLoading(false)
      })
  }, [router])

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta serie? Se eliminarán todos sus episodios.")) return
    const res = await fetch(`/api/series/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
    if (res.ok) {
      setSeriesList((prev) => prev.filter((s) => s.id !== id))
    }
  }

  function handleLogout() {
    clearSession()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-zinc-400">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/series/new")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
          >
            Nueva Serie
          </button>
          <button
            onClick={handleLogout}
            className="border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-medium px-5 py-2 rounded-lg transition-colors text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {seriesList.map((series) => (
          <div
            key={series.id}
            className="p-5 rounded-xl border border-zinc-800 series-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-white">{series.title}</h2>
                <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{series.description}</p>
                <p className="text-zinc-600 text-xs mt-2">
                  {series.episodes.length} episodios &middot; ID: {series.id}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => router.push(`/admin/series/${series.id}/edit`)}
                  className="text-sm px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(series.id)}
                  className="text-sm px-4 py-2 rounded-lg bg-red-900/50 hover:bg-red-800/50 text-red-400 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

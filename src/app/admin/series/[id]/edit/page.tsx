'use client'

import { useState, useEffect, FormEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import { isAuthenticated, authHeaders } from "@/lib/admin-auth"

interface Episode {
  id: string
  title: string
  description: string
  spotifyId: string
  duration: string
  date: string
}

interface Series {
  id: string
  title: string
  description: string
  episodes: Episode[]
}

export default function EditSeries() {
  const router = useRouter()
  const params = useParams()
  const seriesId = params.id as string

  const [series, setSeries] = useState<Series | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
      return
    }

    fetch(`/api/series/${seriesId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => {
        setSeries(data)
        setTitle(data.title)
        setDescription(data.description)
        setLoading(false)
      })
      .catch(() => router.push("/admin"))
  }, [router, seriesId])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    const res = await fetch(`/api/series/${seriesId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ title, description }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Error al guardar")
      setSaving(false)
      return
    }

    setSuccess("Serie actualizada")
    setSaving(false)
  }

  async function handleDeleteEpisode(episodeId: string) {
    if (!confirm("¿Eliminar este episodio?")) return
    const res = await fetch(`/api/series/${seriesId}/episodes/${episodeId}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
    if (res.ok) {
      setSeries((prev) =>
        prev ? { ...prev, episodes: prev.episodes.filter((ep) => ep.id !== episodeId) } : prev
      )
    }
  }

  async function handleAddEpisode(e: FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const title = data.get("ep-title") as string
    const description = data.get("ep-description") as string
    const spotifyId = data.get("ep-spotifyId") as string
    const duration = data.get("ep-duration") as string
    const date = data.get("ep-date") as string

    if (!title) return

    const res = await fetch(`/api/series/${seriesId}/episodes`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, description, spotifyId, duration, date }),
    })

    if (!res.ok) {
      const errData = await res.json()
      alert(errData.error || "Error al crear episodio")
      return
    }

    const episode = await res.json()
    setSeries((prev) => (prev ? { ...prev, episodes: [...prev.episodes, episode] } : prev))
    form.reset()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-zinc-400">Cargando...</p>
      </div>
    )
  }

  if (!series) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => router.push("/admin")}
        className="text-emerald-500 hover:text-emerald-400 text-sm font-medium mb-6 inline-block"
      >
        &larr; Volver al panel
      </button>

      <h1 className="text-3xl font-bold text-white mb-8">Editar Serie</h1>

      <form onSubmit={handleSave} className="space-y-5 mb-12">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-emerald-400 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          {saving ? "Guardando..." : "Guardar Serie"}
        </button>
      </form>

      <div className="border-t border-zinc-800 pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Episodios ({series.episodes.length})
        </h2>

        <div className="space-y-3 mb-8">
          {series.episodes.map((ep) => (
            <div
              key={ep.id}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-medium">{ep.title}</h3>
                  <p className="text-zinc-500 text-xs mt-1">
                    {ep.duration} &middot; {ep.date} &middot; {ep.spotifyId ? "Publicado" : "Próximamente"}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteEpisode(ep.id)}
                  className="text-sm px-3 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-800/50 text-red-400 transition-colors shrink-0"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 pt-8">
          <h3 className="text-xl font-bold text-white mb-4">Añadir Episodio</h3>
          <form onSubmit={handleAddEpisode} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Título</label>
              <input
                name="ep-title"
                required
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Descripción</label>
              <textarea
                name="ep-description"
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Spotify ID</label>
                <input
                  name="ep-spotifyId"
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Duración</label>
                <input
                  name="ep-duration"
                  placeholder="ej: 10 min"
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Fecha</label>
                <input
                  type="date"
                  name="ep-date"
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              Añadir Episodio
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

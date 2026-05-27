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

  const [spotifyLink, setSpotifyLink] = useState("")
  const [fetchingSpotify, setFetchingSpotify] = useState(false)
  const [spotifyData, setSpotifyData] = useState<{
    spotifyId: string
    title: string
    description: string
    duration: string
    date: string
    image: string | null
  } | null>(null)
  const [spotifyError, setSpotifyError] = useState("")
  const [addingEpisode, setAddingEpisode] = useState(false)

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

  async function handleFetchSpotify() {
    const match = spotifyLink.trim().match(/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)/)
    if (!match) {
      setSpotifyError("Link de Spotify inválido")
      return
    }
    setSpotifyError("")
    setFetchingSpotify(true)
    setSpotifyData(null)

    const res = await fetch(`/api/episodes/fetch-spotify?id=${match[1]}`)
    if (!res.ok) {
      const err = await res.json()
      setSpotifyError(err.error || "Error al obtener datos de Spotify")
      setFetchingSpotify(false)
      return
    }

    const data = await res.json()
    setSpotifyData(data)
    setFetchingSpotify(false)
  }

  async function handleAddEpisode() {
    if (!spotifyData) return
    setAddingEpisode(true)

    const res = await fetch(`/api/series/${seriesId}/episodes`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        title: spotifyData.title,
        description: spotifyData.description,
        spotifyId: spotifyData.spotifyId,
        duration: spotifyData.duration,
        date: spotifyData.date,
      }),
    })

    if (!res.ok) {
      const errData = await res.json()
      alert(errData.error || "Error al crear episodio")
      setAddingEpisode(false)
      return
    }

    const episode = await res.json()
    setSeries((prev) => (prev ? { ...prev, episodes: [...prev.episodes, episode] } : prev))
    setSpotifyLink("")
    setSpotifyData(null)
    setAddingEpisode(false)
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

        <div className="space-y-4 mb-8">
          {series.episodes.map((ep, i) => (
            <div
              key={ep.id}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-500 mt-0.5">
                  {String(series.episodes.length - i).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-white font-semibold text-base leading-snug">{ep.title}</h3>
                    <button
                      onClick={() => handleDeleteEpisode(ep.id)}
                      className="shrink-0 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-900/30 transition-colors"
                      title="Eliminar episodio"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-zinc-400 text-sm mt-2 line-clamp-2">{ep.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs">
                    {ep.spotifyId ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.72.48-1.08.24-2.88-1.8-6.48-2.16-10.68-1.2-.36.12-.72-.12-.84-.48-.12-.36.12-.72.48-.84 4.56-1.08 8.52-.6 11.76 1.2.36.24.48.72.24 1.08zm1.44-3.24c-.3.42-.84.6-1.26.3-3.24-2.04-8.16-2.64-11.88-1.44-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.32-1.32 9.72-.72 13.44 1.56.42.24.6.84.24 1.32zm.12-3.48c-3.84-2.28-10.08-2.52-13.68-1.44-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.2-1.2 10.92-.96 15.36 1.68.48.24.6.84.36 1.32-.24.36-.84.48-1.32.18z"/>
                        </svg>
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-zinc-500">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Próximamente
                      </span>
                    )}
                    <span className="text-zinc-500">{ep.duration}</span>
                    <span className="text-zinc-500">{ep.date}</span>
                    {ep.spotifyId && (
                      <a
                        href={`https://open.spotify.com/episode/${ep.spotifyId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-500 hover:text-emerald-400 transition-colors"
                      >
                        Spotify &nearr;
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 pt-8">
          <h3 className="text-xl font-bold text-white mb-4">Añadir Episodio</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Link del episodio (Spotify)</label>
              <div className="flex gap-2">
                <input
                  value={spotifyLink}
                  onChange={(e) => {
                    setSpotifyLink(e.target.value)
                    setSpotifyError("")
                  }}
                  placeholder="https://open.spotify.com/episode/..."
                  className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button
                  type="button"
                  onClick={handleFetchSpotify}
                  disabled={fetchingSpotify || !spotifyLink.trim()}
                  className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm shrink-0"
                >
                  {fetchingSpotify ? "Obteniendo..." : "Obtener datos"}
                </button>
              </div>
              {spotifyError && <p className="text-red-400 text-xs mt-1">{spotifyError}</p>}
            </div>

            {spotifyData && (
              <div className="p-4 rounded-xl border border-emerald-700/40 bg-zinc-900/60 space-y-3">
                <div className="flex items-start gap-4">
                  {spotifyData.image && (
                    <img
                      src={spotifyData.image}
                      alt={spotifyData.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-white font-semibold text-base leading-snug">{spotifyData.title}</h4>
                    <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{spotifyData.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zinc-500">
                      <span>{spotifyData.duration}</span>
                      <span>{spotifyData.date}</span>
                      <span className="text-emerald-400">Spotify ID: {spotifyData.spotifyId}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleAddEpisode}
                  disabled={addingEpisode}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  {addingEpisode ? "Añadiendo..." : "Añadir Episodio"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

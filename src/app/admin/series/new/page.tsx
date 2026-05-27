'use client'

import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, authHeaders } from "@/lib/admin-auth"
import { slugify } from "@/lib/utils"

export default function NewSeries() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [id, setId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [autoId, setAutoId] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) router.push("/admin/login")
  }, [router])

  function handleTitleChange(value: string) {
    setTitle(value)
    if (autoId) setId(slugify(value))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id || !title) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/series", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ id, title, description }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Error del servidor" }))
        setError(data.error || "Error al crear la serie")
        setLoading(false)
        return
      }

      router.push("/admin")
    } catch (err) {
      setError("Error de conexión con el servidor")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <button
        onClick={() => router.push("/admin")}
        className="text-emerald-500 hover:text-emerald-400 text-sm font-medium mb-6 inline-block"
      >
        &larr; Volver al panel
      </button>

      <h1 className="text-3xl font-bold text-white mb-8">Nueva Serie</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            ID <span className="text-zinc-600">(identificador único para la URL)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={id}
              onChange={(e) => { setId(e.target.value); setAutoId(false) }}
              required
              className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => { setId(slugify(title)); setAutoId(true) }}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs transition-colors"
            >
              Auto
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? "Creando..." : "Crear Serie"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

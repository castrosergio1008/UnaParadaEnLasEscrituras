"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getToken } from "@/lib/admin-auth"

export default function AuthNav() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(!!getToken())
  }, [])

  return (
    <>
      <Link href="/" className="text-zinc-300 hover:text-white transition-colors">Inicio</Link>
      <Link href="/series" className="text-zinc-300 hover:text-white transition-colors">Series</Link>
      <a
        href="https://open.spotify.com/show/3NlOQmbSAy21EpKirDk8o0"
        target="_blank"
        rel="noopener noreferrer"
        className="text-zinc-300 hover:text-white transition-colors"
      >
        Spotify
      </a>
      {isAdmin && (
        <Link
          href="/admin"
          className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
        >
          Administrar
        </Link>
      )}
    </>
  )
}

"use client"

import { useState, useEffect } from "react"

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [showButton, setShowButton] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" })
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true)
      return
    }

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)
    setIsIOS(iOS)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowButton(true)
    }
    window.addEventListener("beforeinstallprompt", handler)

    if (iOS) setShowButton(true)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (isIOS) return

    const promptEvent = deferredPrompt as any
    if (!promptEvent) return
    promptEvent.prompt()
    const result = await promptEvent.userChoice
    if (result.outcome === "accepted") setDeferredPrompt(null)
    setShowButton(false)
  }

  if (isStandalone) return null
  if (!showButton) return null

  return (
    <button
      onClick={handleInstall}
      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
      title={
        isIOS
          ? "Abre en Safari, pulsa Compartir y luego 'Agregar a Inicio'"
          : "Instalar aplicación"
      }
    >
      {isIOS ? "Instalar App" : "Instalar App"}
    </button>
  )
}

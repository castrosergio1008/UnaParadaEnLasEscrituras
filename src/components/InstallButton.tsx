"use client"

import { useState, useEffect } from "react"

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [showButton, setShowButton] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

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
    if (isIOS) {
      setShowTooltip((prev) => !prev)
      return
    }

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
    <div className="relative">
      <button
        onClick={handleInstall}
        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors"
      >
        {isIOS ? "Instalar App" : "Instalar App"}
      </button>
      {isIOS && showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-64 p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 shadow-xl z-50">
          <div className="font-medium text-white mb-1">Para instalar en iOS:</div>
          <ol className="list-decimal list-inside space-y-1">
            <li>Abre en <strong className="text-white">Safari</strong></li>
            <li>Toca el botón <strong className="text-white">Compartir</strong> <span className="text-zinc-500">(cuadro con flecha)</span></li>
            <li>Desplázate y elige <strong className="text-white">Agregar a Inicio</strong></li>
            <li>Toca <strong className="text-white">Agregar</strong></li>
          </ol>
          <button
            onClick={() => setShowTooltip(false)}
            className="mt-2 text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Entendido
          </button>
        </div>
      )}
    </div>
  )
}

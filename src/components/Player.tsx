'use client'

import { useState, useCallback } from 'react'

export interface PlayerEpisode {
  id: string
  title: string
  description: string
  spotifyId: string
  duration: string
  date: string
  seriesTitle: string
  seriesId: string
}

function findNextPlayable(episodes: PlayerEpisode[], fromIndex: number, direction: 1 | -1): number {
  let i = fromIndex + direction
  while (i >= 0 && i < episodes.length) {
    if (episodes[i].spotifyId) return i
    i += direction
  }
  return -1
}

export default function Player({ episodes }: { episodes: PlayerEpisode[] }) {
  const firstPlayable = episodes.findIndex((ep) => ep.spotifyId)
  const [currentIndex, setCurrentIndex] = useState(firstPlayable >= 0 ? firstPlayable : 0)

  const current = episodes[currentIndex]
  const hasPrevious = findNextPlayable(episodes, currentIndex, -1) >= 0
  const hasNext = findNextPlayable(episodes, currentIndex, 1) >= 0

  const goNext = useCallback(() => {
    const next = findNextPlayable(episodes, currentIndex, 1)
    if (next >= 0) setCurrentIndex(next)
  }, [episodes, currentIndex])

  const goPrevious = useCallback(() => {
    const prev = findNextPlayable(episodes, currentIndex, -1)
    if (prev >= 0) setCurrentIndex(prev)
  }, [episodes, currentIndex])

  const jumpTo = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  if (!current) {
    return (
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center text-zinc-500">
        No hay episodios disponibles
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div className="p-5">
        {current.spotifyId ? (
          <div className="rounded-lg overflow-hidden bg-zinc-800/50">
            <iframe
              key={current.spotifyId}
              src={`https://open.spotify.com/embed/episode/${current.spotifyId}?utm_source=generator&autoplay=1`}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="eager"
              className="block"
            />
          </div>
        ) : (
          <div className="h-[152px] rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-500 text-sm">
            Próximamente
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-white font-semibold text-base leading-snug">
            {current.title}
          </h3>
          <p className="text-zinc-400 text-xs mt-1">
            {current.seriesTitle} &middot; {current.duration} &middot; {current.date}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={goPrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-zinc-800 enabled:text-zinc-300 enabled:hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Anterior
          </button>

          <button
            onClick={goNext}
            disabled={!hasNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-zinc-800 enabled:text-zinc-300 enabled:hover:text-white"
          >
            Siguiente
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="px-5 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">
          Lista de episodios &middot; {episodes.length}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {episodes.map((ep, i) => {
            const isCurrent = i === currentIndex
            const isPlayable = !!ep.spotifyId
            return (
              <button
                key={ep.id}
                onClick={() => isPlayable && jumpTo(i)}
                disabled={!isPlayable}
                className={`w-full text-left px-5 py-3 flex items-center gap-3 border-b border-zinc-800/50 transition-colors ${
                  isCurrent
                    ? 'bg-emerald-600/10 border-l-2 border-l-emerald-500'
                    : 'border-l-2 border-l-transparent hover:bg-zinc-800/30'
                } ${!isPlayable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className={`shrink-0 text-xs font-mono w-5 ${
                  isCurrent ? 'text-emerald-400' : 'text-zinc-600'
                }`}>
                  {isCurrent ? '▶' : `${episodes.length - i}`.padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <span className={`text-sm block truncate ${
                    isCurrent ? 'text-emerald-300 font-medium' : 'text-zinc-300'
                  }`}>
                    {ep.title}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {isPlayable ? `${ep.seriesTitle} · ${ep.duration}` : 'Próximamente'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

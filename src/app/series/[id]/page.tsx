import Link from "next/link"
import { notFound } from "next/navigation"
import { seriesList } from "@/data/podcasts"

export const dynamic = "force-dynamic"

export default async function SeriesDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const series = seriesList.find((s) => s.id === id)
  if (!series) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/series" className="text-emerald-500 hover:text-emerald-400 text-sm font-medium mb-6 inline-block">
        &larr; Todas las series
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">{series.title}</h1>
      <p className="text-zinc-400 mb-8">{series.description}</p>

      <div className="space-y-4">
        {series.episodes.map((ep, i) => (
          <article
            key={ep.id}
            className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-lg font-semibold text-white">
                <span className="text-zinc-500 mr-2">#{series.episodes.length - i}</span>
                {ep.title}
              </h2>
              <span className="shrink-0 text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                {ep.duration}
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-4">{ep.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">{ep.date}</span>
              {ep.spotifyId ? (
                <a
                  href={`https://open.spotify.com/episode/${ep.spotifyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors"
                >
                  Escuchar en Spotify &rarr;
                </a>
              ) : (
                <span className="text-zinc-600 text-sm">Próximamente</span>
              )}
            </div>
            {ep.spotifyId && (
              <div className="mt-4 rounded-lg overflow-hidden bg-zinc-800/50">
                <iframe
                  src={`https://open.spotify.com/embed/episode/${ep.spotifyId}?utm_source=generator`}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="block"
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

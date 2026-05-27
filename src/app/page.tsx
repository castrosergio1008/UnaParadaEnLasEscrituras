import Link from "next/link"
import { getSeriesList } from "@/data/podcasts"
import Player from "@/components/Player"

export const dynamic = "force-dynamic"

export default async function Home() {
  const seriesList = await getSeriesList()

  const allEpisodes = seriesList
    .flatMap((s) => s.episodes.map((e) => ({ ...e, seriesTitle: s.title, seriesId: s.id })))
    .sort((a, b) => b.date.localeCompare(a.date))

  const totalEpisodes = seriesList.reduce((acc, s) => acc + s.episodes.length, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="flex flex-col md:flex-row items-center gap-8 mb-16">
        <img src="/logo.png" alt="Una Parada en las Escrituras" className="w-40 h-40 md:w-52 md:h-52 rounded-2xl shadow-lg shadow-emerald-900/30" />
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Una Parada en las Escrituras
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl">
            Has una parada en tu día y escucha lo que Dios quiere decirte hoy a través de las Escrituras.
            {totalEpisodes} episodios organizados por series para tu crecimiento espiritual.
          </p>
          <div className="flex gap-4 mt-6">
            <a
              href={`https://open.spotify.com/show/3NlOQmbSAy21EpKirDk8o0`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.72.48-1.08.24-2.88-1.8-6.48-2.16-10.68-1.2-.36.12-.72-.12-.84-.48-.12-.36.12-.72.48-.84 4.56-1.08 8.52-.6 11.76 1.2.36.24.48.72.24 1.08zm1.44-3.24c-.3.42-.84.6-1.26.3-3.24-2.04-8.16-2.64-11.88-1.44-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.32-1.32 9.72-.72 13.44 1.56.42.24.6.84.24 1.32zm.12-3.48c-3.84-2.28-10.08-2.52-13.68-1.44-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.2-1.2 10.92-.96 15.36 1.68.48.24.6.84.36 1.32-.24.36-.84.48-1.32.18z"/>
              </svg>
              Escuchar en Spotify
            </a>
          </div>
        </div>
      </section>

      <section className="mb-16 max-w-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Último episodio</h2>
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold text-white">{allEpisodes[0].title}</h3>
            <span className="shrink-0 text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
              {allEpisodes[0].duration}
            </span>
          </div>
          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{allEpisodes[0].description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600">{allEpisodes[0].seriesTitle} &middot; {allEpisodes[0].date}</span>
            {allEpisodes[0].spotifyId ? (
              <a
                href={`https://open.spotify.com/episode/${allEpisodes[0].spotifyId}`}
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
          <div className="mt-4 rounded-lg overflow-hidden">
            {allEpisodes[0].spotifyId ? (
              <iframe
                src={`https://open.spotify.com/embed/episode/${allEpisodes[0].spotifyId}?utm_source=generator`}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block"
              />
            ) : (
              <div className="h-[152px] rounded-lg bg-zinc-800/30 border border-dashed border-zinc-700/40 flex flex-col items-center justify-center gap-1.5">
                <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-zinc-600">Próximamente</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-8">Series</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seriesList.map((series) => (
            <Link
              key={series.id}
              href={`/series/${series.id}`}
              className="group block p-6 rounded-xl border border-zinc-800 series-card hover:border-emerald-700/50 transition-all"
            >
              <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors mb-2">
                {series.title}
              </h3>
              <p className="text-zinc-400 text-sm mb-3">{series.description}</p>
              <span className="text-emerald-500 text-sm font-medium">
                {series.episodes.length} episodios &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-16 max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Reproductor</h2>
        <Player episodes={allEpisodes} />
      </section>
    </div>
  )
}

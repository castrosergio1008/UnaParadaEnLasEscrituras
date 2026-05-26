import Link from "next/link"
import { seriesList } from "@/data/podcasts"

export default function Home() {
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

      <section className="mb-12">
        <div className="rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800 max-w-2xl">
          <iframe
            src={`https://open.spotify.com/embed/show/3NlOQmbSAy21EpKirDk8o0?utm_source=generator`}
            width="100%"
            height="232"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="block"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-8">Series</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seriesList.map((series) => (
            <Link
              key={series.id}
              href={`/series/${series.id}`}
              className="group block p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-emerald-700/50 transition-all"
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
    </div>
  )
}

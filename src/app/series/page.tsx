import Link from "next/link"
import { getSeriesList } from "@/data/podcasts"

export const dynamic = "force-dynamic"

export default async function SeriesPage() {
  const seriesList = await getSeriesList()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Series</h1>
      <p className="text-zinc-400 mb-10">Explora nuestros episodios organizados por tema.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seriesList.map((series) => (
          <Link
            key={series.id}
            href={`/series/${series.id}`}
            className="group block p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-emerald-700/50 transition-all"
          >
            <h2 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors mb-2">
              {series.title}
            </h2>
            <p className="text-zinc-400 text-sm mb-3">{series.description}</p>
            <span className="text-emerald-500 text-sm font-medium">
              {series.episodes.length} episodios &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

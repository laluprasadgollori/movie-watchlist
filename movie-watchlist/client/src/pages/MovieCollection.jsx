import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import MovieCard from '../components/MovieCard'
import { SkeletonGrid } from '../components/Skeleton'

const rankTones = ['rank-gold', 'rank-silver', 'rank-bronze']

export default function MovieCollection({ eyebrow, emptyMessage, fetchMovies, ranked, title }) {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    fetchMovies(page)
      .then((result) => {
        if (!active) return
        setMovies(result.data || [])
        setTotalPages(result.totalPages || 0)
      })
      .catch((requestError) => {
        if (!active) return
        const message = requestError.response?.data?.message || 'Could not load this collection.'
        setError(message)
        toast.error(message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [fetchMovies, page])

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 pb-16 pt-32">
      <section><p className="text-xs font-bold tracking-[0.24em] text-cinema-red">{eyebrow}</p><h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-cinema-cream md:text-7xl">{title}</h1><p className="mt-4 max-w-xl text-cinema-muted">{ranked ? 'The highest-rated films in your personal collection.' : 'Every film you have marked as watched.'}</p></section>
      {loading && <SkeletonGrid />}
      {error && <div className="mt-12 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">{error}</div>}
      {!loading && !error && movies.length === 0 && <div className="mt-16 rounded-2xl border border-dashed border-white/15 p-12 text-center"><p className="font-display text-2xl font-bold text-cinema-cream">{emptyMessage}</p><p className="mt-2 text-cinema-muted">Add more movies to fill this shelf.</p></div>}
      {!loading && !error && movies.length > 0 && <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{movies.map((movie, index) => <MovieCard key={movie._id} movie={movie} rank={ranked ? ((page - 1) * 12) + index + 1 : undefined} rankTone={ranked ? rankTones[index] || 'border-white/10' : undefined} />)}</div>}
      {!loading && totalPages > 1 && <nav className="mt-12 flex items-center justify-center gap-5"><button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-cinema-muted hover:border-cinema-red hover:text-cinema-cream disabled:opacity-40" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span className="text-sm text-cinema-muted">Page {page} of {totalPages}</span><button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-cinema-muted hover:border-cinema-red hover:text-cinema-cream disabled:opacity-40" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button></nav>}
    </main>
  )
}
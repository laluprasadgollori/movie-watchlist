import { Link } from 'react-router-dom'

const fallbackPoster = 'https://placehold.co/600x900/1a211c/f5f1ea?text=No+Poster'

const genreColors = {
  Action: 'bg-red-500/15 text-red-200 border-red-400/30',
  Family: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
  Comedy: 'bg-violet-500/15 text-violet-200 border-violet-400/30',
  Mass: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/30',
  Love: 'bg-pink-500/15 text-pink-200 border-pink-400/30',
  'Danger Kills': 'bg-amber-500/15 text-amber-200 border-amber-400/30',
  'Emotional Army': 'bg-cyan-500/15 text-cyan-200 border-cyan-400/30',
}

export default function MovieCard({ movie, rank, rankTone }) {
  const rating = Math.max(0, Math.min(5, Math.round(movie.avgRating || 0)))
  const genreBadge = genreColors[movie.genre] || 'bg-white/5 text-cinema-muted border-white/10'
  const isFastFurious = movie._id === 'starter-furious-10'

  return (
    <Link className={`movie-card group relative block overflow-hidden rounded-[22px] border bg-[#1d2a39] shadow-[0_18px_38px_rgba(0,0,0,0.30)] ${rankTone || 'border-white/10'}`} to={`/movies/${movie._id}`}>
      <div className="relative aspect-[2/3] overflow-hidden bg-cinema-ink">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={movie.posterUrl || fallbackPoster}
          alt={`${movie.title} poster`}
          onError={(event) => { event.currentTarget.src = fallbackPoster }}
        />
        {isFastFurious && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-2 text-left">
            <img
              src="https://m.media-amazon.com/images/S/pv-target-images/b6b6e10570e53c32c606a0db1ffaf87827d609d0ea0a11a0c82b97a322385aff.jpg"
              alt="Fast & Furious 10 logo"
              className="h-20 w-auto max-w-[85%] object-contain drop-shadow-[0_5px_18px_rgba(0,0,0,0.6)]"
            />
          </div>
        )}
        {movie.watched && <span className="absolute left-3 top-3 rounded-full bg-cinema-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-cinema-ink">Watched</span>}
        {rank && <span className="rank-badge absolute right-3 top-3">#{rank}</span>}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-[1.05rem] font-bold leading-tight text-cinema-cream">{movie.title}</h2>
          {movie.year && <span className="shrink-0 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-cinema-muted">{movie.year}</span>}
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${genreBadge}`}>{movie.genre}</span>
          <span className="text-[0.66rem] uppercase tracking-[0.1em] text-cinema-muted">{movie.avgRating ? movie.avgRating.toFixed(1) : 'Unrated'}</span>
        </div>
        <div className="flex items-center gap-2 pt-1" aria-label={`${movie.avgRating || 0} out of 5 stars`}>
          <span className="text-sm tracking-[0.18em] text-cinema-gold">{'★'.repeat(rating)}<span className="text-white/20">{'★'.repeat(5 - rating)}</span></span>
        </div>
      </div>
    </Link>
  )
}

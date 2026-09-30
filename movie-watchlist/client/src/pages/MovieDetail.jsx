import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import MovieForm from '../components/MovieForm'
import ReviewForm from '../components/ReviewForm'
import { SkeletonPage } from '../components/Skeleton'
import { deleteMovie, getMovie, markWatched, updateMovie } from '../services/movieService'
import { createReview, deleteReview, getReviews, updateReview } from '../services/reviewService'

const fallbackPoster = 'https://placehold.co/600x900/1a211c/f5f1ea?text=No+Poster'

function Stars({ rating }) {
  const filled = Math.round(rating || 0)
  return <span className="tracking-widest text-cinema-gold" aria-label={`${rating || 0} out of 5 stars`}>{'★'.repeat(filled)}<span className="text-white/20">{'★'.repeat(5 - filled)}</span></span>
}

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [editingReview, setEditingReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [action, setAction] = useState('')
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([getMovie(id), getReviews(id)])
      .then(([movieData, reviewData]) => {
        if (!active) return
        setMovie(movieData)
        setReviews(reviewData.data || [])
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Could not load this movie.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [id])

  async function handleWatched() {
    setAction('watched')
    try {
      setMovie(await markWatched(id))
      toast.success('Marked as watched.')
    } catch {
      toast.error('Unable to update watched status.')
    } finally {
      setAction('')
    }
  }

  async function handleDeleteMovie() {
    if (!window.confirm('Delete this movie and its details?')) return
    setAction('delete')
    try {
      await deleteMovie(id)
      toast.success('Movie deleted.')
      navigate('/movies', { replace: true })
    } catch {
      toast.error('Unable to delete movie.')
      setAction('')
    }
  }

  async function handleUpdateMovie(updatedMovie) {
    try {
      setMovie(await updateMovie(id, updatedMovie))
      setShowEdit(false)
      toast.success('Movie updated.')
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to update movie.'
      toast.error(message)
      throw new Error(message)
    }
  }

  async function handleReviewSubmit(review) {
    try {
      if (editingReview) {
        await updateReview(editingReview._id, review)
        toast.success('Review updated.')
      } else {
        await createReview(review)
        toast.success('Review posted.')
      }
      const [movieData, reviewData] = await Promise.all([getMovie(id), getReviews(id)])
      setMovie(movieData)
      setReviews(reviewData.data || [])
      setEditingReview(null)
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to save review.'
      toast.error(message)
      throw new Error(message)
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm('Delete your review?')) return
    try {
      await deleteReview(reviewId)
      const [movieData, reviewData] = await Promise.all([getMovie(id), getReviews(id)])
      setMovie(movieData)
      setReviews(reviewData.data || [])
      toast.success('Review deleted.')
    } catch {
      toast.error('Unable to delete review.')
    }
  }

  if (loading) return <SkeletonPage />
  if (error || !movie) return <main className="mx-auto min-h-screen max-w-6xl px-6 pb-16 pt-32"><p className="text-red-300">{error || 'Movie not found.'}</p><Link className="button mt-6 inline-block" to="/movies">Back to movies</Link></main>

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 pb-20 pt-32">
      <Link className="text-sm text-cinema-muted hover:text-cinema-cream" to="/movies">← Back to movies</Link>
      <section className="mt-8 grid gap-10 md:grid-cols-[minmax(220px,340px)_1fr] md:items-center">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-cinema-panel shadow-2xl"><img className="aspect-[2/3] h-full w-full object-cover" src={movie.posterUrl || fallbackPoster} alt={`${movie.title} poster`} onError={(event) => { event.currentTarget.src = fallbackPoster }} /></div>
        <div><p className="text-xs font-bold tracking-[0.24em] text-cinema-red">MOVIE DETAIL</p><h1 className="mt-4 font-display text-5xl font-bold leading-tight text-cinema-cream md:text-7xl">{movie.title}</h1><div className="mt-5 flex flex-wrap items-center gap-3 text-cinema-muted"><span>{movie.genre}</span>{movie.year && <><span className="text-white/20">/</span><span>{movie.year}</span></>}</div><div className="mt-6 flex items-center gap-3"><Stars rating={movie.avgRating} /><span className="text-sm text-cinema-muted">{movie.avgRating ? `${movie.avgRating.toFixed(1)} average` : 'Not rated yet'}</span></div><div className="mt-8 flex flex-wrap gap-3"><button className="button" disabled={movie.watched || action === 'watched'} onClick={handleWatched}>{movie.watched ? 'Watched' : action === 'watched' ? 'Updating...' : 'Mark as watched'}</button><button className="rounded-lg border border-white/15 px-4 py-3 text-sm text-cinema-muted hover:border-cinema-gold hover:text-cinema-cream" onClick={() => setShowEdit(true)}>Edit</button><button className="rounded-lg border border-red-300/30 px-4 py-3 text-sm text-red-200 hover:bg-red-400/10" disabled={action === 'delete'} onClick={handleDeleteMovie}>{action === 'delete' ? 'Deleting...' : 'Delete'}</button></div></div>
      </section>
      {showEdit && <MovieForm initialData={movie} onClose={() => setShowEdit(false)} onSubmit={handleUpdateMovie} />}
      <section className="mt-20 max-w-3xl"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.24em] text-cinema-red">REVIEWS</p><h2 className="mt-2 font-display text-3xl font-bold text-cinema-cream">What did you think?</h2></div><span className="text-sm text-cinema-muted">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span></div><div className="mt-8 space-y-4">{reviews.map((review) => <article className="rounded-2xl border border-white/10 bg-cinema-panel/60 p-5" key={review._id}><div className="flex flex-wrap items-center justify-between gap-3"><div><Stars rating={review.rating} /><p className="mt-2 text-xs text-cinema-muted">{review.user?.name || 'You'}</p></div><div className="flex gap-3 text-sm"><button className="text-cinema-gold hover:text-cinema-cream" onClick={() => setEditingReview(review)}>Edit</button><button className="text-red-200 hover:text-red-100" onClick={() => handleDeleteReview(review._id)}>Delete</button></div></div>{review.comment && <p className="mt-4 leading-7 text-cinema-muted">{review.comment}</p>}</article>)}</div>{reviews.length === 0 && !editingReview && <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-8 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cinema-red/15 text-2xl text-cinema-red">+</div><p className="mt-4 font-display text-xl font-bold text-cinema-cream">No reviews yet.</p><p className="mt-1 text-cinema-muted">Be the first to leave a thought.</p></div>}<div className="mt-8"><ReviewForm existingReview={editingReview} movieId={id} onCancel={() => setEditingReview(null)} onSubmit={handleReviewSubmit} /></div></section>
    </main>
  )
}

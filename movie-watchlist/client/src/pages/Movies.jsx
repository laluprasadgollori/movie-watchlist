import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import MovieCard from '../components/MovieCard'
import MovieForm from '../components/MovieForm'
import { SkeletonGrid } from '../components/Skeleton'
import { createMovie, getMovies, searchMovies } from '../services/movieService'

const starterMovies = [
  {
    _id: 'starter-furious-10',
    title: 'First and Furious 10',
    genre: 'Action',
    year: 2025,
    posterUrl: 'https://imusic.b-cdn.net/images/item/original/248/5053083260248.jpg?vin-diesel-michelle-rodriguez-2023-fast-furious-10-dvd&class=scaled&v=1692757458https://imusic.b-cdn.net/images/item/original/248/5053083260248.jpg?vin-diesel-michelle-rodriguez-2023-fast-furious-10-dvd&class=scaled&v=1692757458',
    watched: false,
  },
  {
    _id: 'starter-vishwanath-and-sons',
    title: 'Vishwanath and Sons',
    genre: 'Family',
    year: 2026,
    posterUrl: 'https://axsmwioqmf3c.compat.objectstorage.ap-hyderabad-1.oraclecloud.com/static.filmyfocus.com/wp-content/uploads/2026/08/Vishwanath-And-Sons-Movie-Review-Rating-in-English.jpg',
    watched: false,
  },
  {
    _id: 'starter-f2',
    title: 'F2',
    genre: 'Comedy',
    year: 2025,
    posterUrl: 'https://www.telugu360.com/wp-content/uploads/2019/01/F2-Fun-and-Frustration-Review.jpg',
    watched: false,
  },
  {
    _id: 'starter-anaanaga-okka-raju',
    title: 'Ananaga Okka Raju',
    genre: 'Comedy',
    year: 2026,
    posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/anaganaga-oka-raju-et00426948-1767878081.jpg',
    watched: false,
  },
  {
    _id: 'starter-naa-samiranga',
    title: 'Naa Samiranga',
    genre: 'Mass',
    year: 2024,
    posterUrl: 'https://preview.redd.it/naa-saami-ranga-2024-review-discussion-thread-spoilers-must-v0-w8f0wz8ps57c1.jpg?width=1638&format=pjpg&auto=webp&s=4a0e8b2baa26a7e4a53a5f55a797199ae7a6212b',
    watched: false,
  },
  {
    _id: 'starter-96',
    title: '96',
    genre: 'Love',
    year: 2018,
    posterUrl: 'https://talesntunes.wordpress.com/wp-content/uploads/2018/10/96-movie-trailer1.jpg',
    watched: false,
  },
  {
    _id: 'starter-anakapalli',
    title: 'Anakapalli',
    genre: 'Love',
    year: 2026,
    posterUrl: 'https://cdn.district.in/movies-assets/images/cinema/Anakapalli_Gallery-9e157be0-6e16-11f1-9444-c504df2f3dc4.jpg',
    watched: false,
  },
  {
    _id: 'starter-et',
    title: 'E.T.',
    genre: 'Love',
    year: 2025,
    posterUrl: 'https://sund-images.sunnxt.com/135955/500x750_ETTelugu_135955_b0208dd5-37cf-42c3-8461-7567c138faae.jpg',
    watched: false,
  },
  {
    _id: 'starter-colore-photo',
    title: 'Colore Photo',
    genre: 'Love',
    year: 2022,
    posterUrl: 'https://images.filmibeat.com/img/popcorn/movie_posters/colourphoto-20201023201407-19345.jpg',
    watched: false,
  },
  {
    _id: 'starter-pushpa',
    title: 'Pushpa',
    genre: 'Danger Kills',
    year: 2021,
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjJmMjJmYWMtNTQyYy00NzcxLWE5N2EtMTY5NjRhMGZmYjNlXkEyXkFqcGc@._V1_.jpg',
    watched: false,
  },
  {
    _id: 'starter-arjun-reddy',
    title: 'Arjun Reddy',
    genre: 'Love',
    year: 2022,
    posterUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9HqlShA9OaN42u9_eZRyTsFS_P6MryLpYmrzY3ph9_n4wnjwyKv35SAdF&s=10',
    watched: false,
  },
  {
    _id: 'starter-jana-nayagan',
    title: 'Jana Nayagan',
    genre: 'Emotional Army',
    year: 2026,
    posterUrl: 'https://images.bhaskarassets.com/web2images/521/2026/03/16/gimsluza4aak0le1767762725_1773661216.jpg',
    watched: false,
  },
]

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    const request = query
      ? searchMovies(query, page)
      : getMovies(page)

    request
      .then((result) => {
        if (!active) return
        const loadedMovies = result.data && result.data.length > 0 ? result.data : !query ? starterMovies : []
        setMovies(loadedMovies)
        setTotalPages(result.totalPages || 1)
      })
      .catch(() => {
        if (active) setError('Could not load your movies. Please try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [page, query, refreshKey])

  function handleSearch(event) {
    event.preventDefault()
    setPage(1)
    setQuery(searchInput.trim())
  }

  async function handleCreate(movie) {
    try {
      await createMovie(movie)
      setShowForm(false)
      setRefreshKey((value) => value + 1)
      setPage(1)
      setQuery('')
      setSearchInput('')
      toast.success('Movie added to your list.')
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to add movie.'
      toast.error(message)
      throw new Error(message)
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 pb-16 pt-32">
      <section className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="flex flex-1 items-center gap-5">
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-cinema-panel shadow-2xl md:block">
            <img
              src="https://m.media-amazon.com/images/M/MV5BNmYyNGFjMjctMWVkZC00MzNmLTk4NTAtMGVjZmJmOWVhY2Y1XkEyXkFqcGc@._V1_.jpg"
              alt="Movies to remember cover"
              className="h-24 w-20 object-cover sm:h-28 sm:w-24"
            />
          </div>
          <div>
            <h1 className="font-display text-5xl font-bold tracking-tight text-cinema-cream md:text-7xl">Movies to remember.</h1>
            <p className="mt-3 max-w-xl text-lg text-cinema-muted">A personal shelf for the films that stayed with you.</p>
          </div>
        </div>
        <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
          <form className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm" onSubmit={handleSearch}>
            <span className="text-lg text-cinema-muted">⌕</span>
            <input className="w-full bg-transparent text-sm text-cinema-cream placeholder:text-cinema-muted/80 focus:outline-none" type="search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search" aria-label="Search movies" />
          </form>
          <button className="button shrink-0 rounded-xl px-5 py-3 text-sm" onClick={() => setShowForm(true)}>+ Add movie</button>
        </div>
      </section>
      {loading && <SkeletonGrid />}
      {error && <div className="mt-12 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">{error}</div>}
      {!loading && !error && movies.length === 0 && <div className="mt-16 rounded-2xl border border-dashed border-white/15 p-12 text-center"><p className="font-display text-2xl font-bold text-cinema-cream">{query ? 'No titles found.' : 'Your shelf is waiting.'}</p><p className="mt-2 text-cinema-muted">{query ? 'Try a different search.' : 'Add your first movie to get started.'}</p></div>}
      {!loading && !error && movies.length > 0 && <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{movies.map((movie) => <MovieCard key={movie._id} movie={movie} />)}</div>}
      {!loading && totalPages > 1 && <nav className="mt-12 flex items-center justify-center gap-5"><button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-cinema-muted hover:border-cinema-red hover:text-cinema-cream disabled:opacity-40" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span className="text-sm text-cinema-muted">Page {page} of {totalPages}</span><button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-cinema-muted hover:border-cinema-red hover:text-cinema-cream disabled:opacity-40" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button></nav>}
      {showForm && <MovieForm onClose={() => setShowForm(false)} onSubmit={handleCreate} />}
    </main>
  )
}

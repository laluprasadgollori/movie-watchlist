import MovieCollection from './MovieCollection'
import { getWatchedMovies } from '../services/movieService'

export default function Watched() {
  return <MovieCollection eyebrow="WATCHED" title="Stories you've seen." emptyMessage="Nothing watched yet." fetchMovies={getWatchedMovies} />
}
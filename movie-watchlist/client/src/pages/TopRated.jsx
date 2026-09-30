import MovieCollection from './MovieCollection'
import { getTopRatedMovies } from '../services/movieService'

export default function TopRated() {
  return <MovieCollection eyebrow="TOP RATED" title="The ones worth replaying." emptyMessage="No rated movies yet." fetchMovies={getTopRatedMovies} ranked />
}
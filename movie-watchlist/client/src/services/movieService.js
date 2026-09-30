import api from './api'

export async function getMovies(page = 1, limit = 12) {
  const { data } = await api.get('/movies', { params: { page, limit } })
  return data
}

export async function searchMovies(query, page = 1, limit = 12) {
  const { data } = await api.get('/movies/search', { params: { q: query, page, limit } })
  return data
}

export async function createMovie(movie) {
  const { data } = await api.post('/movies', movie)
  return data
}

export async function getMovie(id) {
  const { data } = await api.get(`/movies/${id}`)
  return data
}

export async function updateMovie(id, movie) {
  const { data } = await api.put(`/movies/${id}`, movie)
  return data
}

export async function deleteMovie(id) {
  const { data } = await api.delete(`/movies/${id}`)
  return data
}

export async function markWatched(id) {
  const { data } = await api.patch(`/movies/${id}/watched`)
  return data
}

export async function getWatchedMovies(page = 1, limit = 12) {
  const { data } = await api.get('/movies/watched', { params: { page, limit } })
  return data
}

export async function getTopRatedMovies(page = 1, limit = 12) {
  const { data } = await api.get('/movies/top-rated', { params: { page, limit } })
  return data
}

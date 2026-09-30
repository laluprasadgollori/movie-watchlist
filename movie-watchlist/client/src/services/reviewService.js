import api from './api'

export async function getReviews(movieId) {
  const { data } = await api.get('/reviews', { params: { movie: movieId } })
  return data
}

export async function createReview(review) {
  const { data } = await api.post('/reviews', review)
  return data
}

export async function updateReview(id, review) {
  const { data } = await api.put(`/reviews/${id}`, review)
  return data
}

export async function deleteReview(id) {
  const { data } = await api.delete(`/reviews/${id}`)
  return data
}

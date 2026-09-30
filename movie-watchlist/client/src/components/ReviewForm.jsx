import { useEffect, useState } from 'react'

export default function ReviewForm({ existingReview, movieId, onCancel, onSubmit }) {
  const [rating, setRating] = useState(existingReview?.rating || 5)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setRating(existingReview?.rating || 5)
    setComment(existingReview?.comment || '')
  }, [existingReview])

  async function handleSubmit(event) {
    event.preventDefault()
    if (rating < 1 || rating > 5) {
      setError('Choose a rating from 1 to 5.')
      return
    }

    setError('')
    setSaving(true)
    try {
      await onSubmit({ movie: movieId, rating: Number(rating), comment: comment.trim() })
      setComment('')
      setRating(5)
    } catch (submitError) {
      setError(submitError.message || 'Unable to save review.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="rounded-2xl border border-white/10 bg-cinema-panel/70 p-5" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-4"><h3 className="font-display text-xl font-bold text-cinema-cream">{existingReview ? 'Edit your review' : 'Add your review'}</h3>{existingReview && <button className="text-sm text-cinema-muted hover:text-cinema-cream" type="button" onClick={onCancel}>Cancel</button>}</div>
      <div className="mt-5 grid gap-4 sm:grid-cols-[10rem_1fr]">
        <label className="text-sm text-cinema-muted">Rating<select className="field" value={rating} onChange={(event) => setRating(event.target.value)}><option value="5">5 / 5</option><option value="4">4 / 5</option><option value="3">3 / 5</option><option value="2">2 / 5</option><option value="1">1 / 5</option></select></label>
        <label className="text-sm text-cinema-muted">Comment<textarea className="field min-h-24 resize-y" maxLength="500" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="What stayed with you?" /></label>
      </div>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      <button className="button mt-5" disabled={saving}>{saving ? 'Saving...' : existingReview ? 'Save changes' : 'Post review'}</button>
    </form>
  )
}

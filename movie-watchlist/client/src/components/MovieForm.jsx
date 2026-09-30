import { useState } from 'react'

const initialForm = { title: '', genre: '', posterUrl: '', year: '' }

export default function MovieForm({ initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(initialData ? {
    title: initialData.title || '',
    genre: initialData.genre || '',
    posterUrl: initialData.posterUrl || '',
    year: initialData.year || '',
  } : initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.genre.trim()) {
      setError('Title and genre are required.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const title = form.title.trim()
      await onSubmit({
        title,
        genre: form.genre.trim(),
        posterUrl: form.posterUrl.trim() || `https://placehold.co/600x900/1a211c/f5f1ea?text=${encodeURIComponent(title)}`,
        year: form.year ? Number(form.year) : undefined,
      })
    } catch (submitError) {
      setError(submitError.message || 'Unable to add movie.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/70 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-movie-title">
      <form className="auth-card w-full max-w-lg rounded-3xl border border-white/10 bg-cinema-panel p-7 shadow-2xl" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold tracking-[0.24em] text-cinema-red">{initialData ? 'EDIT ENTRY' : 'NEW ENTRY'}</p><h2 id="add-movie-title" className="mt-2 font-display text-3xl font-bold text-cinema-cream">{initialData ? 'Edit movie' : 'Add a movie'}</h2></div>
          <button className="text-2xl leading-none text-cinema-muted hover:text-cinema-cream" type="button" aria-label="Close dialog" onClick={onClose}>×</button>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-cinema-muted sm:col-span-2">Title<input className="field" name="title" value={form.title} onChange={updateField} autoFocus /></label>
          <label className="text-sm text-cinema-muted">Genre<input className="field" name="genre" value={form.genre} onChange={updateField} placeholder="Sci-Fi" /></label>
          <label className="text-sm text-cinema-muted">Year<input className="field" name="year" type="number" min="1888" value={form.year} onChange={updateField} placeholder="1999" /></label>
          <label className="text-sm text-cinema-muted sm:col-span-2">Poster URL<input className="field" name="posterUrl" type="url" value={form.posterUrl} onChange={updateField} placeholder="https://..." /></label>
        </div>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <div className="mt-7 flex justify-end gap-3"><button className="rounded-lg px-4 py-2 text-sm text-cinema-muted hover:text-cinema-cream" type="button" onClick={onClose}>Cancel</button><button className="button" disabled={submitting}>{submitting ? 'Saving...' : initialData ? 'Save changes' : 'Add movie'}</button></div>
      </form>
    </div>
  )
}

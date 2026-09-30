import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const nextErrors = {}

    if (form.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!validate()) {
      toast.error('Check the highlighted fields.')
      return
    }
    setSubmitting(true)

    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created.')
      navigate('/movies', { replace: true })
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to create account'
      setError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <form className="auth-card w-full rounded-3xl border border-white/10 bg-gradient-to-br from-cinema-panel via-cinema-panel to-cinema-ink p-8 shadow-2xl" onSubmit={handleSubmit}>
        <p className="text-xs font-bold tracking-[0.24em] text-cinema-red">MOVIE WATCHLIST</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-cinema-cream">Start your list.</h1>
        <p className="mt-3 text-cinema-muted">Save the films you want to remember.</p>
        <label className="mt-8 block text-sm text-cinema-muted">Name<input className={`field ${fieldErrors.name ? 'field-error' : ''}`} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />{fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}</label>
        <label className="mt-4 block text-sm text-cinema-muted">Email<input className={`field ${fieldErrors.email ? 'field-error' : ''}`} type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />{fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}</label>
        <label className="mt-4 block text-sm text-cinema-muted">Password<input className={`field ${fieldErrors.password ? 'field-error' : ''}`} type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />{fieldErrors.password && <span className="error-text">{fieldErrors.password}</span>}</label>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <button className="button mt-6 flex w-full items-center justify-center gap-2" disabled={submitting}>{submitting && <span className="spinner" aria-hidden="true" />}{submitting ? 'Creating...' : 'Create account'}</button>
        <p className="mt-6 text-sm text-cinema-muted">Already registered? <Link className="text-cinema-gold hover:text-cinema-cream" to="/login">Sign in</Link></p>
      </form>
    </main>
  )
}

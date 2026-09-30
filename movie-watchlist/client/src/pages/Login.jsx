import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const nextErrors = {}

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
      await login(form.email, form.password)
      toast.success('Welcome back.')
      navigate(location.state?.from?.pathname || '/movies', { replace: true })
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to log in'
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
        <h1 className="mt-4 font-display text-4xl font-bold text-cinema-cream">Welcome back.</h1>
        <p className="mt-3 text-cinema-muted">Sign in to return to your watchlist.</p>
        <label className="mt-8 block text-sm text-cinema-muted">Email<input className={`field ${fieldErrors.email ? 'field-error' : ''}`} type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />{fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}</label>
        <label className="mt-4 block text-sm text-cinema-muted">Password<input className={`field ${fieldErrors.password ? 'field-error' : ''}`} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />{fieldErrors.password && <span className="error-text">{fieldErrors.password}</span>}</label>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <button className="button mt-6 flex w-full items-center justify-center gap-2" disabled={submitting}>{submitting && <span className="spinner" aria-hidden="true" />}{submitting ? 'Signing in...' : 'Sign in'}</button>
        <p className="mt-6 text-sm text-cinema-muted">New here? <Link className="text-cinema-gold hover:text-cinema-cream" to="/register">Create an account</Link></p>
      </form>
    </main>
  )
}

import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-20">
      <section><p className="text-xs font-bold tracking-[0.24em] text-cinema-red">404 / LOST REEL</p><h1 className="mt-5 font-display text-6xl font-bold text-cinema-cream md:text-8xl">Scene missing.</h1><p className="mt-5 max-w-md text-lg leading-8 text-cinema-muted">That page is not in this cut. Return to your collection and keep browsing.</p><Link className="button mt-8 inline-block" to="/movies">Back to movies</Link></section>
    </main>
  )
}

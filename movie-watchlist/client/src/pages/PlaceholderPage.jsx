import { Link, useParams } from 'react-router-dom'

export default function PlaceholderPage({ eyebrow, title, description }) {
  const { id } = useParams()

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">
      <section className="max-w-2xl">
        <p className="text-xs font-bold tracking-[0.24em] text-cinema-red">{eyebrow}</p>
        <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-cinema-cream md:text-7xl">{title}{id ? ` #${id}` : ''}</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-cinema-muted">{description}</p>
        <Link className="button mt-8" to="/movies">Back to movies</Link>
      </section>
    </main>
  )
}

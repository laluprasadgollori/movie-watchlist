import { Link } from 'react-router-dom'

const posterImages = [
  'https://placehold.co/500x750/1a211c/f5f1ea?text=Afterglow',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVSbpSfxBs-IwBiLIk00swv4t6pwJ7zrLMCvkWz362VJzxRsXQNHHwGWcu&s=10',
  'https://placehold.co/500x750/202b3b/f5f1ea?text=North+Star',
]

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-copy">
          <p className="home-kicker"><span className="live-dot" /> PERSONAL CINEMA / 001</p>
          <h1>Save the films that <em>stay</em> with you.</h1>
          <p className="home-lede">A beautifully simple watchlist for the stories you are not ready to lose.</p>
          <div className="home-actions">
            <Link className="button home-primary" to="/register">Build your list <span aria-hidden="true">↗</span></Link>
            <Link className="home-secondary" to="/login">I already have a list <span aria-hidden="true">→</span></Link>
          </div>
          <div className="home-meta"><span>01 / KEEP</span><span>02 / WATCH</span><span>03 / REMEMBER</span></div>
        </div>
        <div className="hero-visual" aria-label="Animated cinema projector scene">
          <div className="light-beam light-beam-one" />
          <div className="light-beam light-beam-two" />
          <div className="poster-orbit poster-orbit-back"><img src={posterImages[0]} alt="Afterglow poster" /></div>
          <div className="poster-orbit poster-orbit-side"><img src={posterImages[2]} alt="North Star poster" /></div>
          <div className="screen-frame"><div className="screen-glow" /><img src={posterImages[1]} alt="Paradise poster" /><div className="screen-scanlines" /><span className="screen-label">NOW PLAYING / YOUR NEXT FAVORITE</span></div>
          <div className="reel-mark" aria-hidden="true"><span /><span /><span /><span /><i /></div>
          <div className="visual-caption"><span>REEL / LIST</span><span>EST. 2026</span></div>
        </div>
      </section>
      <section className="home-lower"><div><span className="lower-index">01</span><h2>Less scrolling.<br /><strong>More feeling.</strong></h2></div><p>Keep a living archive of your unwatched, watched, and highest-rated stories. Your taste deserves a home with a little atmosphere.</p><Link className="lower-arrow" to="/register" aria-label="Start your watchlist">↘</Link></section>
    </main>
  )
}

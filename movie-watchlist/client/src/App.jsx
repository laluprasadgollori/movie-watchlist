import { useState } from 'react'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetail from './pages/MovieDetail'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import TopRated from './pages/TopRated'
import Watched from './pages/Watched'

function Navigation() {
  const { logout, user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const initials = user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  function handleLogout() {
    setLoggingOut(true)
    logout()
    setLoggingOut(false)
    setMenuOpen(false)
  }

  return (
    <header className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <Link className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-[#f5f1ea] text-xl font-black text-[#101311] shadow-lg shadow-black/20" to="/movies" aria-label="Home">RY</Link>
      {user ? <>
        <nav className="hidden items-center gap-6 text-sm text-cinema-muted sm:flex"><NavLink className={({ isActive }) => isActive ? 'text-cinema-cream' : 'hover:text-cinema-cream'} to="/movies">Movies</NavLink><NavLink className={({ isActive }) => isActive ? 'text-cinema-cream' : 'hover:text-cinema-cream'} to="/watched">Watched</NavLink><NavLink className={({ isActive }) => isActive ? 'text-cinema-cream' : 'hover:text-cinema-cream'} to="/top-rated">Top rated</NavLink><div className="relative"><button className="flex items-center gap-2 text-cinema-gold hover:text-cinema-cream" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span className="avatar">{initials}</span><span>{user.name}</span><span aria-hidden="true">⌄</span></button>{menuOpen && <div className="dropdown"><p className="truncate px-4 py-2 text-xs text-cinema-muted">{user.email}</p><button className="w-full px-4 py-2 text-left text-sm text-red-200 hover:bg-white/5 disabled:opacity-50" disabled={loggingOut} onClick={handleLogout}>{loggingOut ? 'Logging out...' : 'Log out'}</button></div>}</div></nav>
        <button className="menu-button sm:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : '☰'}</button>
        {menuOpen && <nav className="mobile-menu sm:hidden"><NavLink to="/movies" onClick={() => setMenuOpen(false)}>Movies</NavLink><NavLink to="/watched" onClick={() => setMenuOpen(false)}>Watched</NavLink><NavLink to="/top-rated" onClick={() => setMenuOpen(false)}>Top rated</NavLink><div className="border-t border-white/10 pt-3 text-sm text-cinema-muted">{user.name}<button className="mt-2 block text-red-200 disabled:opacity-50" disabled={loggingOut} onClick={handleLogout}>{loggingOut ? 'Logging out...' : 'Log out'}</button></div></nav>}
      </> : <nav className="public-nav"><Link className="public-login" to="/login">Sign in</Link><Link className="public-register" to="/register">Join the list <span aria-hidden="true">↗</span></Link></nav>}
    </header>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/watched" element={<Watched />} />
            <Route path="/top-rated" element={<TopRated />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

function saveSession({ token, user }) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)
      return
    }

    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      })
      .catch(() => {
        clearSession()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    saveSession(data)
    setUser(data.user)
    return data.user
  }

  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password })
    saveSession(data)
    setUser(data.user)
    return data.user
  }

  function logout() {
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ loading, login, logout, register, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

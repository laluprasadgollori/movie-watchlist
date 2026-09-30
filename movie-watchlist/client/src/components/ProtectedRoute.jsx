import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageTransition from './PageTransition'
import { SkeletonPage } from './Skeleton'

export default function ProtectedRoute() {
  const { loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return <SkeletonPage />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <PageTransition><Outlet /></PageTransition>
}

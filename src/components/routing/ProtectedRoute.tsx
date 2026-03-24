import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { userProfile, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return null
  }

  if (!userProfile) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

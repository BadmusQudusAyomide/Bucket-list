import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { userProfile, initializing } = useAuth()

  if (initializing) {
    return null
  }

  if (!userProfile) {
    return <Navigate to="/auth" replace />
  }

  if (userProfile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

import { Navigate } from 'react-router-dom'
import { AuthCard } from '../components/auth/AuthCard'
import { useAuth } from '../context/useAuth'

export const AuthPage = () => {
  const { userProfile } = useAuth()

  if (userProfile) {
    return <Navigate to={userProfile.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return (
    <section className="mx-auto max-w-6xl">
      <AuthCard />
    </section>
  )
}

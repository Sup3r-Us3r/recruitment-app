import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export { PublicRoute }

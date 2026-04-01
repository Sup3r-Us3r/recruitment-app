import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { PublicRoute } from '@/components/public-route'

// We will create these pages next
import { Login } from '@/pages/auth/login'
import { Register } from '@/pages/auth/register'
import { Jobs } from '@/pages/jobs'
import { Dashboard } from '@/pages/dashboard'
import { CreateJob } from '@/pages/jobs/create'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/jobs" element={<Jobs />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs/create" element={<CreateJob />} />
          </Route>
        </Routes>
        <Toaster richColors position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}

export { App }

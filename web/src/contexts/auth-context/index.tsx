import { createContext, useContext, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import type { LoginPayload, RegisterPayload, UserResponse } from '@/http/recruitment-api/auth/types'
import { login as loginApi, register as registerApi } from '@/http/recruitment-api/auth'
import { apiClient } from '@/http/recruitment-api/api-client'
import { useNavigate } from 'react-router-dom'

interface AuthContextData {
  user: UserResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginPayload) => Promise<void>
  register: (data: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface AuthProviderProps {
  children: React.ReactNode
}

const getInitialUser = (): UserResponse | null => {
  const token = localStorage.getItem('@recruitment:token')
  if (token) {
    try {
      const decoded = jwtDecode<UserResponse>(token)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      return decoded
    } catch {
      localStorage.removeItem('@recruitment:token')
    }
  }
  return null
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserResponse | null>(getInitialUser)
  const [isLoading] = useState(false) // Not loading async on boot anymore
  const navigate = useNavigate()

  const login = async (data: LoginPayload) => {
    const response = await loginApi(data)
    localStorage.setItem('@recruitment:token', response.token)
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.token}`
    const decoded = jwtDecode<UserResponse>(response.token)
    setUser(decoded)
    navigate('/dashboard')
  }

  const register = async (data: RegisterPayload) => {
    await registerApi(data)
  }

  const logout = () => {
    localStorage.removeItem('@recruitment:token')
    delete apiClient.defaults.headers.common['Authorization']
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }

import { useAuth } from '@/contexts/auth-context'
import { useState } from 'react'

const useNavbar = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return {
    isAuthenticated,
    user,
    logout,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  }
}

export { useNavbar }

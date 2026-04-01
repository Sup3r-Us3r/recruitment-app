import { Link } from 'react-router-dom'
import { useNavbar } from './hooks/use-navbar'
import { NavLinks } from './components/nav-links'
import { UserMenu } from './components/user-menu'
import { MobileMenu } from './components/mobile-menu'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const { isAuthenticated, user, logout, isMobileMenuOpen, setIsMobileMenuOpen } = useNavbar()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 leading-tight">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            onOpenChange={setIsMobileMenuOpen} 
            isAuthenticated={isAuthenticated}
            onLogout={logout}
          />
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block">
              RecruitApp
            </span>
          </Link>
          <NavLinks />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <div className="hidden md:flex gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Criar Conta</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export { Navbar }

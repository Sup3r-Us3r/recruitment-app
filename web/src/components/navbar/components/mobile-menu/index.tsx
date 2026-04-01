import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

interface MobileMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isAuthenticated: boolean
  onLogout: () => void
}

const MobileMenu = ({ isOpen, onOpenChange, isAuthenticated, onLogout }: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-left">RecruitApp</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-6">
          <Link to="/jobs" onClick={() => onOpenChange(false)} className="text-sm font-medium">
            Vagas
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => onOpenChange(false)} className="text-sm font-medium">
                Dashboard
              </Link>
              <button 
                onClick={() => {
                  onLogout()
                  onOpenChange(false)
                }}
                className="text-left text-sm font-medium text-destructive"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => onOpenChange(false)} className="text-sm font-medium">
                Entrar
              </Link>
              <Link to="/register" onClick={() => onOpenChange(false)} className="text-sm font-medium text-primary">
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileMenu }

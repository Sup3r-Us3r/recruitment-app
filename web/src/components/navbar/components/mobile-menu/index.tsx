import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const MobileMenu = ({
  isOpen,
  onOpenChange,
  isAuthenticated,
  onLogout,
}: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-left">RecruitApp</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-2">
          <Link
            to="/jobs"
            onClick={() => onOpenChange(false)}
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
          >
            Vagas
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => onOpenChange(false)}
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onOpenChange(false);
                }}
                className="rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => onOpenChange(false)}
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                onClick={() => onOpenChange(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
              >
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { MobileMenu };

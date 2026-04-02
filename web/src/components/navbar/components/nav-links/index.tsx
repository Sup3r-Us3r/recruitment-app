import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinksProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

interface NavLinkItemProps {
  to: string;
  children: React.ReactNode;
}

const NavLinkItem = ({ to, children }: NavLinkItemProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || pathname.startsWith(to + '/');

  return (
    <Link
      to={to}
      className={cn(
        'relative text-sm font-medium transition-colors hover:text-primary py-5',
        isActive
          ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary'
          : 'text-muted-foreground'
      )}
    >
      {children}
    </Link>
  );
};

const NavLinks = ({ isAuthenticated, onLogout }: NavLinksProps) => {
  return (
    <div className="hidden md:flex flex-1 gap-6 items-center">
      <NavLinkItem to="/jobs">Vagas</NavLinkItem>
      {isAuthenticated && (
        <>
          <NavLinkItem to="/dashboard">Dashboard</NavLinkItem>
          <button
            type="button"
            className="text-sm font-medium transition-colors ml-auto text-muted-foreground hover:text-primary cursor-pointer"
            onClick={onLogout}
          >
            Sair
          </button>
        </>
      )}
    </div>
  );
};

export { NavLinks };

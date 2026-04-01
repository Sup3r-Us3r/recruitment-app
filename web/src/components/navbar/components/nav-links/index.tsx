import { Link } from 'react-router-dom';

interface NavLinksProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const NavLinks = ({ isAuthenticated, onLogout }: NavLinksProps) => {
  return (
    <div className="hidden md:flex gap-6 items-center">
      <Link
        to="/jobs"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Vagas
      </Link>
      {isAuthenticated && (
        <>
          <Link
            to="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <button
            type="button"
            className="text-sm font-medium transition-colors hover:text-primary"
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

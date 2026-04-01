import { Link } from 'react-router-dom'

const NavLinks = () => {
  return (
    <div className="hidden md:flex gap-6 items-center">
      <Link to="/jobs" className="text-sm font-medium transition-colors hover:text-primary">
        Vagas
      </Link>
    </div>
  )
}

export { NavLinks }

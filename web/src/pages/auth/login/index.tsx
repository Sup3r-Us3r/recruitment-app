import { LoginForm } from './components/login-form'
import { AuthHeroPanel } from '../components/auth-hero-panel'
import { BriefcaseBusiness } from 'lucide-react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BriefcaseBusiness className="size-4" />
            </div>
            Recruitment
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <AuthHeroPanel />
    </div>
  )
}

export { Login }

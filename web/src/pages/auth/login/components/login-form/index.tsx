import { useLogin } from './hooks/use-login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const LoginForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { form, isLoading, onSubmit, errorMsg } = useLogin()

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Entrar na conta</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Insira seu e-mail e senha para acessar o sistema
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/15 text-destructive font-medium">
              <AlertCircle className="h-4 w-4" />
              {errorMsg}
            </div>
          )}

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center text-sm">
        Ainda não tem uma conta?{' '}
        <Link to="/register" className="underline underline-offset-4">
          Cadastre-se
        </Link>
      </div>
    </div>
  )
}

export { LoginForm }

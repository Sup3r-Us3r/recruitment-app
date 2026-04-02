import { useRegister } from './hooks/use-register';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const RegisterForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { form, isLoading, onSubmit, errorMsg } = useRegister();

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Criar Conta</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Preencha seus dados para se cadastrar
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de conta</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={
                          field.value === 'candidate' ? 'default' : 'outline'
                        }
                        onClick={() => field.onChange('candidate')}
                      >
                        Candidato
                      </Button>
                      <Button
                        type="button"
                        variant={
                          field.value === 'recruiter' ? 'default' : 'outline'
                        }
                        onClick={() => field.onChange('recruiter')}
                      >
                        Recrutador
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center text-sm">
        Já tem uma conta?{' '}
        <Link to="/login" className="underline underline-offset-4">
          Entrar
        </Link>
      </div>
    </div>
  );
};

export { RegisterForm };

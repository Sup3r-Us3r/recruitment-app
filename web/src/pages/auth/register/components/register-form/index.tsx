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

const RegisterForm = () => {
  const { form, isLoading, onSubmit, errorMsg } = useRegister();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/15 text-destructive font-medium">
            <AlertCircle className="h-4 w-4" />
            {errorMsg}
          </div>
        )}

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
      </form>
    </Form>
  );
};

export { RegisterForm };

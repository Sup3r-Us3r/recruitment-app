import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/auth-context';
import { registerSchema, type RegisterSchema } from './schema';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

const useRegister = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'candidate',
      confirmPassword: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: RegisterSchema) => {
    setErrorMsg(null);
    try {
      await register({
        email: data.email,
        password: data.password,
        role: data.role,
      });
      toast.success('Conta criada com sucesso!', {
        description: 'Você já pode fazer login.',
      });
      navigate('/login');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setErrorMsg(axiosError.response?.data?.message || 'Erro ao criar conta');
      toast.error('Falha no cadastro', {
        description: 'Tente novamente mais tarde.',
      });
    }
  };

  return { form, isLoading, onSubmit, errorMsg };
};

export { useRegister };

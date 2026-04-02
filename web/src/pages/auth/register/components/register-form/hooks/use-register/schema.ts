import { z } from 'zod';

const registerSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    role: z.enum(['candidate', 'recruiter'], {
      message: 'Selecione o tipo de conta',
    }),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export { registerSchema };
export type { RegisterSchema };

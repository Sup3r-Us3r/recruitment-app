import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type LoginSchema = z.infer<typeof loginSchema>

export { loginSchema }
export type { LoginSchema }

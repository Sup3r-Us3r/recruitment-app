import { z } from 'zod'

const createJobSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  location: z.string().min(2, 'A localização é obrigatória'),
})

type CreateJobSchema = z.infer<typeof createJobSchema>

export { createJobSchema }
export type { CreateJobSchema }

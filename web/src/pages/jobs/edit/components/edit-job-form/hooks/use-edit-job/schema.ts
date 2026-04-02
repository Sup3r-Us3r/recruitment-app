import { z } from 'zod'

const editJobSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  company: z.string().min(2, 'O nome da empresa é obrigatório'),
  location: z.string().min(2, 'A localização é obrigatória'),
  work_mode: z.enum(['on_site', 'remote', 'hybrid'], {
    required_error: 'Selecione o modelo de trabalho',
  }),
  labels: z.array(z.string()).default([]),
})

type EditJobSchema = z.infer<typeof editJobSchema>

export { editJobSchema }
export type { EditJobSchema }

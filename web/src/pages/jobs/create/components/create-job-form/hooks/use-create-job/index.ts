import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createJobSchema, type CreateJobSchema } from './schema'
import { createJob } from '@/http/recruitment-api/jobs'
import { toast } from 'sonner'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const useCreateJob = () => {
  const navigate = useNavigate()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const form = useForm<CreateJobSchema>({
    resolver: zodResolver(createJobSchema),
    defaultValues: { title: '', description: '', location: '' },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: CreateJobSchema) => {
    setErrorMsg(null)
    try {
      await createJob(data)
      toast.success('Vaga criada com sucesso!', { description: 'Sua vaga já está disponível para candidaturas.' })
      navigate('/dashboard')
    } catch {
      setErrorMsg('Ocorreu um erro ao criar a vaga. Tente novamente mais tarde.')
      toast.error('Falha ao criar vaga', { description: 'Não foi possível publicar a vaga.' })
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return { form, isLoading, onSubmit, errorMsg, handleCancel }
}

export { useCreateJob }

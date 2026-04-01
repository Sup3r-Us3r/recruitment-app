import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth-context'
import { loginSchema, type LoginSchema } from './schema'
import { toast } from 'sonner'
import { useState } from 'react'
import type { AxiosError } from 'axios'

const useLogin = () => {
  const { login } = useAuth()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: LoginSchema) => {
    setErrorMsg(null)
    try {
      await login(data)
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      setErrorMsg(axiosError.response?.data?.message || 'E-mail ou senha inválidos')
      toast.error('Falha no login', { description: 'Verifique suas credenciais e tente novamente.' })
    }
  }

  return { form, isLoading, onSubmit, errorMsg }
}

export { useLogin }

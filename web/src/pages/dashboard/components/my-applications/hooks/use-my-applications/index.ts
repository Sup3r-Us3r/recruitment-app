import { useState, useEffect } from 'react'
import { listMyApplications } from '@/http/recruitment-api/applications'
import type { ApplicationResponse } from '@/http/recruitment-api/applications/types'
import { toast } from 'sonner'

const useMyApplications = () => {
  const [applications, setApplications] = useState<ApplicationResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const data = await listMyApplications()
      setApplications(data || [])
    } catch {
      toast.error('Erro ao buscar candidaturas', { description: 'Não foi possível carregar as vagas nas quais você se candidatou.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return { applications, isLoading }
}

export { useMyApplications }

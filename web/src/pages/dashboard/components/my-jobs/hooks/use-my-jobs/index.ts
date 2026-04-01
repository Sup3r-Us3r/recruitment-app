import { useState, useEffect } from 'react'
import { listMyJobs } from '@/http/recruitment-api/jobs'
import type { JobResponse } from '@/http/recruitment-api/jobs/types'
import { toast } from 'sonner'

const useMyJobs = () => {
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const data = await listMyJobs()
      setJobs(data || [])
    } catch {
      toast.error('Erro ao buscar vagas', { description: 'Não foi possível carregar suas vagas criadas.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return { jobs, isLoading }
}

export { useMyJobs }

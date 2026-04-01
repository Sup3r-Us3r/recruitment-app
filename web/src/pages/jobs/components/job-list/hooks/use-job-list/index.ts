import { useState, useEffect, useCallback } from 'react'
import { listJobs } from '@/http/recruitment-api/jobs'
import { listMyApplications } from '@/http/recruitment-api/applications'
import type { JobResponse } from '@/http/recruitment-api/jobs/types'
import { useAuth } from '@/contexts/auth-context'
import type { ApplicationResponse } from '@/http/recruitment-api/applications/types'

const useJobList = () => {
  const { isAuthenticated } = useAuth()
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  const fetchJobs = useCallback(async (search?: string) => {
    setIsLoading(true)
    try {
      const fetchJobsPromise = listJobs({ search: search || undefined })
      
      let applicationsPromise: Promise<ApplicationResponse[]> = Promise.resolve([])
      if (isAuthenticated) {
        applicationsPromise = listMyApplications()
      }

      const [jobsData, applicationsData] = await Promise.all([
        fetchJobsPromise,
        applicationsPromise
      ])

      setJobs(jobsData || [])
      
      if (isAuthenticated && Array.isArray(applicationsData)) {
        const ids = new Set((applicationsData as ApplicationResponse[]).map(app => app.job_id))
        setAppliedJobIds(ids)
      }
    } catch (error) {
      console.error('Error fetching jobs', error)
      setJobs([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  return {
    jobs,
    appliedJobIds,
    isLoading,
    fetchJobs,
  }
}

export { useJobList }

import { apiClient } from '../api-client'
import type { ApplicationResponse } from './types'

async function listMyApplications(): Promise<ApplicationResponse[]> {
  const response = await apiClient.get<ApplicationResponse[]>('/applications/mine')
  return response.data
}

async function applyToJob(jobId: number): Promise<ApplicationResponse> {
  const response = await apiClient.post<ApplicationResponse>(`/jobs/${jobId}/apply`)
  return response.data
}

export { listMyApplications, applyToJob }

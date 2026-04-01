import { apiClient } from '../api-client'
import type { CreateJobPayload, JobResponse, ListJobsParams } from './types'

async function listJobs(params?: ListJobsParams): Promise<JobResponse[]> {
  const response = await apiClient.get<JobResponse[]>('/jobs', { params })
  return response.data
}

async function listMyJobs(): Promise<JobResponse[]> {
  const response = await apiClient.get<JobResponse[]>('/jobs/mine')
  return response.data
}

async function createJob(data: CreateJobPayload): Promise<JobResponse> {
  const response = await apiClient.post<JobResponse>('/jobs', data)
  return response.data
}

export { listJobs, listMyJobs, createJob }

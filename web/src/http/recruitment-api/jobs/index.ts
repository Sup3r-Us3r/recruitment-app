import { apiClient } from '../api-client'
import type { CreateJobPayload, JobResponse, JobDetailResponse, UpdateJobPayload, ApplicantResponse, ListJobsParams } from './types'

async function listJobs(params?: ListJobsParams): Promise<JobResponse[]> {
  const response = await apiClient.get<JobResponse[]>('/jobs', { params })
  return response.data
}

async function listMyJobs(): Promise<JobResponse[]> {
  const response = await apiClient.get<JobResponse[]>('/jobs/mine')
  return response.data
}

async function getJob(id: number): Promise<JobDetailResponse> {
  const response = await apiClient.get<JobDetailResponse>(`/jobs/${id}`)
  return response.data
}

async function createJob(data: CreateJobPayload): Promise<JobResponse> {
  const response = await apiClient.post<JobResponse>('/jobs', data)
  return response.data
}

async function updateJob(id: number, data: UpdateJobPayload): Promise<JobResponse> {
  const response = await apiClient.put<JobResponse>(`/jobs/${id}`, data)
  return response.data
}

async function listLabels(): Promise<string[]> {
  const response = await apiClient.get<string[]>('/jobs/labels')
  return response.data
}

async function cancelJob(id: number): Promise<void> {
  await apiClient.post(`/jobs/${id}/cancel`)
}

async function listApplicants(jobId: number): Promise<ApplicantResponse[]> {
  const response = await apiClient.get<ApplicantResponse[]>(`/jobs/${jobId}/applicants`)
  return response.data
}

export { listJobs, listMyJobs, getJob, createJob, updateJob, cancelJob, listApplicants, listLabels }

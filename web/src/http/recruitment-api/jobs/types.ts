export type WorkMode = 'on_site' | 'remote' | 'hybrid'

export interface CreateJobPayload {
  title: string
  description: string
  company: string
  location: string
  work_mode: WorkMode
  labels: string[]
}

export interface JobResponse {
  id: number
  title: string
  description: string
  company: string
  location: string
  work_mode: WorkMode
  labels: string[]
  owner_id: number
  canceled_at: string | null
  created_at: string
}

export interface JobDetailResponse extends JobResponse {
  application_count: number
}

export type UpdateJobPayload = CreateJobPayload

export interface ApplicantUser {
  id: number
  name: string
  email: string
}

export interface ApplicantResponse {
  id: number
  user: ApplicantUser
  created_at: string
}

export interface ListJobsParams {
  search?: string
  work_mode?: string
  labels?: string
}

export interface CreateJobPayload {
  title: string
  description: string
  location: string
}

export interface JobResponse {
  id: number
  title: string
  description: string
  location: string
  owner_id: number
  created_at: string
}

export interface ListJobsParams {
  search?: string
}

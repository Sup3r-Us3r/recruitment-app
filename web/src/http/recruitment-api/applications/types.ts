import type { JobResponse } from '../jobs/types'
import type { UserResponse } from '../auth/types'

export interface ApplyPayload {
  job_id: number
}

export interface ApplicationResponse {
  id: number
  job_id: number
  user_id: number
  canceled_at: string | null
  created_at: string
  job?: JobResponse
  user?: UserResponse
}

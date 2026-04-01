export interface RegisterPayload {
  email: string
  password: string
}

export interface RegisterResponse {
  id: number
  email: string
  created_at: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface UserResponse {
  id: number
  email: string
  created_at: string
}

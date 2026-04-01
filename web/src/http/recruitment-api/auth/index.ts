import { apiClient } from '../api-client'
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from './types'

async function login(data: LoginPayload): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', data)
  return response.data
}

async function register(data: RegisterPayload): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>('/auth/register', data)
  return response.data
}

export { login, register }

export type UserRole = 'candidate' | 'recruiter';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthTokenPayload {
  user_id: number;
  name: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}

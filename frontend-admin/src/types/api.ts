// Shared types for API services
export interface User {
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  profile_photo: string | null;
  date_of_birth: string | null;
  gender: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  verification_token: string | null;
  verification_expires: Date | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: User;
}

export interface VerifyResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
  error?: string;
}

// Auth specific types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// User specific types
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
}
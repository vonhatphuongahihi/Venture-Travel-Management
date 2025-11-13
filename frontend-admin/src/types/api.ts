// Shared types for API services
export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  profilePhoto: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  verification_token: string | null;
  verification_expires: Date | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
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
  dateOfBirth?: string;
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
  dateOfBirth?: string;
  gender?: string;
}

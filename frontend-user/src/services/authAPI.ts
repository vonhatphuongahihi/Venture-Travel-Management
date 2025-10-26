const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
  };
}

export interface VerifyResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
  };
  error?: string;
}

class AuthAPI {
  // Login user
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return response.json();
  }

  // Register user
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response.json();
  }

  // Verify email
  static async verifyEmail(verifyData: VerifyEmailRequest): Promise<VerifyResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verifyData),
    });

    return response.json();
  }

  // Get user profile
  static async getProfile(token: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }

  // Logout
  static async logout(token: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }
}

export default AuthAPI;

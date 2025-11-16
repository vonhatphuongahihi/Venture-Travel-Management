import { AuthResponse, LoginRequest, RegisterRequest, VerifyEmailRequest, VerifyResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class AuthAPI {
  // Login user
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `HTTP Error: ${response.status}`,
        };
      }

      return response.json();
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }

  // Register user
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `HTTP Error: ${response.status}`,
        };
      }

      return response.json();
    } catch (error) {
      console.error('Register API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
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

  // Logout
  static async logout(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `HTTP Error: ${response.status}`,
        };
      }

      return response.json();
    } catch (error) {
      console.error('Logout API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }
}

export default AuthAPI;

import type { AuthResponse, ProfileResponse, UpdateProfileRequest } from "@/types/api";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class AdminAPI {
  // Get admin profile
  static async getProfile(token: string): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'GET',
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
      console.error('Get profile API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }

  // Update admin profile
  static async updateProfile(token: string, profileData: UpdateProfileRequest): Promise<AuthResponse> {
    try {
      console.log('Sending to API:', profileData);
      
      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        return {
          success: false,
          message: responseData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return responseData;
    } catch (error) {
      console.error('Update profile API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }

  // Update admin avatar
  static async updateAvatar(token: string, file: File): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/admin/avatar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
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
      console.error('Update avatar API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }

  // Change password
  static async changePassword(token: string, oldPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: responseData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return responseData;
    } catch (error) {
      console.error('Change password API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }

  // Change email
  static async changeEmail(token: string, email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: responseData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return responseData;
    } catch (error) {
      console.error('Change email API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }
}

export default AdminAPI;

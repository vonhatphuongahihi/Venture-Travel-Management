import { User, UpdateProfileRequest, AuthResponse, VerifyResponse, ProfileResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class UserAPI {
  // Get user profile
  static async getProfile(token: string): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
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

  // Update user profile
  static async updateProfile(token: string, profileData: UpdateProfileRequest): Promise<AuthResponse> {
    try {
      console.log('Sending to API:', profileData);

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
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

  // Update user avatar
  static async updateAvatar(token: string, file: File): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/users/avatar`, {
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

  // Toggle favorite tour
  static async toggleFavoriteTour(token: string, tourId: string): Promise<AuthResponse & { data?: { isFavorite: boolean; favoriteTours: string[] } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tourId }),
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
      console.error('Toggle favorite tour API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }

  // Get favorite tours
  static async getFavoriteTours(token: string): Promise<ProfileResponse & { data?: any[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
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
      console.error('Get favorite tours API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }
}

export default UserAPI;

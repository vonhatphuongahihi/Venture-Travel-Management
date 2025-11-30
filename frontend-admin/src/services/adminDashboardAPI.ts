const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalPlaces: number;
  totalActiveTours: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface TopTour {
  id: string;
  name: string;
  bookingCount: number;
}

export interface TopPlace {
  id: string;
  name: string;
  visitCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class AdminDashboardAPI {
  private static getAuthHeaders() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get dashboard statistics
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return data;
    } catch (error) {
      console.error('Get dashboard stats API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }

  // Get monthly data
  static async getMonthlyData(): Promise<ApiResponse<MonthlyData[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/monthly-data`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return data;
    } catch (error) {
      console.error('Get monthly data API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }

  // Get top tours
  static async getTopTours(): Promise<ApiResponse<TopTour[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/top-tours`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return data;
    } catch (error) {
      console.error('Get top tours API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }

  // Get top places
  static async getTopPlaces(): Promise<ApiResponse<TopPlace[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/top-places`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return data;
    } catch (error) {
      console.error('Get top places API error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      };
    }
  }
}

export default AdminDashboardAPI;
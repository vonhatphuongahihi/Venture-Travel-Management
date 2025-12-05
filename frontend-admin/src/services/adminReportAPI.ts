import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with auth header
const createAuthenticatedApi = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};

export interface AdminReportsStats {
  totalTickets: number;
  totalBookings: number;
  totalRevenue: number;
  ticketGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
}

export interface MonthlyBookingData {
  month: string;
  bookings: number;
  revenue: number;
}

export interface TourByStatusData {
  name: string;
  value: number;
  color: string;
}

export interface TopTourData {
  tourId: string;
  tourName: string;
  bookings: number;
  revenue: number;
  avgRating: number;
  growthRate: number;
}

export interface BookingByAttractionData {
  attractionName: string;
  bookings: number;
  revenue: number;
}

export class AdminReportAPI {
  // Lấy thống kê tổng quan
  static async getReportsStats(): Promise<AdminReportsStats> {
    try {
      const api = createAuthenticatedApi();
      const response = await api.get('/admin/reports/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reports stats:', error);
      throw error;
    }
  }

  // Lấy dữ liệu theo tháng
  static async getMonthlyData(): Promise<MonthlyBookingData[]> {
    try {
      const api = createAuthenticatedApi();
      const response = await api.get('/admin/reports/monthly');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      throw error;
    }
  }

  // Lấy thống kê theo trạng thái tour
  static async getTourByStatus(): Promise<TourByStatusData[]> {
    try {
      const api = createAuthenticatedApi();
      const response = await api.get('/admin/reports/tour-status');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tour status data:', error);
      throw error;
    }
  }

  // Lấy top tours
  static async getTopTours(sortBy: 'popularity' | 'rating' | 'revenue' = 'popularity'): Promise<TopTourData[]> {
    try {
      const api = createAuthenticatedApi();
      const response = await api.get(`/admin/reports/top-tours?sortBy=${sortBy}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching top tours:', error);
      throw error;
    }
  }

  // Lấy dữ liệu đặt chỗ theo điểm đến
  static async getBookingsByAttraction(): Promise<BookingByAttractionData[]> {
    try {
      const api = createAuthenticatedApi();
      const response = await api.get('/admin/reports/bookings-by-attraction');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bookings by attraction:', error);
      throw error;
    }
  }
}
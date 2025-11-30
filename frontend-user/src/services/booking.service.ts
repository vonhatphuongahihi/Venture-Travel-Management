import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import { BookingFormData, BookingResponse, BookingHistoryItem } from '@/types/tour.types';

export const bookingService = {
  // Create new booking
  async createBooking(data: BookingFormData): Promise<BookingResponse> {
    const response = await apiClient.post<{ success: boolean; data: BookingResponse }>(API_ENDPOINTS.bookings.create, data);
    return response.data;
  },

  // Get all bookings for current user
  async getUserBookings(): Promise<BookingHistoryItem[]> {
    const response = await apiClient.get<{ success: boolean; data: BookingHistoryItem[] }>("/bookings/user/bookings");
    return response.data || [];
  },

  // Get booking by ID
  async getBookingById(id: string): Promise<BookingResponse> {
    const response = await apiClient.get<{ success: boolean; data: BookingResponse }>(API_ENDPOINTS.bookings.detail(id));
    return response.data;
  },

  // Cancel booking
  async cancelBooking(id: string): Promise<void> {
    await apiClient.patch<{ success: boolean; data: BookingResponse }>(`${API_ENDPOINTS.bookings.detail(id)}/cancel`, {});
  },
};

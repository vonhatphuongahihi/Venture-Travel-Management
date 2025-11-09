import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import { BookingFormData } from '@/types/tour.types';

interface BookingResponse {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingNumber: string;
  createdAt: string;
}

export const bookingService = {
  // Create new booking
  async createBooking(data: BookingFormData & { tourId: string }): Promise<BookingResponse> {
    return apiClient.post<BookingResponse>(API_ENDPOINTS.bookings.create, data);
  },

  // Get all bookings for current user
  async getUserBookings(): Promise<BookingResponse[]> {
    return apiClient.get<BookingResponse[]>(API_ENDPOINTS.bookings.list);
  },

  // Get booking by ID
  async getBookingById(id: string): Promise<BookingResponse> {
    return apiClient.get<BookingResponse>(API_ENDPOINTS.bookings.detail(id));
  },

  // Cancel booking
  async cancelBooking(id: string): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.bookings.cancel(id));
  },
};

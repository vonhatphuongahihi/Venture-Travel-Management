import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import { Tour } from '@/types/tour.types';

export const tourService = {
  // Get all tours
  async getAllTours(): Promise<Tour[]> {
    return apiClient.get<Tour[]>(API_ENDPOINTS.tours.list);
  },

  // Get tour by ID
  async getTourById(id: string): Promise<Tour> {
    return apiClient.get<Tour>(API_ENDPOINTS.tours.detail(id));
  },

  // Search tours
  async searchTours(params: {
    keyword?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<Tour[]> {
    return apiClient.get<Tour[]>(API_ENDPOINTS.tours.search, { params });
  },
};

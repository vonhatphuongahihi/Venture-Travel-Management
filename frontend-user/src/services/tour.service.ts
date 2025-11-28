import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';

interface TourResponse {
  success: boolean;
  message: string;
  data: {
    tours: TourFromAPI[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface TourFromAPI {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  duration: string;
  location: string;
  provinceId: string;
  rating: number;
  reviewCount: number;
  category: string;
  categories: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  maxParticipants: number;
  availableSpots: number;
  ageRange: string;
  languages: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  pickupPoint: string;
  endPoint?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  location: string;
  rating: number;
  reviewCount: number;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  maxParticipants: number;
  availableSpots: number;
}

export const tourService = {
  // Get all tours
  async getAllTours(params?: {
    page?: number;
    limit?: number;
    provinceId?: string;
    category?: string;
    isActive?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<{ tours: Tour[]; pagination: any }> {
    try {
      const response = await apiClient.get<TourResponse>(API_ENDPOINTS.tours.list, { params });

      if (response.success && response.data) {
        return {
          tours: response.data.tours.map((tour) => ({
            id: tour.id,
            title: tour.title,
            description: tour.description,
            image: tour.image || '/placeholder.svg',
            price: tour.price,
            duration: tour.duration,
            location: tour.location,
            rating: tour.rating,
            reviewCount: tour.reviewCount,
            category: tour.category,
            status: tour.status,
            maxParticipants: tour.maxParticipants,
            availableSpots: tour.availableSpots,
          })),
          pagination: response.data.pagination,
        };
      }

      return { tours: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    } catch (error) {
      console.error('Error fetching tours:', error);
      return { tours: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    }
  },

  // Get tour by ID
  async getTourById(id: string) {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.tours.detail(id));

      if (response.success && response.data) {
        const tour = response.data;

        // Map tour stops
        const tourStops = tour.tourStops?.map((stop: any) => {
          const attraction = stop.attraction;

          // Get coordinates from attraction point
          let attractionGeom: [number, number] = [0, 0];
          if (attraction?.point) {
            attractionGeom = [attraction.point.longitude || 0, attraction.point.latitude || 0];
          }

          return {
            stopId: stop.stopId,
            tourId: tour.id,
            attractionId: attraction?.id || '',
            attractionName: attraction?.name || '',
            attractionImage: attraction?.images?.[0] || '/placeholder.svg',
            attractionGeom,
            stopOrder: stop.stopOrder,
            notes: stop.notes || '',
            details: stop.details || '',
            created_at: new Date(stop.createdAt || tour.createdAt || Date.now()),
          };
        }) || [];

        // Map ticket prices
        const ticketPrices: any[] = [];
        tour.ticketTypes?.forEach((type: any) => {
          type.prices?.forEach((price: any) => {
            ticketPrices.push({
              ticketPriceId: price.ticketPriceId,
              ticketTypeId: type.ticketTypeId,
              categoryId: price.categoryId,
              notes: price.notes || '',
              price: price.price || 0,
              quantity: price.quantity || 0,
              isActive: true,
              createdAt: new Date(tour.createdAt || Date.now()),
            });
          });
        });

        // Map reviews
        const reviews = tour.reviews?.map((review: any) => ({
          reviewId: review.reviewId,
          userId: review.user?.id || '',
          userName: review.user?.name || 'Anonymous',
          userAvatar: review.user?.avatar || '/default-avatar.png',
          targetType: 'tour',
          targetId: tour.id,
          rate: review.rating || 0,
          content: review.content || '',
          images: review.images || [],
          likesCount: 0, // TODO: Add likes count if available
          createdAt: new Date(review.date || Date.now()),
          updatedAt: new Date(review.date || Date.now()),
        })) || [];

        // Parse expectations (string to array)
        const expectations = tour.expectations ?
          (typeof tour.expectations === 'string' ?
            tour.expectations.split('\n').filter((line: string) => line.trim()) :
            tour.expectations) :
          [];

        return {
          id: tour.id,
          provinceId: tour.provinceId || '',
          title: tour.name || '',
          description: tour.about || '',
          images: tour.images || [],
          age: tour.ageRange || '0-50',
          maxGroup: tour.maxGroupSize || 30,
          duration: tour.duration || '',
          languages: Array.isArray(tour.languages) ? tour.languages.join(', ') : (tour.languages || 'Tiếng Việt'),
          categories: tour.categories || [],
          highlight: tour.highlights || [],
          inclusions: tour.inclusions || [],
          exclusions: tour.exclusions || [],
          expectations: expectations,
          pickUpPoint: tour.pickupPoint || '',
          pickUpDetails: tour.pickupDetails || '',
          pickUpPointGeom: tour.pickupCoordinates ?
            [tour.pickupCoordinates.lon || 0, tour.pickupCoordinates.lat || 0] :
            [0, 0],
          endPoint: tour.endPoint || '',
          endPointGeom: tour.endCoordinates ?
            [tour.endCoordinates.lon || 0, tour.endCoordinates.lat || 0] :
            [0, 0],
          additionalInfo: tour.additionalInformation || '',
          cancelPolicy: tour.cancellationPolicy || '',
          contact: '+84 987 654 321', // TODO: Get from tour data
          startDate: tour.startDate ? new Date(tour.startDate) : new Date(),
          endDate: tour.endDate ? new Date(tour.endDate) : new Date(),
          maxBooking: 5, // TODO: Get from tour data
          region: tour.province?.region || '',
          isActive: tour.isActive !== undefined ? tour.isActive : true,
          createdAt: tour.createdAt ? new Date(tour.createdAt) : new Date(),
          updatedAt: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
          createdBy: 'admin', // TODO: Get from tour data
          tourStops,
          ticketPrices,
          reviews,
          rating: tour.rating || 0,
          reviewCount: tour.reviewCount || 0,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching tour detail:', error);
      return null;
    }
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
    try {
      const response = await apiClient.get<TourResponse>(API_ENDPOINTS.tours.list, {
        params: {
          ...params,
          provinceId: params.location,
        }
      });

      if (response.success && response.data) {
        return response.data.tours.map((tour) => ({
          id: tour.id,
          title: tour.title,
          description: tour.description,
          image: tour.image || '/placeholder.svg',
          price: tour.price,
          duration: tour.duration,
          location: tour.location,
          rating: tour.rating,
          reviewCount: tour.reviewCount,
          category: tour.category,
          status: tour.status,
          maxParticipants: tour.maxParticipants,
          availableSpots: tour.availableSpots,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching tours:', error);
      return [];
    }
  },

  // Get all categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          categories: string[];
        };
      }>(API_ENDPOINTS.tours.categories);

      if (response.success && response.data) {
        return response.data.categories || [];
      }

      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
};

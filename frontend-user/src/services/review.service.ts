import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';

export interface CreateTourReviewRequest {
    tourId: string;
    rate: number;
    content: string;
    images?: string[]; // Array of image URLs
}

export interface CreateAttractionReviewRequest {
    attractionId: string;
    rate: number;
    content: string;
    images?: string[]; // Array of image URLs
}

export interface ReviewResponse {
    reviewId: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    rating: number;
    content: string;
    images: string[];
    likesCount: number;
    liked: boolean;
    date: string;
    updatedAt: string;
}

export interface ReviewsResponse {
    reviews: ReviewResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    averageRating: number;
}

export const reviewService = {
    // Create a review for a tour
    async createTourReview(data: CreateTourReviewRequest): Promise<ReviewResponse> {
        try {
            const response = await apiClient.post<{ success: boolean; message: string; data: ReviewResponse }>(
                API_ENDPOINTS.reviews.createTour(data.tourId),
                {
                    rate: data.rate,
                    content: data.content,
                    images: data.images || [],
                }
            );

            if (response.success && response.data) {
                return response.data;
            }

            throw new Error(response.message || 'Failed to create review');
        } catch (error: any) {
            console.error('Error creating tour review:', error);
            throw error;
        }
    },

    // Create a review for an attraction
    async createAttractionReview(data: CreateAttractionReviewRequest): Promise<ReviewResponse> {
        try {
            const response = await apiClient.post<{ success: boolean; message: string; data: ReviewResponse }>(
                API_ENDPOINTS.reviews.createAttraction(data.attractionId),
                {
                    rate: data.rate,
                    content: data.content,
                    images: data.images || [],
                }
            );

            if (response.success && response.data) {
                return response.data;
            }

            throw new Error(response.message || 'Failed to create review');
        } catch (error: any) {
            console.error('Error creating attraction review:', error);
            throw error;
        }
    },

    // Get reviews for a tour
    async getTourReviews(
        tourId: string,
        params?: {
            page?: number;
            limit?: number;
            sortBy?: string;
            order?: 'asc' | 'desc';
        }
    ): Promise<ReviewsResponse> {
        try {
            const response = await apiClient.get<{ success: boolean; message: string; data: ReviewsResponse }>(
                API_ENDPOINTS.reviews.getTourReviews(tourId),
                { params }
            );

            if (response.success && response.data) {
                return response.data;
            }

            throw new Error(response.message || 'Failed to get reviews');
        } catch (error: any) {
            console.error('Error getting tour reviews:', error);
            throw error;
        }
    },

    // Get reviews for an attraction
    async getAttractionReviews(
        attractionId: string,
        params?: {
            page?: number;
            limit?: number;
            sortBy?: string;
            order?: 'asc' | 'desc';
        }
    ): Promise<ReviewsResponse> {
        try {
            const response = await apiClient.get<{ success: boolean; message: string; data: ReviewsResponse }>(
                API_ENDPOINTS.reviews.getAttractionReviews(attractionId),
                { params }
            );

            if (response.success && response.data) {
                return response.data;
            }

            throw new Error(response.message || 'Failed to get reviews');
        } catch (error: any) {
            console.error('Error getting attraction reviews:', error);
            throw error;
        }
    },

    // Like/Unlike a tour review
    async likeTourReview(reviewId: string): Promise<{ likesCount: number; liked: boolean }> {
        try {
            const response = await apiClient.post<{ success: boolean; message: string; data: { likesCount: number; liked: boolean } }>(
                API_ENDPOINTS.reviews.likeTourReview(reviewId)
            );

            if (response.success && response.data) {
                return response.data;
            }

            throw new Error(response.message || 'Failed to like review');
        } catch (error: any) {
            console.error('Error liking tour review:', error);
            throw error;
        }
    },

    // Like/Unlike an attraction review
    async likeAttractionReview(reviewId: string): Promise<{ likesCount: number; liked: boolean }> {
        try {
            const response = await apiClient.post<{ success: boolean; message: string; data: { likesCount: number; liked: boolean } }>(
                API_ENDPOINTS.reviews.likeAttractionReview(reviewId)
            );

            if (response.success && response.data) {
                return response.data;
            }

            throw new Error(response.message || 'Failed to like review');
        } catch (error: any) {
            console.error('Error liking attraction review:', error);
            throw error;
        }
    },
};


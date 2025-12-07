const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
import { Attraction } from "@/global.types";

export interface ProvinceResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface Province {
    id: string;
    name: string;
    slug: string;
    image: string;
    images?: string[];
    region: string;
    description: string;
    point: {
        long: number;
        lat: number;
    };
}

class ProvinceAPI {
    // Get all provinces
    static async getProvinces(): Promise<Province[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/provinces`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Get provinces API error:', errorData);
                return [];
            }

            const result: ProvinceResponse = await response.json();

            if (result.success && result.data) {
                return result.data.map((province: any) => ({
                    id: province.id || province.provinceId || '',
                    name: province.name || '',
                    slug: province.slug || province.id?.toLowerCase().replace(/\s+/g, '-') || '',
                    image: province.image || (province.images && province.images.length > 0 ? province.images[0] : '/placeholder.svg'),
                    images: province.images || [],
                    region: province.region || '',
                    description: province.description || '',
                    point: province.point || { long: 0, lat: 0 },
                }));
            }

            return [];
        } catch (error) {
            console.error('Get provinces API error:', error);
            return [];
        }
    }

    // Get province by slug
    static async getProvinceBySlug(slug: string): Promise<Province | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/provinces/${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Get province by slug API error:', errorData);
                return null;
            }

            const result: ProvinceResponse = await response.json();

            if (result.success && result.data) {
                const province = result.data;
                return {
                    id: province.id || province.provinceId || '',
                    name: province.name || '',
                    slug: province.slug || province.id?.toLowerCase().replace(/\s+/g, '-') || '',
                    image: province.image || (province.images && province.images.length > 0 ? province.images[0] : '/placeholder.svg'),
                    images: province.images || [],
                    region: province.region || '',
                    description: province.description || '',
                    point: province.point || { long: 0, lat: 0 },
                };
            }

            return null;
        } catch (error) {
            console.error('Get province by slug API error:', error);
            return null;
        }
    }

    // Get tours by province ID
    static async getToursByProvince(provinceId: string, page: number = 1, limit: number = 10, sortBy: string = 'price-asc'): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/provinces/${provinceId}/tours?page=${page}&limit=${limit}&sortBy=${sortBy}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Get tours by province API error:', errorData);
                return { data: [], pagination: {} };
            }

            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            }
            return { data: [], pagination: {} };
        } catch (error) {
            console.error('Get tours by province API error:', error);
            return { data: [], pagination: {} };
        }
    }


    // Get attractions by province ID
    static async getAttractionsByProvince(provinceId: string): Promise<Attraction[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/provinces/${provinceId}/attractions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Get attractions by province API error:', errorData);
                return [];
            }

            const result = await response.json();
            if (result.success && result.data) {
                return result.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    category: item.category,
                    image: item.image,
                    images: item.images,
                    location: {
                        province: '', // Placeholder as backend doesn't return this yet
                        slug: item.slug,
                        address: item.address,
                        coordinates: { lat: 0, lng: 0 }
                    },
                    reviewInfo: {
                        rating: item.rating,
                        count: item.reviewCount
                    },
                    slug: item.slug,
                    tours: []
                }));
            }
            return [];
        } catch (error) {
            console.error('Get attractions by province API error:', error);
            return [];
        }
    }

    // Get reviews by province ID
    static async getReviewsByProvince(provinceId: string, page: number = 1, limit: number = 10): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/provinces/${provinceId}/reviews?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Get reviews by province API error:', errorData);
                return { data: [], pagination: {} };
            }

            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            }
            return { data: [], pagination: {} };
        } catch (error) {
            console.error('Get reviews by province API error:', error);
            return { data: [], pagination: {} };
        }
    }

    // Get weather data (Climate API)
    static async getWeather(lat: number, long: number, startDate: string, endDate: string): Promise<any> {
        try {
            // Open-Meteo Climate API for long-term averages
            // Using CMCC_CM2_VHR4 model for high resolution data
            const response = await fetch(
                `https://climate-api.open-meteo.com/v1/climate?latitude=${lat}&longitude=${long}&start_date=${startDate}&end_date=${endDate}&models=CMCC_CM2_VHR4&daily=temperature_2m_max,temperature_2m_min&disable_bias_correction=true`,
                {
                    method: 'GET',
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Get weather API error:', errorText);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Get weather API error:', error);
            return null;
        }
    }
    // Get 7-day weather forecast
    static async getForecast(lat: number, long: number): Promise<any> {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&hourly=temperature_2m,precipitation,weathercode&timezone=auto&forecast_days=7`,
                {
                    method: 'GET',
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Get forecast API error:', errorText);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Get forecast API error:', error);
            return null;
        }
    }
}

export default ProvinceAPI;


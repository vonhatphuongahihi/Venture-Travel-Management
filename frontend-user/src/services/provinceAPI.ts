const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
}

export default ProvinceAPI;


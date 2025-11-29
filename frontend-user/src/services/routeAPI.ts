const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface RoutePoint {
    pointId: string;
    latitude: number;
    longitude: number;
    type: 'pickup' | 'stop' | 'end';
    stopOrder?: number;
    attractionName?: string;
}

export interface RouteSegment {
    from: RoutePoint;
    to: RoutePoint;
    coordinates: Array<{ longitude: number; latitude: number }>;
    hasDetailedRoute: boolean;
}

export interface TourRouteResponse {
    success: boolean;
    message?: string;
    data?: {
        tourId: string;
        tourName: string;
        routePoints: RoutePoint[];
        routeSegments: RouteSegment[];
        fullRoute: Array<{ longitude: number; latitude: number }>;
        totalPoints: number;
    };
}

class RouteAPI {
    /**
     * Get route for a tour with all stops
     */
    static async getTourRoute(tourId: string): Promise<TourRouteResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/routes/tour/${tourId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
            console.error('Get tour route API error:', error);
            return {
                success: false,
                message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
            };
        }
    }

    /**
     * Get route between two specific points
     */
    static async getRouteBetweenPoints(
        startPointId: string,
        endPointId: string
    ): Promise<{
        success: boolean;
        message?: string;
        data?: {
            arcId?: string;
            hasDetailedRoute: boolean;
            coordinates: Array<{ longitude: number; latitude: number }>;
            totalPoints?: number;
        };
    }> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/routes/between-points?startPointId=${startPointId}&endPointId=${endPointId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    message: errorData.message || `HTTP Error: ${response.status}`,
                };
            }

            return response.json();
        } catch (error) {
            console.error('Get route between points API error:', error);
            return {
                success: false,
                message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
            };
        }
    }
}

export default RouteAPI;


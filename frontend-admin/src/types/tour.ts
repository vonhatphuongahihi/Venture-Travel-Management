export interface PointCoordinates {
    latitude: number;
    longitude: number;
}

export interface TourStop {
    attractionId: string;
    notes?: string;
    details?: string;
}

export interface PriceCategory {
    name: string;
    categoryId: string;
    description?: string;
    price: number;
    quantity: number;
}

export interface TicketType {
    id?: string;
    name: string;
    quantity: number;
    notes?: string;
    prices: PriceCategory[];
}

export interface Attraction {
    attractionId: string;
    name: string;
    address: string;
    description: string;
    province: {
        provinceId: string;
        name: string;
    };
    point: {
        pointId: string;
        latitude: number;
        longitude: number;
    };
}

export interface PriceCategoryData {
    categoryId: string;
    name: string;
    description?: string;
}

export interface Province {
    provinceId: string;
    name: string;
    code: string;
}

export interface TourFormMetadata {
    attractions: Attraction[];
    priceCategories: PriceCategoryData[];
    provinces: Province[];
    attractionCategories: string[];
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface CreateTourRequest {
    name: string;
    about: string;
    ageRange: string;
    maxGroupSize: number;
    duration: string;
    languages: string[];
    categories: string[];
    highlights?: string[];
    inclusions: string[];
    exclusions: string[];
    expectations: string;
    cancellationPolicy: string;
    additionalInformation?: string;
    pickupPoint: string;
    pickupDetails: string;
    pickupPointCoordinates: PointCoordinates;
    pickupAreaRadius: number;
    endPoint?: string;
    endPointCoordinates?: PointCoordinates;
    startDate: Date;
    endDate: Date;
    images: string[];
    tourStops: TourStop[];
    ticketTypes: TicketType[];
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface TourFilters {
    page?: number;
    limit?: number;
    categories?: string[]; // Thay đổi: Mảng categories
    search?: string;
    sortBy?: "newest" | "popular" | "topRated" | "bestPrice";
}

export interface TourWithStats {
    tourId: string;
    name: string;
    images: string[];
    about: string;
    createdAt: Date;
    avgRating: number;
    totalBookings: number;
    reviewCount: number;
    categories: string[];
    minPrice: number;
}

export interface TourListResponse {
    tours: TourWithStats[];
    total: number;
}

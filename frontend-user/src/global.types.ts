export interface ShortTourInfo {
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
  status: "upcoming" | "ongoing" | "completed";
  maxParticipants: number;
  availableSpots: number;
  start_point: {
    lat: number;
    long: number;
  };
}

export interface Tour {
  tourId: string;
  name: string;
  images: string[];
  about: string;
  ageRange: string;
  maxGroupSize: number;
  duration: string;
  languages: string[];
  categories: string[];
  expectations: string;
  pickupPoint: string;
  pickupPointGeom: string;
  pickupDetails: string;
  pickupAreaGeom: string;
  endPoint?: string;
  endPointGeom?: string;
  additionalInformation?: string;
  cancellationPolicy: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  // Relations
  favoriteTours?: FavoriteTour[];
  ticketTypes?: TicketType[];
  reviews?: TourReview[];
  tourStops?: TourStop[];
}

export interface FavoriteTour {
  favoriteId: string;
  userId: string;
  tourId: string;
  createdAt: string; // ISO date string
  tour?: Tour;
}

export interface TicketType {
  ticketTypeId: string;
  tourId: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  tour?: Tour;
}

export interface TourReview {
  reviewId: string;
  userId: string;
  tourId: string;
  rate: number;
  rating?: number; // API response uses 'rating'
  content: string;
  images: string[];
  createdAt: string; // ISO date string
  date?: string; // API response uses 'date'
  updatedAt?: string; // ISO date string
  likes: string[];
  // Relations
  tour?: Tour;
  user?: {
    id?: string; // API response uses 'id'
    userId?: string;
    name: string;
    avatar?: string;
  };
}

export interface TourStop {
  tourStopId: string;
  tourId: string;
  attractionId: string;
  stopOrder: number;
  tour?: Tour;
  attraction?: Attraction;
}

export interface Attraction {
  id: string;
  name: string;
  images: string[];
  address: string;
  description: string;
  category: string;
  provinceId: string;
  province: Province;
  tourCount: number;
  rating: number;
  reviewCount: number;
  coordinates: {
    lat: number;
    lon: number;
  };
  tours?: ShortTourInfo[];
  attractionReviews?: AttractionReview[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Province {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  description?: string;
  region?: string;
  coordinates?: {
    lat: number;
    long: number;
  };
  point?: {
    long: number;
    lat: number;
  };
}

export interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  date: string; // ISO date string
  targetId: string; // ID of the tour or attraction being reviewed
  targetType: "tour" | "attraction";
  tour?: {
    id: string;
    title: string;
    image: string;
  };
  images: string[] | null;
}

export interface AttractionReview {
  reviewId: string;
  userId: string;
  attractionId: string;
  rate: number;
  rating?: number; // API response uses 'rating'
  content: string;
  images: string[];
  createdAt: string; // ISO date string
  date?: string; // API response uses 'date'
  updatedAt?: string; // ISO date string
  likes: string[];
  // Relations
  attraction?: Attraction;
  user?: {
    id?: string; // API response uses 'id'
    userId?: string;
    name: string;
    avatar?: string;
  };
}

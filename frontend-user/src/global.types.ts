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
  status: "upcoming" | "ongoing" | "completed";
  maxParticipants: number;
  availableSpots: number;
}

export interface Attraction {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  images?: string[]; // Additional images for gallery
  location: {
    province: string;
    slug: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  reviewInfo: {
    rating: number;
    count: number;
  };
  slug?: string;
  tours?: Tour[]; // Related tours for this attraction
}

export interface Province {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  point: {
    long: number;
    lat: number;
  };
}

export interface Review {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  date: string; // ISO date string
  targetId: number; // ID of the tour or attraction being reviewed
  targetType: "tour" | "attraction";
  tour?: {
    id: string;
    title: string;
    image: string;
  };
  images: string[] | null;
}

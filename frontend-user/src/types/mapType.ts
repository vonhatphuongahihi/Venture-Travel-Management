export interface TourType {
  tourId?: string;
  name: string;
  description: string;
  region: string;
  coords: [number, number][];
  image?: string;
  location?: string;
}

export interface DestinationType {
  name: string;
  description: string;
  region: string;
  coords: [number, number];
  image?: string;
  address?: string;
}

export interface EventType {
  name: string;
  description: string;
  region: string;
  coords: [number, number];
}

export interface HotelType {
  name: string;
  description: string;
  region: string;
  coords: [number, number];
}

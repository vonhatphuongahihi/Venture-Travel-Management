export interface PointCoordinates {
  latitude: number;
  longitude: number;
}

export interface CreateTourStopRequest {
  attractionId: string;
  notes?: string;
  details?: string;
}

export interface CreatePriceCategoryRequest {
  name: string;
  categoryId: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface CreateTicketTypeRequest {
  id?: string;
  name: string;
  quantity: number;
  notes?: string;
  prices: CreatePriceCategoryRequest[];
}

export interface CreateTourRequest {
  provinceId: string;
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
  tourStops: CreateTourStopRequest[];
  ticketTypes: CreateTicketTypeRequest[];
}
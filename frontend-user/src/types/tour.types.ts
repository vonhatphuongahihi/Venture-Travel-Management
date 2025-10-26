// Tour related types
export interface Tour {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  description: string;
  destination: string;
  departurePoint: string;
  departureTime: string;
  returnTime: string;
  dressCode: string;
  images: string[];
  included: string[];
  excluded: string[];
}

export interface BookingFormData {
  name: string;
  email: string;
  confirmEmail: string;
  phone: string;
  date: string;
  tickets: number;
  ticketType: 'adult' | 'child' | '';
  note: string;
}

export interface PaymentFormData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  promoCode: string;
}

export interface OrderSummary {
  tourName: string;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

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

export interface PriceCategoryBooking {
  categoryId: string;
  quantity: number;
}

export interface BookingFormData {
  user_id: string;
  ticket_type_id: string;
  pickup_address: string;
  departure_date: string;
  name: string;
  phone: string;
  email: string;
  total_price: number;
  special_requests?: string;
  priceCategories: PriceCategoryBooking[];
}

export interface BookingResponse {
  bookingId: string;
  userId: string;
  ticketTypeId: string;
  pickupAddress: string;
  departureDate: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  paymentType: string;
  totalPrice: number;
  specialRequests: string | null;
  createdAt: string;
  updatedAt: string;
  bookingDetails: Array<{
    bookingDetailId: string;
    ticketPriceId: string;
    quantity: number;
    totalPrice: number;
  }>;
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

export interface BookingHistoryItem {
  bookingId: string;
  tourId: string;
  tourName: string;
  tourImage: string | null;
  bookingDate: string;
  startDate: string;
  status: "processing" | "completed" | "cancelled";
  totalPrice: number;
  participants: number;
  pickupAddress: string;
  name: string;
  phone: string;
  email: string;
  paymentType: string;
  specialRequests: string | null;
  ticketTypeName: string;
  bookingDetails: Array<{
    bookingDetailId: string;
    quantity: number;
    totalPrice: number;
    categoryName: string;
    price: number;
  }>;
}

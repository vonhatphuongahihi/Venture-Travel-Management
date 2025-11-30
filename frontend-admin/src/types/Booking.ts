export type BookingDetail = {
  bookingDetailId: string;
  quantity: number;
  totalPrice: number;
  ticketTypeId?: string;    // thêm optional
  ticketTypeName?: string;  // thêm optional
};

export type BookingStatus = "completed" | "pending" | "canceled";
export type PaymentType = "cash" | "bank" | "momo";

export type Booking = {
  bookingId: string;
  userId: string;
  ticketTypeId: string;
  ticketTypeName?: string;  // giữ optional để tương thích
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  departureDate: string;
  status: BookingStatus;
  paymentType: PaymentType;
  totalPrice: number;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
  bookingDetails: BookingDetail[];
};

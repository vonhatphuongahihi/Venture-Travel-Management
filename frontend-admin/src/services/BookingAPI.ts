
import { axiosClient } from "@/configs/axiosClient";

export type PriceCategory = {
  categoryId: string;
  name: string;
  description: string | null;
};

export type BookingDetail = {
  bookingDetailId: string;
  ticketPriceId: string;
  ticketTypeName: string;
  quantity: number;
  totalPrice: number;
  price: number;
  priceCategory: PriceCategory | null;
};

export type Tour = {
  tourId: string;
  name: string;
  images: string[];
  duration: string;
  about: string;
};

export type TicketType = {
  ticketTypeId: string;
  name: string;
  notes: string | null;
};

export type Booking = {
  bookingId: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  departureDate: string;
  status: "pending" | "completed" | "canceled" | "cancelled" | "processing";
  paymentType: "cash" | "bank" | "momo" | "unpaid";
  totalPrice: number;
  specialRequests: string | null;
  createdAt: string;
  updatedAt: string;
  tour: Tour | null;
  ticketType: TicketType;
  bookingDetails: BookingDetail[];
};

export type TourOption = {
  tourId: string;
  name: string;
};

export type TicketTypeOption = {
  ticketTypeId: string;
  name: string;
  notes: string | null;
  ticketPrices: {
    ticketPriceId: string;
    categoryId: string;
    categoryName: string;
    price: number;
    quantity: number;
    notes: string | null;
    priceCategory: {
      categoryId: string;
      name: string;
      description: string | null;
    };
  }[];
};

export class BookingAPI {
  static prefix = "/bookings";

  // --- GET tất cả bookings ---
  static async getBookings(): Promise<Booking[]> {
    const { data } = await axiosClient.get(`${BookingAPI.prefix}`);
    return data.data; // backend trả { success, data }
  }

  // --- GET booking theo ID ---
  static async getBooking(id: string): Promise<Booking> {
    const { data } = await axiosClient.get(`${BookingAPI.prefix}/${id}`);
    return data.data;
  }

  // --- CREATE booking ---
  static async createBooking(payload: Partial<Booking>): Promise<Booking> {
    // Lọc các vé đã chọn (có ticketPriceId và priceCategory)
    const validBookingDetails = payload.bookingDetails?.filter(
      (detail) => detail.ticketPriceId && detail.priceCategory?.categoryId && detail.quantity > 0
    ) || [];
    
    // Format payload cho backend
    const backendPayload: any = {
      // user_id có thể null hoặc empty - backend sẽ tự xử lý
      user_id: payload.userId || null,
      ticket_type_id: payload.ticketType?.ticketTypeId || "",
      // pickup_address có thể null hoặc empty
      pickup_address: payload.pickupAddress || null,
      // departure_date có thể null - backend sẽ dùng ngày hiện tại
      departure_date: payload.departureDate || null,
      name: payload.name || "",
      phone: payload.phone || "",
      email: payload.email || "",
      total_price: payload.totalPrice || 0,
      special_requests: payload.specialRequests || null,
      status: payload.status === "cancelled" || payload.status === "canceled" ? "cancelled" : payload.status || "pending",
      payment_type: payload.paymentType || "unpaid",
      priceCategories: validBookingDetails.map(detail => ({
        categoryId: detail.priceCategory?.categoryId || "",
        quantity: detail.quantity || 1,
      })),
    };
    
    const { data } = await axiosClient.post(`${BookingAPI.prefix}`, backendPayload);
    return data.data;
  }

  // --- UPDATE booking ---
  static async updateBooking(id: string, payload: Partial<Booking>): Promise<Booking> {
    // Format payload cho backend - bao gồm bookingDetails
    const backendPayload: any = {
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      pickupAddress: payload.pickupAddress || "",
      departureDate: payload.departureDate,
      status: payload.status,
      paymentType: payload.paymentType,
      specialRequests: payload.specialRequests || null,
      totalPrice: payload.totalPrice || 0,
      ticketTypeId: payload.ticketType?.ticketTypeId,
      // Gửi bookingDetails để backend update - chỉ gửi các vé đã chọn
      bookingDetails: payload.bookingDetails
        ?.filter(detail => detail.ticketPriceId && detail.quantity > 0)
        .map(detail => ({
          ticketPriceId: detail.ticketPriceId,
          quantity: detail.quantity,
          price: detail.price,
        })) || [],
    };
    
    const { data } = await axiosClient.patch(`${BookingAPI.prefix}/${id}`, backendPayload);
    return data.data;
  }

  // --- UPDATE booking status only ---
  static async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const { data } = await axiosClient.patch(`${BookingAPI.prefix}/${id}`, { status });
    return data.data;
  }

  // --- DELETE booking ---
  static async deleteBooking(id: string): Promise<void> {
    await axiosClient.delete(`${BookingAPI.prefix}/${id}`);
  }

  // --- GET danh sách tours đơn giản (chỉ tourId và name) ---
  static async getTours(): Promise<TourOption[]> {
    const { data } = await axiosClient.get("/tours", {
      params: { limit: 1000, isActive: "true" }
    });
    // Backend trả về { success, data: { tours: [...], pagination: {...} } }
    if (data.success && data.data?.tours) {
      return data.data.tours.map((tour: any) => ({
        tourId: tour.id || tour.tourId,
        name: tour.title || tour.name,
      }));
    }
    return [];
  }

  // --- GET thông tin đầy đủ của một tour ---
  static async getTourById(tourId: string): Promise<Tour | null> {
    try {
      const { data } = await axiosClient.get(`/tours/${tourId}`);
      if (data.success && data.data) {
        const tour = data.data;
        return {
          tourId: tour.id || tour.tourId,
          name: tour.title || tour.name,
          images: tour.images || [],
          duration: tour.duration || "",
          about: tour.about || tour.description || "",
        };
      }
      return null;
    } catch (err) {
      console.error("Error loading tour:", err);
      return null;
    }
  }

  // --- GET ticket types và prices của một tour ---
  static async getTourTicketTypes(tourId: string): Promise<TicketTypeOption[]> {
    const { data } = await axiosClient.get(`/tours/${tourId}`);
    if (data.success && data.data?.ticketTypes) {
      return data.data.ticketTypes.map((type: any) => ({
        ticketTypeId: type.ticketTypeId,
        name: type.name,
        notes: type.notes,
        ticketPrices: type.prices?.map((price: any) => ({
          ticketPriceId: price.ticketPriceId,
          categoryId: price.categoryId,
          categoryName: price.categoryName,
          price: price.price,
          quantity: price.quantity,
          notes: price.notes,
          priceCategory: {
            categoryId: price.categoryId,
            name: price.categoryName,
            description: null,
          },
        })) || [],
      }));
    }
    return [];
  }
}

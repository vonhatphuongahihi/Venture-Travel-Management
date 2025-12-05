
import { axiosClient } from "@/configs/axiosClient";

export type BookingDetail = {
  bookingDetailId: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  totalPrice: number;
};

export type Booking = {
  bookingId: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  departureDate: string;
  status: "pending" | "completed" | "canceled";
  paymentType: "cash" | "bank" | "momo";
  totalPrice: number;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
  bookingDetails: BookingDetail[];
};

export type TourOption = {
  tourId: string;
  name: string;
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
    const { data } = await axiosClient.post(`${BookingAPI.prefix}`, payload);
    return data.data;
  }

  // --- UPDATE booking ---
  static async updateBooking(id: string, payload: Partial<Booking>): Promise<Booking> {
    const { data } = await axiosClient.put(`${BookingAPI.prefix}/${id}`, payload);
    return data.data;
  }

  // --- DELETE booking ---
  static async deleteBooking(id: string): Promise<void> {
    await axiosClient.delete(`${BookingAPI.prefix}/${id}`);
  }

  
 
}

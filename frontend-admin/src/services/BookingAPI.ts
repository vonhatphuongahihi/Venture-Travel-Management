// import type { Booking } from "@/components/BookingList";
// import { axiosClient } from "@/configs/axiosClient";

// export type TourOption = {
//   tourId: string;
//   name: string;
// };

// export class BookingAPI {
//   static prefix = "/bookings";

//   static async getBookings(): Promise<Booking[]> {
//     const { data } = await axiosClient.get(`${BookingAPI.prefix}`);
//     return data.data; // data.data vì backend trả { success, data }
//   }

//   static async getBooking(id: string): Promise<Booking> {
//     const { data } = await axiosClient.get(`${BookingAPI.prefix}/${id}`);
//     return data.data;
//   }

//   static async createBooking(payload: Partial<Booking>): Promise<Booking> {
//     const { data } = await axiosClient.post(`${BookingAPI.prefix}`, payload);
//     return data.data;
//   }

//   static async updateBooking(id: string, payload: Partial<Booking>): Promise<Booking> {
//     const { data } = await axiosClient.put(`${BookingAPI.prefix}/${id}`, payload);
//     return data.data;
//   }

//   static async deleteBooking(id: string): Promise<void> {
//     await axiosClient.delete(`${BookingAPI.prefix}/${id}`);
//   }

//   // 🟪 Get tours
// static async getTours(): Promise<TourOption[]> {
//     const { data } = await axiosClient.get(BookingAPI.prefix + "/tours");
//     return data.data; // backend trả { success, data }
//   }
// }

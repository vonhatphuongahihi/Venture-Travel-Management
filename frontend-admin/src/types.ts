export type BookingStatus = "completed" | "pending" | "canceled";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface AbstractResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  limit: number;
}

export type Booking = {
  id: string;
  customerName: string;
  customerAvatarUrl: string;
  tourTitle: string;
  bookedAt: string;
  startAt: string;
  status: BookingStatus;
  email: string;
  phone: string;
  address: string;
  quantity: number;
  paymentStatus: PaymentStatus;
  tourSlug: string;
  note?: string;
};

// Users interfaces
export type Role = "ADMIN" | "USER" | "GUEST";
export type AuthProvider = "LOCAL" | "GOOGLE";

export interface GetUserRequest {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

export interface User {
  user_id: string;
  email: string;
  reset_token: string | null;
  google_id: string | null;
  name: string;
  password: string | null;
  phone: string | null;
  address: string | null;
  profile_photo: string | null;
  date_of_birth: Date | null;
  gender: string | null;
  role: Role;
  is_active: boolean;
  is_verified: boolean;
  verification_token: string | null;
  verification_expires: Date | null;
  reset_expires: Date | null;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
  auth_provider: AuthProvider;
}

export interface GetUserStatisticsResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersInMonth: number;
}

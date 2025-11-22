// API configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// API endpoints
export const API_ENDPOINTS = {
  // Tours
  tours: {
    list: "/tours",
    detail: (id: string) => `/tours/${id}`,
    search: "/tours/search",
  },
  // Bookings
  bookings: {
    create: "/bookings",
    list: "/bookings",
    detail: (id: string) => `/bookings/${id}`,
    cancel: (id: string) => `/bookings/${id}/cancel`,
  },
  // Payments
  payments: {
    process: "/payments/process",
    validatePromo: "/payments/promo/validate",
  },
  // User
  user: {
    profile: "/user/profile",
    bookings: "/user/bookings",
  },
};

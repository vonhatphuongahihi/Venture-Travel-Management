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
    categories: "/tours/categories",
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
  // Reviews
  reviews: {
    createTour: (tourId: string) => `/reviews/tours/${tourId}`,
    getTourReviews: (tourId: string) => `/reviews/tours/${tourId}`,
    updateTourReview: (reviewId: string) => `/reviews/tours/${reviewId}`,
    deleteTourReview: (reviewId: string) => `/reviews/tours/${reviewId}`,
    likeTourReview: (reviewId: string) => `/reviews/tours/${reviewId}/like`,
    createAttraction: (attractionId: string) => `/reviews/attractions/${attractionId}`,
    getAttractionReviews: (attractionId: string) => `/reviews/attractions/${attractionId}`,
    updateAttractionReview: (reviewId: string) => `/reviews/attractions/${reviewId}`,
    deleteAttractionReview: (reviewId: string) => `/reviews/attractions/${reviewId}`,
    likeAttractionReview: (reviewId: string) => `/reviews/attractions/${reviewId}/like`,
  },
  // Upload
  upload: {
    reviewSingle: '/upload/review/single',
    reviewMultiple: '/upload/review/multiple',
  },
};

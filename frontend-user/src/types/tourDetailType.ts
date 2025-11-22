export interface TourDetail {
    id: string; //tour_id
    provinceId: string; //province_id
    title: string; // name
    description: string; //about
    images: string[]; //images
    age: string; //age_range
    maxGroup: number; //max_group_size
    duration: string;
    languages: string; //languages_spoken
    categories: string[]; //categories
    highlight?: string[]; //highlights
    inclusions: string[]; //inclusions
    exclusions: string[]; //exclusions
    expectations?: string[]; //what_to_expect
    pickUpPoint: string; //pick_up_point
    pickUpDetails: string; //pick_up_details
    pickUpPointGeom: [number, number];
    endPoint: string; //end_point
    endPointGeom: [number, number];
    additionalInfo?: string; //additional_info
    cancelPolicy: string; //cancellation_policy
    contact: string;
    startDate: Date; //start_date
    endDate: Date; //end_date
    maxBooking: number; //max_quantity_per_booking
    region: string; //Bắc, Trung, Nam
    isActive: boolean; //isActive
    createdAt: Date; //createdAt
    updatedAt: Date; //updatedAt
    createdBy: string; //created_by
}

export interface TourStop {
    stopId: string;
    tourId: string;
    attractionId: string;
    attractionName: string;
    attractionImage: string;
    attractionGeom: [number, number]; // [lng, lat]
    stopOrder: number;
    notes?: string;
    details?: string;
    createdAt: Date;
}

export interface TourRoute {
    route_id: string;
    tour_id: string;
    geom: [number, number][];
    // LineString → mảng [lng, lat]
    createdAt?: Date;
    created_at?: Date; // Support both formats
}

export interface Review {
    reviewId: string; //review_id
    userId: string; //user_id
    userName: string;
    userAvatar: string;
    targetType: string; //target_type   (tour)
    targetId: string; //target_id (id của tour)
    rate: number; //rate
    content: string; //content
    images: string[]; //images
    likesCount: number; //likes_count
    liked: boolean; //whether current user liked this review
    createdAt: Date; //created_at
    updatedAt: Date; //updatedAt
}

export interface ReviewLikes {
    reviewLikeId: string; //review_like_id
    reviewId: string; //review_id
    userId: string; //user_id
    createdAt: Date; //created_at
}

export interface TicketType { // Thường, Cao cấp, ...
  ticketTypeId: string;
  tourId: string; // FK -> tours.tour_id
  name: string;
  notes?: string;
  quantity: number;
  price: number;
  isActive: boolean;
  createdAt: Date; // ISO timestamp
}

export interface PriceCategories{ // Người lớn, trẻ em, ...
  categoryId: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface TicketPrices{
  ticketPriceId: string ;
  ticketTypeId: string ; // FK -> ticket_types.ticket_type_id
  categoryId: string ; // FK -> price_categories.category_id
  notes?: string;
  price: number;
  quantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

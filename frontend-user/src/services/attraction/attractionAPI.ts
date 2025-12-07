import { Attraction } from "@/global.types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AttractionResponse {
  success: boolean;
  message: string;
  data?:
    | Attraction
    | Attraction[]
    | {
        destinations?: Attraction[];
        attractions?: Attraction[];
        pagination?: PaginationData;
      };
}

export interface TopDestination {
  id: string;
  name: string;
  images: string[];
  image: string;
  address: string;
  description: string;
  category: string;
  provinceId: string;
  province?: {
    id: string;
    name: string;
    region?: string;
  };
  tourCount: number;
  rating: number;
  reviewCount: number;
}

class AttractionAPI {
  // Get top destinations
  static async getTopDestinations(
    limit: number = 5
  ): Promise<TopDestination[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/attractions/top?limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Get top destinations API error:", errorData);
        return [];
      }

      const result: AttractionResponse = await response.json();

      if (
        result.success &&
        result.data &&
        typeof result.data === "object" &&
        "destinations" in result.data &&
        result.data.destinations
      ) {
        return result.data.destinations.map((destination) => ({
          id: destination.id || "",
          name: destination.name || "",
          images: destination.images || [],
          image:
            destination.images && destination.images.length > 0
              ? destination.images[0]
              : "/placeholder.svg",
          address: destination.address || "",
          description: destination.description || "",
          category: destination.category || "",
          provinceId: destination.provinceId || "",
          province: destination.province,
          tourCount: destination.tourCount || 0,
          rating: destination.rating || 0,
          reviewCount: destination.reviewCount || 0,
        }));
      }

      return [];
    } catch (error) {
      console.error("Get top destinations API error:", error);
      return [];
    }
  }

  // Get all attractions
  static async getAttractions(params?: {
    page?: number;
    limit?: number;
    provinceId?: string;
    category?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{ attractions: Attraction[]; pagination: PaginationData }> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(
        `${API_BASE_URL}/attractions?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Get attractions API error:", errorData);
        return {
          attractions: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      }

      const result: AttractionResponse = await response.json();

      if (
        result.success &&
        result.data &&
        typeof result.data === "object" &&
        "attractions" in result.data &&
        result.data.attractions
      ) {
        return {
          attractions: result.data.attractions.map((attraction) => ({
            id: attraction.id || "",
            name: attraction.name || "",
            images: attraction.images || [],
            address: attraction.address || "",
            description: attraction.description || "",
            category: attraction.category || "",
            provinceId: attraction.provinceId || "",
            province: attraction.province,
            tourCount: attraction.tourCount || 0,
            rating: attraction.rating || 0,
            reviewCount: attraction.reviewCount || 0,
            coordinates: attraction.coordinates || { lat: 0, lon: 0 },
            tours: attraction.tours || [],
            attractionReviews: attraction.attractionReviews || [],
            createdAt: attraction.createdAt || new Date().toISOString(),
            updatedAt: attraction.updatedAt || new Date().toISOString(),
          })),
          pagination: result.data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        };
      }

      return {
        attractions: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    } catch (error) {
      console.error("Get attractions API error:", error);
      return {
        attractions: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  }

  // Get attraction by ID
  static async getAttractionById(id: string): Promise<Attraction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/attractions/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Get attraction by ID API error:", errorData);
        return null;
      }

      const result: AttractionResponse = await response.json();

      if (result.success && result.data && !Array.isArray(result.data)) {
        return result.data as Attraction;
      }

      return null;
    } catch (error) {
      console.error("Get attraction by ID API error:", error);
      return null;
    }
  }
}

export default AttractionAPI;

import { axiosClient } from "@/configs/axiosClient";


export interface AbstractResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Province {
  provinceId: string;
  name: string;
}

export interface AttractionReview {
  reviewId: string;
  userId: string;
  attractionId: string;
  rate: number;
  content: string;
  images: string[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
  
}


export interface Attraction {
  attractionId: string;
  name: string;
  images: string[];
  address: string;
  description: string;
  geom: string;
  provinceId: string;
  province?: Province; // thêm trường này để join bảng Province
  category: string;
  createdAt: string;
  updatedAt: string;
  reviews?: AttractionReview[];
}

export interface GetAttractionRequest {
  page?: number;
  limit?: number;
  provinceId?: string;
  category?: string;
  search?: string;
}

export interface CreateAttractionRequest {
  name: string;
  images: string[];
  address: string;
  description: string;
  geom: string;
  provinceId: string;
  category: string;
}

export interface UpdateAttractionRequest
  extends Partial<CreateAttractionRequest> {}

// =========================
//  API CLASS
// =========================

export class AttractionAPI {
  static prefix = "/admin/attractions";

  // 🟦 Get list + filters
  static async getAttractions(
    filterParams: GetAttractionRequest
  ): Promise<AbstractResponse<PaginatedResponse<Attraction>>> {
    const { data } = await axiosClient.get(`${this.prefix}`, {
      params: filterParams,
    });
    return data;
  }

  // 🟪 Get provinces
  static async getProvinces(): Promise<AbstractResponse<Province[]>> {
    const { data } = await axiosClient.get(`${this.prefix}/provinces`);
    return data;
  }


  // 🟩 Get detail
  static async getAttractionById(
    attractionId: string
  ): Promise<AbstractResponse<Attraction>> {
    const { data } = await axiosClient.get(`${this.prefix}/${attractionId}`);
    return data;
  }

  // 🟧 Create
  // 🟧 Create (multipart/form-data)
static async createAttraction(formData: FormData): Promise<AbstractResponse<Attraction>> {
  const { data } = await axiosClient.post(`${this.prefix}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

  // 🟨 Update
  static async updateAttraction(
    attractionId: string,
    payload: UpdateAttractionRequest
  ): Promise<AbstractResponse<Attraction>> {
    const { data } = await axiosClient.put(`${this.prefix}/${attractionId}`, payload);
    return data;
  }

  // 🟥 Delete
  static async deleteAttraction(
    attractionId: string
  ): Promise<AbstractResponse<null>> {
    const { data } = await axiosClient.delete(`${this.prefix}/${attractionId}`);
    return data;
  }
}

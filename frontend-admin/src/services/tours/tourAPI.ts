import { axiosClient } from "@/configs/axiosClient";
import type { ApiResponse, CreateTourRequest, TourFilters, TourFormMetadata, TourListResponse } from "@/types/tour";

export class TourAPI {
    static basePath = "/admin/tours";

    static async getTourFormMetadata(provinceId?: string): Promise<TourFormMetadata> {
        const params = provinceId ? { provinceId } : {};

        const response = await axiosClient.get<ApiResponse<TourFormMetadata>>(
            `${this.basePath}/metadata`,
            { params }
        );

        return response.data.data;
    }

    static async createTour(data: CreateTourRequest): Promise<any> {
        const response = await axiosClient.post<ApiResponse<any>>(this.basePath, data);

        return response.data.data;
    }

    static uploadTourImages = async (
        files: File[]
    ): Promise<{
        images: Array<{ url: string; publicId: string }>;
    }> => {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("images", file);
        });

        const response = await axiosClient.post(`${this.basePath}/images`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.data;
    };

    static  getTours = async (filters?: TourFilters): Promise<TourListResponse> => {
        const response = await axiosClient.get<ApiResponse<TourListResponse>>(this.basePath, {
            params: filters,
        });
        return response.data.data;
    }
}

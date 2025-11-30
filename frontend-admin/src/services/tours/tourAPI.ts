import { axiosClient } from "@/configs/axiosClient";
import type { ApiResponse, CreateTourRequest, TourFormMetadata } from "@/types/tour";


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

}


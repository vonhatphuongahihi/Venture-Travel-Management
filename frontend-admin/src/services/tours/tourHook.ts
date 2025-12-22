import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TourAPI } from "./tourAPI";
import type {
    CreateTourRequest,
    TourFormMetadata,
    Attraction,
    PriceCategoryData,
    TourFilters,
} from "@/types/tour";
import type { AxiosError } from "axios";

interface UploadResponse {
    images: Array<{
        url: string;
        publicId: string;
    }>;
}

interface UploadError {
    message: string;
    details?: string;
}

export const tourKeys = {
    all: ["tours"] as const,
    lists: () => [...tourKeys.all, "list"] as const,
    list: (filters: Record<string, any>) => [...tourKeys.lists(), filters] as const,
    details: () => [...tourKeys.all, "detail"] as const,
    detail: (id: string) => [...tourKeys.details(), id] as const,
    metadata: () => [...tourKeys.all, "metadata"] as const,
};

export const useGetTourFormMetadata = () => {
    return useQuery({
        queryKey: tourKeys.metadata(),
        queryFn: () => TourAPI.getTourFormMetadata(),
        staleTime: 10 * 60 * 1000, 
    });
};

// export function useTour(tourId: string) {
//     return useQuery({
//         queryKey: tourKeys.detail(tourId),
//         queryFn: () => TourAPI.getTourById(tourId),
//         enabled: !!tourId,
//     });
// }

export const useCreateTour = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTourRequest) => TourAPI.createTour(data),
        onSuccess: (newTour) => {
            queryClient.invalidateQueries({ queryKey: tourKeys.lists() });

            queryClient.setQueryData(tourKeys.detail(newTour.tourId), newTour);
        },
        onError: (error: any) => {
            console.error("Error creating tour:", error);
        },
    });
};

export const useUploadTourImages = () => {
    return useMutation<UploadResponse, AxiosError, File[]>({
        mutationFn: (files: File[]) => TourAPI.uploadTourImages(files),
        onSuccess: (data) => {
            console.log("Upload thành công:", data);
        },
        onError: (error) => {
            console.error("Upload thất bại:", error);
        },
    });
};

export function usegetTours(filters?: TourFilters) {
  return useQuery({
    queryKey: tourKeys.list(filters || {}),
    queryFn: () => TourAPI.getTours(filters),
  });
}

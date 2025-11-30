import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TourAPI } from "./tourAPI";
import type {
    CreateTourRequest,
    TourFormMetadata,
    Attraction,
    PriceCategoryData,
} from "@/types/tour";

export const tourKeys = {
  all: ['tours'] as const,
  lists: () => [...tourKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...tourKeys.lists(), filters] as const,
  details: () => [...tourKeys.all, 'detail'] as const,
  detail: (id: string) => [...tourKeys.details(), id] as const,
  metadata: () => [...tourKeys.all, 'metadata'] as const,
};

export function useGetTourFormMetadata() {
    return useQuery({
        queryKey: tourKeys.metadata(),
        queryFn: () => TourAPI.getTourFormMetadata(),
        staleTime: 10 * 60 * 1000, // 10 minutes - metadata ít thay đổi
    });
}

// export function useTour(tourId: string) {
//     return useQuery({
//         queryKey: tourKeys.detail(tourId),
//         queryFn: () => TourAPI.getTourById(tourId),
//         enabled: !!tourId,
//     });
// }


export function useCreateTour() {
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
}

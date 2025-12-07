import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import AttractionAPI from "./attractionAPI";

export const useAttractions = (params?: {
  page?: number;
  limit?: number;
  provinceId?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["attractions", params],
    queryFn: () => AttractionAPI.getAttractions(params),
  });
};

export const useTopDestinations = (limit: number = 5) => {
  return useQuery({
    queryKey: ["topDestinations", limit],
    queryFn: () => AttractionAPI.getTopDestinations(limit),
  });
};

export const useAttraction = (id: string) => {
  return useQuery({
    queryKey: ["attraction", id],
    queryFn: () => AttractionAPI.getAttractionById(id),
    enabled: !!id,
  });
};

export const useAttractionsInfinite = (params?: {
  limit?: number;
  provinceId?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  return useInfiniteQuery({
    queryKey: ["attractions", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      AttractionAPI.getAttractions({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

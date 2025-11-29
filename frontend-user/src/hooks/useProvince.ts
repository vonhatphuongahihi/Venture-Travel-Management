import { useQuery } from "@tanstack/react-query";
import ProvinceAPI from "@/services/provinceAPI";

export const useProvince = (slug: string) => {
  return useQuery({
    queryKey: ["province", slug],
    queryFn: () => ProvinceAPI.getProvinceBySlug(slug),
    enabled: !!slug,
  });
};

export const useProvinceTours = (provinceId: string, page: number = 1, limit: number = 100) => {
  return useQuery({
    queryKey: ["province-tours", provinceId, page, limit],
    queryFn: () => ProvinceAPI.getToursByProvince(provinceId, page, limit),
    enabled: !!provinceId,
  });
};

import { useInfiniteQuery } from "@tanstack/react-query";

export const useProvinceToursInfinite = (provinceId: string, limit: number = 10, sortBy: string = 'price-asc') => {
  return useInfiniteQuery({
    queryKey: ["province-tours-infinite", provinceId, limit, sortBy],
    queryFn: ({ pageParam }) => ProvinceAPI.getToursByProvince(provinceId, pageParam as number, limit, sortBy),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!provinceId,
  });
};

export const useProvinceAttractions = (provinceId: string) => {
  return useQuery({
    queryKey: ["province-attractions", provinceId],
    queryFn: () => ProvinceAPI.getAttractionsByProvince(provinceId),
    enabled: !!provinceId,
  });
};

export const useProvinceReviews = (provinceId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["province-reviews", provinceId, page, limit],
    queryFn: () => ProvinceAPI.getReviewsByProvince(provinceId, page, limit),
    enabled: !!provinceId,
  });
};

export const useProvinceWeather = (lat: number, long: number) => {
  return useQuery({
    queryKey: ["province-weather", lat, long],
    queryFn: () => {
      // Fetch 20 years of data for climatological averages
      const startDate = "2005-01-01";
      const endDate = "2025-12-31";
      
      return ProvinceAPI.getWeather(lat, long, startDate, endDate);
    },
    enabled: !!lat && !!long,
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days (climate data doesn't change often)
  });
};

export const useProvinceForecast = (lat: number, long: number) => {
  return useQuery({
    queryKey: ["province-forecast", lat, long],
    queryFn: () => ProvinceAPI.getForecast(lat, long),
    enabled: !!lat && !!long,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

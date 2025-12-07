import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProvinceService {
   static async getProvinces() {
      const provinces = await prisma.province.findMany();
      return provinces;
   }

   static async getProvinceBySlug(slug: string) {
      const province = await prisma.province.findUnique({
         where: {
            provinceId: slug,
         },
      });
      return province;
   }

   static async getToursByProvinceId(provinceId: string, page: number, limit: number, sortBy: string = 'price-asc') {
      // Fetch all matching tours first to sort in memory (due to computed fields)
      // In a production environment with large data, this should be optimized with database views or indexed computed columns
      const allTours = await prisma.tour.findMany({
         where: {
            isActive: true,
            tourStops: {
               some: {
                  attraction: {
                     provinceId: provinceId
                  }
               }
            }
         },
         include: {
            tourStops: {
               include: {
                  attraction: true
               }
            },
            ticketTypes: {
               include: {
                  ticketPrices: true
               }
            },
            tourReviews: true,
            pickup: true
         }
      });

      // Helper to get min price
      const getMinPrice = (tour: any) => {
         if (!tour.ticketTypes || tour.ticketTypes.length === 0) return 0;
         const prices = tour.ticketTypes.flatMap((tt: any) =>
            tt.ticketPrices ? tt.ticketPrices.map((tp: any) => tp.price) : []
         );
         return prices.length > 0 ? Math.min(...prices) : 0;
      };

      // Helper to get avg rating
      const getAvgRating = (tour: any) => {
         if (!tour.tourReviews || tour.tourReviews.length === 0) return 0;
         const total = tour.tourReviews.reduce((acc: number, r: any) => acc + r.rate, 0);
         return total / tour.tourReviews.length;
      };

      // Sort
      allTours.sort((a, b) => {
         switch (sortBy) {
            case 'price-asc':
               return getMinPrice(a) - getMinPrice(b);
            case 'price-desc':
               return getMinPrice(b) - getMinPrice(a);
            case 'rating-desc':
               return getAvgRating(b) - getAvgRating(a);
            default:
               return 0;
         }
      });

      // Pagination
      const total = allTours.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTours = allTours.slice(startIndex, endIndex);

      return {
         data: paginatedTours,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
         }
      };
   }

   static async getAttractionsByProvinceId(provinceId: string) {
      const attractions = await prisma.attraction.findMany({
         where: {
            provinceId: provinceId,
         },
         include: {
            attractionReviews: true,
         }
      });
      return attractions;
   }

   static async getReviewsByProvinceId(provinceId: string, page: number, limit: number) {
      const reviews = await prisma.tourReview.findMany({
         where: {
            tour: {
               tourStops: {
                  some: {
                     attraction: {
                        provinceId: provinceId
                     }
                  }
               }
            }
         },
         include: {
            user: {
               select: {
                  userId: true,
                  name: true,
                  profilePhoto: true
               }
            },
            tour: true
         },
         orderBy: {
            createdAt: 'desc'
         },
         skip: (page - 1) * limit,
         take: limit
      });

      const total = await prisma.tourReview.count({
         where: {
            tour: {
               tourStops: {
                  some: {
                     attraction: {
                        provinceId: provinceId
                     }
                  }
               }
            }
         }
      });

      return {
         data: reviews,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
         }
      };
   }
}
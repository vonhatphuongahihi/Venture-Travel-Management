import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ResponseUtils } from "@/utils";
import { ProvinceService } from "@/services/provinceService";

const prisma = new PrismaClient();

export class ProvinceController {
  // Get all provinces
  static async getProvinces(req: Request, res: Response): Promise<void> {
    try {
      const provinces = await ProvinceService.getProvinces();

      // Transform to frontend format
      const formattedProvinces = provinces.map((province) => ({
        id: province.provinceId,
        name: province.name,
        slug: province.provinceId.toLowerCase().replace(/\s+/g, "-"), // Generate slug from provinceId or name
        image:
          province.images && province.images.length > 0
            ? province.images[0]
            : "/placeholder.svg",
        images: province.images,
        region: province.region,
        description: province.description,
      }));

      res
        .status(200)
        .json(
          ResponseUtils.success(
            "Lấy danh sách tỉnh thành thành công",
            formattedProvinces
          )
        );
    } catch (error) {
      console.error("🔴 [ProvinceController] Get provinces error:", error);
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Không thể lấy danh sách tỉnh thành",
            error instanceof Error ? error.message : "Lỗi không xác định"
          )
        );
    }
  }

  // Get province by slug or ID
  static async getProvinceBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      // Try to find by provinceId first
      let province = await ProvinceService.getProvinceBySlug(slug);

      if (!province) {
        res.status(404).json(ResponseUtils.error("Không tìm thấy tỉnh thành"));
        return;
      }

      // Transform to frontend format
      const formattedProvince = {
        id: province.provinceId,
        name: province.name,
        slug: province.provinceId.toLowerCase().replace(/\s+/g, "-"),
        image:
          province.images && province.images.length > 0
            ? province.images[0]
            : "/placeholder.svg",
        images: province.images,
        region: province.region,
        description: province.description,
        point: {
          lat: province.lat,
          long: province.long,
        },
      };

      res
        .status(200)
        .json(
          ResponseUtils.success(
            "Lấy thông tin tỉnh thành thành công",
            formattedProvince
          )
        );
    } catch (error) {
      console.error(
        "🔴 [ProvinceController] Get province by slug error:",
        error
      );
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Không thể lấy thông tin tỉnh thành",
            error instanceof Error ? error.message : "Lỗi không xác định"
          )
        );
    }
  }

  // Get tours by province ID
  static async getToursByProvince(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || "price-asc";

      const result = await ProvinceService.getToursByProvinceId(
        id,
        page,
        limit,
        sortBy
      );

      const formattedTours = result.data.map((tour: any) => {
        // Calculate min price
        const prices = tour.ticketTypes.flatMap((tt: any) =>
          tt.ticketPrices ? tt.ticketPrices.map((tp: any) => tp.price) : []
        );
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

        // Calculate avg rating
        const totalRating = tour.tourReviews.reduce((acc: number, r: any) => acc + r.rate, 0);
        const avgRating = tour.tourReviews.length > 0 ? totalRating / tour.tourReviews.length : 0;

        // Parse duration (assuming format like "2 days 1 night" or similar)
        // This is a basic parser, adjust regex based on actual data format
        let durationDays = 0;
        let durationNights = 0;
        const dayMatch = tour.duration.match(/(\d+)\s*(?:ngày|day)/i);
        const nightMatch = tour.duration.match(/(\d+)\s*(?:đêm|night)/i);
        if (dayMatch) durationDays = parseInt(dayMatch[1]);
        if (nightMatch) durationNights = parseInt(nightMatch[1]);
        if (!dayMatch && !nightMatch && tour.duration) {
          // Fallback if just a number is provided or different format
          const num = parseInt(tour.duration);
          if (!isNaN(num)) durationDays = num;
        }

        // Determine status
        let status = 'upcoming';
        const now = new Date();
        if (tour.startDate && tour.endDate) {
          const start = new Date(tour.startDate);
          const end = new Date(tour.endDate);
          if (now >= start && now <= end) {
            status = 'ongoing';
          } else if (now > end) {
            status = 'completed';
          }
        } else if (tour.isActive) {
          status = 'ongoing'; // Default if no dates but active
        }

        return {
          id: tour.tourId,
          title: tour.name, // Mapped to title
          description: tour.about, // Mapped to description
          image: tour.images && tour.images.length > 0 ? tour.images[0] : "/placeholder-tour.jpg",
          price: minPrice,
          duration: tour.duration, // Raw duration string
          location: tour.pickupPoint || '', // Mapped to location
          rating: parseFloat(avgRating.toFixed(1)),
          reviewCount: tour.tourReviews.length, // Mapped to reviewCount
          category: tour.categories && tour.categories.length > 0 ? tour.categories[0] : 'General', // Mapped to category
          status: status,
          maxParticipants: tour.maxGroupSize,
          availableSpots: tour.maxGroupSize, // Placeholder, ideally calculated from bookings

          // Keep existing fields if needed by other components, or remove if strictly following the list
          name: tour.name,
          review_count: tour.tourReviews.length,
          duration_days: durationDays,
          duration_nights: durationNights,
          start_point: tour.pickup ? {
            lat: tour.pickup.latitude,
            long: tour.pickup.longitude
          } : null
        };
      });

      res
        .status(200)
        .json(
          ResponseUtils.success(
            "Lấy danh sách tour theo tỉnh thành thành công",
            {
              data: formattedTours,
              pagination: result.pagination
            }
          )
        );
    } catch (error) {
      console.error(
        "🔴 [ProvinceController] Get tours by province error:",
        error
      );
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Không thể lấy danh sách tour theo tỉnh thành",
            error instanceof Error ? error.message : "Lỗi không xác định"
          )
        );
    }
  }

  // Get attractions by province ID
  static async getAttractionsByProvince(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const attractions = await ProvinceService.getAttractionsByProvinceId(id);

      // Transform to frontend format
      const formattedAttractions = attractions.map((attraction) => ({
        id: attraction.attractionId,
        name: attraction.name,
        slug: attraction.attractionId.toLowerCase().replace(/\s+/g, "-"), // Or use a proper slug field if available
        image:
          attraction.images && attraction.images.length > 0
            ? attraction.images[0]
            : "/placeholder.svg",
        images: attraction.images,
        address: attraction.address,
        description: attraction.description,
        category: attraction.category,
        rating:
          attraction.attractionReviews.length > 0
            ? attraction.attractionReviews.reduce((acc: number, r: any) => acc + r.rate, 0) /
            attraction.attractionReviews.length
            : 0,
        reviewCount: attraction.attractionReviews.length,
      }));

      res
        .status(200)
        .json(
          ResponseUtils.success(
            "Lấy danh sách điểm tham quan thành công",
            formattedAttractions
          )
        );
    } catch (error) {
      console.error(
        "🔴 [ProvinceController] Get attractions by province error:",
        error
      );
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Không thể lấy danh sách điểm tham quan",
            error instanceof Error ? error.message : "Lỗi không xác định"
          )
        );
    }
  }

  // Get reviews by province ID
  static async getReviewsByProvince(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ProvinceService.getReviewsByProvinceId(
        id,
        page,
        limit
      );

      // Transform to frontend format
      const formattedReviews = result.data.map((review) => ({
        id: review.reviewId,
        user: {
          id: review.user.userId,
          name: review.user.name,
          avatar: review.user.profilePhoto || "/placeholder-user.jpg",
        },
        rating: review.rate,
        content: review.content,
        date: review.createdAt.toISOString(),
        targetId: review.tourId,
        targetType: "tour",
        tour: {
          id: review.tour.tourId,
          title: review.tour.name,
          image:
            review.tour.images && review.tour.images.length > 0
              ? review.tour.images[0]
              : "/placeholder.svg",
        },
        images: review.images,
      }));

      res.status(200).json(
        ResponseUtils.success("Lấy danh sách đánh giá thành công", {
          data: formattedReviews,
          pagination: result.pagination,
        })
      );
    } catch (error) {
      console.error(
        "🔴 [ProvinceController] Get reviews by province error:",
        error
      );
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Không thể lấy danh sách đánh giá",
            error instanceof Error ? error.message : "Lỗi không xác định"
          )
        );
    }
  }
}

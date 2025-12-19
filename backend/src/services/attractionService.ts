import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AttractionService {
  // Get all attractions with optional filters
  static async getAttractions(params: {
    page?: number;
    limit?: number;
    provinceId?: string;
    category?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }) {
    const {
      page = 1,
      limit = 10,
      provinceId,
      category,
      sortBy = "createdAt",
      order = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (provinceId) {
      where.provinceId = provinceId;
    }

    if (category) {
      where.category = category;
    }

    // Get attractions with relations
    const [attractions, total] = await Promise.all([
      prisma.attraction.findMany({
        where,
        include: {
          province: {
            select: {
              provinceId: true,
              name: true,
              region: true,
            },
          },
          point: {
            select: {
              latitude: true,
              longitude: true,
            },
          },
          tourStops: {
            select: {
              tourId: true,
            },
          },
          attractionReviews: {
            select: {
              rate: true,
            },
          },
        },
        orderBy: {
          [sortBy]: order,
        },
        skip,
        take: limit,
      }),
      prisma.attraction.count({ where }),
    ]);

    // Format response
    const formattedAttractions = attractions.map((attraction) => {
      // Count unique tours
      const tourCount = new Set(attraction.tourStops.map((stop) => stop.tourId))
        .size;

      // Calculate average rating
      const avgRating =
        attraction.attractionReviews.length > 0
          ? attraction.attractionReviews.reduce(
              (sum: number, review: any) => sum + review.rate,
              0
            ) / attraction.attractionReviews.length
          : 0;

      return {
        id: attraction.attractionId,
        name: attraction.name,
        images: attraction.images,
        image:
          attraction.images && attraction.images.length > 0
            ? attraction.images[0]
            : "/placeholder.svg",
        address: attraction.address,
        description: attraction.description,
        category: attraction.category,
        provinceId: attraction.provinceId,
        provinceName: attraction.province.name,
        tourCount,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: attraction.attractionReviews.length,
        coordinates: attraction.point
          ? {
              lat: attraction.point.latitude,
              lon: attraction.point.longitude,
            }
          : null,
        createdAt: attraction.createdAt,
        updatedAt: attraction.updatedAt,
      };
    });

    return {
      attractions: formattedAttractions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get top destinations (attractions with most tours)
  static async getTopDestinations(limit: number = 5) {
    // Get attractions with tour count
    const attractions = await prisma.attraction.findMany({
      include: {
        province: {
          select: {
            provinceId: true,
            name: true,
            region: true,
          },
        },
        tourStops: {
          select: {
            tourId: true,
          },
        },
      },
      take: 50, // Get more to filter by tour count
    });

    // Calculate tour count for each attraction and sort
    const attractionsWithTourCount = attractions.map((attraction: any) => {
      const tourCount = new Set(
        attraction.tourStops.map((stop: any) => stop.tourId)
      ).size;
      return {
        ...attraction,
        tourCount,
      };
    });

    // Sort by tour count descending and take top N
    const topAttractions = attractionsWithTourCount
      .sort((a: any, b: any) => b.tourCount - a.tourCount)
      .slice(0, limit);

    // Format response
    return topAttractions.map((attraction: any) => ({
      id: attraction.attractionId,
      name: attraction.name,
      images: attraction.images,
      image:
        attraction.images && attraction.images.length > 0
          ? attraction.images[0]
          : "/placeholder.svg",
      address: attraction.address,
      description: attraction.description,
      category: attraction.category,
      provinceId: attraction.provinceId,
      provinceName: attraction.province.name,
      tourCount: attraction.tourCount,
    }));
  }

  // Get attraction by ID
  static async getAttractionById(id: string) {
    const attraction = await prisma.attraction.findUnique({
      where: { attractionId: id },
      include: {
        province: true,
        tourStops: {
          include: {
            tour: {
              include: {
                tourStops: {
                  include: {
                    attraction: {
                      include: {
                        province: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
                tourReviews: {
                  select: {
                    rate: true,
                  },
                },
                ticketTypes: {
                  include: {
                    ticketPrices: true,
                    bookings: {
                      include: {
                        bookingDetails: {
                          select: {
                            quantity: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        attractionReviews: {
          include: {
            user: {
              select: {
                userId: true,
                name: true,
                profilePhoto: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        point: true,
      },
    });

    if (!attraction) {
      return null;
    }

    // Calculate average rating
    const avgRating =
      attraction.attractionReviews.length > 0
        ? attraction.attractionReviews.reduce(
            (sum: number, review: any) => sum + review.rate,
            0
          ) / attraction.attractionReviews.length
        : 0;

    // Get unique tours with full details
    const tourIds = Array.from(
      new Set(attraction.tourStops.map((stop: any) => stop.tourId))
    );
    const tours = tourIds
      .map((tourId: any) => {
        const stop = attraction.tourStops.find((s: any) => s.tourId === tourId);
        const tour = stop?.tour;

        if (!tour) return null;

        // Calculate tour rating
        const tourAvgRating =
          tour.tourReviews.length > 0
            ? tour.tourReviews.reduce(
                (sum: number, review: any) => sum + review.rate,
                0
              ) / tour.tourReviews.length
            : 0;

        // Get location from first tour stop with province
        const locationStop = tour.tourStops.find(
          (ts: any) => ts.attraction?.province?.name
        );
        const location = locationStop?.attraction?.province?.name || "";

        // Calculate price from ticket prices
        const allTicketPrices: number[] = [];
        tour.ticketTypes.forEach((ticketType: any) => {
          ticketType.ticketPrices.forEach((tp: any) => {
            allTicketPrices.push(tp.price);
          });
        });
        const minPrice =
          allTicketPrices.length > 0 ? Math.min(...allTicketPrices) : 0;

        // Calculate max participants and available spots
        const maxParticipants = tour.ticketTypes.reduce(
          (sum: number, tt: any) => sum + tt.quantity,
          0
        );

        // Count total booked from booking details
        const totalBooked = tour.ticketTypes.reduce((sum: number, tt: any) => {
          return (
            sum +
            (tt.bookings?.reduce((bookingSum: number, booking: any) => {
              return (
                bookingSum +
                (booking.booking_details?.reduce(
                  (detailSum: number, detail: any) =>
                    detailSum + detail.quantity,
                  0
                ) ?? 0)
              );
            }, 0) ?? 0)
          );
        }, 0);

        const availableSpots = maxParticipants - totalBooked;

        // Determine status based on dates
        const now = new Date();
        const startDate = tour.startDate ? new Date(tour.startDate) : null;
        const endDate = tour.endDate ? new Date(tour.endDate) : null;
        let status: "upcoming" | "ongoing" | "completed" = "upcoming";

        if (startDate && endDate) {
          if (now < startDate) {
            status = "upcoming";
          } else if (now >= startDate && now <= endDate) {
            status = "ongoing";
          } else {
            status = "completed";
          }
        }

        // Get category from first category in array
        const category =
          tour.categories && tour.categories.length > 0
            ? tour.categories[0]
            : "";

        return {
          id: tour.tourId,
          title: tour.name,
          description: tour.about,
          image:
            tour.images && tour.images.length > 0
              ? tour.images[0]
              : "/placeholder.svg",
          price: minPrice,
          duration: tour.duration,
          location,
          rating: Math.round(tourAvgRating * 10) / 10,
          reviewCount: tour.tourReviews.length,
          category,
          status,
          maxParticipants,
          availableSpots: availableSpots >= 0 ? availableSpots : 0,
        };
      })
      .filter(Boolean);

    // Format response
    return {
      id: attraction.attractionId,
      name: attraction.name,
      images: attraction.images,
      address: attraction.address,
      description: attraction.description,
      category: attraction.category,
      provinceId: attraction.provinceId,
      province: {
        id: attraction.province.provinceId,
        name: attraction.province.name,
        region: attraction.province.region,
        coordinates: {
          lat: attraction.province.lat,
          long: attraction.province.long,
        },
      },
      tourCount: tours.length,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: attraction.attractionReviews.length,
      tours: tours,
      attractionReviews: attraction.attractionReviews.map((review: any) => ({
        reviewId: review.reviewId,
        user: {
          id: review.user.userId,
          name: review.user.name,
          avatar: review.user.profilePhoto || "/default-avatar.png",
        },
        rating: review.rate,
        content: review.content,
        images: review.images,
        date: review.createdAt,
      })),
      coordinates: attraction.point
        ? {
            lat: attraction.point.latitude,
            lon: attraction.point.longitude,
          }
        : null,
      createdAt: attraction.createdAt,
      updatedAt: attraction.updatedAt,
    };
  }
}

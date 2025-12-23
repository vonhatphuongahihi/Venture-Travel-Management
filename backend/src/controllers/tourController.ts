import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ResponseUtils } from '@/utils';

const prisma = new PrismaClient();

export class TourController {
    // Get all tours with optional filters
    static async getTours(req: Request, res: Response): Promise<void> {
        try {
            const {
                page = '1',
                limit = '10',
                category,
                isActive = 'true',
                sortBy = 'createdAt',
                order = 'desc'
            } = req.query;

            const pageNum = Number(page);
            const limitNum = Number(limit);
            const skip = (pageNum - 1) * limitNum;

            // Build where clause
            const where: any = {
                isActive: isActive === 'true',
            };

            if (category) {
                where.categories = {
                    has: category,
                };
            }

            // Get tours with relations
            const [tours, total] = await Promise.all([
                prisma.tour.findMany({
                    where,
                    include: {
                        tourReviews: {
                            select: {
                                rate: true,
                            },
                        },
                        ticketTypes: {
                            include: {
                                ticketPrices: {
                                    include: {
                                        priceCategory: true,
                                    },
                                    // Get all prices to calculate minimum
                                },
                            },
                            // Get all ticket types to calculate minimum price
                        },
                    },
                    orderBy: {
                        [sortBy as string]: order as 'asc' | 'desc',
                    },
                    skip,
                    take: limitNum,
                }),
                prisma.tour.count({ where }),
            ]);

            // Format response
            const formattedTours = tours.map((tour: any) => {
                // Calculate average rating
                const avgRating = tour.tourReviews.length > 0
                    ? tour.tourReviews.reduce((sum: number, review: any) => sum + review.rate, 0) / tour.tourReviews.length
                    : 0;

                // Calculate min price from all ticket prices (same as provinceController)
                const prices = tour.ticketTypes.flatMap((tt: any) =>
                    tt.ticketPrices ? tt.ticketPrices.map((tp: any) => tp.price) : []
                );
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

                // Determine status based on dates
                let status: 'upcoming' | 'ongoing' | 'completed' = 'upcoming';
                const now = new Date();
                if (tour.startDate && tour.endDate) {
                    if (now < tour.startDate) {
                        status = 'upcoming';
                    } else if (now >= tour.startDate && now <= tour.endDate) {
                        status = 'ongoing';
                    } else {
                        status = 'completed';
                    }
                }

                return {
                    id: tour.tourId,
                    title: tour.name,
                    description: tour.about,
                    image: tour.images && tour.images.length > 0 ? tour.images[0] : '/placeholder.svg',
                    images: tour.images,
                    price: minPrice,
                    duration: tour.duration,
                    location: 'Việt Nam',
                    rating: Math.round(avgRating * 10) / 10,
                    reviewCount: tour.tourReviews.length,
                    category: tour.categories && tour.categories.length > 0 ? tour.categories[0] : 'Tour du lịch',
                    categories: tour.categories,
                    status,
                    maxParticipants: tour.maxGroupSize,
                    availableSpots: tour.maxGroupSize, // TODO: Calculate from bookings
                    ageRange: tour.ageRange,
                    languages: tour.languages,
                    highlights: tour.highlights,
                    inclusions: tour.inclusions,
                    exclusions: tour.exclusions,
                    pickupPoint: tour.pickupPoint,
                    endPoint: tour.endPoint,
                    startDate: tour.startDate?.toISOString(),
                    endDate: tour.endDate?.toISOString(),
                    createdAt: tour.createdAt.toISOString(),
                };
            });

            res.status(200).json(
                ResponseUtils.success('Lấy danh sách tour thành công', {
                    tours: formattedTours,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum),
                    },
                })
            );
        } catch (error) {
            console.error('🔴 [TourController] Get tours error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể lấy danh sách tour',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Get tour by ID
    static async getTourById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const tour = await prisma.tour.findUnique({
                where: { tourId: id },
                include: {
                    tourStops: {
                        include: {
                            attraction: {
                                include: {
                                    point: true,
                                },
                            },
                        },
                        orderBy: {
                            stopOrder: 'asc',
                        },
                    },
                    ticketTypes: {
                        include: {
                            ticketPrices: {
                                include: {
                                    priceCategory: true,
                                },
                            },
                        },
                    },
                    tourReviews: {
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
                            createdAt: 'desc',
                        },
                        take: 10,
                    },
                    pickup: true,
                    end: true,
                    pickupArea: {
                        include: {
                            polygon_points: {
                                include: {
                                    points: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!tour) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy tour'));
                return;
            }

            // Calculate average rating
            const avgRating = tour.tourReviews.length > 0
                ? tour.tourReviews.reduce((sum: number, review: any) => sum + review.rate, 0) / tour.tourReviews.length
                : 0;

            // Format response
            const formattedTour = {
                id: tour.tourId,
                name: tour.name,
                images: tour.images,
                about: tour.about,
                price: 0, // Will be calculated from ticket prices
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: tour.tourReviews.length,
                duration: tour.duration,
                ageRange: tour.ageRange,
                maxGroupSize: tour.maxGroupSize,
                languages: tour.languages,
                categories: tour.categories,
                expectations: tour.expectations,
                highlights: tour.highlights,
                inclusions: tour.inclusions,
                exclusions: tour.exclusions,
                pickupPoint: tour.pickupPoint,
                pickupDetails: tour.pickupDetails,
                endPoint: tour.endPoint,
                additionalInformation: tour.additionalInformation,
                cancellationPolicy: tour.cancellationPolicy,
                startDate: tour.startDate?.toISOString(),
                endDate: tour.endDate?.toISOString(),
                isActive: tour.isActive,
                tourStops: tour.tourStops.map((stop: any) => ({
                    stopId: stop.stopId,
                    attraction: {
                        id: stop.attraction.attractionId,
                        name: stop.attraction.name,
                        images: stop.attraction.images,
                        address: stop.attraction.address,
                        description: stop.attraction.description,
                        point: stop.attraction.point ? {
                            latitude: stop.attraction.point.latitude,
                            longitude: stop.attraction.point.longitude,
                        } : null,
                    },
                    stopOrder: stop.stopOrder,
                    notes: stop.notes,
                    details: stop.details,
                })),
                ticketTypes: tour.ticketTypes.map((type: any) => ({
                    ticketTypeId: type.ticketTypeId,
                    name: type.name,
                    notes: type.notes,
                    quantity: type.quantity,
                    prices: type.ticketPrices.map((price: any) => ({
                        ticketPriceId: price.ticketPriceId,
                        categoryId: price.categoryId,
                        categoryName: price.priceCategory.name,
                        price: price.price,
                        quantity: price.quantity,
                        notes: price.notes,
                    })),
                })),
                tourReviews: tour.tourReviews.map((review: any) => ({
                    reviewId: review.reviewId,
                    user: {
                        id: review.user.userId,
                        name: review.user.name,
                        avatar: review.user.profilePhoto || '/default-avatar.png',
                    },
                    rating: review.rate,
                    content: review.content,
                    images: review.images,
                    date: review.createdAt.toISOString(),
                })),
                pickupCoordinates: tour.pickup ? {
                    lat: tour.pickup.latitude,
                    lon: tour.pickup.longitude,
                } : null,
                endCoordinates: tour.end ? {
                    lat: tour.end.latitude,
                    lon: tour.end.longitude,
                } : null,
                pickupAreaCoordinates: tour.pickupArea?.polygon_points
                    ? tour.pickupArea.polygon_points
                        .sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0))
                        .map((pp: any) => ({
                            lat: pp.points.latitude,
                            lon: pp.points.longitude,
                        }))
                    : null,
            };

            res.status(200).json(
                ResponseUtils.success('Lấy thông tin tour thành công', formattedTour)
            );
        } catch (error) {
            console.error('🔴 [TourController] Get tour by ID error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể lấy thông tin tour',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Get all unique categories from tours
    static async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const tours = await prisma.tour.findMany({
                where: {
                    isActive: true,
                },
                select: {
                    categories: true,
                },
            });

            // Extract all unique categories
            const allCategories = new Set<string>();
            tours.forEach((tour) => {
                if (tour.categories && Array.isArray(tour.categories)) {
                    tour.categories.forEach((category) => {
                        if (category && typeof category === 'string') {
                            allCategories.add(category);
                        }
                    });
                }
            });

            const categories = Array.from(allCategories).sort();

            res.status(200).json(
                ResponseUtils.success('Lấy danh sách categories thành công', {
                    categories,
                })
            );
        } catch (error) {
            console.error('🔴 [TourController] Get categories error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể lấy danh sách categories',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }
}


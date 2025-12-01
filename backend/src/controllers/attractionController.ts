import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ResponseUtils } from '@/utils';

const prisma = new PrismaClient();

export class AttractionController {
    // Get all attractions with optional filters
    static async getAttractions(req: Request, res: Response): Promise<void> {
        try {
            const {
                page = '1',
                limit = '10',
                provinceId,
                category,
                sortBy = 'createdAt',
                order = 'desc'
            } = req.query;

            const pageNum = Number(page);
            const limitNum = Number(limit);
            const skip = (pageNum - 1) * limitNum;

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
                        [sortBy as string]: order as 'asc' | 'desc',
                    },
                    skip,
                    take: limitNum,
                }),
                prisma.attraction.count({ where }),
            ]);

            // Format response
            const formattedAttractions = attractions.map((attraction: any) => {
                // Count unique tours
                const tourCount = new Set(attraction.tourStops.map((stop: any) => stop.tourId)).size;

                // Calculate average rating
                const avgRating = attraction.attractionReviews.length > 0
                    ? attraction.reviews.reduce((sum: number, review: any) => sum + review.rate, 0) / attraction.reviews.length
                    : 0;

                return {
                    id: attraction.attractionId,
                    name: attraction.name,
                    images: attraction.images,
                    image: attraction.images && attraction.images.length > 0 ? attraction.images[0] : '/placeholder.svg',
                    address: attraction.address,
                    description: attraction.description,
                    category: attraction.category,
                    provinceId: attraction.provinceId,
                    provinceName: attraction.province.name,
                    tourCount,
                    rating: Math.round(avgRating * 10) / 10,
                    reviewCount: attraction.attractionReviews.length,
                    coordinates: attraction.point ? {
                        lat: attraction.point.latitude,
                        lon: attraction.point.longitude,
                    } : null,
                    createdAt: attraction.createdAt.toISOString(),
                    updatedAt: attraction.updatedAt.toISOString(),
                };
            });

            res.status(200).json(
                ResponseUtils.success('Lấy danh sách điểm đến thành công', {
                    attractions: formattedAttractions,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum),
                    },
                })
            );
        } catch (error) {
            console.error('🔴 [AttractionController] Get attractions error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể lấy danh sách điểm đến',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Get top destinations (attractions with most tours)
    static async getTopDestinations(req: Request, res: Response): Promise<void> {
        try {
            const { limit = '5' } = req.query;
            const limitNum = Number(limit);

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
                const tourCount = new Set(attraction.tourStops.map((stop: any) => stop.tourId)).size;
                return {
                    ...attraction,
                    tourCount,
                };
            });

            // Sort by tour count descending and take top N
            const topAttractions = attractionsWithTourCount
                .sort((a: any, b: any) => b.tourCount - a.tourCount)
                .slice(0, limitNum);

            // Format response
            const formattedDestinations = topAttractions.map((attraction: any) => ({
                id: attraction.attractionId,
                name: attraction.name,
                images: attraction.images,
                image: attraction.images && attraction.images.length > 0 ? attraction.images[0] : '/placeholder.svg',
                address: attraction.address,
                description: attraction.description,
                category: attraction.category,
                provinceId: attraction.provinceId,
                provinceName: attraction.province.name,
                tourCount: attraction.tourCount,
            }));

            res.status(200).json(
                ResponseUtils.success('Lấy top điểm đến thành công', {
                    destinations: formattedDestinations,
                })
            );
        } catch (error) {
            console.error('🔴 [AttractionController] Get top destinations error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể lấy top điểm đến',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Get attraction by ID
    static async getAttractionById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const attraction = await prisma.attraction.findUnique({
                where: { attractionId: id },
                include: {
                    province: true,
                    tourStops: {
                        include: {
                            tour: {
                                select: {
                                    tourId: true,
                                    name: true,
                                    images: true,
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
                            createdAt: 'desc',
                        },
                        take: 10,
                    },
                    point: true,
                },
            });

            if (!attraction) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy điểm đến'));
                return;
            }

            // Calculate average rating
            const avgRating = attraction.attractionReviews.length > 0
                ? attraction.attractionReviews.reduce((sum: number, review: any) => sum + review.rate, 0) / attraction.attractionReviews.length
                : 0;

            // Get unique tours
            const tourIds = Array.from(new Set(attraction.tourStops.map((stop: any) => stop.tourId)));
            const tours = tourIds.map((tourId: any) => {
                const stop = attraction.tourStops.find((s: any) => s.tourId === tourId);
                return stop?.tour;
            }).filter(Boolean);

            // Format response
            const formattedAttraction = {
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
                        avatar: review.user.profilePhoto || '/default-avatar.png',
                    },
                    rating: review.rate,
                    content: review.content,
                    images: review.images,
                    date: review.createdAt.toISOString(),
                })),
                coordinates: attraction.point ? {
                    lat: attraction.point.latitude,
                    lon: attraction.point.longitude,
                } : null,
                createdAt: attraction.createdAt.toISOString(),
                updatedAt: attraction.updatedAt.toISOString(),
            };

            res.status(200).json(
                ResponseUtils.success('Lấy thông tin điểm đến thành công', formattedAttraction)
            );
        } catch (error) {
            console.error('🔴 [AttractionController] Get attraction by ID error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể lấy thông tin điểm đến',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }
}


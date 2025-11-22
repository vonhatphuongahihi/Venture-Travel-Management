import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ResponseUtils } from '@/utils';
import { AuthenticatedRequest } from '@/types';

const prisma = new PrismaClient();

export class ReviewController {
    // Get all reviews for a tour
    static async getTourReviews(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { tourId } = req.params;
            const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
            const userId = req.user?.userId; // Get userId if authenticated

            const pageNum = Number(page);
            const limitNum = Number(limit);
            const skip = (pageNum - 1) * limitNum;

            // Verify tour exists
            const tour = await prisma.tour.findUnique({
                where: { tourId },
            });

            if (!tour) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy tour'));
                return;
            }

            // Get reviews
            const [reviews, total] = await Promise.all([
                prisma.tourReview.findMany({
                    where: { tourId },
                    include: {
                        user: {
                            select: {
                                userId: true,
                                name: true,
                                profilePhoto: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        [sortBy as string]: order as 'asc' | 'desc',
                    },
                    skip,
                    take: limitNum,
                }),
                prisma.tourReview.count({ where: { tourId } }),
            ]);

            // Calculate average rating
            const avgRating = reviews.length > 0
                ? reviews.reduce((sum, review) => sum + review.rate, 0) / reviews.length
                : 0;

            // Format response
            const formattedReviews = reviews.map((review) => ({
                reviewId: review.reviewId,
                user: {
                    id: review.user.userId,
                    name: review.user.name,
                    avatar: review.user.profilePhoto || '/default-avatar.png',
                },
                rating: review.rate,
                content: review.content,
                images: review.images,
                likesCount: review.likes?.length || 0,
                liked: userId ? (review.likes?.includes(userId) || false) : false,
                date: review.createdAt.toISOString(),
                updatedAt: review.updatedAt.toISOString(),
            }));

            res.status(200).json(
                ResponseUtils.success('Lấy danh sách đánh giá tour thành công', {
                    reviews: formattedReviews,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum),
                    },
                    averageRating: Math.round(avgRating * 10) / 10,
                })
            );
        } catch (error) {
            console.error('🔴 [ReviewController] Get tour reviews error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể lấy danh sách đánh giá tour',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Create a review for a tour
    static async createTourReview(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { tourId } = req.params;
            const { rate, content, images = [] } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa đăng nhập'));
                return;
            }

            // Verify tour exists
            const tour = await prisma.tour.findUnique({
                where: { tourId },
            });

            if (!tour) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy tour'));
                return;
            }

            // Check if user already reviewed this tour
            const existingReview = await prisma.tourReview.findFirst({
                where: {
                    tourId,
                    userId,
                },
            });

            if (existingReview) {
                res.status(400).json(ResponseUtils.error('Bạn đã đánh giá tour này rồi'));
                return;
            }

            // Create review
            const review = await prisma.tourReview.create({
                data: {
                    userId,
                    tourId,
                    rate,
                    content,
                    images,
                },
                include: {
                    user: {
                        select: {
                            userId: true,
                            name: true,
                            profilePhoto: true,
                            email: true,
                        },
                    },
                },
            });

            const formattedReview = {
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
                updatedAt: review.updatedAt.toISOString(),
            };

            res.status(201).json(
                ResponseUtils.success('Tạo đánh giá tour thành công', formattedReview)
            );
        } catch (error) {
            console.error('🔴 [ReviewController] Create tour review error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể tạo đánh giá tour',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Update a tour review
    static async updateTourReview(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { reviewId } = req.params;
            const { rate, content, images } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa đăng nhập'));
                return;
            }

            // Check if review exists and belongs to user
            const review = await prisma.tourReview.findUnique({
                where: { reviewId },
            });

            if (!review) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy đánh giá'));
                return;
            }

            if (review.userId !== userId) {
                res.status(403).json(ResponseUtils.error('Bạn không có quyền chỉnh sửa đánh giá này'));
                return;
            }

            // Update review
            const updatedReview = await prisma.tourReview.update({
                where: { reviewId },
                data: {
                    ...(rate && { rate }),
                    ...(content && { content }),
                    ...(images !== undefined && { images }),
                },
                include: {
                    user: {
                        select: {
                            userId: true,
                            name: true,
                            profilePhoto: true,
                            email: true,
                        },
                    },
                },
            });

            const formattedReview = {
                reviewId: updatedReview.reviewId,
                user: {
                    id: updatedReview.user.userId,
                    name: updatedReview.user.name,
                    avatar: updatedReview.user.profilePhoto || '/default-avatar.png',
                },
                rating: updatedReview.rate,
                content: updatedReview.content,
                images: updatedReview.images,
                date: updatedReview.createdAt.toISOString(),
                updatedAt: updatedReview.updatedAt.toISOString(),
            };

            res.status(200).json(
                ResponseUtils.success('Cập nhật đánh giá tour thành công', formattedReview)
            );
        } catch (error) {
            console.error('🔴 [ReviewController] Update tour review error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể cập nhật đánh giá tour',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Delete a tour review
    static async deleteTourReview(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { reviewId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa đăng nhập'));
                return;
            }

            // Check if review exists and belongs to user
            const review = await prisma.tourReview.findUnique({
                where: { reviewId },
            });

            if (!review) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy đánh giá'));
                return;
            }

            if (review.userId !== userId && req.user?.role !== 'ADMIN') {
                res.status(403).json(ResponseUtils.error('Bạn không có quyền xóa đánh giá này'));
                return;
            }

            // Delete review
            await prisma.tourReview.delete({
                where: { reviewId },
            });

            res.status(200).json(ResponseUtils.success('Xóa đánh giá tour thành công'));
        } catch (error) {
            console.error('🔴 [ReviewController] Delete tour review error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể xóa đánh giá tour',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Get all reviews for an attraction
    static async getAttractionReviews(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { attractionId } = req.params;
            const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
            const userId = req.user?.userId; // Get userId if authenticated

            const pageNum = Number(page);
            const limitNum = Number(limit);
            const skip = (pageNum - 1) * limitNum;

            // Verify attraction exists
            const attraction = await prisma.attraction.findUnique({
                where: { attractionId },
            });

            if (!attraction) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy điểm đến'));
                return;
            }

            // Get reviews
            const [reviews, total] = await Promise.all([
                prisma.attractionReview.findMany({
                    where: { attractionId },
                    include: {
                        user: {
                            select: {
                                userId: true,
                                name: true,
                                profilePhoto: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        [sortBy as string]: order as 'asc' | 'desc',
                    },
                    skip,
                    take: limitNum,
                }),
                prisma.attractionReview.count({ where: { attractionId } }),
            ]);

            // Calculate average rating
            const avgRating = reviews.length > 0
                ? reviews.reduce((sum, review) => sum + review.rate, 0) / reviews.length
                : 0;

            // Format response
            const formattedReviews = reviews.map((review) => ({
                reviewId: review.reviewId,
                user: {
                    id: review.user.userId,
                    name: review.user.name,
                    avatar: review.user.profilePhoto || '/default-avatar.png',
                },
                rating: review.rate,
                content: review.content,
                images: review.images,
                likesCount: review.likes?.length || 0,
                liked: userId ? (review.likes?.includes(userId) || false) : false,
                date: review.createdAt.toISOString(),
                updatedAt: review.updatedAt.toISOString(),
            }));

            res.status(200).json(
                ResponseUtils.success('Lấy danh sách đánh giá điểm đến thành công', {
                    reviews: formattedReviews,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum),
                    },
                    averageRating: Math.round(avgRating * 10) / 10,
                })
            );
        } catch (error) {
            console.error('🔴 [ReviewController] Get attraction reviews error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể lấy danh sách đánh giá điểm đến',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Create a review for an attraction
    static async createAttractionReview(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { attractionId } = req.params;
            const { rate, content, images = [] } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa đăng nhập'));
                return;
            }

            // Verify attraction exists
            const attraction = await prisma.attraction.findUnique({
                where: { attractionId },
            });

            if (!attraction) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy điểm đến'));
                return;
            }

            // Check if user already reviewed this attraction
            const existingReview = await prisma.attractionReview.findFirst({
                where: {
                    attractionId,
                    userId,
                },
            });

            if (existingReview) {
                res.status(400).json(ResponseUtils.error('Bạn đã đánh giá điểm đến này rồi'));
                return;
            }

            // Create review
            const review = await prisma.attractionReview.create({
                data: {
                    userId,
                    attractionId,
                    rate,
                    content,
                    images,
                },
                include: {
                    user: {
                        select: {
                            userId: true,
                            name: true,
                            profilePhoto: true,
                            email: true,
                        },
                    },
                },
            });

            const formattedReview = {
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
                updatedAt: review.updatedAt.toISOString(),
            };

            res.status(201).json(
                ResponseUtils.success('Tạo đánh giá điểm đến thành công', formattedReview)
            );
        } catch (error) {
            console.error('🔴 [ReviewController] Create attraction review error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể tạo đánh giá điểm đến',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Update an attraction review
    static async updateAttractionReview(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { reviewId } = req.params;
            const { rate, content, images } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa đăng nhập'));
                return;
            }

            // Check if review exists and belongs to user
            const review = await prisma.attractionReview.findUnique({
                where: { reviewId },
            });

            if (!review) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy đánh giá'));
                return;
            }

            if (review.userId !== userId) {
                res.status(403).json(ResponseUtils.error('Bạn không có quyền chỉnh sửa đánh giá này'));
                return;
            }

            // Update review
            const updatedReview = await prisma.attractionReview.update({
                where: { reviewId },
                data: {
                    ...(rate && { rate }),
                    ...(content && { content }),
                    ...(images !== undefined && { images }),
                },
                include: {
                    user: {
                        select: {
                            userId: true,
                            name: true,
                            profilePhoto: true,
                            email: true,
                        },
                    },
                },
            });

            const formattedReview = {
                reviewId: updatedReview.reviewId,
                user: {
                    id: updatedReview.user.userId,
                    name: updatedReview.user.name,
                    avatar: updatedReview.user.profilePhoto || '/default-avatar.png',
                },
                rating: updatedReview.rate,
                content: updatedReview.content,
                images: updatedReview.images,
                date: updatedReview.createdAt.toISOString(),
                updatedAt: updatedReview.updatedAt.toISOString(),
            };

            res.status(200).json(
                ResponseUtils.success('Cập nhật đánh giá điểm đến thành công', formattedReview)
            );
        } catch (error) {
            console.error('🔴 [ReviewController] Update attraction review error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể cập nhật đánh giá điểm đến',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Delete an attraction review
    static async deleteAttractionReview(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { reviewId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa đăng nhập'));
                return;
            }

            // Check if review exists and belongs to user
            const review = await prisma.attractionReview.findUnique({
                where: { reviewId },
            });

            if (!review) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy đánh giá'));
                return;
            }

            if (review.userId !== userId && req.user?.role !== 'ADMIN') {
                res.status(403).json(ResponseUtils.error('Bạn không có quyền xóa đánh giá này'));
                return;
            }

            // Delete review
            await prisma.attractionReview.delete({
                where: { reviewId },
            });

            res.status(200).json(ResponseUtils.success('Xóa đánh giá điểm đến thành công'));
        } catch (error) {
            console.error('🔴 [ReviewController] Delete attraction review error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể xóa đánh giá điểm đến',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Like/Unlike a tour review
    static async toggleTourReviewLike(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { reviewId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa đăng nhập'));
                return;
            }

            // Get review
            const review = await prisma.tourReview.findUnique({
                where: { reviewId },
                select: { likes: true },
            });

            if (!review) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy đánh giá'));
                return;
            }

            // Toggle like
            const currentLikes = review.likes || [];
            const isLiked = currentLikes.includes(userId);
            const newLikes = isLiked
                ? currentLikes.filter((id) => id !== userId)
                : [...currentLikes, userId];

            // Update review
            const updatedReview = await prisma.tourReview.update({
                where: { reviewId },
                data: { likes: newLikes },
                select: {
                    reviewId: true,
                    likes: true,
                },
            });

            res.status(200).json(
                ResponseUtils.success(isLiked ? 'Bỏ thích thành công' : 'Thích thành công', {
                    reviewId: updatedReview.reviewId,
                    likesCount: updatedReview.likes?.length || 0,
                    liked: !isLiked,
                })
            );
        } catch (error) {
            console.error('🔴 [ReviewController] Toggle tour review like error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
            console.error('🔴 Error details:', errorMessage);
            if (error instanceof Error) {
                console.error('🔴 Error stack:', error.stack);
            }
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể thực hiện thích đánh giá',
                    errorMessage
                )
            );
        }
    }

    // Like/Unlike an attraction review
    static async toggleAttractionReviewLike(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { reviewId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa đăng nhập'));
                return;
            }

            // Get review
            const review = await prisma.attractionReview.findUnique({
                where: { reviewId },
                select: { likes: true },
            });

            if (!review) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy đánh giá'));
                return;
            }

            // Toggle like
            const currentLikes = review.likes || [];
            const isLiked = currentLikes.includes(userId);
            const newLikes = isLiked
                ? currentLikes.filter((id) => id !== userId)
                : [...currentLikes, userId];

            // Update review
            const updatedReview = await prisma.attractionReview.update({
                where: { reviewId },
                data: { likes: newLikes },
                select: {
                    reviewId: true,
                    likes: true,
                },
            });

            res.status(200).json(
                ResponseUtils.success(isLiked ? 'Bỏ thích thành công' : 'Thích thành công', {
                    reviewId: updatedReview.reviewId,
                    likesCount: updatedReview.likes?.length || 0,
                    liked: !isLiked,
                })
            );
        } catch (error) {
            console.error('🔴 [ReviewController] Toggle attraction review like error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
            console.error('🔴 Error details:', errorMessage);
            if (error instanceof Error) {
                console.error('🔴 Error stack:', error.stack);
            }
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể thực hiện thích đánh giá',
                    errorMessage
                )
            );
        }
    }
}


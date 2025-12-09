import { UpdateProfileRequest, UserService } from "@/services/userService";
import { AuthenticatedRequest, GetUsersRequest } from "@/types";
import { ResponseUtils } from "@/utils";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserController {
  // Get user profile
  static async getProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const result = await UserService.getProfile(req.user.userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to get profile",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  // Update user profile
  static async updateProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const updateData: UpdateProfileRequest = req.body;
      const result = await UserService.updateProfile(
        req.user.userId,
        updateData
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to update profile",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  // Update user avatar
  static async updateAvatar(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      if (!req.file) {
        res.status(400).json(ResponseUtils.error("No file uploaded"));
        return;
      }

      const result = await UserService.updateAvatar(req.user.userId, req.file);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to update avatar",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  // Get users
  static async getUsers(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const result = await UserService.getUsers(req.query);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to get users",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  static async updateUserStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const { isActive } = req.body;
      const result = await UserService.updateUserStatus(userId, isActive);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to ban user",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  static async deleteUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const userId = req.params.id;

      // Users can only delete their own account, or admin can delete any account
      if (req.user.userId !== userId && req.user.role !== "ADMIN") {
        res
          .status(403)
          .json(ResponseUtils.error("You can only delete your own account"));
        return;
      }

      const result = await UserService.deleteUser(userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to delete user",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  static async getUserStatistics(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const result = await UserService.getUserStatistics();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to get user statistics",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  // Toggle favorite tour
  static async toggleFavoriteTour(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const { tourId } = req.body;

      if (!tourId) {
        res.status(400).json(ResponseUtils.error("Tour ID is required"));
        return;
      }

      const result = await UserService.toggleFavoriteTour(
        req.user.userId,
        tourId
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to toggle favorite tour",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  // Get favorite tours
  static async getFavoriteTours(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const result = await UserService.getFavoriteTours(req.user.userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to get favorite tours",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  // Change password
  static async changePassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const { oldPassword, newPassword } = req.body;
      const result = await UserService.changePassword(
        req.user.userId,
        oldPassword,
        newPassword
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to change password",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  // Get user's tour reviews
  static async getUserTourReviews(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const reviews = await prisma.tourReview.findMany({
        where: { userId: req.user.userId },
        include: {
          tour: {
            select: {
              tourId: true,
              name: true,
              images: true,
            },
          },
          user: {
            select: {
              userId: true,
              name: true,
              profilePhoto: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const formattedReviews = reviews.map((review) => ({
        reviewId: review.reviewId,
        user: {
          id: review.user.userId,
          name: review.user.name,
          avatar: review.user.profilePhoto || "/default-avatar.png",
        },
        rating: review.rate,
        content: review.content,
        images: review.images,
        likesCount: review.likes?.length || 0,
        liked: false,
        date: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
        tour: review.tour,
      }));

      res
        .status(200)
        .json(
          ResponseUtils.success(
            "Lấy danh sách đánh giá tour thành công",
            formattedReviews
          )
        );
    } catch (error) {
      console.error("🔴 [UserController] Get user tour reviews error:", error);
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to get user tour reviews",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }

  // Get user's attraction reviews
  static async getUserAttractionReviews(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error("User not authenticated"));
        return;
      }

      const reviews = await prisma.attractionReview.findMany({
        where: { userId: req.user.userId },
        include: {
          attraction: {
            select: {
              attractionId: true,
              name: true,
              images: true,
            },
          },
          user: {
            select: {
              userId: true,
              name: true,
              profilePhoto: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const formattedReviews = reviews.map((review) => ({
        reviewId: review.reviewId,
        user: {
          id: review.user.userId,
          name: review.user.name,
          avatar: review.user.profilePhoto || "/default-avatar.png",
        },
        rating: review.rate,
        content: review.content,
        images: review.images,
        likesCount: review.likes?.length || 0,
        liked: false,
        date: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
        attraction: review.attraction,
      }));

      res
        .status(200)
        .json(
          ResponseUtils.success(
            "Lấy danh sách đánh giá địa điểm thành công",
            formattedReviews
          )
        );
    } catch (error) {
      console.error(
        "🔴 [UserController] Get user attraction reviews error:",
        error
      );
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Failed to get user attraction reviews",
            error instanceof Error ? error.message : "Unknown error"
          )
        );
    }
  }
}

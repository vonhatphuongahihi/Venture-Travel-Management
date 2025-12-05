import { PasswordUtils, ResponseUtils } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { CloudinaryService } from "./cloudinaryService";
import { GetUsersRequest } from "@/types";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const cloudinaryService = new CloudinaryService();

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
}

export interface UpdateAvatarResponse {
  success: boolean;
  message: string;
  data?: {
    profilePhoto: string;
    user: any;
  };
  error?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeEmailRequest {
  email: string;
}

export class UserService {
  // Update user profile
  static async updateProfile(userId: string, updateData: UpdateProfileRequest) {
    try {
      // Validate and clean update data
      const cleanData: any = {};

      if (updateData.name !== undefined && updateData.name !== null) {
        cleanData.name = updateData.name.trim();
      }

      if (updateData.phone !== undefined && updateData.phone !== null) {
        cleanData.phone = updateData.phone.trim();
      }

      if (updateData.address !== undefined && updateData.address !== null) {
        cleanData.address = updateData.address.trim();
      }

      if (updateData.gender !== undefined && updateData.gender !== null) {
        cleanData.gender = updateData.gender.trim();
      }

      if (
        updateData.dateOfBirth !== undefined &&
        updateData.dateOfBirth !== null &&
        updateData.dateOfBirth !== ""
      ) {
        try {
          cleanData.dateOfBirth = new Date(updateData.dateOfBirth);
        } catch (error) {
          console.error("Invalid date format:", updateData.dateOfBirth);
        }
      }

      cleanData.updatedAt = new Date();

      const updatedUser = await prisma.user.update({
        where: { userId: userId },
        data: cleanData,
        select: {
          userId: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          profilePhoto: true,
          dateOfBirth: true,
          gender: true,
          role: true,
          isActive: true,
          isVerified: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return ResponseUtils.success("Cập nhật thông tin thành công", updatedUser);
    } catch (error) {
      return ResponseUtils.error(
        "Cập nhật thông tin thất bại",
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
    }
  }

  // Update user avatar
  static async updateAvatar(
    userId: string,
    file: Express.Multer.File
  ): Promise<UpdateAvatarResponse> {
    try {
      // Get current user to check existing avatar
      const currentUser = await prisma.user.findUnique({
        where: { userId: userId },
        select: { profilePhoto: true, name: true },
      });

      if (!currentUser) {
        return {
          success: false,
          message: "Người dùng không tồn tại",
        };
      }

      // Generate unique filename
      const fileName = `user_${userId}_${Date.now()}`;

      // Upload new image to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(
        file.buffer,
        fileName,
        "venture-travel/avatars"
      );

      // Delete old avatar if exists
      if (currentUser.profilePhoto) {
        const oldPublicId = cloudinaryService.extractPublicId(currentUser.profilePhoto);
        if (oldPublicId) {
          await cloudinaryService.deleteImage(oldPublicId).catch(() => {
            // Ignore deletion errors
            console.log("Failed to delete old avatar");
          });
        }
      }

      // Update user profile photo in database
      const updatedUser = await prisma.user.update({
        where: { userId: userId },
        data: {
          profilePhoto: uploadResult.secure_url,
          updatedAt: new Date(),
        },
        select: {
          userId: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          profilePhoto: true,
          dateOfBirth: true,
          gender: true,
          role: true,
          isActive: true,
          isVerified: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: "Cập nhật ảnh đại diện thành công",
        data: {
          profilePhoto: uploadResult.secure_url,
          user: updatedUser,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Cập nhật ảnh đại diện thất bại",
        error: error instanceof Error ? error.message : "Lỗi không xác định",
      };
    }
  }

  // Get user profile
  static async getProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { userId: userId },
        select: {
          userId: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          profilePhoto: true,
          dateOfBirth: true,
          gender: true,
          role: true,
          isActive: true,
          isVerified: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return ResponseUtils.error("Người dùng không tồn tại");
      }

      return ResponseUtils.success("Lấy thông tin thành công", user);
    } catch (error) {
      return ResponseUtils.error(
        "Lấy thông tin thất bại",
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
    }
  }

  // Toggle favorite tour (add or remove)
  static async toggleFavoriteTour(userId: string, tourId: string) {
    try {
      // Check if tour exists
      const tour = await prisma.tour.findUnique({
        where: { tourId: tourId },
      });

      if (!tour) {
        return ResponseUtils.error("Tour không tồn tại");
      }

      // Check if already in favorites
      const existingFavorite = await prisma.favorite_tours.findFirst({
        where: {
          user_id: userId,
          tour_id: tourId,
        },
      });

      if (existingFavorite) {
        // Remove from favorites
        await prisma.favorite_tours.delete({
          where: {
            favorite_id: existingFavorite.favorite_id,
          },
        });

        return ResponseUtils.success("Đã xóa khỏi danh sách yêu thích", {
          isFavorite: false,
        });
      } else {
        // Add to favorites - generate UUID for favorite_id
        await prisma.favorite_tours.create({
          data: {
            favorite_id: uuidv4(),
            user_id: userId,
            tour_id: tourId,
          },
        });

        return ResponseUtils.success("Đã thêm vào danh sách yêu thích", {
          isFavorite: true,
        });
      }
    } catch (error) {
      return ResponseUtils.error(
        "Thất bại khi cập nhật tour yêu thích",
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
    }
  }

  // Get favorite tours with details
  static async getFavoriteTours(userId: string) {
    try {
      // Get user's favorite tours from junction table
      const favoriteTours = await prisma.favorite_tours.findMany({
        where: { user_id: userId },
        include: {
          tours: {
            select: {
              tourId: true,
              name: true,
              images: true,
              about: true,
              duration: true,
              categories: true,
              createdAt: true,
              isActive: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Filter only active tours and map to tour data
      const activeTours = favoriteTours
        .filter(fav => fav.tours.isActive)
        .map(fav => fav.tours);

      return ResponseUtils.success("Lấy danh sách tour yêu thích thành công", activeTours);
    } catch (error) {
      return ResponseUtils.error(
        "Lấy danh sách tour yêu thích thất bại",
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
    }
  }

  // Get users
  static async getUsers(filterParams: GetUsersRequest) {
    try {
      const { page, limit, search, isActive } = filterParams;

      const filterClause: any = {
        where: {
          OR: search
            ? [
              {
                name: {
                  contains: search.trim().toLowerCase(),
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search.trim().toLowerCase(),
                  mode: "insensitive",
                },
              },
            ]
            : undefined,
          isActive: isActive !== undefined ? isActive : undefined,
        },
      };

      if (page && limit) {
        filterClause["skip"] = (page - 1) * limit;
        filterClause["take"] = Number(limit);
      }

      const users = await prisma.user.findMany(filterClause);

      const totalUsers = await prisma.user.count({
        where: filterClause.where,
      });

      return ResponseUtils.success("Lấy danh sách người dùng thành công", {
        content: users,
        totalElements: totalUsers,
        totalPages: Math.ceil(totalUsers / (limit || totalUsers)),
        page: page || 1,
        limit: limit || totalUsers,
      });
    } catch (error) {
      return ResponseUtils.error(
        "Failed to get users",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async updateUserStatus(userId: string, isActive: boolean) {
    try {
      const user = await prisma.user.update({
        where: { userId: userId },
        data: { isActive: isActive },
        select: {
          userId: true,
          name: true,
          email: true,
          isActive: true,
        },
      });

      return ResponseUtils.success("User status updated successfully", user);
    } catch (error) {
      return ResponseUtils.error(
        "Failed to update user status",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async deleteUser(userId: string) {
    try {
      await prisma.user.delete({
        where: { userId: userId },
      });
      return ResponseUtils.success("User deleted successfully");
    } catch (error) {
      return ResponseUtils.error(
        "Failed to delete user",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  static async getUserStatistics() {
    try {
      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({
        where: { isActive: true },
      });
      const inactiveUsers = await prisma.user.count({
        where: { isActive: false },
      });
      const newUsersInMonth = await prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
        },
      });

      return ResponseUtils.success("User statistics retrieved successfully", {
        totalUsers,
        activeUsers,
        inactiveUsers,
        newUsersInMonth,
      });
    } catch (error) {
      return ResponseUtils.error(
        "Failed to get user statistics",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  // Change password
  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { userId: userId },
        select: { password: true },
      });

      if (!user) {
        return ResponseUtils.error("Người dùng không tồn tại");
      }

      if (!user.password) {
        return ResponseUtils.error(
          "Tài khoản này không có mật khẩu. Vui lòng đăng nhập bằng Google."
        );
      }

      // Verify old password
      const isOldPasswordValid = await PasswordUtils.comparePassword(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return ResponseUtils.error("Mật khẩu cũ không đúng");
      }

      // Hash new password
      const hashedNewPassword = await PasswordUtils.hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { userId: userId },
        data: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      });

      return ResponseUtils.success("Đổi mật khẩu thành công");
    } catch (error) {
      return ResponseUtils.error(
        "Đổi mật khẩu thất bại",
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
    }
  }

  // Change email
  static async changeEmail(userId: string, newEmail: string) {
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: newEmail },
      });

      if (existingUser && existingUser.userId !== userId) {
        return ResponseUtils.error("Email này đã được sử dụng bởi tài khoản khác");
      }

      // Update email and reset verification
      const updatedUser = await prisma.user.update({
        where: { userId: userId },
        data: {
          email: newEmail,
          isVerified: false, // Reset verification when email changes
          updatedAt: new Date(),
        },
        select: {
          userId: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          profilePhoto: true,
          dateOfBirth: true,
          gender: true,
          role: true,
          isActive: true,
          isVerified: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return ResponseUtils.success(
        "Đổi email thành công. Vui lòng xác thực email mới.",
        updatedUser
      );
    } catch (error) {
      return ResponseUtils.error(
        "Đổi email thất bại",
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
    }
  }
}

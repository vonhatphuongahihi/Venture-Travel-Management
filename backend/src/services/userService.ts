import { ResponseUtils } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { CloudinaryService } from "./cloudinaryService";
import { GetUsersRequest } from "@/types";

const prisma = new PrismaClient();
const cloudinaryService = new CloudinaryService();

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface UpdateAvatarResponse {
  success: boolean;
  message: string;
  data?: {
    profile_photo: string;
    user: any;
  };
  error?: string;
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
        updateData.date_of_birth !== undefined &&
        updateData.date_of_birth !== null &&
        updateData.date_of_birth !== ""
      ) {
        try {
          cleanData.date_of_birth = new Date(updateData.date_of_birth);
        } catch (error) {
          console.error("Invalid date format:", updateData.date_of_birth);
        }
      }

      cleanData.updated_at = new Date();

      const updatedUser = await prisma.user.update({
        where: { user_id: userId },
        data: cleanData,
        select: {
          user_id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          profile_photo: true,
          date_of_birth: true,
          gender: true,
          role: true,
          is_active: true,
          is_verified: true,
          last_login: true,
          created_at: true,
          updated_at: true,
        },
      });

      return ResponseUtils.success(
        "Cập nhật thông tin thành công",
        updatedUser
      );
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
        where: { user_id: userId },
        select: { profile_photo: true, name: true },
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
      if (currentUser.profile_photo) {
        const oldPublicId = cloudinaryService.extractPublicId(
          currentUser.profile_photo
        );
        if (oldPublicId) {
          await cloudinaryService.deleteImage(oldPublicId).catch(() => {
            // Ignore deletion errors
            console.log("Failed to delete old avatar");
          });
        }
      }

      // Update user profile photo in database
      const updatedUser = await prisma.user.update({
        where: { user_id: userId },
        data: {
          profile_photo: uploadResult.secure_url,
          updated_at: new Date(),
        },
        select: {
          user_id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          profile_photo: true,
          date_of_birth: true,
          gender: true,
          role: true,
          is_active: true,
          is_verified: true,
          last_login: true,
          created_at: true,
          updated_at: true,
        },
      });

      return {
        success: true,
        message: "Cập nhật ảnh đại diện thành công",
        data: {
          profile_photo: uploadResult.secure_url,
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
        where: { user_id: userId },
        select: {
          user_id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          profile_photo: true,
          date_of_birth: true,
          gender: true,
          role: true,
          is_active: true,
          is_verified: true,
          last_login: true,
          created_at: true,
          updated_at: true,
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

  // Get users
  static async getUsers(filterParams: GetUsersRequest) {
    try {
      const { page, limit, search } = filterParams;

      const filterClause: any = {};

      if (search) {
        filterClause["where"]["OR"] = [
          { name: { contains: search.trim(), mode: "insensitive" } },
          { email: { contains: search.trim(), mode: "insensitive" } },
        ];
      }

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
}

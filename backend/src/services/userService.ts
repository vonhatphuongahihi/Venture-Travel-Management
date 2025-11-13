import { ResponseUtils } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { CloudinaryService } from "./cloudinaryService";

const prisma = new PrismaClient();
const cloudinaryService = new CloudinaryService();

export interface UpdateProfileRequest {
    name?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
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
}

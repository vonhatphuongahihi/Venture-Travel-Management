import { Request, Response } from 'express';
import { CloudinaryService } from '@/services/cloudinaryService';
import { ResponseUtils } from '@/utils';
import { AuthenticatedRequest } from '@/types';

const cloudinaryService = new CloudinaryService();

export class UploadController {
    // Upload single image (for review images)
    static async uploadReviewImage(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa đăng nhập'));
                return;
            }

            if (!req.file) {
                res.status(400).json(ResponseUtils.error('Không có file được upload'));
                return;
            }

            // Generate unique filename
            const fileName = `review_${req.user.userId}_${Date.now()}`;

            // Upload image to Cloudinary (sử dụng method riêng cho review images)
            const uploadResult = await cloudinaryService.uploadReviewImage(
                req.file.buffer,
                fileName
            );

            res.status(200).json(
                ResponseUtils.success('Upload ảnh thành công', {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                })
            );
        } catch (error) {
            console.error('🔴 [UploadController] Upload review image error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể upload ảnh',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Upload multiple images (for review images)
    static async uploadReviewImages(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa đăng nhập'));
                return;
            }

            if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
                res.status(400).json(ResponseUtils.error('Không có file được upload'));
                return;
            }

            // req.files should be an array from multer.array()
            const files = req.files as Express.Multer.File[];

            // Limit to 10 images max
            if (files.length > 10) {
                res.status(400).json(ResponseUtils.error('Tối đa 10 ảnh được upload'));
                return;
            }

            const uploadPromises = files.map(async (file: Express.Multer.File, index: number) => {
                const fileName = `review_${req.user!.userId}_${Date.now()}_${index}`;
                // Upload image to Cloudinary (sử dụng method riêng cho review images)
                const uploadResult = await cloudinaryService.uploadReviewImage(
                    file.buffer,
                    fileName
                );
                return {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                };
            });

            const uploadResults = await Promise.all(uploadPromises);

            res.status(200).json(
                ResponseUtils.success('Upload ảnh thành công', {
                    images: uploadResults,
                })
            );
        } catch (error) {
            console.error('🔴 [UploadController] Upload review images error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể upload ảnh',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }

    // Upload multiple images (for review images)
    static async uploadTourImages(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {

            if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
                res.status(400).json(ResponseUtils.error('Không có file được upload'));
                return;
            }
            const files = req.files as Express.Multer.File[];

            // Limit to 10 images max
            if (files.length > 10) {
                res.status(400).json(ResponseUtils.error('Tối đa 10 ảnh được upload'));
                return;
            }

            const uploadPromises = files.map(async (file: Express.Multer.File, index: number) => {
                const fileName = `tour_${Date.now()}_${index}`;
                // Upload image to Cloudinary (sử dụng method riêng cho review images)
                const uploadResult = await cloudinaryService.uploadTourImage(
                    file.buffer,
                    fileName
                );
                return {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                };
            });

            const uploadResults = await Promise.all(uploadPromises);

            res.status(200).json(
                ResponseUtils.success('Upload ảnh thành công', {
                    images: uploadResults,
                })
            );
        } catch (error) {
            console.error('🔴 [UploadController] Upload review images error:', error);
            res.status(500).json(
                ResponseUtils.error(
                    'Không thể upload ảnh',
                    error instanceof Error ? error.message : 'Lỗi không xác định'
                )
            );
        }
    }
}


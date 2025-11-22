import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

export class CloudinaryService {
    constructor() {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    // Upload image to Cloudinary (generic method)
    async uploadImage(
        fileBuffer: Buffer,
        fileName: string,
        folder: string = 'venture-travel/avatars',
        options?: {
            width?: number;
            height?: number;
            crop?: 'fill' | 'fit' | 'scale' | 'limit';
            quality?: string;
            format?: string;
        }
    ): Promise<UploadApiResponse> {
        try {
            const {
                width = 400,
                height = 400,
                crop = 'fill',
                quality = 'auto',
                format = 'webp'
            } = options || {};

            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: folder,
                        public_id: fileName,
                        transformation: [
                            { width, height, crop },
                            { quality },
                            { format }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result as UploadApiResponse);
                        }
                    }
                ).end(fileBuffer);
            });
        } catch (error) {
            throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Upload review image to Cloudinary (specific method for reviews)
    async uploadReviewImage(
        fileBuffer: Buffer,
        fileName: string
    ): Promise<UploadApiResponse> {
        return this.uploadImage(
            fileBuffer,
            fileName,
            'venture-travel/reviews',
            {
                width: 1200,
                height: 1200,
                crop: 'limit', // Giữ tỷ lệ gốc
                quality: 'auto',
                format: 'webp'
            }
        );
    }

    // Delete image from Cloudinary
    async deleteImage(publicId: string): Promise<any> {
        try {
            return await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Get optimized image URL
    getOptimizedUrl(publicId: string, width: number = 400, height: number = 400): string {
        return cloudinary.url(publicId, {
            width,
            height,
            crop: 'fill',
            quality: 'auto',
            format: 'webp'
        });
    }

    // Extract public ID from Cloudinary URL
    extractPublicId(url: string): string | null {
        try {
            const regex = /\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/;
            const match = url.match(regex);
            return match ? match[1] : null;
        } catch (error) {
            return null;
        }
    }
}

export default new CloudinaryService();
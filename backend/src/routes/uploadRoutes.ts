import { Router } from 'express';
import { UploadController } from '@/controllers/uploadController';
import { authenticateToken } from '@/middleware/auth';
import { uploadSingle, uploadMultiple } from '@/middleware/upload';

const router = Router();

// Upload single review image
router.post(
    '/review/single',
    authenticateToken,
    uploadSingle('image'),
    UploadController.uploadReviewImage
);

// Upload multiple review images
router.post(
    '/review/multiple',
    authenticateToken,
    uploadMultiple('images', 10),
    UploadController.uploadReviewImages
);


export default router;


import { UserController } from '@/controllers/userController';
import { authenticateToken } from '@/middleware/auth';
import { uploadSingle } from '@/middleware/upload';
import { updateProfileSchema, validateRequest } from '@/middleware/validation';
import { Router } from 'express';

const router = Router();

router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), UserController.updateProfile);
router.put('/avatar', authenticateToken, uploadSingle('avatar'), UserController.updateAvatar);

export default router;

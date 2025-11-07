import { AdminController } from '@/controllers/adminController';
import { authenticateToken } from '@/middleware/auth';
import { uploadSingle } from '@/middleware/upload';
import { updateProfileSchema, changePasswordSchema, changeEmailSchema, validateRequest } from '@/middleware/validation';
import { Router } from 'express';

const router = Router();

router.get('/profile', authenticateToken, AdminController.getProfile);
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), AdminController.updateProfile);
router.put('/avatar', authenticateToken, uploadSingle('avatar'), AdminController.updateAvatar);
router.put('/password', authenticateToken, validateRequest(changePasswordSchema), AdminController.changePassword);
router.put('/email', authenticateToken, validateRequest(changeEmailSchema), AdminController.changeEmail);

export default router;


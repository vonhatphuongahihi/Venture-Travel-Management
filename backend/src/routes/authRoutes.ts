import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest, registerSchema, loginSchema, verifyEmailSchema } from '@/middleware/validation';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/verify-email', validateRequest(verifyEmailSchema), AuthController.verifyEmail);
router.post('/logout', authenticateToken, AuthController.logout);

export default router;

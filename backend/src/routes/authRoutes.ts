import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { PasswordResetController } from '@/controllers/passwordResetController';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest, registerSchema, loginSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } from '@/middleware/validation';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/verify-email', validateRequest(verifyEmailSchema), AuthController.verifyEmail);
router.post('/logout', authenticateToken, AuthController.logout);

// Password Reset Routes
router.post('/forgot-password', validateRequest(forgotPasswordSchema), PasswordResetController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), PasswordResetController.resetPassword);
router.get('/verify-reset-token', PasswordResetController.verifyResetToken);

export default router;

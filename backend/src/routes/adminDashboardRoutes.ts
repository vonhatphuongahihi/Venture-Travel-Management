import { AdminDashboardController } from '@/controllers/adminDashboardController';
import { authenticateToken } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// All routes require authentication and admin role
router.get('/stats', authenticateToken, AdminDashboardController.getDashboardStats);
router.get('/monthly-data', authenticateToken, AdminDashboardController.getMonthlyData);
router.get('/top-tours', authenticateToken, AdminDashboardController.getTopTours);
router.get('/top-places', authenticateToken, AdminDashboardController.getTopPlaces);

export default router;
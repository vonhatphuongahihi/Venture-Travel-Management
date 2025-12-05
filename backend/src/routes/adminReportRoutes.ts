import { AdminReportController } from '@/controllers/adminReportController';
import { authenticateToken } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// All routes require authentication and admin role
router.get('/stats', authenticateToken, AdminReportController.getReportsStats);
router.get('/monthly', authenticateToken, AdminReportController.getMonthlyData);
router.get('/tour-status', authenticateToken, AdminReportController.getTourByStatus);
router.get('/top-tours', authenticateToken, AdminReportController.getTopTours);
router.get('/bookings-by-attraction', authenticateToken, AdminReportController.getBookingsByAttraction);

export default router;
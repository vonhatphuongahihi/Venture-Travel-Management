import { Router } from 'express';
import authRoutes from './authRoutes';

const router = Router();

router.use('/auth', authRoutes);

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;

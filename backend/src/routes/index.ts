import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;

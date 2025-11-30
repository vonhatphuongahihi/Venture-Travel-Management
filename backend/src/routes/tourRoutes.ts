import { Router } from 'express';
import { TourController } from '@/controllers/tourController';

const router = Router();

// Get all tours with optional filters
router.get('/', TourController.getTours);

// Get all categories
router.get('/categories', TourController.getCategories);

// Get tour by ID
router.get('/:id', TourController.getTourById);

export default router;


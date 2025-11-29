import { Router } from 'express';
import { ProvinceController } from '@/controllers/provinceController';

const router = Router();

// Get all provinces
router.get('/', ProvinceController.getProvinces);

// Get province by slug
router.get('/:slug', ProvinceController.getProvinceBySlug);

// Get tours by province ID
router.get('/:id/tours', ProvinceController.getToursByProvince);

// Get attractions by province ID
router.get('/:id/attractions', ProvinceController.getAttractionsByProvince);

// Get reviews by province ID
router.get('/:id/reviews', ProvinceController.getReviewsByProvince);

export default router;


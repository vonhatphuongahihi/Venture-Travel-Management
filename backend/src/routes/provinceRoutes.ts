import { Router } from 'express';
import { ProvinceController } from '@/controllers/provinceController';

const router = Router();

// Get all provinces
router.get('/', ProvinceController.getProvinces);

// Get province by slug
router.get('/:slug', ProvinceController.getProvinceBySlug);

export default router;



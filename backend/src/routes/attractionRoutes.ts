import { Router } from 'express';
import { AttractionController } from '@/controllers/attractionController';

const router = Router();

// Get top destinations (attractions with most tours)
router.get('/top', AttractionController.getTopDestinations);

// Get all attractions with optional filters
router.get('/', AttractionController.getAttractions);

// Get attraction by ID
router.get('/:id', AttractionController.getAttractionById);

export default router;


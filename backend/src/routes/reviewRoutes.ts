import { Router } from 'express';
import { ReviewController } from '@/controllers/reviewController';
import { authenticateToken, optionalAuthenticateToken } from '@/middleware/auth';
import {
    validateRequest,
    validateQuery,
    createTourReviewSchema,
    updateTourReviewSchema,
    createAttractionReviewSchema,
    updateAttractionReviewSchema,
    getReviewsQuerySchema,
} from '@/middleware/validation';

const router = Router();

// Tour Review Routes - Like routes must come BEFORE routes with :tourId to avoid conflicts
router.post(
    '/tours/:reviewId/like',
    authenticateToken,
    ReviewController.toggleTourReviewLike
);

router.get(
    '/tours/:tourId',
    optionalAuthenticateToken, // Optional: populate req.user if token exists
    validateQuery(getReviewsQuerySchema),
    ReviewController.getTourReviews
);

router.post(
    '/tours/:tourId',
    authenticateToken,
    validateRequest(createTourReviewSchema),
    ReviewController.createTourReview
);

router.put(
    '/tours/:reviewId',
    authenticateToken,
    validateRequest(updateTourReviewSchema),
    ReviewController.updateTourReview
);

router.delete(
    '/tours/:reviewId',
    authenticateToken,
    ReviewController.deleteTourReview
);

// Attraction Review Routes - Like routes must come BEFORE routes with :attractionId to avoid conflicts
router.post(
    '/attractions/:reviewId/like',
    authenticateToken,
    ReviewController.toggleAttractionReviewLike
);

router.get(
    '/attractions/:attractionId',
    optionalAuthenticateToken, // Optional: populate req.user if token exists
    validateQuery(getReviewsQuerySchema),
    ReviewController.getAttractionReviews
);

router.post(
    '/attractions/:attractionId',
    authenticateToken,
    validateRequest(createAttractionReviewSchema),
    ReviewController.createAttractionReview
);

router.put(
    '/attractions/:reviewId',
    authenticateToken,
    validateRequest(updateAttractionReviewSchema),
    ReviewController.updateAttractionReview
);

router.delete(
    '/attractions/:reviewId',
    authenticateToken,
    ReviewController.deleteAttractionReview
);

export default router;


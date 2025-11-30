import { Router } from 'express';
import { RouteController } from '@/controllers/routeController';

const router = Router();

// Get route for a tour (includes all stops)
router.get('/tour/:tourId', RouteController.getRoute);

// Get route between two specific points
router.get('/between-points', RouteController.getRouteBetweenPoints);

export default router;


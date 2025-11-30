import { AdminDashboardService } from '@/services/adminDashboardService';
import { AuthenticatedRequest } from '@/types';
import { ResponseUtils } from '@/utils';
import { Response } from 'express';

export class AdminDashboardController {
  // Get dashboard statistics
  static async getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      // Check if user is admin
      if (req.user.role !== 'ADMIN') {
        res.status(403).json(ResponseUtils.error('Access denied. Admin role required.'));
        return;
      }

      const result = await AdminDashboardService.getDashboardStats();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json(ResponseUtils.error(
        'Failed to get dashboard stats',
        error instanceof Error ? error.message : 'Unknown error'
      ));
    }
  }

  // Get monthly data
  static async getMonthlyData(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      if (req.user.role !== 'ADMIN') {
        res.status(403).json(ResponseUtils.error('Access denied. Admin role required.'));
        return;
      }

      const result = await AdminDashboardService.getMonthlyData();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json(ResponseUtils.error(
        'Failed to get monthly data',
        error instanceof Error ? error.message : 'Unknown error'
      ));
    }
  }

  // Get top tours
  static async getTopTours(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      if (req.user.role !== 'ADMIN') {
        res.status(403).json(ResponseUtils.error('Access denied. Admin role required.'));
        return;
      }

      const result = await AdminDashboardService.getTopTours();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json(ResponseUtils.error(
        'Failed to get top tours',
        error instanceof Error ? error.message : 'Unknown error'
      ));
    }
  }

  // Get top places
  static async getTopPlaces(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ResponseUtils.error('User not authenticated'));
        return;
      }

      if (req.user.role !== 'ADMIN') {
        res.status(403).json(ResponseUtils.error('Access denied. Admin role required.'));
        return;
      }

      const result = await AdminDashboardService.getTopPlaces();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json(ResponseUtils.error(
        'Failed to get top places',
        error instanceof Error ? error.message : 'Unknown error'
      ));
    }
  }
}
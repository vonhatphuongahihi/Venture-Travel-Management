import { Request, Response } from 'express';
import { adminReportService } from '../services/adminReportService';

export class AdminReportController {
  // Lấy thống kê tổng quan
  static async getReportsStats(req: Request, res: Response) {
    try {
      const stats = await adminReportService.getReportsStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching reports stats:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy thống kê tổng quan',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Lấy dữ liệu đặt chỗ theo tháng
  static async getMonthlyData(req: Request, res: Response) {
    try {
      const data = await adminReportService.getMonthlyBookingData();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy dữ liệu theo tháng',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Lấy thống kê tour theo trạng thái
  static async getTourByStatus(req: Request, res: Response) {
    try {
      const data = await adminReportService.getTourByStatusData();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching tour status data:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy dữ liệu trạng thái tour',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Lấy top tours
  static async getTopTours(req: Request, res: Response) {
    try {
      const { sortBy } = req.query;
      const validSortOptions = ['popularity', 'rating', 'revenue'];
      const sortOption = validSortOptions.includes(sortBy as string) ? sortBy as 'popularity' | 'rating' | 'revenue' : 'popularity';
      
      const data = await adminReportService.getTopTours(sortOption);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching top tours:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy danh sách top tours',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Lấy số lượt đặt theo điểm đến
  static async getBookingsByAttraction(req: Request, res: Response) {
    try {
      const data = await adminReportService.getBookingsByAttraction();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching bookings by attraction:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy dữ liệu đặt chỗ theo điểm đến',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
import { ResponseUtils } from '@/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalPlaces: number;
  totalActiveTours: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface TopTour {
  id: string;
  name: string;
  bookingCount: number;
}

export interface TopPlace {
  id: string;
  name: string;
  visitCount: number;
}

export class AdminDashboardService {
  // Get dashboard statistics
  static async getDashboardStats() {
    try {
      // Get total users (excluding admins)
      const totalUsers = await prisma.user.count({
        where: { role: 'USER' }
      });

      // Get total bookings (pending + confirmed)
      const totalBookings = await prisma.booking.count({
        where: {
          status: {
            in: ['pending', 'confirmed']
          }
        }
      });

      // Get total places/attractions
      const totalPlaces = await prisma.attraction.count();

      // Get total active tours
      const totalActiveTours = await prisma.tour.count({
        where: { isActive: true }
      });

      const stats: DashboardStats = {
        totalUsers,
        totalBookings,
        totalPlaces,
        totalActiveTours
      };

      return ResponseUtils.success('Lấy thống kê thành công', stats);
    } catch (error) {
      return ResponseUtils.error(
        'Lỗi khi lấy thống kê',
        error instanceof Error ? error.message : 'Lỗi không xác định'
      );
    }
  }

  // Get monthly revenue and customer data
  static async getMonthlyData() {
    try {
      const currentYear = new Date().getFullYear();
      const monthlyData: MonthlyData[] = [];

      for (let month = 1; month <= 12; month++) {
        const startDate = new Date(currentYear, month - 1, 1);
        const endDate = new Date(currentYear, month, 0, 23, 59, 59);

        // Get revenue for the month
        const revenue = await prisma.booking.aggregate({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            },
            status: 'confirmed'
          },
          _sum: {
            totalPrice: true
          }
        });

        // Get booking count for the month (pending + confirmed)
        const bookings = await prisma.booking.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            },
            status: {
              in: ['pending', 'confirmed']
            }
          }
        });

        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        monthlyData.push({
          month: monthNames[month - 1],
          revenue: (revenue._sum.totalPrice || 0) / 1000000, // Convert to millions
          bookings: bookings
        });
      }

      return ResponseUtils.success('Lấy dữ liệu tháng thành công', monthlyData);
    } catch (error) {
      return ResponseUtils.error(
        'Lỗi khi lấy dữ liệu tháng',
        error instanceof Error ? error.message : 'Lỗi không xác định'
      );
    }
  }

  // Get top tours by booking count (via ticket types)
  static async getTopTours() {
    try {
      const topTours = await prisma.tour.findMany({
        select: {
          tourId: true,
          name: true,
          ticketTypes: {
            select: {
              _count: {
                select: {
                  bookings: {
                    where: {
                      status: 'confirmed'
                    }
                  }
                }
              }
            }
          }
        },
        take: 5
      });

      const formattedTours: TopTour[] = topTours.map(tour => {
        const totalBookings = tour.ticketTypes.reduce((sum, ticketType) => {
          return sum + ticketType._count.bookings;
        }, 0);
        
        return {
          id: tour.tourId,
          name: tour.name,
          bookingCount: totalBookings
        };
      }).sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 5);

      return ResponseUtils.success('Lấy top tour thành công', formattedTours);
    } catch (error) {
      return ResponseUtils.error(
        'Lỗi khi lấy top tour',
        error instanceof Error ? error.message : 'Lỗi không xác định'
      );
    }
  }

  // Get top places by booking count (based on tours that go through them)
  static async getTopPlaces() {
    try {
      // Get attractions with their tour stops and count bookings through those tours
      const attractionsWithBookings = await prisma.attraction.findMany({
        select: {
          attractionId: true,
          name: true,
          tourStops: {
            select: {
              tour: {
                select: {
                  ticketTypes: {
                    select: {
                      _count: {
                        select: {
                          bookings: {
                            where: {
                              status: 'confirmed'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Calculate booking count for each attraction
      const formattedPlaces: TopPlace[] = attractionsWithBookings.map(place => {
        const totalBookings = place.tourStops.reduce((placeSum, tourStop) => {
          const tourBookings = tourStop.tour.ticketTypes.reduce((tourSum, ticketType) => {
            return tourSum + ticketType._count.bookings;
          }, 0);
          return placeSum + tourBookings;
        }, 0);

        return {
          id: place.attractionId,
          name: place.name,
          visitCount: totalBookings
        };
      })
      .filter(place => place.visitCount > 0) // Only include places with bookings
      .sort((a, b) => b.visitCount - a.visitCount) // Sort by booking count desc
      .slice(0, 5); // Take top 5

      return ResponseUtils.success('Lấy top điểm đến thành công', formattedPlaces);
    } catch (error) {
      return ResponseUtils.error(
        'Lỗi khi lấy top điểm đến',
        error instanceof Error ? error.message : 'Lỗi không xác định'
      );
    }
  }
}

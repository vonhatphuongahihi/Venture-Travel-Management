import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MonthlyBookingData {
  month: string;
  bookings: number;
  revenue: number;
}

interface TourByStatusData {
  name: string;
  value: number;
  color: string;
}

interface TopTourData {
  tourId: string;
  tourName: string;
  bookings: number;
  revenue: number;
  avgRating: number;
  growthRate: number;
}

interface BookingByAttractionData {
  attractionName: string;
  bookings: number;
  revenue: number;
}

interface AdminReportsStats {
  totalTickets: number;
  totalBookings: number;
  totalRevenue: number;
  ticketGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
}

export class AdminReportService {
  // Thống kê tổng quan
  async getReportsStats(): Promise<AdminReportsStats> {
    const currentMonth = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(currentMonth.getMonth() - 1);
    
    const startOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const endOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

    // Tổng số vé của tháng hiện tại (tính từ booking_details)
    const currentMonthTicketsResult = await prisma.booking_details.aggregate({
      _sum: {
        quantity: true
      },
      where: {
        bookings: {
          created_at: {
            gte: startOfCurrentMonth
          },
          status: 'confirmed'
        }
      }
    });

    // Tổng đặt chỗ của tháng hiện tại
    const currentMonthBookings = await prisma.bookings.count({
      where: {
        created_at: {
          gte: startOfCurrentMonth
        },
        status: 'confirmed'
      }
    });

    // Tổng doanh thu của tháng hiện tại
    const currentMonthRevenueResult = await prisma.bookings.aggregate({
      _sum: {
        total_price: true
      },
      where: {
        created_at: {
          gte: startOfCurrentMonth
        },
        status: 'confirmed'
      }
    });

    // Thống kê số vé tháng trước
    const lastMonthTicketsResult = await prisma.booking_details.aggregate({
      _sum: {
        quantity: true
      },
      where: {
        bookings: {
          created_at: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          },
          status: 'confirmed'
        }
      }
    });

    // Thống kê đặt chỗ tháng trước
    const lastMonthBookings = await prisma.bookings.count({
      where: {
        created_at: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        },
        status: 'confirmed'
      }
    });

    // Thống kê doanh thu tháng trước
    const lastMonthRevenueResult = await prisma.bookings.aggregate({
      _sum: {
        total_price: true
      },
      where: {
        created_at: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        },
        status: 'confirmed'
      }
    });

    // Tính tỷ lệ tăng trưởng
    const currentMonthTickets = currentMonthTicketsResult._sum.quantity || 0;
    const lastMonthTickets = lastMonthTicketsResult._sum.quantity || 0;
    const currentMonthRevenue = currentMonthRevenueResult._sum.total_price || 0;
    const lastMonthRevenue = lastMonthRevenueResult._sum.total_price || 0;

    const ticketGrowth = lastMonthTickets > 0 ? ((currentMonthTickets - lastMonthTickets) / lastMonthTickets) * 100 : 0;
    const bookingGrowth = lastMonthBookings > 0 ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0;
    const revenueGrowth = lastMonthRevenue > 0 ? 
      ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    return {
      totalTickets: currentMonthTickets,
      totalBookings: currentMonthBookings,
      totalRevenue: currentMonthRevenue,
      ticketGrowth,
      bookingGrowth,
      revenueGrowth
    };
  }

  // Dữ liệu đặt chỗ theo tháng (7 tháng gần nhất)
  async getMonthlyBookingData(): Promise<MonthlyBookingData[]> {
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const data: MonthlyBookingData[] = [];
    const currentDate = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      // Tháng tiếp theo, ngày đầu tiên để bao gồm toàn bộ tháng hiện tại
      const startOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      startOfNextMonth.setHours(0, 0, 0, 0);

      const bookingCount = await prisma.bookings.count({
        where: {
          created_at: {
            gte: startOfMonth,
            lt: startOfNextMonth
          },
          status: 'confirmed'
        }
      });

      const revenueResult = await prisma.bookings.aggregate({
        _sum: {
          total_price: true
        },
        where: {
          created_at: {
            gte: startOfMonth,
            lt: startOfNextMonth
          },
          status: 'confirmed'
        }
      });

      data.push({
        month: monthNames[date.getMonth()],
        bookings: bookingCount,
        revenue: revenueResult._sum.total_price || 0
      });
    }

    return data;
  }

  // Thống kê tour theo trạng thái đặt chỗ
  async getTourByStatusData(): Promise<TourByStatusData[]> {
    const confirmedBookings = await prisma.bookings.count({
      where: { status: 'confirmed' }
    });

    const pendingBookings = await prisma.bookings.count({
      where: { status: 'pending' }
    });

    const cancelledBookings = await prisma.bookings.count({
      where: { status: 'cancelled' }
    });

    const total = confirmedBookings + pendingBookings + cancelledBookings;

    if (total === 0) {
      return [
        { name: 'Đã xác nhận', value: 0, color: '#22c55e' },
        { name: 'Chờ xử lý', value: 0, color: '#f59e0b' },
        { name: 'Đã hủy', value: 0, color: '#ef4444' }
      ];
    }

    return [
      { name: 'Đã xác nhận', value: Math.round((confirmedBookings / total) * 100), color: '#22c55e' },
      { name: 'Chờ xử lý', value: Math.round((pendingBookings / total) * 100), color: '#f59e0b' },
      { name: 'Đã hủy', value: Math.round((cancelledBookings / total) * 100), color: '#ef4444' }
    ];
  }

  // Top tours phổ biến nhất
  async getTopTours(sortBy: 'popularity' | 'rating' | 'revenue' = 'popularity'): Promise<TopTourData[]> {
    const tours = await prisma.tour.findMany({
      include: {
        ticketTypes: {
          include: {
            bookings: {
              where: {
                status: 'confirmed'
              }
            }
          }
        },
        reviews: true
      }
    });

    const tourStats = tours.map(tour => {
      const totalBookings = tour.ticketTypes.reduce((sum, ticketType) => sum + ticketType.bookings.length, 0);
      const totalRevenue = tour.ticketTypes.reduce((sum, ticketType) => 
        sum + ticketType.bookings.reduce((bookingSum, booking) => bookingSum + booking.total_price, 0), 0
      );
      
      const avgRating = tour.reviews.length > 0 ? 
        tour.reviews.reduce((sum, review) => sum + review.rate, 0) / tour.reviews.length : 0;

      // Tính tỷ lệ tăng trưởng (giả sử so với tháng trước)
      const currentMonth = new Date();
      const startOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const currentMonthBookings = tour.ticketTypes.reduce((sum, ticketType) => 
        sum + ticketType.bookings.filter(booking => booking.created_at >= startOfCurrentMonth).length, 0
      );

      const lastMonth = new Date();
      lastMonth.setMonth(currentMonth.getMonth() - 1);
      const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
      const endOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

      const lastMonthBookings = tour.ticketTypes.reduce((sum, ticketType) => 
        sum + ticketType.bookings.filter(booking => 
          booking.created_at >= startOfLastMonth && booking.created_at <= endOfLastMonth
        ).length, 0
      );

      const growthRate = lastMonthBookings > 0 ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0;

      return {
        tourId: tour.tourId,
        tourName: tour.name,
        bookings: totalBookings,
        revenue: totalRevenue,
        avgRating: Number(avgRating.toFixed(1)),
        growthRate: Number(growthRate.toFixed(1))
      };
    });

    // Sắp xếp theo tiêu chí
    let sortedTours: TopTourData[];
    switch (sortBy) {
      case 'rating':
        sortedTours = tourStats.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'revenue':
        sortedTours = tourStats.sort((a, b) => b.revenue - a.revenue);
        break;
      default:
        sortedTours = tourStats.sort((a, b) => b.bookings - a.bookings);
    }

    return sortedTours.slice(0, 5);
  }

  // Số lượt đặt tour theo điểm đến (attractions)
  async getBookingsByAttraction(): Promise<BookingByAttractionData[]> {
    const attractionBookings = await prisma.attraction.findMany({
      include: {
        tourStops: {
          include: {
            tour: {
              include: {
                ticketTypes: {
                  include: {
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
    });

    const attractionStats = attractionBookings.map(attraction => {
      const bookingCount = attraction.tourStops.reduce((sum, stop) => {
        return sum + stop.tour.ticketTypes.reduce((ticketSum, ticketType) => {
          return ticketSum + ticketType.bookings.length;
        }, 0);
      }, 0);

      const revenue = attraction.tourStops.reduce((sum, stop) => {
        return sum + stop.tour.ticketTypes.reduce((ticketSum, ticketType) => {
          return ticketSum + ticketType.bookings.reduce((bookingSum, booking) => {
            return bookingSum + booking.total_price;
          }, 0);
        }, 0);
      }, 0);

      return {
        attractionName: attraction.name,
        bookings: bookingCount,
        revenue
      };
    }).filter(item => item.bookings > 0) // Chỉ lấy những attraction có booking
      .sort((a, b) => b.bookings - a.bookings) // Sắp xếp theo số booking
      .slice(0, 10); // Top 10

    return attractionStats;
  }
}

export const adminReportService = new AdminReportService();
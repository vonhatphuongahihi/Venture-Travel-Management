import {
  Calendar,
  MapPin,
  Package,
  Users
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "../components/Layout";
import AdminDashboardAPI, {
  type DashboardStats,
  type MonthlyData,
  type TopPlace,
  type TopTour
} from "../services/adminDashboardAPI";

// Hàm format tháng tiếng Việt
const formatMonthName = (monthStr: string) => {
  const monthNames = {
    'Jan': 'Tháng 1',
    'Feb': 'Tháng 2', 
    'Mar': 'Tháng 3',
    'Apr': 'Tháng 4',
    'May': 'Tháng 5',
    'Jun': 'Tháng 6',
    'Jul': 'Tháng 7',
    'Aug': 'Tháng 8',
    'Sep': 'Tháng 9',
    'Oct': 'Tháng 10',
    'Nov': 'Tháng 11',
    'Dec': 'Tháng 12'
  } as Record<string, string>;
  
  return monthNames[monthStr] || monthStr;
};

// Interface cho tooltip props
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

// Custom tooltip cho biểu đồ doanh thu
const RevenueTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{formatMonthName(label)}</p>
        <p className="text-blue-600">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Doanh thu: {payload[0].value?.toLocaleString()} triệu đồng
        </p>
      </div>
    );
  }
  return null;
};

// Custom tooltip cho biểu đồ booking
const BookingTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{formatMonthName(label)}</p>
        <p className="text-green-600">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Số lượt đặt: {payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalPlaces: 0,
    totalActiveTours: 0
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topTours, setTopTours] = useState<TopTour[]>([]);
  const [topPlaces, setTopPlaces] = useState<TopPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all dashboard data in parallel
        const [statsResponse, monthlyResponse, toursResponse, placesResponse] = await Promise.all([
          AdminDashboardAPI.getDashboardStats(),
          AdminDashboardAPI.getMonthlyData(),
          AdminDashboardAPI.getTopTours(),
          AdminDashboardAPI.getTopPlaces()
        ]);

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }

        if (monthlyResponse.success && monthlyResponse.data) {
          setMonthlyData(monthlyResponse.data);
        }

        if (toursResponse.success && toursResponse.data) {
          setTopTours(toursResponse.data);
        }

        if (placesResponse.success && placesResponse.data) {
          setTopPlaces(placesResponse.data);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Layout title="Tổng quan">
        <div className="p-2 space-y-4">
          {/* Loading Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm border animate-pulse">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>

          {/* Loading Charts */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm border animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-8"></div>
                <div className="h-[300px] bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>

          {/* Loading Lists */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm border animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex flex-col flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout title="Tổng quan">
      <div className="p-2 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] text-[#0A0A0A]">Tổng số khách hàng</p>
              <Users className="h-[20px] w-[20px] text-[#45556C]" />
            </div>
            <h2 className="text-[22px] font-bold">{stats.totalUsers.toLocaleString()}</h2>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] text-[#0A0A0A]">Tổng số đơn đặt</p>
              <Calendar className="h-[20px] w-[20px] text-[#45556C]" />
            </div>
            <h2 className="text-[22px] font-bold">{stats.totalBookings.toLocaleString()}</h2>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] text-[#0A0A0A]">Tổng số điểm đến</p>
              <MapPin className="h-[20px] w-[20px] text-[#45556C]" />
            </div>
            <h2 className="text-[22px] font-bold">{stats.totalPlaces.toLocaleString()}</h2>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] text-[#0A0A0A]">Tổng số tour đang mở</p>
              <Package className="h-[20px] w-[20px] text-[#45556C]" />
            </div>
            <h2 className="text-[22px] font-bold">{stats.totalActiveTours.toLocaleString()}</h2>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-semibold text-[#0A0A0A]">Doanh thu theo tháng</h3>
              <span className="text-[14px] text-[#0A0A0A] italic">Đơn vị: triệu đồng</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<RevenueTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" fill="#bae6fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="font-semibold text-[#0A0A0A] mb-8">
              Số lượt đặt tour theo tháng
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<BookingTooltip />} />
                <Area type="monotone" dataKey="bookings" stroke="#22c55e" fill="#bbf7d0" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top lists */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="font-semibold text-[#0A0A0A] mb-6">Top tour hot nhất</h3>
            <ul className="space-y-4">
              {topTours.map((tour, idx) => (
                  <li key={tour.id} className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-500 rounded-full text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[15px]">{tour.name}</span>
                      <span className="text-xs text-[#6B7280]">{tour.bookingCount} lượt đặt tour</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="font-semibold text-[#0A0A0A] mb-6">Top điểm đến hot nhất</h3>
            <ul className="space-y-4">
              {topPlaces.map((place, idx) => (
                  <li key={place.id} className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-500 rounded-full text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[15px]">{place.name}</span>
                      <span className="text-xs text-[#6B7280]">{place.visitCount} lượt đặt tour</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
import {
  Calendar,
  MapPin,
  Package,
  Users
} from "lucide-react";
import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "../components/Layout";

const data = [
  { name: "Jan", revenue: 2500, customers: 2500 },
  { name: "Feb", revenue: 1500, customers: 1800 },
  { name: "Mar", revenue: 10000, customers: 9000 },
  { name: "Apr", revenue: 4000, customers: 5000 },
  { name: "May", revenue: 5000, customers: 6000 },
  { name: "Jun", revenue: 5500, customers: 5000 },
  { name: "Jul", revenue: 6000, customers: 5200 },
];

const tour_hot = [
  { name: "Tour du lịch biển Nha Trang", customers: 1500 },
  { name: "Tour du lịch Vũng Tàu", customers: 1200 },
  { name: "Tour du lịch Tây Bắc", customers: 1100 },
  { name: "Tour du lịch Phú Yên", customers: 900 },
  { name: "Tour du lịch Đà Lạt", customers: 850 },
];

const places_hot = [
  { name: "Tháp Bà Ponagar", visits: 3000 },
  { name: "Hồ Xuân Hương", visits: 2500 },
  { name: "Núi Bà Đen", visits: 2000 },
  { name: "Bãi biển Mũi Né", visits: 1800 },
  { name: "Kinh thành Huế", visits: 1500 },
];

const Dashboard: React.FC = () => {
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
            <h2 className="text-[22px] font-bold">45,231</h2>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] text-[#0A0A0A]">Tổng số đơn đặt</p>
              <Calendar className="h-[20px] w-[20px] text-[#45556C]" />
            </div>
            <h2 className="text-[22px] font-bold">20,125</h2>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] text-[#0A0A0A]">Tổng số điểm đến</p>
              <MapPin className="h-[20px] w-[20px] text-[#45556C]" />
            </div>
            <h2 className="text-[22px] font-bold">127</h2>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] text-[#0A0A0A]">Tổng số tour đang mở</p>
              <Package className="h-[20px] w-[20px] text-[#45556C]" />
            </div>
            <h2 className="text-[22px] font-bold">23</h2>
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
              <AreaChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" fill="#bae6fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-sm border">
            <h3 className="font-semibold text-[#0A0A0A] mb-8">
              Số lượt khách theo tháng
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="customers" stroke="#22c55e" fill="#bbf7d0" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top lists */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="font-semibold text-[#0A0A0A] mb-6">Top tour hot nhất</h3>
            <ul className="space-y-4">
              {tour_hot.map((tour, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-500 rounded-full text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[15px]">{tour.name}</span>
                      <span className="text-xs text-[#6B7280]">{tour.customers} khách tham quan</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="font-semibold text-[#0A0A0A] mb-6">Top điểm đến hot nhất</h3>
            <ul className="space-y-4">
              {places_hot.map((place, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-500 rounded-full text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[15px]">{place.name}</span>
                      <span className="text-xs text-[#6B7280]">{place.visits} lượt tham quan</span>
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

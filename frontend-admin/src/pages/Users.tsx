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

const Users: React.FC = () => {
  return (
    <Layout title="Người dùng">
    <div className="p-4 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow-sm">
          <p className="text-sm text-gray-500">Tổng số khách hàng</p>
          <h2 className="text-2xl font-bold">45,231</h2>
        </div>
        <div className="p-4 bg-white rounded shadow-sm">
          <p className="text-sm text-gray-500">Tổng số đơn đặt</p>
          <h2 className="text-2xl font-bold">20,125</h2>
        </div>
        <div className="p-4 bg-white rounded shadow-sm">
          <p className="text-sm text-gray-500">Tổng số điểm đến</p>
          <h2 className="text-2xl font-bold">127</h2>
        </div>
        <div className="p-4 bg-white rounded shadow-sm">
          <p className="text-sm text-gray-500">Tổng số tour đang mở</p>
          <h2 className="text-2xl font-bold">23</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Doanh thu theo tháng (đơn vị: triệu đồng)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#38bdf8" fill="#bae6fd" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Số lượt khách theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={250}>
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
        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Top tour hot nhất</h3>
          <ul className="space-y-2">
            {["Tour du lịch biển Nha Trang", "Tour du lịch Vũng Tàu", "Tour du lịch Tây Bắc", "Tour du lịch Phú Yên", "Tour du lịch Đà Lạt"].map(
              (tour, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center bg-sky-100 text-sky-500 rounded-full text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span>{tour}</span>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Top điểm đến hot nhất</h3>
          <ul className="space-y-2">
            {["Tháp Bà Ponagar", "Hồ Xuân Hương", "Núi Bà Đen", "Bãi biển Mũi Né", "Kinh thành Huế"].map(
              (place, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center bg-sky-100 text-sky-500 rounded-full text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span>{place}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Users;
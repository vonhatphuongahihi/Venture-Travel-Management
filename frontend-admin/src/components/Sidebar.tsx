import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Settings,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar: React.FC = () => {
  const menus = [
    { name: "Tổng quan", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Tour", icon: Package, path: "/tours" },
    { name: "Đặt tour", icon: Calendar, path: "/bookings" },
    { name: "Điểm đến", icon: MapPin, path: "/attractions" },
    { name: "Báo cáo", icon: BarChart3, path: "/reports" },
    { name: "Người dùng", icon: Users, path: "/users" },
    { name: "Cài đặt", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="w-60 h-screen bg-[#F8FAFC] border-r flex flex-col justify-between fixed left-0">
      {/* Logo */}
      <div>
        <div className="p-6 flex border-b">
          <img src={logo} alt="Venture Logo" className="w-36" />
        </div>

        {/* Menu */}
        <ul className="mt-3 space-y-1">
          {menus.map((menu) => {
            const Icon = menu.icon;
            return (
              <li key={menu.name}>
                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 pl-3 pr-5 py-[10px] transition rounded-md mx-3
                    ${
                      isActive
                        ? "bg-[#E4F8FF] text-[#09BCFD] font-medium border border-[#BBEBFD] rounded-lg"
                        : "text-[#45556C] hover:bg-[#F0F4F8] hover:text-black"
                    }`
                  }
                >
                  <Icon size={22} />
                  <span className="ml-1">{menu.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout */}
      <div className="border-t">
        <button className="flex items-center gap-3 w-full px-6 py-4 text-[#45556C] hover:bg-red-50 hover:text-red-600 transition">
          <LogOut size={22} />
          <span className="ml-1">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
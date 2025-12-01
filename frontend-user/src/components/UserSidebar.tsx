import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, User, History, Heart, Settings, FileText, Shield, Info, LogOut } from "lucide-react";
import avatarImg from "@/assets/beach-destination.jpg";

interface UserSidebarProps {
  user: any;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
  activeLink?: string;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ user, isSidebarOpen, setIsSidebarOpen, handleLogout, activeLink = "profile" }) => {
  return (
    <aside className="w-full lg:w-72 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 self-start lg:sticky lg:top-24 z-10 overflow-hidden">
      {/* Header Sidebar: Click để toggle trên mobile */}
      <div 
        className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-between cursor-pointer lg:cursor-default border-b border-primary/10"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.profilePhoto || avatarImg}
              alt="avatar"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md"
            />
          </div>
          <div>
            <div className="text-base font-semibold text-slate-800 line-clamp-1">
              {user?.name || "Người dùng"}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full"></span>
              Thành viên
            </div>
          </div>
        </div>
        {/* Icon toggle chỉ hiện trên mobile/tablet */}
        <div className="lg:hidden text-slate-400 transition-transform duration-200">
          {isSidebarOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Menu Nav: Ẩn/Hiện trên mobile dựa vào state, luôn hiện trên desktop */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Main Navigation */}
        <nav className="p-4 space-y-1">
          <Link
            to="/profile"
            className={`flex items-center gap-3 text-sm py-3 px-4 rounded-lg transition-all duration-200 ${
              activeLink === "profile" 
                ? "bg-primary text-white" 
                : "text-slate-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <User size={18} />
            <span>Hồ sơ của tôi</span>
          </Link>
          
          <Link
            to="/booking-history"
            className={`flex items-center gap-3 text-sm py-3 px-4 rounded-lg transition-all duration-200 ${
              activeLink === "booking-history" 
                ? "bg-primary text-white" 
                : "text-slate-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <History size={18} />
            <span>Lịch sử đặt tour</span>
          </Link>
          
          <Link
            to="/favorite-tours"
            className={`flex items-center gap-3 text-sm py-3 px-4 rounded-lg transition-all duration-200 ${
              activeLink === "favorite-tours" 
                ? "bg-primary text-white" 
                : "text-slate-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <Heart size={18} />
            <span>Tour yêu thích</span>
          </Link>
          
          <Link
            to="#"
            className={`flex items-center gap-3 text-sm py-3 px-4 rounded-lg transition-all duration-200 ${
              activeLink === "settings" 
                ? "bg-primary text-white" 
                : "text-slate-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <Settings size={18} />
            <span>Cài đặt</span>
          </Link>
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-slate-200"></div>

        {/* Secondary Navigation */}
        <nav className="p-4 space-y-1">
          <Link
            to="/terms"
            className="block text-sm py-3 px-4 rounded-lg text-slate-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
          >
            Điều khoản sử dụng
          </Link>
          
          <Link
            to="/policy"
            className="block text-sm py-3 px-4 rounded-lg text-slate-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
          >
            Chính sách bảo mật
          </Link>
          
          <Link
            to="/about"
            className="block text-sm py-3 px-4 rounded-lg text-slate-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
          >
            Về VENTURE
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4 pt-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full text-sm py-3 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
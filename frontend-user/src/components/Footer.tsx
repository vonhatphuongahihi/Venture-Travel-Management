import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Plane } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#E5F8FF] text-primary">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="relative">
                  <img src='/src/assets/logo.png' alt="logo" className="h-11 w-30 mb-2" />
                </div>
                <div className="relative ml-2">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
            <p className="text-sm text-primary text-justify">
              Công ty du lịch hàng đầu Việt Nam với hơn 10 năm kinh nghiệm.
              Chúng tôi cam kết mang đến những trải nghiệm du lịch tuyệt vời nhất.
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors">
                <Facebook className="h-4 w-4 text-primary" />
              </div>
              <div className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors">
                <Instagram className="h-4 w-4 text-primary" />
              </div>
              <div className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors">
                <Youtube className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-4 ml-4">
            <h3 className="font-semibold text-lg text-primary">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/tour"
                  className="text-primary hover:text-[#0891B2] transition-colors"
                >
                  Tours du lịch
                </Link>
              </li>
              <li>
                <Link
                  to="/destination"
                  className="text-primary hover:text-[#0891B2] transition-colors"
                >
                  Điểm đến
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="text-primary hover:text-[#0891B2] transition-colors"
                >
                  Bản đồ
                </Link>
              </li>
              <li>
                <Link
                  to="/explore-360"
                  className="text-primary hover:text-[#0891B2] transition-colors"
                >
                  Khám phá 360°
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-primary hover:text-[#0891B2] transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 ml-6">
            <h3 className="font-semibold text-lg text-primary">Dịch vụ</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary hover:text-[#0891B2] transition-colors">Tour trọn gói</a></li>
              <li><a href="#" className="text-primary hover:text-[#0891B2] transition-colors">Đặt Tour</a></li>
            </ul>
          </div>

          <div className="space-y-4 ml-8">
            <h3 className="font-semibold text-lg text-primary">Liên hệ</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary/60" />
                <span className="text-primary">123 Nguyễn Huệ, Q1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary/60" />
                <span className="text-primary">0365 486 141</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary/60" />
                <span className="text-primary">contact@venture.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary/80 text-sm">
            © 2025 Venture. Bản quyền thuộc về chúng tôi.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              to="/terms"
              className="text-primary/70 hover:text-[#0891B2] transition-colors"
            >
              Điều khoản
            </Link>
            <Link
              to="/policy"
              className="text-primary/70 hover:text-[#0891B2] transition-colors"
            >
              Chính sách
            </Link>
            <Link
              to="/support"
              className="text-primary/70 hover:text-[#0891B2] transition-colors"
            >
              Hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
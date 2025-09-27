import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8" />
              <span className="text-xl font-bold">VietTravel</span>
            </div>
            <p className="text-white/80 text-sm">
              Công ty du lịch hàng đầu Việt Nam với hơn 10 năm kinh nghiệm. 
              Chúng tôi cam kết mang đến những trải nghiệm du lịch tuyệt vời nhất.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#tours" className="text-white/80 hover:text-white transition-colors">Tours du lịch</a></li>
              <li><a href="#destinations" className="text-white/80 hover:text-white transition-colors">Điểm đến</a></li>
              <li><a href="#map" className="text-white/80 hover:text-white transition-colors">Bản đồ</a></li>
              <li><a href="#events" className="text-white/80 hover:text-white transition-colors">Sự kiện</a></li>
              <li><a href="#blog" className="text-white/80 hover:text-white transition-colors">Blog du lịch</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Dịch vụ</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Tour trọn gói</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Đặt vé máy bay</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Đặt khách sạn</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Thuê xe</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Visa & hộ chiếu</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Liên hệ</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-white/60" />
                <span className="text-white/80">123 Nguyễn Huệ, Q1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-white/60" />
                <span className="text-white/80">1900 1234</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-white/60" />
                <span className="text-white/80">info@viettravel.com</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Đăng ký nhận tin</h4>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button variant="secondary" size="sm">
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2024 VietTravel. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-white/60 hover:text-white transition-colors">Điều khoản</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Chính sách</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Hỗ trợ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
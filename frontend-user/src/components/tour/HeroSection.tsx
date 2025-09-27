import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Search, Instagram, Facebook, Phone } from "lucide-react";
import heroImage from "@/assets/hero-vietnam.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Vietnam travel destinations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-primary/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[26px] md:text-[42px] font-medium font-marmelad mb-6 leading-tight">
            Việt Nam quê hương ta
          </h1>

          <p className="text-base md:text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Trải nghiệm những chuyến du lịch tuyệt vời với bản đồ tương tác, khám phá các
            địa điểm hấp dẫn khắp Việt Nam.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tour theo địa điểm, tên tour..."
                className="w-full pl-12 pr-28 py-4 rounded-xl bg-white/70 text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl font-inter font-medium"
              >
                Tìm kiếm
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center font-black italic">
              <div className="text-2xl mb-2">120+</div>
              <div className="text-white/80">Tours du lịch</div>
            </div>
            <div className="text-center font-black italic">
              <div className="text-2xl mb-2">200+</div>
              <div className="text-white/80">Điểm đến</div>
            </div>
            <div className="text-center font-black italic">
              <div className="text-2xl mb-2">1000+</div>
              <div className="text-white/80">Khách hàng</div>
            </div>
            <div className="text-center font-black italic">
              <div className="text-2xl mb-2">63</div>
              <div className="text-white/80">Tỉnh thành</div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="absolute bottom-10 left-10 flex gap-4 hidden lg:flex">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110">
          <Instagram className="h-6 w-6 text-white" />
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110">
          <Facebook className="h-6 w-6 text-white" />
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110">
          <Phone className="h-6 w-6 text-white" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
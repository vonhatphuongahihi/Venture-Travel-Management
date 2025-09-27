import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Khám phá
            <span className="block text-transparent bg-gradient-to-r from-white to-blue-200 bg-clip-text">
              Việt Nam
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Trải nghiệm những chuyến du lịch tuyệt vời với bản đồ tương tác và lịch trình được cá nhân hóa
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              <MapPin className="h-5 w-5" />
              Khám phá Tours
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
              <Calendar className="h-5 w-5" />
              Xem bản đồ
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">120+</div>
              <div className="text-white/80">Tours du lịch</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-white/80">Khách hàng hài lòng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">63</div>
              <div className="text-white/80">Tỉnh thành</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 left-10 floating-element hidden lg:block">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
          <Users className="h-6 w-6 mb-2 text-blue-200" />
          <div className="text-xs text-white/70">đang khám phá</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
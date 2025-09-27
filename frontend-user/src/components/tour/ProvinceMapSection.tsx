import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ProvinceMapSection = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadLeaflet = async () => {
      // Load Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
      document.head.appendChild(link);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
      script.onload = () => {
        if (mapRef.current && (window as any).L) {
          const map = (window as any).L.map(mapRef.current).setView([14.0583, 108.2772], 5);

          (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          // Add Vietnam marker
          (window as any).L.marker([14.0583, 108.2772])
            .addTo(map)
            .bindPopup("Việt Nam")
            .openPopup();

          // Add province markers
          const provinces = [
            { name: "Hà Nội", coords: [21.0285, 105.8542] },
            { name: "TP. Hồ Chí Minh", coords: [10.8231, 106.6297] },
            { name: "Đà Nẵng", coords: [16.0544, 108.2022] },
            { name: "Hạ Long", coords: [20.9101, 107.1839] },
            { name: "Hội An", coords: [15.8801, 108.3380] },
            { name: "Nha Trang", coords: [12.2388, 109.1967] },
            { name: "Đà Lạt", coords: [11.9404, 108.4583] },
            { name: "Phú Quốc", coords: [10.2899, 103.9840] }
          ];

          provinces.forEach(province => {
            (window as any).L.marker(province.coords)
              .addTo(map)
              .bindPopup(province.name);
          });
        }
      };
      document.head.appendChild(script);
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const regions = [
    {
      id: "north",
      name: "Miền Bắc",
      provinces: [
        "Hà Nội",
        "Hạ Long",
        "Ninh Bình",
        "Hà Giang",
        "Mai Châu",
        "Sapa"
      ]
    },
    {
      id: "central",
      name: "Miền Trung",
      provinces: [
        "Đà Nẵng",
        "Hội An",
        "Nha Trang",
        "Đà Lạt",
        "Huế",
        "Phong Nha"
      ]
    },
    {
      id: "south",
      name: "Miền Nam",
      provinces: [
        "Côn Đảo",
        "Cần Thơ",
        "Phú Quốc"
      ]
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="container">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-yellow-200 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Compass className="h-4 w-4" />
            Khám phá
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ĐỊA ĐIỂM DU LỊCH 63 TỈNH THÀNH
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Trải nghiệm du lịch khắp 63 tỉnh thành Việt Nam, khám phá các địa danh đặc sắc và những nét văn hóa độc đáo của từng vùng miền
          </p>
        </div>

        {/* Main Content */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Left Side - Map */}
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-4">Vietnam Map</div>
            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-gray-200">
              <div
                ref={mapRef}
                className="w-full h-96 rounded-lg"
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Khám phá 3 miền Việt Nam
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Việt Nam mở ra như một bức tranh sống động trải dài khắp ba miền, mỗi miền sở hữu vẻ đẹp riêng biệt. Tất cả cùng dệt nên một câu chuyện tuyệt đẹp về thiên nhiên, văn hóa và những cuộc phiêu lưu.
              </p>
            </div>

            {/* Regions List */}
            <div className="space-y-6">
              {regions.map((region) => (
                <div key={region.id}>
                  <h4 className="text-xl font-bold text-primary mb-3 relative">
                    {region.name}
                    <div className="absolute top-7 left-0 w-[60px] h-1 bg-primary mt-1"></div>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {region.provinces.map((province, index) => (
                      <div key={index} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                        {province}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProvinceMapSection;
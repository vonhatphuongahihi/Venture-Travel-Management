import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Layers, Navigation, Filter } from "lucide-react";
import { useState } from "react";

const MapSection = () => {
  const [activeLayer, setActiveLayer] = useState("tours");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const layers = [
    { id: "tours", label: "Tours", icon: MapPin, count: 120 },
    { id: "destinations", label: "Điểm đến", icon: Navigation, count: 85 },
    { id: "events", label: "Sự kiện", icon: Layers, count: 32 },
  ];

  const regions = [
    { id: "all", label: "Tất cả", count: 237 },
    { id: "north", label: "Miền Bắc", count: 89 },  
    { id: "central", label: "Miền Trung", count: 76 },
    { id: "south", label: "Miền Nam", count: 72 },
  ];

  // Mock tour points for visualization
  const tourPoints = [
    { id: 1, name: "Vịnh Hạ Long", x: 65, y: 25, type: "beach", status: "ongoing" },
    { id: 2, name: "Sapa", x: 45, y: 20, type: "mountain", status: "upcoming" },
    { id: 3, name: "Hội An", x: 55, y: 55, type: "cultural", status: "ongoing" },
    { id: 4, name: "Phú Quốc", x: 35, y: 85, type: "beach", status: "upcoming" },
    { id: 5, name: "Đà Lạt", x: 50, y: 70, type: "mountain", status: "completed" },
    { id: 6, name: "Hồ Chí Minh", x: 50, y: 80, type: "city", status: "ongoing" },
  ];

  const getPointColor = (status: string) => {
    switch (status) {
      case "ongoing": return "bg-blue-500 animate-pulse";
      case "upcoming": return "bg-green-500";
      case "completed": return "bg-gray-400";
      default: return "bg-primary";
    }
  };

  return (
    <section id="map" className="py-16 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bản đồ Du lịch <span className="text-gradient">Tương tác</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Khám phá các tour, điểm đến và sự kiện trên bản đồ Việt Nam. 
            Theo dõi trạng thái tour theo thời gian thực.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <div className="space-y-6">
            {/* Layer Controls */}
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-3 flex items-center">
                <Layers className="h-4 w-4 mr-2 text-primary" />
                Lớp bản đồ
              </h3>
              <div className="space-y-2">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                      activeLayer === layer.id 
                        ? "bg-primary text-white" 
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center">
                      <layer.icon className="h-4 w-4 mr-2" />
                      {layer.label}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {layer.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Region Filter */}  
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-3 flex items-center">
                <Filter className="h-4 w-4 mr-2 text-primary" />
                Khu vực
              </h3>
              <div className="space-y-2">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                      selectedRegion === region.id 
                        ? "bg-primary text-white" 
                        : "hover:bg-accent"
                    }`}
                  >
                    {region.label}
                    <Badge variant="secondary" className="text-xs">
                      {region.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-3">Chú thích</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  Đang diễn ra
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Sắp khởi hành
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  Đã kết thúc
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-green-50">
                {/* Vietnam Map Outline (simplified) */}
                <svg 
                  viewBox="0 0 100 100" 
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: "drop-shadow(0 4px 12px rgba(35, 202, 241, 0.1))" }}
                >
                  {/* Simplified Vietnam border */}
                  <path
                    d="M45 15 Q50 12 55 15 Q60 20 65 25 Q70 30 68 40 Q65 50 62 55 Q58 58 55 60 Q52 65 50 70 Q48 75 45 80 Q42 85 40 90 Q35 88 32 85 Q30 80 28 75 Q25 70 23 65 Q20 60 18 55 Q15 50 17 45 Q20 40 25 35 Q30 30 35 25 Q40 20 45 15 Z"
                    fill="rgba(35, 202, 241, 0.1)"
                    stroke="rgba(35, 202, 241, 0.3)"
                    strokeWidth="0.5"
                  />
                </svg>

                {/* Tour Points */}
                {tourPoints.map((point) => (
                  <div
                    key={point.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  >
                    <div className={`w-4 h-4 ${getPointColor(point.status)} rounded-full shadow-lg group-hover:scale-125 transition-all duration-300`}></div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      <div className="font-semibold text-sm">{point.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{point.type}</div>
                      <div className="text-xs">
                        <Badge className={`text-xs ${getPointColor(point.status).replace('animate-pulse', '')} text-white`}>
                          {point.status === 'ongoing' ? 'Đang diễn ra' : 
                           point.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pickup Zones (example) */}
                <div className="absolute top-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm font-semibold mb-2">Vùng đón miễn phí</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        Nội thành Hà Nội
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        Q1, Q3, Q7 TP.HCM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Actions */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {tourPoints.length} điểm trên bản đồ
              </div>
              <div className="flex gap-2">
                <Button variant="map" size="sm">
                  Xem 360°
                </Button>
                <Button variant="tour" size="sm">
                  Lọc theo thời gian
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
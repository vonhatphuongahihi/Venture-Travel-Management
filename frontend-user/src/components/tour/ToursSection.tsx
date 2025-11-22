import TourCard from "./TourCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import beachImage from "@/assets/beach-destination.jpg";
import culturalImage from "@/assets/cultural-festival.jpg";

const ToursSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const filters = [
    { id: "all", label: "Tất cả", count: 120 },
    { id: "beach", label: "Biển đảo", count: 45 },
    { id: "cultural", label: "Văn hóa", count: 32 },
    { id: "mountain", label: "Núi rừng", count: 28 },
    { id: "city", label: "Thành phố", count: 15 },
  ];

  // Count tours by category
  const getTourCount = (filterId: string) => {
    if (filterId === "all") return filters.find(f => f.id === "all")?.count || 120;

    const categoryMap: { [key: string]: string } = {
      "beach": "Biển đảo",
      "cultural": "Văn hóa",
      "mountain": "Núi rừng",
      "city": "Thành phố"
    };

    return tours.filter(tour => tour.category === categoryMap[filterId]).length;
  };

  // Mock tour data
  const tours = [
    {
      id: "1",
      title: "Vịnh Hạ Long - Kỳ quan thiên nhiên thế giới",
      description: "Khám phá vẻ đẹp huyền bí của Vịnh Hạ Long với những hang động kỳ thú và làng chài truyền thống. Trải nghiệm đêm trên du thuyền sang trọng.",
      image: beachImage,
      price: 2500000,
      duration: "2 ngày 1 đêm",
      location: "Quảng Ninh",
      rating: 4.8,
      reviewCount: 234,
      category: "Biển đảo",
      status: "ongoing" as const,
      maxParticipants: 20,
      availableSpots: 5
    },
    {
      id: "2",
      title: "Hội An - Phố cổ đèn lồng",
      description: "Dạo bước trên những con phố cổ kính với ánh đèn lồng lung linh. Thưởng thức ẩm thực đường phố và tham quan làng nghề thủ công truyền thống.",
      image: culturalImage,
      price: 1800000,
      duration: "3 ngày 2 đêm",
      location: "Quảng Nam",
      rating: 4.9,
      reviewCount: 189,
      category: "Văn hóa",
      status: "upcoming" as const,
      maxParticipants: 25,
      availableSpots: 12
    },
    {
      id: "3",
      title: "Sapa - Ruộng bậc thang mùa nước đổ",
      description: "Trekking qua những thửa ruộng bậc thang xanh mướt, gặp gỡ đồng bào dân tộc thiểu số và trải nghiệm văn hóa độc đáo vùng cao Tây Bắc.",
      image: beachImage,
      price: 2200000,
      duration: "4 ngày 3 đêm",
      location: "Lào Cai",
      rating: 4.7,
      reviewCount: 156,
      category: "Núi rừng",
      status: "upcoming" as const,
      maxParticipants: 15,
      availableSpots: 8
    },
    {
      id: "4",
      title: "Phú Quốc - Thiên đường nghỉ dưỡng",
      description: "Thư giãn tại những bãi biển tuyệt đẹp, khám phá rừng nguyên sinh và thưởng thức hải sản tươi ngon. Trải nghiệm cáp treo vượt biển dài nhất thế giới.",
      image: beachImage,
      price: 3200000,
      duration: "5 ngày 4 đêm",
      location: "Kiên Giang",
      rating: 4.6,
      reviewCount: 298,
      category: "Biển đảo",
      status: "completed" as const,
      maxParticipants: 30,
      availableSpots: 0
    }
  ];

  const filteredTours = activeFilter === "all"
    ? tours
    : tours.filter(tour => {
      const categoryMap: { [key: string]: string } = {
        "beach": "Biển đảo",
        "cultural": "Văn hóa",
        "mountain": "Núi rừng",
        "city": "Thành phố"
      };
      return tour.category === categoryMap[activeFilter];
    });

  return (
    <section ref={sectionRef} id="tours" className="py-16">
      <div className="container">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-[#dff6ff] text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="h-4 w-4" />
            Đặc biệt
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            TOUR DU LỊCH
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Khám phá những tour du lịch đa dạng từ biển đảo đến núi rừng,
            từ văn hóa lịch sử đến thành phố hiện đại
          </p>
        </div>

        {/* Filters and Controls */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-[#dff6ff] text-secondary-foreground hover:bg-accent"
                  }`}
              >
                {filter.label}
                <Badge
                  variant="secondary"
                  className={`text-xs ${activeFilter === filter.id
                    ? "bg-white/30 text-white"
                    : "bg-primary/20 text-primary font-semibold"
                    }`}
                >
                  {getTourCount(filter.id)}
                </Badge>
              </button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc thêm
            </Button>
          </div>
        </div>

        {/* Tours Grid */}
        <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>

        {/* Load More */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button variant="tour" size="lg" className="px-8 bg-[#80CEEA] text-white hover:bg-[#5ebbdd]">
            Xem thêm tours
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ToursSection;
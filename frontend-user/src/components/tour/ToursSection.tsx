import TourCard from "./TourCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { tourService, Tour } from "@/services/tour.service";

const ToursSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch tours from API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: any = {
          limit: 12,
          isActive: 'true',
        };

        // Apply category filter if not "all"
        if (activeFilter !== 'all') {
          const categoryMap: { [key: string]: string } = {
            "beach": "Biển đảo",
            "cultural": "Văn hóa",
            "mountain": "Núi rừng",
            "city": "Thành phố"
          };
          params.category = categoryMap[activeFilter] || activeFilter;
        }

        const result = await tourService.getAllTours(params);
        setTours(result.tours);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError('Không thể tải danh sách tour');
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [activeFilter]);

  const filters = [
    { id: "all", label: "Tất cả", count: tours.length },
    { id: "beach", label: "Biển đảo", count: tours.filter(t => t.category?.includes("Biển đảo")).length },
    { id: "cultural", label: "Văn hóa", count: tours.filter(t => t.category?.includes("Văn hóa")).length },
    { id: "mountain", label: "Núi rừng", count: tours.filter(t => t.category?.includes("Núi rừng")).length },
    { id: "city", label: "Thành phố", count: tours.filter(t => t.category?.includes("Thành phố")).length },
  ];

  // Count tours by category
  const getTourCount = (filterId: string) => {
    if (filterId === "all") return tours.length;

    const categoryMap: { [key: string]: string } = {
      "beach": "Biển đảo",
      "cultural": "Văn hóa",
      "mountain": "Núi rừng",
      "city": "Thành phố"
    };

    return tours.filter(tour => tour.category === categoryMap[filterId]).length;
  };

  const filteredTours = tours;

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
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>Chưa có tour nào</p>
            </div>
          ) : (
            filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                id={tour.id}
                title={tour.title}
                description={tour.description}
                image={tour.image}
                price={tour.price}
                duration={tour.duration}
                location={tour.location}
                rating={tour.rating}
                reviewCount={tour.reviewCount}
                category={tour.category || "Tour du lịch"}
                status={tour.status}
                maxParticipants={tour.maxParticipants}
                availableSpots={tour.availableSpots}
              />
            ))
          )}
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
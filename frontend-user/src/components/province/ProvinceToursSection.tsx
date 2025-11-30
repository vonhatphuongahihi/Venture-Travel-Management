import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tour } from "@/global.types";
import TourCard from "../tour/TourCard";
import { Button } from "../ui/button";

interface ProvinceToursSectionProps {
  tours: Tour[];
  sortBy?: string;
  setSortBy?: (value: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  totalTours?: number;
}

const ProvinceToursSection = ({
  tours,
  sortBy,
  setSortBy,
  onLoadMore,
  hasMore,
  isLoadingMore,
  totalTours = 0,
}: ProvinceToursSectionProps) => {
  return (
    <section className="pt-5">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-gray-500 text-sm">
            Tìm thấy {totalTours} kết quả
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-700">Sắp xếp theo</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Giá (từ thấp đến cao)</SelectItem>
              <SelectItem value="price-desc">Giá (từ cao đến thấp)</SelectItem>
              <SelectItem value="rating-desc">Đánh giá cao nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {tours.map((tour) => (
          <TourCard key={tour.id} {...tour} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-600`}
        >
          <Button
            size="lg"
            className="px-8 bg-[#80CEEA] text-white hover:bg-[#5ebbdd]"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Đang tải..." : "Xem thêm"}
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProvinceToursSection;

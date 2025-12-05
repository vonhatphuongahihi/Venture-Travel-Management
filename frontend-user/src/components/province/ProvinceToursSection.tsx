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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <section className="pt-5">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-gray-500 text-sm">
            {t("provinceTours.foundResults", { count: totalTours })}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-700">{t("provinceTours.sortBy")}</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">{t("provinceTours.priceLowToHigh")}</SelectItem>
              <SelectItem value="price-desc">{t("provinceTours.priceHighToLow")}</SelectItem>
              <SelectItem value="rating-desc">{t("provinceTours.highestRated")}</SelectItem>
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
            {isLoadingMore ? t("provinceTours.loading") : t("provinceTours.viewMore")}
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProvinceToursSection;

import React, { useState } from "react";
import TourCard from "@/components/tour/TourCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tour } from "@/global.types";
import { useTranslation } from "react-i18next";

interface AttractionToursSectionProps {
  tours: Tour[];
}

function AttractionToursSection({ tours }: AttractionToursSectionProps) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<string>("price-asc");
  const [visibleCount, setVisibleCount] = useState(6);

  // Sort tours based on selected option
  const sortedTours = React.useMemo(() => {
    const toursCopy = [...tours];

    switch (sortBy) {
      case "price-asc":
        return toursCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return toursCopy.sort((a, b) => b.price - a.price);
      case "rating-desc":
        return toursCopy.sort((a, b) => b.rating - a.rating);
      case "duration-asc":
        return toursCopy.sort((a, b) => {
          const aDays = parseInt(a.duration.match(/\d+/)?.[0] || "0");
          const bDays = parseInt(b.duration.match(/\d+/)?.[0] || "0");
          return aDays - bDays;
        });
      default:
        return toursCopy;
    }
  }, [tours, sortBy]);

  const visibleTours = sortedTours.slice(0, visibleCount);
  const hasMoreTours = tours.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, tours.length));
  };

  return (
    <section className="py-8">
      {/* Header with sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-gray-500 text-sm">
            {t("attractionTours.foundResults", { count: tours.length })}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-700">{t("attractionTours.sortBy")}</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">{t("attractionTours.priceLowToHigh")}</SelectItem>
              <SelectItem value="price-desc">{t("attractionTours.priceHighToLow")}</SelectItem>
              <SelectItem value="rating-desc">{t("attractionTours.highestRated")}</SelectItem>
              <SelectItem value="duration-asc">{t("attractionTours.shortestDuration")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {visibleTours.map((tour) => (
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
            category={tour.category}
            status={tour.status}
            maxParticipants={tour.maxParticipants}
            availableSpots={tour.availableSpots}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreTours && (
        <div className="flex justify-center">
          <Button
            size="lg"
            className="px-8 bg-[#80CEEA] text-white hover:bg-[#5ebbdd]"
            onClick={handleLoadMore}
          >
            {t("attractionTours.viewMore")}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {tours.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("attractionTours.noTours")}
          </h3>
          <p className="text-gray-500">
            {t("attractionTours.noToursDescription")}
          </p>
        </div>
      )}
    </section>
  );
}

export default AttractionToursSection;

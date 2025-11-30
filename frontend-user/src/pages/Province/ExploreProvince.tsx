import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Import assets
import AttractionsSection from "@/components/province/AttractionsSection";
import ReviewsSection from "@/components/province/ReviewsSection";
import TourSliderSection from "@/components/province/TourSliderSection";
import WeatherSection from "@/components/province/WeatherSection";
import { mockAttractions } from "@/data/attractions";
import { Attraction, Province, Tour } from "@/global.types";

import { useProvinceAttractions, useProvinceTours } from "@/hooks/useProvince";

interface ExploreProvinceContext {
  province: Province;
}

const ExploreProvince = () => {
  const { province } = useOutletContext<ExploreProvinceContext>();
  
  const { data: toursData } = useProvinceTours(province?.id || "", 1, 10);
  const tours = toursData?.data || [];

  const { data: attractionsData } = useProvinceAttractions(province?.id || "");
  const attractions = attractionsData || [];
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      // so sánh chiều cao thực tế với chiều cao hiển thị tối đa
      const isOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsClamped(isOverflowing);
    }
  }, []);

  if (!province) return null;


  return (
    <div className="container mx-auto max-w-7xl space-y-8 mb-8">
      {/* Tours Section */}
      <TourSliderSection province={province} tours={tours} />

      {/* Attractions Section */}
      <AttractionsSection province={province} attractions={attractions} />

      {/* Reviews Section */}
      <ReviewsSection province={province} />

      {/* Weather Section */}
      <WeatherSection province={province} />
    </div>
  );
};

export default ExploreProvince;

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useProvinces } from "@/contexts/ProvinceContext";

// Import assets
import AttractionsSection from "@/components/province/AttractionsSection";
import ReviewsSection from "@/components/province/ReviewsSection";
import TourSliderSection from "@/components/province/TourSliderSection";
import WeatherSection from "@/components/province/WeatherSection";
import { mockAttractions } from "@/data/attractions";
import { mockTours } from "@/data/tours";
import { Attraction, Tour } from "@/global.types";

const ExploreProvince = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProvinceBySlug, loading } = useProvinces();
  const [sortBy, setSortBy] = useState("Giá (từ thấp đến cao)");
  const [tours, setTours] = useState<Tour[]>(mockTours);
  const [attractions, setAttractions] = useState<Attraction[]>(mockAttractions);
  const province = slug ? getProvinceBySlug(slug) : undefined;
  const textRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      // so sánh chiều cao thực tế với chiều cao hiển thị tối đa
      const isOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsClamped(isOverflowing);
    }
  }, []);

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

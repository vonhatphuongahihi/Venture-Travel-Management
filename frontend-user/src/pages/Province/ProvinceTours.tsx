import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useProvinces } from "@/contexts/ProvinceContext";

// Import assets
import ProvinceToursSection from "@/components/province/ProvinceToursSection";
import ReviewsSection from "@/components/province/ReviewsSection";
import { mockAttractions } from "@/data/attractions";
import { mockTours } from "@/data/tours";
import { Attraction, Tour } from "@/global.types";

const ProvinceTours = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProvinceBySlug } = useProvinces();
  const [sortBy, setSortBy] = useState<string>("price-asc");
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
      <ProvinceToursSection
        tours={tours}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Reviews Section */}
      <ReviewsSection province={province} />
    </div>
  );
};

export default ProvinceTours;

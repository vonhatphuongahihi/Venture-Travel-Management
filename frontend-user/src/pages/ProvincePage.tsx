import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { provinces } from "@/data/provinces";
import { useState } from "react";
import { useParams } from "react-router-dom";

// Import assets
import heroImage from "@/assets/hero-vietnam.jpg";
import AttractionsSection from "@/components/province/AttractionsSection";
import ProvinceToursSection from "@/components/province/ProvinceToursSection";
import ReviewsSection from "@/components/province/ReviewsSection";
import WeatherSection from "@/components/province/WeatherSection";
import { mockAttractions } from "@/data/attractions";
import { mockTours } from "@/data/tours";
import { Attraction, Tour } from "@/global.types";

const ProvincePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState("Giá (từ thấp đến cao)");
  const [tours, setTours] = useState<Tour[]>(mockTours);
  const [attractions, setAttractions] = useState<Attraction[]>(mockAttractions);
  const [province, setProvince] = useState(() =>
    provinces.find((p) => p.slug === slug)
  );

  // If province not found, show default or redirect
  if (!province) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Tỉnh thành không tồn tại</h1>
          <p className="text-gray-600 mb-8">
            Không tìm thấy thông tin về tỉnh thành này.
          </p>
          <Button onClick={() => window.history.back()}>Quay lại</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative !h-72 md:h-96">
        <img
          src={heroImage}
          alt={province.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 text-white p-6 md:p-8">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              {province.name}
            </h1>
            <div className="w-full text-sm">
              <p className="leading-relaxed line-clamp-2">
                Sapa là thị xã nằm ở phía Bắc Việt Nam, thuộc địa phận tỉnh Lào
                Cai. Ở độ cao lên đến 1650m, Sapa sở hữu khung cảnh núi non hùng
                vĩ và khí hậu mát mẻ quanh năm. Địa điểm này còn mệnh danh là
                "thị trấn trong mây", với nhiều thắng cảnh thiên Sapa là thị xã
                nằm ở phía Bắc Việt Nam, thuộc địa phận tỉnh Lào Cai. Ở độ cao
                lên đến 1650m, Sapa sở hữu khung cảnh núi non hùng vĩ và khí hậu
                mát mẻ quanh năm. Địa điểm này còn mệnh danh là "thị trấn trong
                mây", với nhiều thắng cảnh thiên nhiên độc đáo.
              </p>
            </div>
            <button className="text-sm underline">Xem thêm</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4">
        {/* Tours Section */}
        <ProvinceToursSection
          tours={tours}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Attractions Section */}
        <AttractionsSection province={province} attractions={attractions} />

        {/* Reviews Section */}
        <ReviewsSection province={province} />

        {/* Weather Section */}
        <WeatherSection province={province} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProvincePage;

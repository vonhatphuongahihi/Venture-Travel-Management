import React from "react";
import { Button } from "../ui/button";
import TourCard from "../tour/TourCard";
import { Tour } from "@/global.types";
import { ChevronDown } from "lucide-react";

interface ProvinceToursSectionProps {
  tours: Tour[];
  sortBy?: string;
  setSortBy?: (value: string) => void;
}

const ProvinceToursSection = ({
  tours,
  sortBy,
  setSortBy,
}: ProvinceToursSectionProps) => {
  return (
    <section className="pt-5">
      {/* Sticky Tab */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="inline-block border-b-primary border-b-2">
          <h2 className="text-base font-semibold text-primary py-3 px-1">
            Tour & Hoạt động
          </h2>
        </div>
      </div>
      {/* Filter Controls */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">Tìm thấy 34 kết quả</p>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">Sắp xếp theo</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Giá (từ thấp đến cao)</option>
              <option>Giá (từ cao đến thấp)</option>
              <option>Đánh giá cao nhất</option>
              <option>Mới nhất</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {tours.map((tour) => (
          <TourCard key={tour.id} {...tour} />
        ))}
      </div>

      {/* Load More */}
      <div
        className={`text-center mt-12 transition-all duration-1000 delay-600`}
      >
        <Button
          size="lg"
          className="px-8 bg-[#80CEEA] text-white hover:bg-[#5ebbdd]"
        >
          Xem thêm
        </Button>
      </div>
    </section>
  );
};

export default ProvinceToursSection;

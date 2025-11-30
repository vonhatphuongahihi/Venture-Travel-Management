"use client";

import type { Attraction } from "@/services/AttractionAPI";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Building2,
  FileText,
  X,
} from "lucide-react";

interface PlaceDetailModalProps {
  open: boolean;
  onClose: () => void;
  place: Attraction | null;
}

export default function PlaceDetailModal({
  open,
  onClose,
  place,
}: PlaceDetailModalProps) {
  if (!open || !place) return null;

  const images = place.images?.length
    ? place.images
    : ["https://via.placeholder.com/400x200"];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const averageRate =
    place.reviews && place.reviews.length
      ? place.reviews.reduce((sum: number, r: any) => sum + r.rate, 0) /
        place.reviews.length
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[750px] bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h3 className="text-xl font-semibold">{place.name}</h3>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image Carousel */}
        <div className="relative w-full h-[360px] bg-black rounded-b-xl overflow-hidden">
          <img
            src={images[currentIndex]}
            className="w-full h-full object-cover"
          />

          {images.length > 1 && (
            <>
              {/* Prev button */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/85 p-2 rounded-full shadow hover:bg-white"
              >
                <ChevronLeft size={22} />
              </button>

              {/* Next button */}
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/85 p-2 rounded-full shadow hover:bg-white"
              >
                <ChevronRight size={22} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2.5 w-2.5 rounded-full cursor-pointer transition ${
                      currentIndex === i
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={20}
                className={
                  n <= averageRate
                    ? "text-amber-500 fill-amber-500"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ml-2 text-gray-700 text-sm">
              {averageRate.toFixed(1)} / 5 • {place.reviews?.length || 0} đánh giá
            </span>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="flex items-start gap-3">
              <MapPin className="text-sky-600 mt-1" size={20} />
              <div>
                <p className="text-xs text-gray-500">Địa chỉ</p>
                <p className="text-sm font-medium text-gray-800">{place.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="text-purple-600 mt-1" size={20} />
              <div>
                <p className="text-xs text-gray-500">Tỉnh / Thành phố</p>
                <p className="text-sm font-medium text-gray-800">
                  {place.province?.name ?? place.provinceId}
                </p>
              </div>
            </div>

            

          </div>

          {/* Description */}
          <div className="pt-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="text-gray-700" size={18} />
              <span className="font-semibold text-gray-800">Mô tả</span>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm">
              {place.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

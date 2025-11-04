import React, { useEffect, useRef, useState } from "react";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Attraction } from "@/global.types";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

interface AttractionHeroSectionProps {
  attraction: Attraction;
}

function AttractionHeroSection({ attraction }: AttractionHeroSectionProps) {
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
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Content */}
        <div className="flex flex-col justify-center lg:col-span-3">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {attraction.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <div>
                <Badge
                  variant="secondary"
                  className="px-2 py-1 text-sm text-primary"
                >
                  {attraction.category}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Star className={`h-4 w-4 fill-yellow-400 text-yellow-400`} />
                <span className="text-sm text-gray-600">
                  {attraction.reviewInfo.rating.toFixed(1)} (
                  {attraction.reviewInfo.count} đánh giá)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center text-gray-600 mb-6">
            <MapPin className="h-4 w-4 mr-2" />
            <button className="underline">{attraction.location.address}</button>
          </div>

          <div className="mb-6 space-y-2">
            <p
              ref={textRef}
              className="text-gray-700 leading-relaxed line-clamp-2"
            >
              {attraction.description}
            </p>
            {isClamped && (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="text-sm underline">Xem thêm</button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <h2 className="text-lg font-semibold mb-4">
                      {attraction.name}
                    </h2>
                  </SheetHeader>
                  <p className="text-gray-700 leading-relaxed">
                    {attraction.description}
                  </p>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <img
              src={attraction.image}
              alt={attraction.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 right-4 bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm"
            >
              Thư viện ảnh
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AttractionHeroSection;

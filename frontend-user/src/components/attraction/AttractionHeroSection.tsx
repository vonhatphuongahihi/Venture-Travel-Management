import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Attraction } from "@/global.types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MapPin, Star, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import AttractionLocationMap from "./AttractionLocationMap";

interface AttractionHeroSectionProps {
  attraction: Attraction;
}

function AttractionHeroSection({ attraction }: AttractionHeroSectionProps) {
  const textRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Ensure images array exists and has at least the main image
  const images = attraction.images;

  const reviewInfo = useMemo(() => {
    return {
      rating:
        (attraction.attractionReviews || []).reduce(
          (sum, review) => sum + review.rate,
          0
        ) / ((attraction.attractionReviews || []).length || 1),
      count: (attraction.attractionReviews || []).length,
    };
  }, [attraction.attractionReviews]);

  useEffect(() => {
    if (textRef.current) {
      // so sánh chiều cao thực tế với chiều cao hiển thị tối đa
      const isOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsClamped(isOverflowing);
    }
  }, []);

  // Keyboard navigation for gallery
  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen, currentImageIndex]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < images.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSelectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

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
                  {reviewInfo.rating.toFixed(1)} ({reviewInfo.count} đánh giá)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center text-gray-600 mb-6">
            <MapPin className="h-4 w-4 mr-2" />
            <Dialog>
              <DialogTrigger asChild>
                <button className="underline hover:text-blue-600 transition-colors text-left">
                  {attraction.address}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-white border-none shadow-2xl [&>button]:hidden">
                <div className="w-full h-[600px] relative group">
                  {/* Floating Close Button */}
                  <DialogClose className="absolute top-4 right-4 z-50 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none">
                    <X className="w-5 h-5 text-gray-700" />
                  </DialogClose>

                  {attraction.coordinates ? (
                    <AttractionLocationMap
                      lat={attraction.coordinates.lat}
                      lng={attraction.coordinates.lon}
                      name={attraction.name}
                      address={attraction.address || ""}
                      image={attraction.images[0] || "/placeholder.svg"}
                      className="w-full h-full rounded-none border-none"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                      Không có dữ liệu tọa độ
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
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
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
            <img
              src={attraction.images[0] || "/placeholder.svg"}
              alt={attraction.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />

            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-4 right-4 bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm"
                  onClick={() => {
                    setCurrentImageIndex(0);
                    setIsGalleryOpen(true);
                  }}
                >
                  Thư viện ảnh
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[1000px] p-0 bg-black/95 border-none text-white h-[85vh] flex flex-col [&>button]:hidden">
                <DialogTitle className="sr-only">Thư viện ảnh</DialogTitle>

                {/* Close button */}
                <DialogClose className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors focus:outline-none">
                  <X className="w-6 h-6" />
                </DialogClose>

                {/* Main Image Area */}
                <div className="flex-1 relative flex items-center justify-center min-h-0 p-4">
                  {/* Prev Button */}
                  {currentImageIndex > 0 && (
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all hover:scale-110 focus:outline-none"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                  )}

                  {/* Image */}
                  <img
                    src={images[currentImageIndex]}
                    alt={`${attraction.name} - ${currentImageIndex + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />

                  {/* Next Button */}
                  {currentImageIndex < images.length - 1 && (
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all hover:scale-110 focus:outline-none"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  )}
                </div>

                {/* Footer Info */}
                <div className="p-4 bg-black/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4">
                    {/* Counter */}
                    <span className="text-sm font-medium text-gray-300">
                      {currentImageIndex + 1} / {images.length}
                    </span>

                    {/* Thumbnails */}
                    <div className="flex gap-2 overflow-x-auto max-w-full pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent px-4">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectImage(idx)}
                          className={cn(
                            "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all",
                            currentImageIndex === idx
                              ? "ring-2 ring-white opacity-100 scale-105"
                              : "opacity-50 hover:opacity-80"
                          )}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AttractionHeroSection;

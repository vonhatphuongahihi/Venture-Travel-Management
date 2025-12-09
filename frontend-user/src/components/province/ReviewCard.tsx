import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { TourReview, AttractionReview } from "@/global.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "../ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ReviewCardProps = {
  review: TourReview | AttractionReview;
  reviewType: "tour" | "attraction";
  isFromProvincePage?: boolean;
};

const ReviewCard = ({
  review,
  reviewType,
  isFromProvincePage = false,
}: ReviewCardProps) => {
  const navigate = useNavigate();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleClick = () => {
    if (reviewType === "tour" && "tourId" in review) {
      navigate(`/tour/${review.tourId}`);
    } else if (reviewType === "attraction" && "attractionId" in review) {
      navigate(`/attraction/${review.attractionId}`);
    }
  };

  const handleImageClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < (review.images?.length || 0) - 1 ? prev + 1 : prev
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSelectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Handle both API response formats (date vs createdAt, rating vs rate)
  const reviewDate =
    "date" in review && review.date ? review.date : review.createdAt;
  const displayDate = new Date(reviewDate).toLocaleDateString("vi-VN");
  const userName = review.user?.name || "Anonymous";
  const userAvatar = review.user?.avatar;
  const rating =
    "rating" in review && review.rating ? review.rating : review.rate;

  return (
    <Card
      className="group overflow-hidden min-w-[200px] rounded-2xl transition-all hover:-translate-y-1 h-full"
      onClick={handleClick}
    >
      <div className="h-full flex flex-col justify-between gap-3">
        <div className="flex justify-between items-center pt-4 px-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold">{userName}</h3>
              <p className="text-sm text-gray-500">{displayDate}</p>
            </div>
          </div>

          <div className="space-x-2 flex items-center">
            <span className="text-primary text-xs font-medium">
              {rating >= 4 ? "Hài lòng" : "Bình thường"}
            </span>
            <span className="bg-primary p-1 rounded-tl-md rounded-br-md text-[12px] text-white">
              {rating}
            </span>
          </div>
        </div>

        <div className="px-4 h-20">
          <p className="line-clamp-4 text-sm">{review.content}</p>
        </div>

        {reviewType === "tour" &&
        isFromProvincePage &&
        "tour" in review &&
        review.tour ? (
          <div className="p-2 bg-gray-100 flex rounded-t-md items-center gap-2">
            <img
              src={review.tour.images?.[0] || ""}
              className="h-12 w-20 rounded-md object-cover"
              alt={review.tour.name}
            />
            <p className="text-xs font-medium">{review.tour.name}</p>
          </div>
        ) : (
          <div className="p-2 flex flex-wrap gap-2">
            {review.images?.map((img, indx) => {
              if (indx > 3) return null;

              return (
                <div className="relative" key={indx}>
                  <img
                    src={img}
                    className="size-20 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => handleImageClick(e, indx)}
                    alt={`Review image ${indx + 1}`}
                  />

                  {indx === 3 && review.images.length > 4 && (
                    <span className="bg-black/50 p-1 absolute bottom-1 right-1 text-white text-xs rounded-sm">
                      {review.images.length - 4}+
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Gallery Dialog */}
      {review.images && review.images.length > 0 && (
        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogContent className="sm:max-w-[1000px] p-0 bg-black/95 border-none text-white h-[85vh] flex flex-col [&>button]:hidden">
            <DialogTitle className="sr-only">Thư viện ảnh đánh giá</DialogTitle>

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
                src={review.images[currentImageIndex]}
                alt={`Review image ${currentImageIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />

              {/* Next Button */}
              {currentImageIndex < review.images.length - 1 && (
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
                  {currentImageIndex + 1} / {review.images.length}
                </span>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto max-w-full pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent px-4">
                  {review.images.map((img, idx) => (
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
      )}
    </Card>
  );
};

export default ReviewCard;

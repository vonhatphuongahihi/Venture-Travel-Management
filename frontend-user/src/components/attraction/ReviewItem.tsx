import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AttractionReview } from "@/global.types";
import { Star, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReviewItemProps {
  review: AttractionReview;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Handle both API response formats
  const reviewDate =
    "date" in review && review.date ? review.date : review.createdAt;
  const displayDate = new Date(reviewDate).toLocaleDateString("vi-VN");
  const userName = review.user?.name || "Anonymous";
  const userAvatar = review.user?.avatar;
  const rating =
    "rating" in review && review.rating ? review.rating : review.rate;

  const getRatingLabel = (rating: number) => {
    const labels = [
      "Chưa đánh giá",
      "Rất tệ",
      "Tệ",
      "Bình thường",
      "Tốt",
      "Rất hài lòng",
    ];
    return labels[rating] || "Chưa đánh giá";
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseGallery = () => {
    setSelectedImageIndex(null);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && review.images) {
      setSelectedImageIndex((prev) =>
        prev !== null && prev < review.images.length - 1 ? prev + 1 : prev
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev !== null && prev > 0 ? prev - 1 : prev
      );
    }
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-0">
      {/* Section 1: User Info & Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-gray-900">{userName}</h4>
          </div>
        </div>
        <span className="text-sm text-gray-500">{displayDate}</span>
      </div>

      {/* Section 2: Rating */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {getRatingLabel(rating)}
          </span>
        </div>
      </div>

      {/* Section 3: Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
      </div>

      {/* Section 4: Images */}
      {review.images && review.images.length > 0 && (
        <div>
          {/* Image Thumbnails */}
          <div className="flex flex-wrap gap-2 mb-3">
            {review.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Review image ${index + 1}`}
                  className={cn(
                    "w-24 h-24 rounded-lg object-cover cursor-pointer transition-all",
                    selectedImageIndex === index
                      ? "ring-2 ring-primary opacity-100"
                      : "hover:opacity-80"
                  )}
                  onClick={() => handleImageClick(index)}
                />
              </div>
            ))}
          </div>

          {/* Inline Image Gallery */}
          {selectedImageIndex !== null && (
            <div className="relative bg-gray-100 rounded-lg p-4 mt-4">
              {/* Close Button */}
              <button
                onClick={handleCloseGallery}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white hover:bg-gray-200 rounded-full shadow-md transition-colors"
                aria-label="Đóng"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>

              {/* Main Image */}
              <div className="relative flex items-center justify-center h-[400px]">
                {/* Prev Button */}
                {selectedImageIndex > 0 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                )}

                {/* Image */}
                <img
                  src={review.images[selectedImageIndex]}
                  alt={`Review image ${selectedImageIndex + 1}`}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />

                {/* Next Button */}
                {selectedImageIndex < review.images.length - 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                )}
              </div>

              {/* Image Counter */}
              <div className="text-center mt-3">
                <span className="text-sm text-gray-600">
                  {selectedImageIndex + 1} / {review.images.length}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;

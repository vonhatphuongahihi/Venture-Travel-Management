import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AttractionReview } from "@/global.types";
import { Star } from "lucide-react";
import { useState } from "react";
import ReviewItem from "./ReviewItem";
import { Button } from "@/components/ui/button";

interface AllReviewsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviews: AttractionReview[];
  averageRating: number;
  totalReviews: number;
}

const REVIEWS_PER_PAGE = 5;

const AllReviewsSheet = ({
  open,
  onOpenChange,
  reviews,
  averageRating,
  totalReviews,
}: AllReviewsSheetProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-6 w-6 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of sheet content
    const sheetContent = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (sheetContent) {
      sheetContent.scrollTop = 0;
    }
  };

  // Reset page when sheet opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setCurrentPage(1);
    }
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full !max-w-screen-md overflow-y-auto">
        {/* Rating Overview - Keep original header */}
        <div className="mb-6">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="text-5xl text-gray-900 mb-2">
                <b>{averageRating.toFixed(1)}</b>
                <span className="text-sm">/ 5</span>
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
            </div>

            <div className="text-sm text-gray-600">{totalReviews} Đánh giá</div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {currentReviews.length > 0 ? (
            currentReviews.map((review) => (
              <ReviewItem key={review.reviewId} review={review} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              Chưa có đánh giá nào.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;

                  if (!showPage) {
                    // Show ellipsis
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 py-1 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AllReviewsSheet;

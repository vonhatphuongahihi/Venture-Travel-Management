import halongImg from "@/assets/hero-vietnam-1.jpg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReviewCard from "./ReviewCard";
import { reviewService } from "@/services/review.service";
import { imageUploadService } from "@/services/imageUpload.service";
import { useToast } from "@/contexts/ToastContext";
import { tourService } from "@/services/tour.service";

interface ReviewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  tourId?: string;
  tourName?: string;
  tourImage?: string;
  tourDescription?: string;
  attractionIds?: string[]; // IDs of attractions in the tour for reviews
  onSuccess?: () => void; // Callback when review is submitted successfully
}

interface ReviewData {
  rating: number;
  reviewText: string;
  images: File[];
  itemId: string;
  itemType: "tour" | "destination";
}

interface TourData {
  name: string;
  description: string;
  image: string;
  type: "tour" | "destination";
}

const ReviewDialog = ({
  open,
  setOpen,
  tourId,
  tourName,
  tourImage,
  tourDescription,
  attractionIds = [],
  onSuccess
}: ReviewDialogProps) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [tourData, setTourData] = useState<TourData | null>(null);
  const [attractionsData, setAttractionsData] = useState<TourData[]>([]);
  const reviewDataRef = useRef<Map<string, ReviewData>>(new Map());

  // Load tour data when dialog opens
  useEffect(() => {
    const loadTourData = async () => {
      if (!open || !tourId) return;

      try {
        // Fetch tour details
        const tour = await tourService.getTourById(tourId);

        if (tour) {
          setTourData({
            name: tour.title || tourName || "Tour",
            description: tour.description || tourDescription || "",
            image: tour.images?.[0] || tourImage || halongImg,
            type: "tour",
          });

          // Load attractions data if needed
          // For now, we'll use empty array as destinations are optional
          setAttractionsData([]);
        } else {
          // Fallback to provided props
          setTourData({
            name: tourName || "Tour",
            description: tourDescription || "",
            image: tourImage || halongImg,
            type: "tour",
          });
        }
      } catch (error) {
        console.error("Error loading tour data:", error);
        // Fallback to provided props
        setTourData({
          name: tourName || "Tour",
          description: tourDescription || "",
          image: tourImage || halongImg,
          type: "tour",
        });
      }
    };

    loadTourData();
  }, [open, tourId, tourName, tourImage, tourDescription]);

  const handleReviewChange = useCallback((itemId: string, data: ReviewData) => {
    reviewDataRef.current.set(itemId, data);
  }, []);

  // Reset all state when dialog closes
  useEffect(() => {
    if (!open) {
      setErrorMessage("");
      setIsLoading(false);
      reviewDataRef.current.clear();
      setResetKey((prev) => prev + 1);
    }
  }, [open]);

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!tourId) {
      setErrorMessage("Không tìm thấy thông tin tour.");
      return;
    }

    // Validate tour review exists
    const tourReview = reviewDataRef.current.get("tour-main");
    if (!tourReview) {
      setErrorMessage("Vui lòng đánh giá tour trước khi gửi.");
      return;
    }

    // Validate tour review has content
    if (!tourReview.reviewText.trim()) {
      setErrorMessage("Vui lòng điền nội dung đánh giá cho tour.");
      return;
    }

    if (tourReview.rating === 0) {
      setErrorMessage("Vui lòng chọn số sao đánh giá cho tour.");
      return;
    }

    // Validate content length
    if (tourReview.reviewText.trim().length < 10) {
      setErrorMessage("Nội dung đánh giá phải có ít nhất 10 ký tự.");
      return;
    }

    setIsLoading(true);

    try {
      // Upload images if any
      let imageUrls: string[] = [];
      if (tourReview.images && tourReview.images.length > 0) {
        try {
          imageUrls = await imageUploadService.uploadImages(tourReview.images);
        } catch (error: any) {
          console.error("Error uploading images:", error);
          setErrorMessage(error.message || "Có lỗi khi upload ảnh. Vui lòng thử lại.");
          setIsLoading(false);
          return;
        }
      }

      // Create tour review
      await reviewService.createTourReview({
        tourId,
        rate: tourReview.rating,
        content: tourReview.reviewText.trim(),
        images: imageUrls,
      });

      // Handle attraction reviews if any
      for (const [itemId, review] of reviewDataRef.current.entries()) {
        if (itemId !== "tour-main" && review.itemType === "destination") {
          // Extract attraction ID from itemId (format: "destination-{index}")
          const attractionIndex = parseInt(itemId.replace("destination-", ""));
          const attractionId = attractionIds[attractionIndex];

          if (attractionId && review.reviewText.trim() && review.rating > 0) {
            // Upload images for attraction review
            let attractionImageUrls: string[] = [];
            if (review.images && review.images.length > 0) {
              try {
                attractionImageUrls = await imageUploadService.uploadImages(review.images);
              } catch (error) {
                console.error("Error uploading attraction images:", error);
                // Continue without images
              }
            }

            // Create attraction review
            await reviewService.createAttractionReview({
              attractionId,
              rate: review.rating,
              content: review.reviewText.trim(),
              images: attractionImageUrls,
            });
          }
        }
      }

      // Success
      showToast("Đánh giá đã được gửi thành công!", "success");
      setOpen(false);
      reviewDataRef.current.clear();

      // Notify parent component if callback is provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogTitle className="text-xl text-[#26B8ED] font-bold">Đánh giá</DialogTitle>

        <div className="mt-4 space-y-6">
          {/* Tour Review */}
          {tourData && (
            <>
              <ReviewCard
                key={`tour-main-${resetKey}`}
                data={tourData}
                itemId="tour-main"
                onReviewChange={handleReviewChange}
              />

              {/* Attractions reviews (optional) */}
              {attractionsData.length > 0 && (
                <>
                  <Separator className="my-4" />
                  {attractionsData.map((destination, index) => (
                    <React.Fragment key={`destination-${index}`}>
                      <ReviewCard
                        key={`destination-${index}-${resetKey}`}
                        data={destination}
                        itemId={`destination-${index}`}
                        onReviewChange={handleReviewChange}
                      />
                      {index !== attractionsData.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </React.Fragment>
                  ))}
                </>
              )}
            </>
          )}

          {!tourData && (
            <div className="text-center py-8 text-gray-500">
              Đang tải thông tin tour...
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
        )}

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(isLoading && "opacity-50 cursor-not-allowed")}
          >
            {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;

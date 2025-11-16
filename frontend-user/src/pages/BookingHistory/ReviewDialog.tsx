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

interface ReviewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  // booking
}

const mockData = {
  name: "Khám Phá Vịnh Hạ Long - Hành Trình Kỳ Quan Thế Giới",
  description:
    "Trải nghiệm vẻ đẹp hùng vĩ của Di sản Thiên nhiên Thế giới với những hang động kỳ bí, làng chài truyền thống và hoàng hôn tuyệt đẹp trên vịnh. Tour bao gồm du thuyền sang trọng, các hoạt động thể thao nước và bữa tiệc hải sản tươi ngon.",
  image: halongImg,
  type: "tour",
  destinations: [
    {
      name: "Vịnh Hạ Long",
      description:
        "Vịnh Hạ Long là một vịnh nhỏ thuộc phần bờ tây vịnh Bắc Bộ tại khu vực biển Đông Bắc Việt Nam, bao gồm vùng biển đảo của thành phố Hạ Long thuộc tỉnh Quảng Ninh. Trung tâm vịnh có tọa độ 20°10' vĩ độ Bắc và 107°12' kinh độ Đông. Vịnh Hạ Long nổi tiếng với hàng nghìn hòn đảo đá vôi kỳ vĩ và hang động tuyệt đẹp, được UNESCO công nhận là Di sản Thiên nhiên Thế giới.",
      image: halongImg,
      type: "destination",
    },
  ],
};

interface ReviewData {
  rating: number;
  reviewText: string;
  images: File[];
  itemId: string;
  itemType: "tour" | "destination";
}

const ReviewDialog = ({ open, setOpen }: ReviewDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const reviewDataRef = useRef<Map<string, ReviewData>>(new Map());

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

    // Validate all reviews
    const totalReviews = 1 + mockData.destinations.length; // tour + destinations
    const submittedReviews = reviewDataRef.current.size;

    if (submittedReviews < totalReviews) {
      setErrorMessage("Vui lòng đánh giá tất cả các mục trước khi gửi.");
      return;
    }

    // Validate each review has content
    for (const [itemId, review] of reviewDataRef.current.entries()) {
      if (!review.reviewText.trim()) {
        setErrorMessage("Vui lòng điền nội dung đánh giá cho tất cả các mục.");
        return;
      }
      if (review.rating === 0) {
        setErrorMessage("Vui lòng chọn số sao đánh giá cho tất cả các mục.");
        return;
      }
    }

    setIsLoading(true);

    try {
      // Giả lập gửi API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Log data để kiểm tra
      console.log(
        "Submitting reviews:",
        Array.from(reviewDataRef.current.entries())
      );

      // Success
      setOpen(false);
      reviewDataRef.current.clear();
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogTitle className="text-xl font-bold">Đánh giá</DialogTitle>

        <div className="mt-4 space-y-6">
          {/* ReviewCard component content */}
          <ReviewCard
            key={`tour-main-${resetKey}`}
            data={mockData}
            itemId="tour-main"
            onReviewChange={handleReviewChange}
          />

          <Separator className="my-4" />

          {mockData.destinations.map((destination, index) => (
            <React.Fragment key={`destination-${index}`}>
              <ReviewCard
                key={`destination-${index}-${resetKey}`}
                data={destination}
                itemId={`destination-${index}`}
                onReviewChange={handleReviewChange}
              />
              {index !== mockData.destinations.length - 1 && (
                <Separator className="my-4" />
              )}
            </React.Fragment>
          ))}
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

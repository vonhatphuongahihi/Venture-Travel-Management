import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/contexts/ToastContext";
import { Attraction } from "@/global.types";
import { cn } from "@/lib/utils";
import { imageUploadService } from "@/services/imageUpload.service";
import { reviewService } from "@/services/review.service";
import { Camera, Plus, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AttractionReviewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  attraction: Attraction;
  onSuccess?: () => void;
}

const AttractionReviewDialog = ({
  open,
  setOpen,
  attraction,
  onSuccess,
}: AttractionReviewDialogProps) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [content, setContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setRating(5);
      setHoveredStar(0);
      setContent("");
      setUploadedImages([]);
      setIsLoading(false);
    }
  }, [open]);

  const getRatingLabel = () => {
    const currentRating = hoveredStar || rating;
    const labels = [
      "Chưa đánh giá",
      "Rất tệ",
      "Tệ",
      "Bình thường",
      "Tốt",
      "Rất tốt",
    ];
    return labels[currentRating] || "Chưa đánh giá";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, 4 - uploadedImages.length);
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async () => {
    // Validation
    if (rating === 0) {
      showToast("Vui lòng chọn số sao đánh giá", "error");
      return;
    }

    if (!content.trim()) {
      showToast("Vui lòng nhập nội dung đánh giá", "error");
      return;
    }

    if (content.trim().length < 10) {
      showToast("Nội dung đánh giá phải có ít nhất 10 ký tự", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Upload images if any
      let imageUrls: string[] = [];
      if (uploadedImages.length > 0) {
        try {
          imageUrls = await imageUploadService.uploadImages(uploadedImages);
        } catch (error) {
          console.error("Error uploading images:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Có lỗi khi upload ảnh. Vui lòng thử lại.";
          showToast(errorMessage, "error");
          setIsLoading(false);
          return;
        }
      }

      // Create attraction review
      await reviewService.createAttractionReview({
        attractionId: attraction.id,
        rate: rating,
        content: content.trim(),
        images: imageUrls,
      });

      showToast("Đánh giá đã được gửi thành công!", "success");
      setOpen(false);

      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        (error instanceof Error ? error.message : null) ||
        "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#26B8ED] font-bold">
            Đánh giá địa điểm
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Attraction Info */}
          <div className="flex gap-4">
            <img
              src={attraction.images?.[0] || "/placeholder.jpg"}
              alt={attraction.name}
              className="w-32 h-24 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{attraction.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {attraction.description}
              </p>
            </div>
          </div>

          {/* Rating Section */}
          <div>
            <label className="text-sm font-medium">
              Đánh giá chất lượng địa điểm:
            </label>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-7 h-7 cursor-pointer transition-colors ${
                      star <= (hoveredStar || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {getRatingLabel()}
              </span>
            </div>
          </div>

          {/* Review Content */}
          <div>
            <label className="text-sm font-medium">
              Nội dung đánh giá: <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Chia sẻ trải nghiệm của bạn về địa điểm này..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 min-h-[120px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tối thiểu 10 ký tự ({content.length}/10)
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium">Hình ảnh (tùy chọn):</label>
            <div className="mt-2">
              {uploadedImages.length === 0 ? (
                <Button
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                  className="border-primary border bg-white hover:bg-primary/20 text-primary"
                  disabled={isLoading}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Thêm hình ảnh
                </Button>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {uploadedImages.map((image, index) => (
                    <div
                      key={index}
                      className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 relative group"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Xóa ảnh"
                        disabled={isLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {uploadedImages.length < 4 && (
                    <button
                      type="button"
                      onClick={() => uploadInputRef.current?.click()}
                      className="w-24 h-24 rounded-lg border-2 border-dashed border-primary bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors flex-col text-primary"
                      disabled={isLoading}
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-xs mt-1">
                        {uploadedImages.length} / 4
                      </span>
                    </button>
                  )}
                </div>
              )}
              <Input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">Tối đa 4 hình ảnh</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
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

export default AttractionReviewDialog;

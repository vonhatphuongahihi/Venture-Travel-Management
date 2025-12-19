import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { imageUploadService } from "@/services/imageUpload.service";
import { useTranslation } from "react-i18next";

interface ReviewEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewData: {
    reviewId: string;
    rate: number;
    content: string;
    images: string[];
  } | null;
  type: "tour" | "attraction";
  onSave: (
    reviewId: string,
    data: { rate: number; content: string; images: string[] }
  ) => Promise<void>;
}

export const ReviewEditDialog = ({
  open,
  onOpenChange,
  reviewData,
  type,
  onSave,
}: ReviewEditDialogProps) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (reviewData) {
      setRating(reviewData.rate);
      setContent(reviewData.content);
      setImages(reviewData.images || []);
    }
  }, [reviewData]);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Limit total images to 5
    if (images.length + files.length > 5) {
      showToast(t("myReviews.maxImagesError"), "error");
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await imageUploadService.uploadSingleImage(file);
        return result;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...newImageUrls]);
      showToast(t("myReviews.uploadSuccess"), "success");
    } catch (error) {
      console.error("Error uploading images:", error);
      showToast(t("myReviews.uploadFailed"), "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!reviewData) return;

    if (!content.trim()) {
      showToast(t("myReviews.contentPlaceholder"), "error");
      return;
    }

    setSaving(true);
    try {
      await onSave(reviewData.reviewId, {
        rate: rating,
        content: content.trim(),
        images,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving review:", error);
    } finally {
      setSaving(false);
    }
  };

  const getRatingLabel = (value: number) => {
    const labels = [
      "",
      t("reviewCard.rating1"),
      t("reviewCard.rating2"),
      t("reviewCard.rating3"),
      t("reviewCard.rating4"),
      t("reviewCard.rating5"),
    ];
    return labels[value] || "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
          <DialogDescription>
            Cập nhật đánh giá của bạn về {type === "tour" ? "tour" : "địa điểm"}{" "}
            này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("myReviews.yourRating")}
            </label>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          value <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {getRatingLabel(rating)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("myReviews.reviewContent")}
            </label>
            <Textarea
              placeholder={t("myReviews.contentPlaceholder")}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length}/500 {t("myReviews.characters")}
            </p>
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("myReviews.images")}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">
                        {t("myReviews.upload")}
                      </span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            {t("myReviews.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={saving || uploading}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("myReviews.saving")}
              </>
            ) : (
              t("myReviews.saveChanges")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

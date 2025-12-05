import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Plus, Star, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ReviewCardProps {
  data: any; // Thay 'any' bằng kiểu dữ liệu thực tế của props nếu có
  itemId: string;
  onReviewChange: (
    itemId: string,
    data: {
      rating: number;
      reviewText: string;
      images: File[];
      itemId: string;
      itemType: "tour" | "destination";
    }
  ) => void;
}

const ReviewCard = ({ data, itemId, onReviewChange }: ReviewCardProps) => {
  const { t } = useTranslation();
  const [tourRating, setTourRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const getRatingLabel = () => {
    const rating = hoveredStar || tourRating;
    if (rating === 0) return t("reviewCard.notRated");
    return t(`reviewCard.rating${rating}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, 4 - uploadedImages.length);
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);

    // Reset input value để có thể chọn lại cùng file
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  // Notify parent component whenever review data changes
  useEffect(() => {
    onReviewChange(itemId, {
      rating: tourRating,
      reviewText,
      images: uploadedImages,
      itemId,
      itemType: data.type,
    });
  }, [
    tourRating,
    reviewText,
    uploadedImages,
    itemId,
    data.type,
    onReviewChange,
  ]);

  return (
    <div className="space-y-3">
      <div className="flex gap-5">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-32 object-cover rounded-md"
        />
        <div>
          <h2 className="font-bold">{data.name}</h2>
          <p className="mt-2 text-gray-600 line-clamp-2">{data.description}</p>
        </div>
      </div>

      <div>
        <span>
          {t("reviewCard.quality")} {data.type == "destination" ? t("reviewCard.destination") : t("reviewCard.tour")}:{" "}
        </span>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer transition-colors ${star <= (hoveredStar || tourRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
                  }`}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setTourRating(star)}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {getRatingLabel()}
          </span>
        </div>
      </div>

      <Textarea
        placeholder={t("reviewCard.placeholder")}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <div>
        {uploadedImages.length === 0 ? (
          <Button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            className="border-primary border bg-white hover:bg-primary/20 text-primary"
          >
            <Camera />
            {t("reviewCard.addImages")}
          </Button>
        ) : (
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 relative group"
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
                  aria-label={t("reviewCard.removeImage")}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {uploadedImages.length < 4 && (
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-primary bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors flex-col text-primary"
              >
                <Plus className="w-8 h-8 " />
                <span className="text-xs">{uploadedImages.length} / 4</span>
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
        />
      </div>
    </div>
  );
};

export default ReviewCard;

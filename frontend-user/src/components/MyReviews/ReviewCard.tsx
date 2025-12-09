import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trash2, Edit, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface ReviewCardProps {
  review: {
    reviewId: string;
    rate?: number;
    rating?: number;
    content: string;
    images: string[];
    date: string;
    createdAt?: string;
    updatedAt?: string;
    tour?: {
      tourId: string;
      name: string;
      images: string[];
    };
    attraction?: {
      attractionId: string;
      name: string;
      images: string[];
    };
  };
  type: "tour" | "attraction";
  onEdit: (reviewId: string) => void;
  onDelete: (reviewId: string) => void;
}

export const ReviewCard = ({
  review,
  type,
  onEdit,
  onDelete,
}: ReviewCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rating = review.rating || review.rate;
  const date = review.date || review.createdAt || "";
  const displayDate = new Date(date).toLocaleDateString("vi-VN");
  const target = type === "tour" ? review.tour : review.attraction;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getRatingLabel = (rating: number) => {
    const labels = [
      t("reviewCard.notRated"),
      t("reviewCard.rating1"),
      t("reviewCard.rating2"),
      t("reviewCard.rating3"),
      t("reviewCard.rating4"),
      t("reviewCard.rating5"),
    ];
    return labels[rating] || t("reviewCard.notRated");
  };

  const handleViewTarget = () => {
    const targetId =
      type === "tour"
        ? (target as { tourId: string })?.tourId
        : (target as { attractionId: string })?.attractionId;
    navigate(type === "tour" ? `/tour/${targetId}` : `/attraction/${targetId}`);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      {/* Header with target info */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-shrink-0">
          <img
            src={target?.images?.[0] || "/placeholder.jpg"}
            alt={target?.name || ""}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
            {type === "tour" ? t("myReviews.tour") : t("myReviews.attraction")}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary cursor-pointer"
            onClick={handleViewTarget}
          >
            {target?.name || "N/A"}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">{renderStars(rating)}</div>
            <span className="text-sm text-gray-600 font-medium">
              {getRatingLabel(rating)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{displayDate}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
      </div>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {review.images.slice(0, 4).map((img, idx) => (
            <div key={idx} className="relative group cursor-pointer">
              <img
                src={img}
                alt={`Review ${idx + 1}`}
                className="w-20 h-20 rounded-md object-cover group-hover:opacity-90 transition-opacity"
              />
              {idx === 3 && review.images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center text-white text-sm font-medium">
                  +{review.images.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewTarget}
          className="flex-1"
        >
          {type === "tour"
            ? t("myReviews.viewTour")
            : t("myReviews.viewAttraction")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(review.reviewId)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Edit className="w-4 h-4 mr-1" />
          {t("myReviews.edit")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(review.reviewId)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          {t("myReviews.delete")}
        </Button>
      </div>
    </Card>
  );
};

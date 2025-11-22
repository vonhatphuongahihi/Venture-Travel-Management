import { Star } from "lucide-react";

export default function RatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating); // số sao đầy
  const halfStar = rating % 1 >= 0.5; // có nửa sao hay không
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-2">
      {/* Điểm số */}
      <span className="text-xl font-bold">{rating.toFixed(1)}</span>

      {/* Icon sao */}
      <div className="flex">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`full-${i}`} className="text-primary" />
          ))}
        {halfStar && <Star className="text-primary/50" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`empty-${i}`} className="text-gray-300" />
          ))}
      </div>
    </div>
  );
}
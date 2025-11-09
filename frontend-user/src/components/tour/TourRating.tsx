import { Star } from 'lucide-react';

interface TourRatingProps {
  rating: number;
  reviewCount: number;
  maxStars?: number;
}

export const TourRating = ({ rating, reviewCount, maxStars = 5 }: TourRatingProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(maxStars)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? 'fill-[#FFBA0A] text-[#FFBA0A]'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-[#5E6282] text-[16px]">
        ({reviewCount.toLocaleString('vi-VN')}k đánh giá)
      </span>
    </div>
  );
};

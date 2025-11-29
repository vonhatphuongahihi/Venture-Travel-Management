import { Star } from 'lucide-react';

interface TourRatingProps {
  rating: number;
  reviewCount: number;
  maxStars?: number;
}

export const TourRating = ({ rating, reviewCount, maxStars = 5 }: TourRatingProps) => {
  return (
    <div className="flex items-center gap-3 bg-slate-50 rounded-full px-4 py-2 w-fit">
      <span className="text-[#FFBA0A] font-semibold text-lg">{rating.toFixed(1)}</span>
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
      <span className="text-[#5E6282] text-[14px]">
        {reviewCount.toLocaleString('vi-VN')} đánh giá
      </span>
    </div>
  );
};

import { Tour } from '@/types/tour.types';
import { formatCurrencySimple } from '@/utils/formatters';
import { TourRating } from './TourRating';
import { Check, X } from 'lucide-react';

interface TourInfoProps {
  tour: Tour;
}

export const TourInfo = ({ tour }: TourInfoProps) => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[31.62px] font-bold text-black mb-2">{tour.name}</h1>
        <TourRating rating={tour.rating} reviewCount={tour.reviewCount} />
        <div className="flex items-center gap-2 mt-4">
          <span className="text-[#DF6951] text-[30px] font-medium">
            {formatCurrencySimple(tour.price)}
          </span>
          <span className="text-[#7D7D7D] text-[16px]">/ khách</span>
        </div>
      </div>

      {/* Description */}
      <div className="prose max-w-none mb-8">
        <p className="text-[16px] leading-[26px] text-black whitespace-pre-line">
          {tour.description}
        </p>
      </div>

      {/* Tour Details */}
      <div className="space-y-6 mb-8">
        <DetailRow label="Điểm đến" value={tour.destination} />
        <DetailRow label="Điểm khởi hành" value={tour.departurePoint} />
        <DetailRow label="Thời gian khởi hành" value={tour.departureTime} />
        <DetailRow label="Thời gian trở về" value={tour.returnTime} />
        <DetailRow label="Trang phục" value={tour.dressCode} />
      </div>

      {/* Included/Excluded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-[#DF6951] text-[20px] font-bold mb-4">Bao gồm</h3>
          <ul className="space-y-2">
            {tour.included.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-black text-[16px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[#DF6951] text-[20px] font-bold mb-4">Không bao gồm</h3>
          <ul className="space-y-2">
            {tour.excluded.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                <span className="text-black text-[16px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <div className="flex flex-col sm:flex-row gap-2">
    <span className="text-[#DF6951] text-[20px] font-bold sm:w-[280px]">
      {label}
    </span>
    <span className="text-black text-[16px]">: {value}</span>
  </div>
);

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Users, Calendar } from "lucide-react";

interface TourCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  location: string;
  rating: number;
  reviewCount: number;
  category: string;
  status: "upcoming" | "ongoing" | "completed";
  maxParticipants: number;
  availableSpots: number;
}

const TourCard = ({
  title,
  description,
  image,
  price,
  duration,
  location,
  rating,
  reviewCount,
  category,
  status,
  maxParticipants,
  availableSpots
}: TourCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-green-100 text-green-800";
      case "ongoing": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming": return "Sắp khởi hành";
      case "ongoing": return "Đang diễn ra";
      case "completed": return "Đã kết thúc";
      default: return "Không xác định";
    }
  };

  return (
    <div className="tour-card group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`tour-badge ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="tour-badge bg-primary text-white">
            {category}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-lg font-bold text-primary">{price.toLocaleString()}đ</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>

        {/* Tour Details */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            {location}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              {duration}
            </div>

            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
              <span className="text-muted-foreground ml-1">({reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2 text-primary" />
              {availableSpots}/{maxParticipants} chỗ
            </div>

            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Hàng ngày
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-border flex gap-2">
          <Button variant="tour" size="sm" className="flex-1 hover:bg-[#b2e8ff] hover:text-[#fafcff]">
            Xem chi tiết
          </Button>
          <Button variant="default" size="sm" className="flex-1">
            Đặt ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
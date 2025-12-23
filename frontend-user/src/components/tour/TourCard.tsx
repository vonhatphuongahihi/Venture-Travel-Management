import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  id,
  title,
  description,
  image,
  price,
  duration,
  location,
  rating,
  reviewCount,

  maxParticipants,
  availableSpots
}: TourCardProps) => {
  const navigate = useNavigate();



  return (
    <div
      className="tour-card group cursor-pointer rounded-2xl border border-transparent bg-white shadow-xl shadow-primary/5 hover:-translate-y-2 transition-all duration-300"
      onClick={() => { navigate(`/tour/${id}`) }}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl rounded-b-none">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-lg font-bold text-primary">{price.toLocaleString()}đ</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
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
              {maxParticipants} chỗ
            </div>

            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Hàng ngày
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-border flex gap-2">
          <Button variant="default" size="sm" className="flex-1" onClick={() => { navigate(`/tour/${id}`) }}>
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
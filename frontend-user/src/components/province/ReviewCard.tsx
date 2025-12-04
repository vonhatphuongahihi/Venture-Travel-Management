import React from "react";
import { Card, CardContent } from "../ui/card";
import { TourReview, AttractionReview } from "@/global.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

type ReviewCardProps = {
  review: TourReview | AttractionReview;
  reviewType: "tour" | "attraction";
  isFromProvincePage?: boolean;
};

const ReviewCard = ({
  review,
  reviewType,
  isFromProvincePage = false,
}: ReviewCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (reviewType === "tour" && "tourId" in review) {
      navigate(`/tour/${review.tourId}`);
    } else if (reviewType === "attraction" && "attractionId" in review) {
      navigate(`/attraction/${review.attractionId}`);
    }
  };

  const displayDate = new Date(review.createdAt).toLocaleDateString();
  const userName = review.user?.name || "Anonymous";
  const userAvatar = review.user?.avatar;
  const rating = review.rate;

  return (
    <Card
      className="group overflow-hidden min-w-[200px] rounded-2xl transition-all hover:-translate-y-1 cursor-pointer h-full"
      onClick={handleClick}
    >
      <div className="h-full flex flex-col justify-between gap-3">
        <div className="flex justify-between items-center pt-4 px-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold">{userName}</h3>
              <p className="text-sm text-gray-500">{displayDate}</p>
            </div>
          </div>

          <div className="space-x-2 flex items-center">
            <span className="text-primary text-xs font-medium">
              {rating >= 4 ? "Hài lòng" : "Bình thường"}
            </span>
            <span className="bg-primary p-1 rounded-tl-md rounded-br-md text-[12px] text-white">
              {rating}
            </span>
          </div>
        </div>

        <div className="px-4 h-20">
          <p className="line-clamp-4 text-sm">{review.content}</p>
        </div>

        {reviewType === "tour" &&
        isFromProvincePage &&
        "tour" in review &&
        review.tour ? (
          <div className="p-2 bg-gray-100 flex rounded-t-md items-center gap-2">
            <img
              src={review.tour.images?.[0] || ""}
              className="h-12 w-20 rounded-md object-cover"
              alt={review.tour.name}
            />
            <p className="text-xs font-medium">{review.tour.name}</p>
          </div>
        ) : (
          <div className="p-2 flex flex-wrap gap-2">
            {review.images?.map((img, indx) => {
              if (indx > 3) return null;

              return (
                <div className="relative" key={indx}>
                  <img
                    key={indx}
                    src={img}
                    className="size-20 rounded-md object-cover"
                  />

                  {indx === 3 && review.images.length > 4 && (
                    <span className="bg-black/50 p-1 absolute bottom-1 right-1 text-white text-xs rounded-sm">
                      {review.images.length - 4}+
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReviewCard;

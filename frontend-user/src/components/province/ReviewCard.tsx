import React from "react";
import { Card, CardContent } from "../ui/card";
import { Review } from "@/global.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const ReviewCard = ({
  review,
  isFromProvincePage = false,
}: {
  review: Review;
  isFromProvincePage?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden min-w-[200px] rounded-2xl transition-all hover:-translate-y-1 cursor-pointer h-full" onClick={() => navigate(`/tour/${review.tour.id}`)}>
      <div className="h-full flex flex-col justify-between gap-3">
        <div className="flex justify-between items-center pt-4 px-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={review.user.avatar} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold">{review.user.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-x-2 flex items-center">
            <span className="text-primary text-xs font-medium">
              {review.rating >= 4 ? "Hài lòng" : "Bình thường"}
            </span>
            <span className="bg-primary p-1 rounded-tl-md rounded-br-md text-[12px] text-white">
              {review.rating}
            </span>
          </div>
        </div>

        <div className="px-4 h-20">
          <p className="line-clamp-4 text-sm">{review.content}</p>
        </div>

        {review.targetType == "tour" && isFromProvincePage ? (
          <div className="p-2 bg-gray-100 flex rounded-t-md items-center gap-2">
            <img src={review.tour.image} className="h-12 w-20 rounded-md" />

            <p className="text-xs font-medium">{review.tour.title}</p>
          </div>
        ) : (
          <div className="p-2 flex flex-wrap gap-2">
            {review?.images.map((img, indx) => {
              if (indx > 3) return null;

              return (
                <div className="relative" key={indx}>
                  <img key={indx} src={img} className="size-20 rounded-md" />

                  {indx === 3 && (
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

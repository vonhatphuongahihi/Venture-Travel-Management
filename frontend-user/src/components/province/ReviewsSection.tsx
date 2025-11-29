import { Province, Review } from "@/global.types";
import React from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { mockReviews } from "@/data/reviews";
import ReviewCard from "./ReviewCard";

import { useProvinceReviews } from "@/hooks/useProvince";

interface ReviewsSectionProps {
  province: Province;
}

const ReviewsSection = ({ province }: ReviewsSectionProps) => {
  const { data: reviewsData } = useProvinceReviews(province.id);
  const reviews = reviewsData?.data || [];
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const updateButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    // cập nhật lần đầu
    updateButtons();

    // lắng nghe khi carousel scroll
    api.on("select", updateButtons);
    api.on("reInit", updateButtons);

    return () => {
      api.off("select", updateButtons);
      api.off("reInit", updateButtons);
    };
  }, [api]);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">
        Đánh giá về các tour ở {province.name}
      </h2>

      {reviews.length > 0 ? <Carousel
        opts={{
          align: "start",
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="pt-2">
          {reviews.map((review, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <ReviewCard review={review} isFromProvincePage={true} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {canScrollPrev && <CarouselPrevious />}
        {canScrollNext && <CarouselNext />}
      </Carousel> : <p>Không có đánh giá nào</p>}
    </section>
  );
};

export default ReviewsSection;

import ReviewCard from "@/components/province/ReviewCard";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AttractionReview, Review } from "@/global.types";
import { Star } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface AttractionReviewsSectionProps {
  reviews: AttractionReview[];
  averageRating: number;
  totalReviews: number;
  canWrite?: boolean;
  onWrite?: () => void;
}

function AttractionReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  canWrite = false,
  onWrite,
}: AttractionReviewsSectionProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [open, setOpen] = React.useState(false);

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-7 w-7 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Đánh giá</h2>
        {canWrite && (
          <Button variant="ghost" onClick={() => onWrite && onWrite()}>
            Viết đánh giá
          </Button>
        )}
      </div>

      {/* Rating Overview */}
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        {/* Overall Rating */}
        <div className="flex-shrink-0">
          <div className="text-center flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="text-5xl text-gray-900 mb-2">
                <b>{averageRating.toFixed(1)}</b>
                <span className="text-sm">/ 5</span>
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
            </div>

            <div className="text-sm text-gray-600">{totalReviews} Đánh giá</div>
          </div>
        </div>

        <button
          className="underline text-gray-500 hidden lg:block"
          onClick={() => setOpen(true)}
        >
          Đọc tất cả đánh giá
        </button>
      </div>

      {/* Reviews using ReviewCard */}
      <Carousel
        opts={{
          align: "start",
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="pt-2">
          {reviews.map((review, index) => (
            <CarouselItem
              key={index}
              className="flex-none w-[380px] lg:basis-1/3"
            >
              <ReviewCard review={review} reviewType="attraction" />
            </CarouselItem>
          ))}
        </CarouselContent>
        {canScrollPrev && <CarouselPrevious className="max-md:hidden" />}
        {canScrollNext && <CarouselNext className="max-md:hidden" />}
      </Carousel>
      <Button
        variant="outline"
        className="w-full mt-5 max-lg:block hidden"
        onClick={() => setOpen(true)}
      >
        Đọc tất cả đánh giá
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full !max-w-screen-md">
          <div className="text-center flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="text-5xl text-gray-900 mb-2">
                <b>{averageRating.toFixed(1)}</b>
                <span className="text-sm">/ 5</span>
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
            </div>

            <div className="text-sm text-gray-600">{totalReviews} Đánh giá</div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AttractionReviewsSection;

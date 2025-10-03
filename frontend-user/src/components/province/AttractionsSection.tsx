import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Attraction, Province } from "@/global.types";
import React from "react";
import AttractionCard from "./AttractionCard";

interface AttractionsSectionProps {
  province: Province;
  attractions: Attraction[];
}

const AttractionsSection = ({
  province,
  attractions,
}: AttractionsSectionProps) => {
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
    <section className="pt-8">
      <h2 className="text-2xl font-semibold mb-6">
        Điểm tham quan hàng đầu ở {province.name}
      </h2>

      <Carousel
        opts={{
          align: "start",
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="pt-2">
          {attractions.map((attraction, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <AttractionCard key={attraction.id} attraction={attraction} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {canScrollPrev && <CarouselPrevious />}
        {canScrollNext && <CarouselNext />}
      </Carousel>
    </section>
  );
};

export default AttractionsSection;

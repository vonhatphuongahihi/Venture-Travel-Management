import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Province, Tour } from "@/global.types";
import React from "react";
import { Link } from "react-router-dom";
import TourCard from "../tour/TourCard";
import { useTranslation } from "react-i18next";

interface TourSliderSectionProps {
  province: Province;
  tours: Tour[];
}

const TourSliderSection = ({ province, tours }: TourSliderSectionProps) => {
  const { t } = useTranslation();
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
    <section className="pt-5">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold ">
          {t("tourSlider.attractiveToursIn")} {province.name}
        </h2>

        <Link
          to={`/province/${province.slug}/tours-activities`}
          className="text-sm text-black/50 font-medium hover:underline self-end"
        >
          {t("tourSlider.viewAll")}
        </Link>
      </div>

      {tours.length > 0 ? <Carousel
        opts={{
          align: "start",
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="pt-2">
          {tours.map((tour, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Link to={`/tour/${tour.id}`}>
                <TourCard key={tour.id} {...tour} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {canScrollPrev && <CarouselPrevious />}
        {canScrollNext && <CarouselNext />}
      </Carousel> : <p>{t("tourSlider.noTours")}</p>}
    </section>
  );
};

export default TourSliderSection;

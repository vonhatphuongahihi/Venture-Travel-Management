import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import Slider from "react-slick";
import { Button } from "../ui/button";
export default function ImageGallery({
  target,
  currentIndex,
  onClose,
}: {
  target: string[];
  currentIndex: number;
  onClose: () => void;
}) {
  const sliderRef = useRef<Slider>(null);
  const NextArrow = () => {
    return (
      <Button
        className="w-10 h-10 absolute right-0 top-1/2 translate-x-full -translate-y-1/2 bg-white text-xl shadow bg-primary text-white hover:bg-primary/80 cursor-pointer rounded-full z-100"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <ChevronRight />
      </Button>
    );
  };
  const PrevArrow = () => {
    return (
        <Button
        className="w-10 h-10 absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-white text-xl shadow bg-primary text-white hover:bg-primary/80 cursor-pointer rounded-full z-10"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <ChevronLeft/>
      </Button>
    );
  };
  const settings = {
    dots: true,
    dotsClass: "slick-dots custom-dots",
    fade: true,
    infinite: true,
    draggable: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(currentIndex, true);
    }
  },[])
  return (
    <div
      className="fixed flex justify-center items-center top-0 left-0 w-full min-h-screen z-20 bg-gray-900/90"
      onClick={onClose}
    >
      <div
        className="bg-white py-10 px-20 rounded-lg w-[1000px] h-[550px] outline outline-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <Slider ref={sliderRef} {...settings}>
          {target.map((url, index) => {
            return (
              <img src={url} key={index} className="w-[800px] h-[450px] object-contain" />
            );
          })}
        </Slider>
        <style>{`
        .custom-dots {
            bottom: -35px;
          }
        .custom-dots li button:before {
          color: #26B8ED !important;
          font-size: 12px;
        }
        .custom-dots li.slick-active button:before {
          color: #26B8ED !important;
          opacity: 1 !important;
        }
      `}</style>
      </div>
    </div>
  );
}

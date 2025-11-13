import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default function ImageGallery({
  target,
  currentIndex,
  onClose,
}: {
  target: string[];
  currentIndex: number;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed flex justify-center items-center -top-2 left-0 w-full min-h-screen z-20 bg-gray-900/90"
      onClick={onClose}
    >
      <div
        className="bg-white py-10 px-20 rounded-lg w-[1000px] h-[550px] outline outline-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <Carousel
          opts={{
            startIndex: currentIndex,
            duration: 30,
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {target.map((url, index) => {
              return (
                <CarouselItem key={index}>
                  <img
                    src={url}
                    className="w-[800px] h-[450px] object-contain"
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="bg-white text-xl shadow bg-primary text-white hover:bg-primary/80 cursor-pointer rounded-full" />
          <CarouselNext className="bg-white text-xl shadow bg-primary text-white hover:bg-primary/80 cursor-pointer rounded-full" />
        </Carousel>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import beachImage from "@/assets/beach-destination.jpg";
import culturalImage from "@/assets/cultural-festival.jpg";
import heroImage from "@/assets/hero-vietnam.jpg";
import top3Image from "@/assets/top-3-destination.png";
import top2Image from "@/assets/top-2-destination.png";

const DestinationsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const destinations = [
        {
            id: 1,
            name: "Đà Lạt",
            tours: 12,
            image: top2Image,
        },
        {
            id: 2,
            name: "Nha Trang",
            tours: 3,
            image: beachImage,
        },
        {
            id: 3,
            name: "Đà Lạt",
            tours: 9,
            image: culturalImage,
        },
        {
            id: 4,
            name: "Quy Nhơn",
            tours: 9,
            image: heroImage,
        },
        {
            id: 5,
            name: "Sapa",
            tours: 15,
            image: top3Image,
        }
    ];

    const getCardOpacity = (index: number, currentIndex: number) => {
        return index === currentIndex ? "opacity-100" : "opacity-80";
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? destinations.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === destinations.length - 1 ? 0 : prev + 1));
    };

    return (
        <section ref={sectionRef} className="py-4 bg-background">
            <div className="container">
                {/* Header */}
                <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 bg-[#dff6ff] text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Star className="h-4 w-4" />
                        Đặc biệt
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        TOP ĐIỂM ĐẾN
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        Sapa với núi rừng hùng vĩ, Đà Lạt mộng mơ, các thành phố nhộn nhịp và những di tích lịch sử - văn hóa đặc sắc
                    </p>
                </div>

                {/* Destination Cards */}
                <div className={`relative mb-8 py-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <div className="flex justify-center">
                        <div className="flex items-center gap-4 max-w-6xl overflow-visible">
                            {destinations.map((destination, index) => (
                                <div
                                    key={destination.id}
                                    className={`relative flex-shrink-0 w-64 h-80 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ${getCardOpacity(index, currentIndex)}`}
                                    style={{
                                        transform: index === currentIndex ? 'scale(1.05) translateY(-10px)' : 'scale(1) translateY(0px)',
                                        zIndex: index === currentIndex ? 10 : 5
                                    }}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h3 className="text-xl font-bold mb-1">
                                            {destination.name}
                                        </h3>
                                        <p className="text-xs opacity-90">
                                            {destination.tours} Tours
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex justify-center gap-4">
                    <Button
                        variant="default"
                        size="icon"
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-full bg-primary/60 hover:bg-primary/90"
                    >
                        <ChevronLeft className="h-6 w-6 text-white" />
                    </Button>
                    <Button
                        variant="default"
                        size="icon"
                        onClick={handleNext}
                        className="w-12 h-12 rounded-full bg-primary/60 hover:bg-primary/90"
                    >
                        <ChevronRight className="h-6 w-6 text-white" />
                    </Button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                    {destinations.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DestinationsSection;

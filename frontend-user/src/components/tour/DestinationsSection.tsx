import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AttractionAPI, { TopDestination } from "@/services/attractionAPI";
import { useTranslation } from "react-i18next";

const DestinationsSection = () => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [destinations, setDestinations] = useState<TopDestination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    // Fetch top destinations from API
    useEffect(() => {
        const fetchTopDestinations = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await AttractionAPI.getTopDestinations(5);
                setDestinations(data);
            } catch (err) {
                console.error('Error fetching top destinations:', err);
                setError(t('destinations.loadError'));
                setDestinations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopDestinations();
    }, []);

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
        <section
            ref={sectionRef}
            className="py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden"
        >
            <div className="absolute inset-x-0 -top-10 h-40 bg-primary/10 blur-3xl opacity-50 pointer-events-none" />
            <div className="container relative">
                {/* Header */}
                <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 bg-[#dff6ff] text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Star className="h-4 w-4" />
                        {t('destinations.badge')}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        {t('destinations.title')}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        {t('destinations.description')}
                    </p>
                </div>

                {/* Destination Cards */}
                <div className={`relative mb-8 py-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : destinations.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>{t('destinations.noDestinations')}</p>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="flex items-center gap-6 max-w-6xl overflow-visible">
                                {destinations.map((destination, index) => (
                                    <div
                                        key={destination.id}
                                        className={`relative flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 shadow-xl shadow-primary/10 border border-white/10 backdrop-blur-lg ${getCardOpacity(index, currentIndex)}`}
                                        style={{
                                            transform: index === currentIndex ? 'scale(1.05) translateY(-10px)' : 'scale(1) translateY(0px)',
                                            zIndex: index === currentIndex ? 10 : 5
                                        }}
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        <img
                                            src={destination.image || '/placeholder.svg'}
                                            alt={destination.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder.svg';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full bg-white/80 text-primary text-xs font-semibold backdrop-blur">
                                                {destination.category || t('destinations.destination')}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-6 left-6 text-white drop-shadow-lg">
                                            <h3 className="text-xl font-bold mb-1">
                                                {destination.name}
                                            </h3>
                                            <p className="text-xs opacity-90">
                                                {destination.tourCount} {t('destinations.tours')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Arrows */}
                {!loading && !error && destinations.length > 0 && (
                    <>
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="default"
                                size="icon"
                                onClick={handlePrev}
                                className="w-12 h-12 rounded-full bg-primary/60 hover:bg-primary/90"
                                disabled={destinations.length === 0}
                            >
                                <ChevronLeft className="h-6 w-6 text-white" />
                            </Button>
                            <Button
                                variant="default"
                                size="icon"
                                onClick={handleNext}
                                className="w-12 h-12 rounded-full bg-primary/60 hover:bg-primary/90"
                                disabled={destinations.length === 0}
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
                    </>
                )}
            </div>
        </section>
    );
};

export default DestinationsSection;

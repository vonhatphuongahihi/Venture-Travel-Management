import Header from "@/components/Header";
import HeroSection from "@/components/tour/HeroSection";
import ToursSection from "@/components/tour/ToursSection";
import DestinationsSection from "@/components/tour/DestinationsSection";
import MapSection from "@/components/tour/ProvinceMapSection";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

const Index = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Trigger page animation after component mounts
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen bg-background transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`sticky top-0 z-50 transition-all duration-1000 delay-200 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <Header />
      </div>
      <main>
        <HeroSection />
        <ToursSection />
        <DestinationsSection />
        <MapSection />
      </main>
      <div
        className={`transition-all duration-1000 delay-400 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Index;

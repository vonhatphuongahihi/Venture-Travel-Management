import Header from "@/components/Header";
import HeroSection from "@/components/tour/HeroSection";
import ToursSection from "@/components/tour/ToursSection";
import MapSection from "@/components/tour/MapSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ToursSection />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ToursSection from "@/components/ToursSection";
import MapSection from "@/components/MapSection";
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
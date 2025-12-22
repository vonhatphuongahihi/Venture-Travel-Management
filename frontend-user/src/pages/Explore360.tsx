import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Play, Megaphone, Target, PenTool, Star, Instagram, Facebook, Phone } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import '../components/tour/herosection.css';
import { useTranslation } from "react-i18next";

// Import images
import tour1 from "@/assets/explore-360/tour-1.jpg";
import tour2 from "@/assets/explore-360/tour-2.jpg";
import tour3 from "@/assets/explore-360/tour-3.jpg";
import tour4 from "@/assets/explore-360/tour-4.jpg";
import tour5 from "@/assets/explore-360/tour-5.jpg";
import tour6 from "@/assets/explore-360/tour-6.jpg";
import banner1 from "@/assets/explore-360/banner-1.jpg";
import banner2 from "@/assets/explore-360/banner-2.jpg";
import banner3 from "@/assets/explore-360/banner-3.jpg";

const Explore360 = () => {
    const { t } = useTranslation();
    const [hoveredSite, setHoveredSite] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isMainVisible, setIsMainVisible] = useState(false);
    const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const mainSectionRef = useRef<HTMLElement>(null);
    const featuresSectionRef = useRef<HTMLElement>(null);

    const slides = [
        {
            id: 0,
            image: banner1,
            title: t("explore360.slides.slide1.title"),
            description: t("explore360.slides.slide1.description")
        },
        {
            id: 1,
            image: banner2,
            title: t("explore360.slides.slide2.title"),
            description: t("explore360.slides.slide2.description")
        },
        {
            id: 2,
            image: banner3,
            title: t("explore360.slides.slide3.title"),
            description: t("explore360.slides.slide3.description")
        }
    ];

    const sites = [
        {
            name: t("explore360.sites.hue.name"),
            image: tour1,
            description: t("explore360.sites.hue.description"),
            link: "https://vietnam.travel/sites/default/files/360Tour/Hue2021/index.htm"
        },
        {
            name: t("explore360.sites.halong.name"),
            image: tour2,
            description: t("explore360.sites.halong.description"),
            link: "https://vietnam.travel/sites/default/files/360Tour/HaLong/index.htm"
        },
        {
            name: t("explore360.sites.hoian.name"),
            image: tour3,
            description: t("explore360.sites.hoian.description"),
            link: "https://vietnam.travel/sites/default/files/360Tour/HoiAn/index.htm"
        },
        {
            name: t("explore360.sites.hanoi.name"),
            image: tour4,
            description: t("explore360.sites.hanoi.description"),
            link: "https://vietnam.travel/sites/default/files/360Tour/HaNoi/index.htm"
        },
        {
            name: t("explore360.sites.phongnha.name"),
            image: tour5,
            description: t("explore360.sites.phongnha.description"),
            link: "https://vietnam.travel/sites/default/files/360Tour/PhongNha/index.htm"
        },
        {
            name: t("explore360.sites.myson.name"),
            image: tour6,
            description: t("explore360.sites.myson.description"),
            link: "https://vietnam.travel/sites/default/files/360Tour/MySon/index.htm"
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const mainObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsMainVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const featuresObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsFeaturesVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        if (mainSectionRef.current) {
            mainObserver.observe(mainSectionRef.current);
        }
        if (featuresSectionRef.current) {
            featuresObserver.observe(featuresSectionRef.current);
        }

        return () => {
            observer.disconnect();
            mainObserver.disconnect();
            featuresObserver.disconnect();
        };
    }, []);

    const handleThumbnailClick = (index: number) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const features = [
        {
            icon: Megaphone,
            title: t("explore360.features.feature1.title"),
            description: t("explore360.features.feature1.description")
        },
        {
            icon: Target,
            title: t("explore360.features.feature2.title"),
            description: t("explore360.features.feature2.description")
        },
        {
            icon: PenTool,
            title: t("explore360.features.feature3.title"),
            description: t("explore360.features.feature3.description")
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section ref={sectionRef} className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
                {/* Background Image Slider */}
                <div className="absolute inset-0 z-0 carousel">
                    <div className="list">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`item ${index === currentSlide ? 'active' : ''}`}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-primary/30 to-transparent" />
                            </div>
                        ))}
                    </div>

                    {/* Thumbnails */}
                    <div className="thumbnail">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`item ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(index)}
                            >
                                <img src={slide.image} alt={slide.title} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 container text-center text-white">
                    <div className="max-w-4xl mx-auto">
                        <h1 className={`text-[26px] md:text-[42px] font-medium font-marmelad mb-6 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            {slides[currentSlide].title}
                        </h1>

                        <p className={`text-base md:text-lg mb-8 text-white/90 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            {slides[currentSlide].description}
                        </p>


                    </div>
                </div>

                {/* Social Media Icons */}
                <div className="absolute bottom-10 left-10  gap-4 hidden lg:flex">
                    <div className="flex space-x-4">
                        <a
                            href="https://www.instagram.com/tuhy.sapoche.99"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 backdrop-blur-sm rounded-full p-3 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                        >
                            <Instagram className="h-6 w-6 text-white" />
                        </a>

                        <a
                            href="https://www.facebook.com/phuong.vonhat.tuhy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 backdrop-blur-sm rounded-full p-3 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                        >
                            <Facebook className="h-6 w-6 text-white" />
                        </a>

                        <a
                            href="tel:+84365486141"
                            className="bg-white/10 backdrop-blur-sm rounded-full p-3 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                        >
                            <Phone className="h-6 w-6 text-white" />
                        </a>
                    </div>

                </div>
            </section>

            {/* Main Content Section */}
            <section ref={mainSectionRef} className="py-16">
                <div className="container px-4">
                    <div className={`text-center mb-12 transition-all duration-1000 ${isMainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="inline-flex items-center gap-2 bg-[#dff6ff] text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Star className="h-4 w-4" />
                            {t("explore360.badge")}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            {t("explore360.mainTitle")}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t("explore360.mainDescription")}
                        </p>
                    </div>

                    {/* Destinations Grid */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12 transition-all duration-1000 delay-200 ${isMainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        {sites.map((site) => (
                            <a
                                key={site.name}
                                href={site.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 block"
                                onMouseEnter={() => setHoveredSite(site.name)}
                                onMouseLeave={() => setHoveredSite(null)}
                            >
                                <div className="relative h-64 w-full">
                                    <img
                                        src={site.image}
                                        alt={`${site.name} tại Việt Nam`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <h3 className="text-4xl font-bold text-white mb-2">{site.name}</h3>
                                            <div className="w-12 h-12 mx-auto rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                                                360°
                                            </div>
                                        </div>
                                    </div>

                                    {hoveredSite === site.name && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white p-4 transform translate-y-0 transition-all duration-300">
                                            <p className="text-sm leading-relaxed">{site.description}</p>
                                        </div>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section >

            {/* Features Section */}
            <section ref={featuresSectionRef} className="py-16">
                <div className="container">
                    <div className={`text-center mb-12 transition-all duration-1000 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            {t("explore360.whyTitle")}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                            {t("explore360.whyDescription")}
                        </p>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-200 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                    <feature.icon className="h-8 w-8 text-primary mx-auto my-auto" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* How It Works Section */}
                    <div className={`bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 mb-16 transition-all duration-1000 delay-400 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <div className={`text-center mb-8 transition-all duration-1000 delay-300 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                {t("explore360.howItWorksTitle")}
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                {t("explore360.howItWorksDescription")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className={`text-center transition-all duration-1000 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold transition-all duration-500 hover:scale-110">1</div>
                                <h4 className="font-bold mb-2">{t("explore360.steps.step1.title")}</h4>
                                <p className="text-sm text-muted-foreground">{t("explore360.steps.step1.description")}</p>
                            </div>

                            <div className={`text-center transition-all duration-1000 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold transition-all duration-500 hover:scale-110">2</div>
                                <h4 className="font-bold mb-2">{t("explore360.steps.step2.title")}</h4>
                                <p className="text-sm text-muted-foreground">{t("explore360.steps.step2.description")}</p>
                            </div>

                            <div className={`text-center transition-all duration-1000 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold transition-all duration-500 hover:scale-110">3</div>
                                <h4 className="font-bold mb-2">{t("explore360.steps.step3.title")}</h4>
                                <p className="text-sm text-muted-foreground">{t("explore360.steps.step3.description")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div >
    );
};

export default Explore360;

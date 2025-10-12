import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Play, Megaphone, Target, PenTool, Star, Instagram, Facebook, Phone } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import '../components/tour/herosection.css';

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
            title: "Khám phá 360° Việt Nam",
            description: "Trải nghiệm thực tế ảo những điểm đến tuyệt vời nhất, từ vịnh biển hùng vĩ đến núi rừng huyền bí."
        },
        {
            id: 1,
            image: banner2,
            title: "Du lịch thực tế ảo",
            description: "Khám phá các địa danh nổi tiếng của Việt Nam qua công nghệ 360° tiên tiến, cảm nhận như đang ở đó."
        },
        {
            id: 2,
            image: banner3,
            title: "Trải nghiệm không giới hạn",
            description: "Từ di sản thế giới UNESCO đến những góc phố cổ kính, khám phá mọi nơi chỉ với một cú click."
        }
    ];

    const sites = [
        {
            name: "Huế",
            image: tour1,
            description: "Cố đô hoàng gia với thành cổ và lăng tẩm của các vị vua",
            link: "https://vietnam.travel/sites/default/files/360Tour/Hue2021/index.htm"
        },
        {
            name: "Hạ Long",
            image: tour2,
            description: "Di sản thế giới UNESCO với hàng nghìn đảo đá vôi",
            link: "https://vietnam.travel/sites/default/files/360Tour/HaLong/index.htm"
        },
        {
            name: "Hội An",
            image: tour3,
            description: "Phố cổ nổi tiếng với đèn lồng và kiến trúc truyền thống",
            link: "https://vietnam.travel/sites/default/files/360Tour/HoiAn/index.htm"
        },
        {
            name: "Hà Nội",
            image: tour4,
            description: "Thủ đô Việt Nam với di sản văn hóa và lịch sử phong phú",
            link: "https://vietnam.travel/sites/default/files/360Tour/HaNoi/index.htm"
        },
        {
            name: "Phong Nha",
            image: tour5,
            description: "Quê hương của những hang động kỳ vĩ và vườn quốc gia",
            link: "https://vietnam.travel/sites/default/files/360Tour/PhongNha/index.htm"
        },
        {
            name: "Mỹ Sơn",
            image: tour6,
            description: "Quần thể đền tháp Hindu cổ từ nền văn minh Champa",
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
            title: "Trải nghiệm trực quan",
            description: "Người dùng có thể quan sát địa điểm như đang ở đó, nhìn xung quanh mọi góc, thay vì chỉ xem hình tĩnh hay video."
        },
        {
            icon: Target,
            title: "Khám phá đa dạng và toàn diện",
            description: "Giúp trải nghiệm cả không gian, cảnh quan, kiến trúc và các điểm đặc sắc của địa điểm, từ đó lên kế hoạch chuyến đi dễ dàng hơn."
        },
        {
            icon: PenTool,
            title: "Tăng sự hài lòng",
            description: "Khách hàng dễ hình dung trải nghiệm thực tế, chọn điểm đến phù hợp và quyết định đặt tour nhanh chóng."
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
                            Đặc biệt
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            KHÁM PHÁ 360°
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Khám phá 360° những kỳ quan thiên nhiên và điểm văn hóa hấp dẫn nhất của đất nước ngay tại đây.
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

                    <div className={`text-center transition-all duration-1000 delay-400 ${isMainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl">
                            Xem thêm
                        </Button>
                    </div>
                </div>
            </section >

            {/* Features Section */}
            <section ref={featuresSectionRef} className="py-16">
                <div className="container">
                    <div className={`text-center mb-12 transition-all duration-1000 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            TẠI SAO LẠI CHỌN KHÁM PHÁ 360°
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                            Công nghệ thực tế ảo 360° mang đến trải nghiệm du lịch hoàn toàn mới, giúp bạn khám phá Việt Nam một cách chân thực và sống động nhất.
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
                                CÁCH THỨC HOẠT ĐỘNG
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Quy trình đơn giản để bắt đầu khám phá thế giới 360° của chúng tôi
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className={`text-center transition-all duration-1000 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold transition-all duration-500 hover:scale-110">1</div>
                                <h4 className="font-bold mb-2">Chọn địa điểm</h4>
                                <p className="text-sm text-muted-foreground">Lựa chọn điểm đến bạn muốn khám phá từ danh sách đa dạng</p>
                            </div>

                            <div className={`text-center transition-all duration-1000 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold transition-all duration-500 hover:scale-110">2</div>
                                <h4 className="font-bold mb-2">Khám phá 360°</h4>
                                <p className="text-sm text-muted-foreground">Trải nghiệm thực tế ảo với khả năng xoay và phóng to mọi góc độ</p>
                            </div>

                            <div className={`text-center transition-all duration-1000 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold transition-all duration-500 hover:scale-110">3</div>
                                <h4 className="font-bold mb-2">Đặt tour thực</h4>
                                <p className="text-sm text-muted-foreground">Quyết định đặt tour thực tế sau khi đã khám phá qua 360°</p>
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

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Play, Megaphone, Target, PenTool, Star } from "lucide-react";
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
                <div className="absolute bottom-10 left-10 flex gap-4 hidden lg:flex">
                    <div className="flex space-x-4">
                        <a
                            href="https://www.instagram.com/tuhy.sapoche.99"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 backdrop-blur-sm rounded-full p-3 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                        >
                            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                            </svg>
                        </a>

                        <a
                            href="https://www.facebook.com/phuong.vonhat.tuhy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 backdrop-blur-sm rounded-full p-3 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                        >
                            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                        </a>

                        <a
                            href="tel:+84365486141"
                            className="bg-white/10 backdrop-blur-sm rounded-full p-3 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                        >
                            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                            </svg>
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

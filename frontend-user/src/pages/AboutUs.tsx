import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Users, Target, Award, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import landscapeSeaImg from "@/assets/landscape-sea.jpg";
import fansipanImg from "@/assets/fansipan.jpg";
import fieldImg from "@/assets/village.jpg";
import festivalImg from "@/assets/saigon.jpg";
import nhatphuong from "@/assets/members/nhatphuong.jpg";
import thuyduong from "@/assets/members/thuyduong.jpg";
import quochuy from "@/assets/members/quochuy.jpg";
import giaminh from "@/assets/members/giaminh.jpg";
import trungnguyen from "@/assets/members/trungnguyen.jpg";
import thanhphong from "@/assets/members/thanhphong.jpg";
import thienphuc from "@/assets/members/thienphuc.jpg";
import huonguyen from "@/assets/members/huonguyen.jpg";

const AboutUs = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { number: "10,000+", label: "Khách hàng hài lòng", icon: Heart },
    { number: "500+", label: "Tour đã tổ chức", icon: MapPin },
    { number: "50+", label: "Điểm đến", icon: Target },
    { number: "5+", label: "Năm kinh nghiệm", icon: Award },
  ];

  const teamMembers = [
    {
      name: "Võ Nhất Phương",
      position: "Team Leader",
      image: nhatphuong,
      description: "22521172"
    },
    {
      name: "Lê Nguyễn Thuỳ Dương",
      position: "Member",
      image: thuyduong,
      description: "22520298"
    },
    {
      name: "Lâm Quốc Huy",
      position: "Member",
      image: quochuy,
      description: "22520545"
    },
    {
      name: "Hoàng Gia Minh",
      position: "Member",
      image: giaminh,
      description: "22520861"
    },
    {
      name: "Phạm Trung Nguyên",
      position: "Member",
      image: trungnguyen,
      description: "22520983"
    },
    {
      name: "Bùi Thanh Phong",
      position: "Member",
      image: thanhphong,
      description: "22521082"
    },
    {
      name: "Lê Thiên Phúc",
      position: "Member",
      image: thienphuc,
      description: "22521121"
    },
    {
      name: "Nguyễn Đăng Hương Uyên",
      position: "Member",
      image: huonguyen,
      description: "22521641"
    },
  ];

  const membersPerSlide = 4;
  const totalSlides = Math.ceil(teamMembers.length / membersPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentMembers = () => {
    const start = currentSlide * membersPerSlide;
    const end = start + membersPerSlide;
    return teamMembers.slice(start, end);
  };

  const values = [
    {
      icon: Heart,
      title: "Tận tâm",
      description: "Chúng tôi luôn đặt khách hàng lên hàng đầu và phục vụ với trái tim chân thành."
    },
    {
      icon: Star,
      title: "Chất lượng",
      description: "Cam kết mang đến những trải nghiệm du lịch chất lượng cao nhất."
    },
    {
      icon: Users,
      title: "Đồng hành",
      description: "Luôn bên cạnh khách hàng trong mọi hành trình khám phá."
    },
    {
      icon: Target,
      title: "Sáng tạo",
      description: "Không ngừng đổi mới để tạo ra những tour du lịch độc đáo."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img 
          src={landscapeSeaImg} 
          alt="Landscape Sea Background" 
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/"></div>
        
        <div className={`container text-right relative z-10 transition-all duration-1000 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Về <span className="text-gradient">VENTURE</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl ml-auto">
            Chúng tôi là đối tác tin cậy trong mọi hành trình khám phá của bạn, 
            mang đến những trải nghiệm du lịch đáng nhớ và ý nghĩa.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className={`transition-all duration-1000 delay-200 ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-primary">
                  SỨ MỆNH CỦA CHÚNG TÔI
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  VENTURE được thành lập với mục tiêu mang đến những trải nghiệm du lịch 
                  chất lượng cao, giúp mọi người khám phá vẻ đẹp của Việt Nam và thế giới. 
                  Chúng tôi tin rằng du lịch không chỉ là việc di chuyển từ nơi này đến nơi khác, 
                  mà còn là hành trình khám phá bản thân và kết nối với những con người, 
                  văn hóa mới lạ.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Với đội ngũ chuyên nghiệp và giàu kinh nghiệm, chúng tôi cam kết tạo ra 
                  những hành trình độc đáo, an toàn và đầy cảm hứng cho mọi khách hàng.
                </p>
              </div>
              <div className="relative flex justify-center">
                <div className="relative w-[75%] transition-all duration-500 hover:scale-150 hover:rotate-3">
                  <img 
                    src={fansipanImg} 
                    className="shadow-xl w-full h-[280px] object-cover transition-all duration-500 hover:shadow-2xl"
                    style={{ clipPath: 'polygon(50% 0%, 85% 35%, 70% 100%, 30% 100%, 15% 35%)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className={`transition-all duration-1000 delay-200 ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative flex justify-center">
                <div className="relative w-[75%] transition-all duration-500 hover:scale-150 hover:-rotate-3">
                  <img 
                    src={fieldImg} 
                    className="shadow-xl w-full h-[280px] object-cover transition-all duration-500 hover:shadow-2xl"
                    style={{ clipPath: 'polygon(50% 0%, 85% 35%, 70% 100%, 30% 100%, 15% 35%)' }}
                  />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-primary">
                  NĂNG LỰC CỐT LÕI
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  VENTURE được thành lập với mục tiêu mang đến những trải nghiệm du lịch 
                  chất lượng cao, giúp mọi người khám phá vẻ đẹp của Việt Nam và thế giới. 
                  Chúng tôi tin rằng du lịch không chỉ là việc di chuyển từ nơi này đến nơi khác, 
                  mà còn là hành trình khám phá bản thân và kết nối với những con người, 
                  văn hóa mới lạ.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Với đội ngũ chuyên nghiệp và giàu kinh nghiệm, chúng tôi cam kết tạo ra 
                  những hành trình độc đáo, an toàn và đầy cảm hứng cho mọi khách hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className={`transition-all duration-1000 delay-200 ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-primary">
                  CÁCH THỨC HOẠT ĐỘNG
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  VENTURE được thành lập với mục tiêu mang đến những trải nghiệm du lịch 
                  chất lượng cao, giúp mọi người khám phá vẻ đẹp của Việt Nam và thế giới. 
                  Chúng tôi tin rằng du lịch không chỉ là việc di chuyển từ nơi này đến nơi khác, 
                  mà còn là hành trình khám phá bản thân và kết nối với những con người, 
                  văn hóa mới lạ.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Với đội ngũ chuyên nghiệp và giàu kinh nghiệm, chúng tôi cam kết tạo ra 
                  những hành trình độc đáo, an toàn và đầy cảm hứng cho mọi khách hàng.
                </p>
              </div>
              <div className="relative flex justify-center">
                <div className="relative w-[75%] transition-all duration-500 hover:scale-150 hover:rotate-2">
                  <img 
                    src={festivalImg} 
                    className="shadow-xl w-full h-[280px] object-cover transition-all duration-500 hover:shadow-2xl"
                    style={{ clipPath: 'polygon(50% 0%, 85% 35%, 70% 100%, 30% 100%, 15% 35%)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Values Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className={`transition-all duration-1000 delay-400 ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Giá trị</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Những giá trị định hướng mọi hoạt động của VENTURE
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center p-6 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 bg-primary/5">
        <div className="container">
          <div className={`transition-all duration-1000 delay-500 ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            </div>
            
            {/* Carousel Container */}
            <div className="relative">
              {/* Team Members Grid */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                        {teamMembers
                          .slice(slideIndex * membersPerSlide, (slideIndex + 1) * membersPerSlide)
                          .map((member, index) => (
                            <div key={index} className="text-center p-4 transition-all duration-300 transform hover:scale-110">
                              <img 
                                src={member.image} 
                                alt={member.name}
                                className="w-28 h-28 rounded-full mx-auto mb-3 object-cover transition-all duration-300"
                              />
                              <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                              <p className="text-primary font-medium mb-1 text-sm">{member.position}</p>
                              <p className="text-muted-foreground text-sm">{member.description}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                disabled={totalSlides <= 1}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                disabled={totalSlides <= 1}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-primary scale-125' 
                        : 'bg-primary/30 hover:bg-primary/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className={`text-center transition-all duration-1000 delay-600 ${
            isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng khám phá cùng <span className="text-gradient">VENTURE</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Hãy để chúng tôi đồng hành cùng bạn trong những hành trình khám phá tuyệt vời nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/" 
                className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors text-center"
              >
                Khám phá Tour
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-3 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors text-center"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className={`transition-all duration-1000 delay-700 ${
        isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
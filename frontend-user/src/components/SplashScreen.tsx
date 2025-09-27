import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const SplashScreen = () => {
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => {
            setShowContent(true);
        }, 500);

        const navigateTimer = setTimeout(() => {
            navigate("/tour");
        }, 3000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(navigateTimer);
        };
    }, [navigate]);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#F9FDFF] to-white flex flex-col items-center justify-center z-50">
            <div className="-translate-y-8">

                {/* Logo Section */}
                <div
                    className={`transition-all duration-1000 transform ${showContent
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                        }`}
                >
                    {/* Logo Container */}
                    <div className="relative flex items-center justify-center mb-8">
                        {/* Plane Icon */}
                        <div
                            className="absolute animate-pulse"
                            style={{ top: "-36px", right: "-28px" }}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="text-[#26B8ED] animate-bounce"
                                style={{ animationDelay: '0.5s' }}
                            >
                                <path
                                    d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
                                    fill="currentColor"
                                />
                                {/* Trail effect */}
                                <path
                                    d="M21 16L18 14.5"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    opacity="0.3"
                                    className="animate-pulse"
                                />
                            </svg>
                        </div>

                        {/* Logo Image */}
                        <img src={logo} alt="Venture" className="h-16 w-50" />
                    </div>
                </div>

                {/* Slogan Section */}
                <div
                    className={`transition-all duration-1000 delay-300 transform ${showContent
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                        }`}
                >
                    <p className="text-xl md:text-2xl font-inter font-bold text-[#26B8ED]/80 tracking-wider text-center uppercase leading-relaxed">
                        ĐỒNG HÀNH CÙNG BẠN ĐẾN MỌI MIỀN TỔ QUỐC VIỆT NAM
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;

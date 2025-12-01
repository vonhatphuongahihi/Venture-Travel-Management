import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Plane } from "lucide-react";
import { useTranslation } from "react-i18next";

const SplashScreen = () => {
    const { t } = useTranslation();
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
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <img src={logo} alt="Venture" className="h-14 w-30" />
                            </div>
                            <div className="relative ml-2 -mt-2">
                                <Plane className="h-8 w-8 text-primary" />
                            </div>
                        </div>
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
                        {t('splash.slogan')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;

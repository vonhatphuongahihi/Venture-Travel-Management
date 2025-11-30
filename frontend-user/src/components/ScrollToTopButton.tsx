import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hiện nút khi scroll quá 300px
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className={`
        fixed z-[9999] 
        bottom-4 right-4 md:bottom-8 md:right-8 
        bg-primary/60 text-white 
        rounded-full shadow-lg shadow-primary/30
        p-3 md:p-4 
        transition-all duration-300 ease-in-out
        hover:bg-primary/90 hover:scale-110 hover:-translate-y-1
        ${visible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10 pointer-events-none"
        }
      `}
      aria-label="Quay về đầu trang"
    >
      <ChevronUp className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTopButton;
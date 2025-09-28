import { Button } from "@/components/ui/button";
import { Menu, Search, User } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Venture" className="h-7 w-30" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-16">
          <a href="#tours" className="text-sm font-medium hover:text-primary transition-colors">
            TOUR
          </a>
          <a href="#destinations" className="text-sm font-medium hover:text-primary transition-colors">
            ĐIỂM ĐẾN
          </a>
          <a href="#map" className="text-sm font-medium hover:text-primary transition-colors">
            BẢN ĐỒ
          </a>
          <a href="#explore-60" className="text-sm font-medium hover:text-primary transition-colors">
            KHÁM PHÁ 360°
          </a>
          <a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </a>
          <a href="/book-tour" className="text-sm font-medium hover:text-primary transition-colors">
            Book Tour
          </a>
        </nav>

        {/* Login */}
        <div className="flex items-center space-x-4">
          <Button variant="tour" size="sm" className="hidden sm:flex">
            <User className="h-4 w-4" />
            Đăng nhập
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="container py-4 space-y-3">
            <a href="#tours" className="block text-sm font-medium hover:text-primary transition-colors">
              Tours
            </a>
            <a href="/contact" className="block text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
            <a href="/book-tour" className="block text-sm font-medium hover:text-primary transition-colors">
              Book Tour
            </a>
            <a href="#destinations" className="block text-sm font-medium hover:text-primary transition-colors">
              Điểm đến
            </a>
            <a href="#map" className="block text-sm font-medium hover:text-primary transition-colors">
              Bản đồ
            </a>
            <a href="#events" className="block text-sm font-medium hover:text-primary transition-colors">
              Sự kiện
            </a>
            <a href="#blog" className="block text-sm font-medium hover:text-primary transition-colors">
              Blog
            </a>
            <div className="pt-3 border-t border-border">
              <Button variant="tour" size="sm" className="w-full">
                <User className="h-4 w-4" />
                Đăng nhập
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
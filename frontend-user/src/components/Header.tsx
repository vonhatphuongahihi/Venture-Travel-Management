import { Button } from "@/components/ui/button";
import { Menu, Plane, Search, User } from "lucide-react";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";
import ProvinceDropdown from "./province/ProvinceDropdown";
import MobileProvinceDropdown from "./province/MobileProvinceDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Link to="/tour">
              <img src={logo} alt="Venture" className="h-7 w-30" />
            </Link>
          </div>
          <div className="relative ml-1">
            <Plane className="h-4 w-4 text-primary" />
          </div>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-16">
          <Link
            to="/tour"
            className={`text-sm font-medium transition-colors ${location.pathname === "/tour"
              ? "text-primary font-semibold"
              : "hover:text-primary"
              }`}
          >
            TOUR
          </Link>
          <ProvinceDropdown />
          <Link
            to="/map"
            className={`text-sm font-medium transition-colors ${location.pathname === "/map"
              ? "text-primary font-semibold"
              : "hover:text-primary"
              }`}>
            BẢN ĐỒ
          </Link>
          <Link
            to="/explore-360"
            className={`text-sm font-medium transition-colors ${location.pathname === "/explore-360"
              ? "text-primary font-semibold"
              : "hover:text-primary"
              }`}
          >
            KHÁM PHÁ 360°
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            LIÊN HỆ
          </Link>
        </nav>

        {/* Login */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <Link to="/login">
              <Button variant="tour" size="sm" className="hidden sm:flex">
                <User className="h-4 w-4" />
                Đăng nhập
              </Button>
            </Link>
          ) : (
            <Link to="/profile" className="hidden sm:inline-flex">
              <button
                className="h-8 w-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-sm overflow-hidden hover:border-primary/40 transition-all"
                aria-label="Hồ sơ"
              >
                {user?.profile_photo ? (
                  <img
                    src={user.profile_photo}
                    alt={user.name || 'Profile'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
              </button>
            </Link>
          )}
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
          <nav className="container py-4 space-y-5">
            <Link
              to="/tour"
              className={`block text-sm font-medium transition-colors ${location.pathname === "/tour"
                ? "text-primary font-semibold"
                : "hover:text-primary"
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              TOUR
            </Link>

            <MobileProvinceDropdown onItemClick={() => setIsMenuOpen(false)} />

            <Link
              to="/map"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              BẢN ĐỒ
            </Link>
            <Link
              to="/explore-360"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              KHÁM PHÁ 360°
            </Link>
            <Link
              to="/contact"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              LIÊN HỆ
            </Link>
            <div className="pt-3 border-t border-border">
              <Link to="/login">
                <Button variant="tour" size="sm" className="w-full">
                  <User className="h-4 w-4" />
                  Đăng nhập
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

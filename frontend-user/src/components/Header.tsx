import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Plane, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MobileProvinceDropdown from "./province/MobileProvinceDropdown";
import ProvinceDropdown from "./province/ProvinceDropdown";
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t } = useTranslation();
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
                        {t("header.tour")}
                    </Link>
                    <ProvinceDropdown />
                    <Link
                        to="/map"
                        className={`text-sm font-medium transition-colors ${location.pathname === "/map"
                            ? "text-primary font-semibold"
                            : "hover:text-primary"
                            }`}
                    >
                        {t("header.map")}
                    </Link>
                    <Link
                        to="/explore-360"
                        className={`text-sm font-medium transition-colors ${location.pathname === "/explore-360"
                            ? "text-primary font-semibold"
                            : "hover:text-primary"
                            }`}
                    >
                        {t("header.explore360")}
                    </Link>
                    <Link
                        to="/contact"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {t("header.contact")}
                    </Link>
                </nav>

                {/* Login / Profile Button (Desktop) */}
                <div className="flex items-center space-x-4">
                    {!isAuthenticated ? (
                        <Link to="/login">
                            <Button variant="tour" size="sm" className="hidden sm:flex">
                                <User className="h-4 w-4" />
                                {t("header.login")}
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/profile" className="hidden sm:inline-flex">
                            <button
                                className="h-8 w-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-sm overflow-hidden hover:border-primary/40 transition-all"
                                aria-label={t("header.profile")}
                            >
                                {user?.profilePhoto ? (
                                    <img
                                        src={user.profilePhoto}
                                        alt={user.name || "Profile"}
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
                            {t("header.tour")}
                        </Link>

                        <MobileProvinceDropdown onItemClick={() => setIsMenuOpen(false)} />

                        <Link
                            to="/map"
                            className="block text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t("header.map")}
                        </Link>
                        <Link
                            to="/explore-360"
                            className="block text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t("header.explore360")}
                        </Link>
                        <Link
                            to="/contact"
                            className="block text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t("header.contact")}
                        </Link>

                        {/* --- PHẦN ĐÃ CHỈNH SỬA --- */}
                        <div className="pt-3 border-t border-border">
                            {!isAuthenticated ? (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="tour" size="sm" className="w-full">
                                        <User className="h-4 w-4" />
                                        {t("header.login")}
                                    </Button>
                                </Link>
                            ) : (
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                                        {user?.profilePhoto ? (
                                            <img
                                                src={user.profilePhoto}
                                                alt={user.name || "Profile"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">
                                        {user?.name || t("header.myAccount")}
                                    </span>
                                </Link>
                            )}
                        </div>
                        {/* -------------------------- */}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
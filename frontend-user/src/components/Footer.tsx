import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#E5F8FF] text-primary">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="relative">
                  <img src='/src/assets/logo.png' alt="logo" className="h-11 w-30 mb-2" />
                </div>
                <div className="relative ml-2">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
            <p className="text-sm text-primary text-justify">
              {t("footer.companyDescription")}
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/phuong.vonhat.tuhy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors"
              >
                <Facebook className="h-4 w-4 text-primary" />
              </a>
              <a
                href="https://www.instagram.com/tuhy.sapoche.99"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors"
              >
                <Instagram className="h-4 w-4 text-primary" />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors"
              >
                <Youtube className="h-4 w-4 text-primary" />
              </a>
            </div>
          </div>

          <div className="space-y-4 ml-4">
            <h3 className="font-semibold text-lg text-primary">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/tour"
                  onClick={scrollToTop}
                  className="text-primary hover:text-[#0891B2] transition-colors"
                >
                  {t("footer.tours")}
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  onClick={scrollToTop}
                  className="text-primary hover:text-[#0891B2] transition-colors"
                >
                  {t("footer.map")}
                </Link>
              </li>
              <li>
                <Link
                  to="/explore-360"
                  onClick={scrollToTop}
                  className="text-primary hover:text-[#0891B2] transition-colors"
                >
                  {t("footer.explore360")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={scrollToTop}
                  className="text-primary hover:text-[#0891B2] transition-colors"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 ml-6">
            <h3 className="font-semibold text-lg text-primary">{t("footer.services")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/tour"
                  onClick={scrollToTop}
                  className="text-primary hover:text-[#0891B2] transition-colors"
                >
                  {t("footer.packageTour")}
                </Link>
              </li>

            </ul>
          </div>

          <div className="space-y-4 ml-8">
            <h3 className="font-semibold text-lg text-primary">{t("footer.contactTitle")}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary/60" />
                <span className="text-primary">{t("footer.address")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary/60" />
                <span className="text-primary">0365 486 141</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary/60" />
                <span className="text-primary">contact@venture.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary/80 text-sm">
            {t("footer.copyright")}
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              to="/terms"
              onClick={scrollToTop}
              className="text-primary/70 hover:text-[#0891B2] transition-colors"
            >
              {t("footer.terms")}
            </Link>
            <Link
              to="/policy"
              onClick={scrollToTop}
              className="text-primary/70 hover:text-[#0891B2] transition-colors"
            >
              {t("footer.policy")}
            </Link>
            <Link
              to="/contact"
              onClick={scrollToTop}
              className="text-primary/70 hover:text-[#0891B2] transition-colors"
            >
              {t("footer.support")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
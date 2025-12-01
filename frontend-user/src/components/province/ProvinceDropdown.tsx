import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useProvinces } from "@/contexts/ProvinceContext";
import type { Province } from "@/global.types";
import { useTranslation } from "react-i18next";

interface ProvinceDropdownProps {
  className?: string;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const ProvinceDropdown = ({
  className = "",
  isMobile = false,
  onItemClick,
}: ProvinceDropdownProps) => {
  const { t } = useTranslation();
  const { provinces, loading } = useProvinces();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateDropdownPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: isMobile ? 0 : rect.left + rect.width / 2 - 300, // 300 = half of 600px width
      });
    }
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      // Cleanup timeout on unmount
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isOpen, updateDropdownPosition]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      // Clear any existing close timeout
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      updateDropdownPosition();
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      // Add delay before closing to allow moving to dropdown
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150); // 150ms delay
    }
  };

  const handleDropdownMouseEnter = () => {
    if (!isMobile) {
      // Clear close timeout when entering dropdown
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    }
  };

  const handleDropdownMouseLeave = () => {
    if (!isMobile) {
      // Close immediately when leaving dropdown
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      updateDropdownPosition();
      setIsOpen(!isOpen);
    }
  };

  const handleProvinceClick = () => {
    setIsOpen(false);
    onItemClick?.();
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={handleClick}
        className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${isMobile ? "w-full justify-between" : ""
          }`}
      >
        <span>{t("provinceDropdown.destinations")}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Dropdown Content - Rendered using Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-h-[400px] overflow-y-auto"
            style={{
              top: `${dropdownPosition.top}px`,
              left: isMobile ? "0px" : `${dropdownPosition.left}px`,
              width: isMobile ? "100vw" : "600px",
              marginTop: "8px",
            }}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div
              className={`grid ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-4 gap-4"
                }`}
            >
              {loading ? (
                <div className="col-span-full text-center py-4 text-gray-500">
                  {t("provinceDropdown.loading")}
                </div>
              ) : (
                provinces.map((province: Province) => (
                  <Link
                    key={province.id}
                    to={`/province/${province.slug}`}
                    onClick={handleProvinceClick}
                    className="group flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-primary transition-all duration-200 group-hover:scale-105">
                      <img
                        src={province.image}
                        alt={province.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback image if province image doesn't exist
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-center text-gray-700 group-hover:text-primary transition-colors leading-tight">
                      {province.name}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ProvinceDropdown;

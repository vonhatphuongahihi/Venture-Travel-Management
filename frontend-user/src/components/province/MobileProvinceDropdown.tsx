import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { provinces, type Province } from "@/data/provinces";

interface MobileProvinceDropdownProps {
  onItemClick?: () => void;
}

const MobileProvinceDropdown = ({
  onItemClick,
}: MobileProvinceDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleProvinceClick = () => {
    setIsOpen(false);
    onItemClick?.();
  };

  return (
    <div className="w-full">
      {/* Trigger Button */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between text-sm font-medium transition-colors hover:text-primary"
      >
        <span>ĐIỂM ĐẾN</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="mt-3 pl-4 space-y-2 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {provinces.map((province: Province) => (
              <Link
                key={province.id}
                to={`/province/${province.slug}`}
                onClick={handleProvinceClick}
                className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-gray-200">
                  <img
                    src={province.image}
                    alt={province.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <span className="text-xs text-gray-700 leading-tight truncate">
                  {province.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileProvinceDropdown;

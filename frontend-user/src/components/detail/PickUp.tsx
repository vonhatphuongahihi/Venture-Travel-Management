import { useState } from "react";
import { ChevronDown, List, MapPin } from "lucide-react";

export default function PickUp({ pickUpPoint, pickUpDetails, endPoint }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-6">
      {/* Header có tiêu đề + icon */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold">Điểm đón</h2>
        <ChevronDown
          className={`w-6 h-6 transform transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Danh sách có hiệu ứng trượt */}
      <div
        className={`space-y-2 overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-full opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <p className="font-bold">Khởi hành: </p>
        <div className="flex space-x-2">
          <MapPin className="w-6 h-6 text-primary" />
          <div className="flex-col space-y-1">
            <p className="font-semibold">Vị trí</p>
            <p className="text-gray-500 max-w-3xl">{pickUpPoint}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <List className="w-6 h-6 text-primary" />
          <div className="flex-col space-y-1">
            <p className="font-semibold">Chi tiết đón</p>
            <p className="text-gray-500 max-w-3xl">{pickUpDetails}</p>
          </div>
        </div>
        <p className="font-bold">Kết thúc: </p>
        <div className="flex space-x-2">
          <MapPin className="w-6 h-6 text-primary" />
          <div className="flex-col space-y-1">
            <p className="font-semibold">Vị trí</p>
            <p className="text-gray-500 max-w-3xl">{endPoint}</p>
          </div>
        </div>
      </div>
      <div className="w-full border-t border-primary my-5"></div>
    </div>
  );
}

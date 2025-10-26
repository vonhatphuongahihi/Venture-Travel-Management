import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Expectations({ expectations }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!expectations || expectations.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Header có tiêu đề + icon */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold">Dự kiến</h2>
        <ChevronDown
          className={`w-6 h-6 transform transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Danh sách có hiệu ứng trượt */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-full opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <ul>
          {expectations.map((item, index) => (
            <li key={index} className="mb-2 list-disc list-inside">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full border-t border-primary my-5"></div>
    </div>
  );
}

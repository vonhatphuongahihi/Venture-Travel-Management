import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CalendarDays, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  ageRange?: string;
  minGroupSize?: number;
  maxGroupSize?: number;
  languages?: string[];
  startDate?: Date;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
  initialFilters?: FilterOptions;
}

const DURATION_OPTIONS = [
  { value: "1 ngày", label: "1 ngày" },
  { value: "2-3 ngày", label: "2-3 ngày" },
  { value: "4-7 ngày", label: "4-7 ngày" },
  { value: "8+ ngày", label: "8+ ngày" },
];

const AGE_RANGE_OPTIONS = [
  { value: "0-5", label: "Trẻ em (0-5 tuổi)" },
  { value: "6-12", label: "Thiếu nhi (6-12 tuổi)" },
  { value: "13-17", label: "Thiếu niên (13-17 tuổi)" },
  { value: "18+", label: "Người lớn (18+ tuổi)" },
  { value: "0-50", label: "Mọi lứa tuổi" },
];

const LANGUAGE_OPTIONS = [
  "Tiếng Việt",
  "English",
  "中文",
  "日本語",
  "한국어",
  "Français",
  "Español",
];

export default function FilterDialog({
  open,
  onOpenChange,
  onApply,
  onReset,
  initialFilters = {},
}: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([
    initialFilters.minPrice || 0,
    initialFilters.maxPrice || 10000000,
  ]);

  const handleApply = () => {
    const appliedFilters: FilterOptions = {
      ...filters,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 10000000 ? priceRange[1] : undefined,
    };
    onApply(appliedFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({});
    setPriceRange([0, 10000000]);
    onReset();
    onOpenChange(false);
  };

  const toggleLanguage = (language: string) => {
    setFilters((prev) => {
      const languages = prev.languages || [];
      if (languages.includes(language)) {
        return { ...prev, languages: languages.filter((l) => l !== language) };
      } else {
        return { ...prev, languages: [...languages, language] };
      }
    });
  };

  const activeFilterCount =
    (filters.duration ? 1 : 0) +
    (filters.ageRange ? 1 : 0) +
    (filters.minGroupSize || filters.maxGroupSize ? 1 : 0) +
    (filters.languages && filters.languages.length > 0 ? 1 : 0) +
    (filters.startDate ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000000 ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#26B8ED]">
            Lọc tour
            {activeFilterCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({activeFilterCount} bộ lọc đang áp dụng)
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Chọn các tiêu chí để tìm tour phù hợp với bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Khoảng giá (VNĐ)</Label>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={10000000}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {priceRange[0].toLocaleString("vi-VN")} VNĐ
                </span>
                <span>
                  {priceRange[1].toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice" className="text-sm">
                    Giá tối thiểu
                  </Label>
                  <Input
                    id="minPrice"
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    min={0}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice" className="text-sm">
                    Giá tối đa
                  </Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    min={priceRange[0]}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Thời gian tour</Label>
            <div className="grid grid-cols-2 gap-2">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      duration:
                        prev.duration === option.value
                          ? undefined
                          : option.value,
                    }))
                  }
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm transition-all",
                    filters.duration === option.value
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Độ tuổi phù hợp</Label>
            <div className="grid grid-cols-2 gap-2">
              {AGE_RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      ageRange:
                        prev.ageRange === option.value ? undefined : option.value,
                    }))
                  }
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm transition-all text-left",
                    filters.ageRange === option.value
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group Size */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Số người</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minGroupSize" className="text-sm">
                  Số người tối thiểu
                </Label>
                <Input
                  id="minGroupSize"
                  type="number"
                  value={filters.minGroupSize || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minGroupSize: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  min={1}
                  placeholder="Tối thiểu"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxGroupSize" className="text-sm">
                  Số người tối đa
                </Label>
                <Input
                  id="maxGroupSize"
                  type="number"
                  value={filters.maxGroupSize || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxGroupSize: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  min={filters.minGroupSize || 1}
                  placeholder="Tối đa"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Ngôn ngữ</Label>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGE_OPTIONS.map((language) => (
                <button
                  key={language}
                  onClick={() => toggleLanguage(language)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm transition-all text-left flex items-center justify-between",
                    filters.languages?.includes(language)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  )}
                >
                  <span>{language}</span>
                  {filters.languages?.includes(language) && (
                    <X className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Ngày khởi hành</Label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {filters.startDate
                  ? filters.startDate.toLocaleDateString("vi-VN")
                  : "Chọn ngày khởi hành"}
              </Button>
              {filters.startDate && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, startDate: undefined }))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {showDatePicker && (
                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg">
                  <DayPicker
                    mode="single"
                    selected={filters.startDate}
                    onSelect={(date) => {
                      setFilters((prev) => ({ ...prev, startDate: date }));
                      setShowDatePicker(false);
                    }}
                    locale={vi}
                    disabled={{ before: new Date() }}
                    classNames={{
                      day_selected:
                        "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day: "h-9 w-9 p-0 text-[#202224]/50 rounded font-['Inter'] hover:text-primary-foreground",
                      day_today: "font-bold",
                      nav_button_previous:
                        "w-6 h-6 bg-primary rounded text-white hover:bg-[#0891B2] hover:text-primary-foreground",
                      nav_button_next:
                        "w-6 h-6 bg-primary rounded text-white hover:bg-[#0891B2]",
                      nav: "space-x-2",
                      month: "font-['Inter'] font-bold",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Đặt lại
          </Button>
          <Button onClick={handleApply} className="bg-primary hover:bg-primary/90">
            Áp dụng ({activeFilterCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


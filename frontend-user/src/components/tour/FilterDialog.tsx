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
import { useTranslation } from "react-i18next";

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  maxGroupSize?: number;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
  initialFilters?: FilterOptions;
}

export default function FilterDialog({
  open,
  onOpenChange,
  onApply,
  onReset,
  initialFilters = {},
}: FilterDialogProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
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

  const activeFilterCount =
    (filters.maxGroupSize ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000000 ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#26B8ED]">
            {t("filterDialog.title")}
            {activeFilterCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({activeFilterCount} {t("filterDialog.filtersApplied")})
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {t("filterDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Range */}
          <div className="space-y-3 rounded-2xl border border-dashed border-primary/30 bg-white/80 p-5 shadow-sm">
            <Label className="text-base font-semibold flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              {t("filterDialog.priceRange")}
            </Label>
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
                    {t("filterDialog.minPrice")}
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
                    {t("filterDialog.maxPrice")}
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

          {/* Group Size */}
          <div className="space-y-3 rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm">
            <Label className="text-base font-semibold">{t("filterDialog.groupSize")}</Label>
            <div>
              <Label htmlFor="maxGroupSize" className="text-sm">
                {t("filterDialog.maxGroupSize")}
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
                min={1}
                placeholder={t("filterDialog.maximum")}
                className="mt-1"
              />
            </div>
          </div>

        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            {t("filterDialog.reset")}
          </Button>
          <Button onClick={handleApply} className="bg-primary hover:bg-primary/90">
            {t("filterDialog.apply")} ({activeFilterCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
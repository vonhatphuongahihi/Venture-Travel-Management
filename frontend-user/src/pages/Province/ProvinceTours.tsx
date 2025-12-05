import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useProvinceToursInfinite } from "@/services/province/provinceHook";

// Import assets
import ProvinceToursSection from "@/components/province/ProvinceToursSection";
import { Province, Tour } from "@/global.types";

interface ProvincePageContext {
  province: Province;
}

const ProvinceTours = () => {
  const { province } = useOutletContext<ProvincePageContext>();
  const [sortBy, setSortBy] = useState<string>("price-asc");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useProvinceToursInfinite(province?.id?.toString() || "", 6, sortBy);

  const tours = data?.pages.flatMap((page: any) => page.data) || [];
  const totalTours = data?.pages[0]?.pagination?.total || 0;

  const textRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      // so sánh chiều cao thực tế với chiều cao hiển thị tối đa
      const isOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsClamped(isOverflowing);
    }
  }, []);

  if (!province) return null;

  return (
    <div className="container mx-auto max-w-7xl space-y-8 mb-8">
      {/* Tours Section */}
      <ProvinceToursSection
        tours={tours}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onLoadMore={() => fetchNextPage()}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        totalTours={totalTours}
      />
    </div>
  );
};

export default ProvinceTours;

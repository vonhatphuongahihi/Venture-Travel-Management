import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useProvince, useProvinceTours } from "@/hooks/useProvince";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

// Import assets
import heroImage from "@/assets/hero-vietnam.jpg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

enum ProvincePageTab {
  EXPLORE = "explore",
  TOURS = "tours",
}

const ProvincePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  const { data: province, isLoading } = useProvince(slug.toUpperCase() || "");

  const textRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);
  const [currPage, setCurrPage] = useState<ProvincePageTab>(
    ProvincePageTab.EXPLORE
  );

  useEffect(() => {
    if (textRef.current) {
      // so sánh chiều cao thực tế với chiều cao hiển thị tối đa
      const isOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsClamped(isOverflowing);
    }
  }, [province]);

  useEffect(() => {
    const parts = location.pathname.split("/");

    if (parts.at(-1) === "tours-activities") {
      setCurrPage(ProvincePageTab.TOURS);
    } else {
      setCurrPage(ProvincePageTab.EXPLORE);
    }
  }, [location]);

  // If loading, show loading state (optional)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If province not found, show default or redirect
  if (!province) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Tỉnh thành không tồn tại</h1>
          <p className="text-gray-600 mb-8">
            Không tìm thấy thông tin về tỉnh thành này.
          </p>
          <Button onClick={() => window.history.back()}>Quay lại</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative h-64 md:h-72">
        <img
          src={province.image || heroImage}
          alt={province.name}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 text-white p-6 md:p-8">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              {province.name}
            </h1>
            <div className="w-full text-sm">
              <p ref={textRef} className="leading-relaxed line-clamp-2">
                {province.description}
              </p>
            </div>
            {isClamped && (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="text-sm underline">Xem thêm</button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <h2 className="text-lg font-semibold mb-4">
                      {province.name}
                    </h2>
                  </SheetHeader>
                  <p className="text-gray-700 leading-relaxed">
                    {province.description}
                  </p>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Tab */}
      <section>
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="container mx-auto max-w-7xl space-x-5">
            <div
              className={cn(
                "inline-block",
                currPage === ProvincePageTab.EXPLORE &&
                  "border-b-primary border-b-2 font-semibold text-primary"
              )}
            >
              <Link to={`/province/${province.slug}`}>
                <h2 className="text-base py-3 px-1">
                  Khám phá {province.name}
                </h2>
              </Link>
            </div>

            <div
              className={cn(
                "inline-block",
                currPage === ProvincePageTab.TOURS &&
                  "border-b-primary border-b-2 font-semibold text-primary"
              )}
            >
              <Link to={`/province/${province.slug}/tours-activities`}>
                <h2 className="text-base py-3 px-1">Những Tour hấp dẫn</h2>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <Outlet context={{ province }} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProvincePage;

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AttractionHeroSection from "@/components/attraction/AttractionHeroSection.tsx";
import AttractionReviewsSection from "@/components/attraction/AttractionReviewsSection.tsx";
import AttractionToursSection from "@/components/attraction/AttractionToursSection.tsx";
import NearbyDestinationsSection from "@/components/attraction/NearbyDestinationsSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAttraction } from "@/services/attraction/attractionHook";
import { Attraction, Tour, Review } from "@/global.types";

export function AttractionPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: attraction, isLoading, isError } = useAttraction(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !attraction) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Không tìm thấy địa điểm này.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    {
      label: attraction.province.name,
      href: `/province/${attraction.provinceId}`,
    },
    { label: attraction.name, href: `/attraction/${attraction.id}` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {index === breadcrumbItems.length - 1 ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section */}
        <div className="border-b border-gray-200">
          <AttractionHeroSection attraction={attraction} />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4">
          <AttractionToursSection tours={attraction.tours || []} />
          <AttractionReviewsSection
            reviews={attraction.reviews || []}
            averageRating={attraction.rating || 0}
            totalReviews={attraction.reviewCount || 0}
          />
          <NearbyDestinationsSection
            provinceId={attraction.provinceId}
            currentAttractionId={attraction.id}
            category={attraction.category}
            provinceCoordinates={attraction.province.point}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

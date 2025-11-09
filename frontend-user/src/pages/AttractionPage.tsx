import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AttractionHeroSection from "@/components/attraction/AttractionHeroSection.tsx";
import AttractionToursSection from "@/components/attraction/AttractionToursSection.tsx";
import AttractionReviewsSection from "@/components/attraction/AttractionReviewsSection.tsx";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Tour, Review, Attraction } from "@/global.types";
import { mockTours } from "@/data/tours";
import { mockReviews } from "@/data/reviews";
import { mockAttractions } from "@/data/attractions";

export function AttractionPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchAttractionData = async () => {
      try {
        setLoading(true);
        // In real app, fetch from API based on slug
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading

        const foundAttraction = mockAttractions.find(
          (attraction) => attraction.slug === slug
        );

        if (!foundAttraction) {
          navigate("/404");
          return;
        }

        setAttraction(foundAttraction);
        setTours(mockTours);
        setReviews(mockReviews);
      } catch (error) {
        console.error("Error fetching attraction data:", error);
        navigate("/404");
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };

    fetchAttractionData();
  }, [slug, navigate]);

  if (loading) {
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

  if (!attraction) {
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
      label: attraction.location.province,
      href: `/province/${attraction.location.slug}`,
    },
    { label: attraction.name, href: `/attraction/${attraction.slug}` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Breadcrumb */}
        <div className="max-w-[1160px] mx-auto px-4 py-4">
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
        <AttractionHeroSection attraction={attraction} />

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="max-w-[1160px] mx-auto px-4">
            <nav className="flex">
              <div className="px-0 py-3 text-sm font-medium border-b-2 border-[#26B8ED] text-[#26B8ED]">
                Tour & Hoạt động
              </div>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1160px] mx-auto px-4">
          <AttractionToursSection tours={tours} />
          <AttractionReviewsSection
            reviews={reviews}
            averageRating={attraction.reviewInfo.rating}
            totalReviews={attraction.reviewInfo.count}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

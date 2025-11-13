import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AttractionHeroSection from "@/components/attraction/AttractionHeroSection.tsx";
import AttractionReviewsSection from "@/components/attraction/AttractionReviewsSection.tsx";
import AttractionToursSection from "@/components/attraction/AttractionToursSection.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { mockAttractions } from "@/data/attractions";
import { mockReviews } from "@/data/reviews";
import { mockTours } from "@/data/tours";
import { Attraction, Review, Tour } from "@/global.types";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

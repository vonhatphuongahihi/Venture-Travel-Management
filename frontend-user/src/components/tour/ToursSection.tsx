import TourCard from "./TourCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { tourService, Tour } from "@/services/tour.service";
import FilterDialog, { FilterOptions } from "./FilterDialog";
import { useTranslation } from "react-i18next";

const ToursSection = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [activeFilter, setActiveFilter] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [allTours, setAllTours] = useState<Tour[]>([]); // Store all tours for counting
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({});
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll to tours section when search query is present
  useEffect(() => {
    if (searchQuery && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchQuery]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList = await tourService.getCategories();
        setCategories(categoriesList);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all tours once for counting (without limit)
  useEffect(() => {
    const fetchAllTours = async () => {
      try {
        const params: any = {
          limit: 1000,
          isActive: 'true',
        };
        const result = await tourService.getAllTours(params);
        setAllTours(result.tours);
      } catch (err) {
        console.error('Error fetching all tours:', err);
      }
    };

    fetchAllTours();
  }, []);

  // Fetch tours from API with filter
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: any = {
          limit: 12,
          isActive: 'true',
        };

        // Apply category filter if not "all"
        if (activeFilter !== 'all') {
          params.category = activeFilter;
        }

        // Apply additional filters
        if (appliedFilters.minPrice !== undefined) {
          params.minPrice = appliedFilters.minPrice;
        }
        if (appliedFilters.maxPrice !== undefined) {
          params.maxPrice = appliedFilters.maxPrice;
        }
        if (appliedFilters.maxGroupSize !== undefined) {
          params.maxGroupSize = appliedFilters.maxGroupSize;
        }

        const result = await tourService.getAllTours(params);

        // Apply client-side filtering for filters not supported by API
        let filteredTours = result.tours;

        // Filter by price
        if (appliedFilters.minPrice !== undefined || appliedFilters.maxPrice !== undefined) {
          filteredTours = filteredTours.filter((tour) => {
            const price = tour.price || 0;
            if (appliedFilters.minPrice !== undefined && price < appliedFilters.minPrice) {
              return false;
            }
            if (appliedFilters.maxPrice !== undefined && price > appliedFilters.maxPrice) {
              return false;
            }
            return true;
          });
        }

        // Filter by max group size
        if (appliedFilters.maxGroupSize !== undefined) {
          filteredTours = filteredTours.filter((tour) => {
            const maxGroup = (tour as any).maxGroupSize || (tour as any).maxParticipants || 0;
            if (maxGroup > appliedFilters.maxGroupSize!) {
              return false;
            }
            return true;
          });
        }

        // Apply search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          filteredTours = filteredTours.filter((tour) => {
            const title = (tour.title || "").toLowerCase();
            const description = (tour.description || "").toLowerCase();
            const location = (tour.location || "").toLowerCase();
            const category = (tour.category || "").toLowerCase();

            return (
              title.includes(query) ||
              description.includes(query) ||
              location.includes(query) ||
              category.includes(query)
            );
          });
        }

        setTours(filteredTours);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError(t('toursSection.errorLoading'));
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [activeFilter, appliedFilters, searchQuery, t]);

  // Build filters from categories - use allTours for accurate counting
  const filters = [
    { id: "all", label: t('toursSection.all'), count: allTours.length },
    ...categories.map((category) => ({
      id: category,
      label: category,
      count: allTours.filter((t) => {
        const tourCategories = (t as any).categories || [];
        return t.category === category || tourCategories.includes(category);
      }).length,
    })),
  ];

  // Count tours by category - use allTours for accurate counting
  const getTourCount = (filterId: string) => {
    if (filterId === "all") return allTours.length;
    return allTours.filter((tour) => {
      const tourCategories = (tour as any).categories || [];
      return tour.category === filterId || tourCategories.includes(filterId);
    }).length;
  };

  const filteredTours = tours;

  return (
    <section ref={sectionRef} id="tours" className="py-16">
      <div className="container">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-[#dff6ff] text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="h-4 w-4" />
            {t('toursSection.special')}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {searchQuery ? `${t('toursSection.searchResults')}: "${searchQuery}"` : t('toursSection.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {searchQuery
              ? `${tours.length} ${t('toursSection.toursFound')}`
              : t('toursSection.description')
            }
          </p>
        </div>

        {/* Filters and Controls */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-[#dff6ff] text-secondary-foreground hover:bg-accent"
                  }`}
              >
                {filter.label}
                <Badge
                  variant="secondary"
                  className={`text-xs ${activeFilter === filter.id
                    ? "bg-white/30 text-white"
                    : "bg-primary/20 text-primary font-semibold"
                    }`}
                >
                  {getTourCount(filter.id)}
                </Badge>
              </button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterDialogOpen(true)}
              className="relative border-primary/30 hover:bg-primary/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('toursSection.filterMore')}
              {Object.keys(appliedFilters).length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                  {Object.keys(appliedFilters).filter(
                    (key) =>
                      appliedFilters[key as keyof FilterOptions] !== undefined
                  ).length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Tours Grid */}
        <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>{t('toursSection.noTours')}</p>
            </div>
          ) : (
            filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                id={tour.id}
                title={tour.title}
                description={tour.description}
                image={tour.image}
                price={tour.price}
                duration={tour.duration}
                location={tour.location}
                rating={tour.rating}
                reviewCount={tour.reviewCount}
                category={tour.category || "Tour du lịch"}
                status={tour.status}
                maxParticipants={tour.maxParticipants}
                availableSpots={tour.availableSpots}
              />
            ))
          )}
        </div>

        {/* Load More */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button variant="tour" size="lg" className="px-8 bg-[#80CEEA] text-white hover:bg-[#5ebbdd]">
            {t('toursSection.viewMoreTours')}
          </Button>
        </div>
      </div>

      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        onApply={(filters) => {
          setAppliedFilters(filters);
        }}
        onReset={() => {
          setAppliedFilters({});
        }}
        initialFilters={appliedFilters}
      />
    </section>
  );
};

export default ToursSection;
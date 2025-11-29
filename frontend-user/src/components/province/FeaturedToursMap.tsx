import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { X, MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProvinceToursInfinite } from "@/hooks/useProvince";
import { Tour } from "@/global.types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

// Ensure Mapbox token is set
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

// Extended Tour type for this component (including fields used in mock data)
interface FeaturedTour extends Partial<Tour> {
  id: string;
  name: string;
  image: string;
  images?: string[];
  rating: number;
  review_count: number;
  duration_days: number;
  duration_nights: number;
  price: number;
  start_point: {
    lat: number;
    long: number;
  };
}

interface FeaturedToursMapProps {
  provinceId: string;
  center: { lat: number; long: number };
  onClose: () => void;
}

export default function FeaturedToursMap({ provinceId, center, onClose }: FeaturedToursMapProps) {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popupsRef = useRef<{ [key: string]: mapboxgl.Popup }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const observerTarget = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [hoveredTourId, setHoveredTourId] = useState<string | null>(null);
  const [hoverSource, setHoverSource] = useState<'card' | 'marker' | null>(null);
  // const [selectedTourId, setSelectedTourId] = useState<string | null>(null); // Removed persistent selection state

  // Fetch tours with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useProvinceToursInfinite(provinceId, 10);

  const tours = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.data) || [];
  }, [data]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [center.long, center.lat], // Use prop center
      zoom: 11,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []); // Only run once on mount

  // Hover Handlers with Grace Period
  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleMarkerEnter = (tourId: string) => {
    clearHoverTimeout();
    setHoveredTourId(tourId);
    setHoverSource('marker');
  };

  const handleMarkerLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredTourId(null);
      setHoverSource(null);
    }, 200); // 200ms grace period
  };

  // Update Markers when tours change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || tours.length === 0) return;

    // Clear existing markers and popups
    Object.values(markersRef.current).forEach(marker => marker.remove());
    Object.values(popupsRef.current).forEach(popup => popup.remove());
    markersRef.current = {};
    popupsRef.current = {};

    tours.forEach((tour) => {
      const lat = tour.start_point?.lat;
      const lng = tour.start_point?.long;

      if (lat && lng) {
        const el = document.createElement("div");
        el.className = "cursor-pointer"; 
        // Default state: Blue dot
        el.innerHTML = `
          <div class="marker-dot w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg transition-transform duration-300"></div>
        `;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map);

        // Hover tooltip - Rich Card
        const popup = new mapboxgl.Popup({ 
          offset: 25, 
          closeButton: false, 
          closeOnClick: false,
          maxWidth: "400px",
          className: "z-50 featured-tour-popup" // Added custom class
        })
        .setLngLat([lng, lat]) // IMPORTANT: Set position!
        .setHTML(`
          <div class="flex p-2 bg-white rounded-xl shadow-md min-w-[320px] gap-3 items-start cursor-pointer hover:bg-gray-50 transition-colors">
            <div class="w-20 h-30 flex-shrink-0 rounded-lg overflow-hidden relative bg-gray-100">
              <img src="${tour.image || '/placeholder-tour.jpg'}" class="w-full h-full object-cover" alt="${tour.name}" />
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-between h-30 py-0.5">
              <h3 class="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-auto">${tour.name}</h3>
              
              <div class="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                <span class="text-yellow-500 font-bold flex items-center gap-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ${tour.rating}
                </span>
                <span>(${tour.review_count} Đánh giá)</span>
              </div>
              
              <div class="mt-1 flex items-center gap-1">
                <span class="text-base font-bold text-gray-900">${formatCurrency(tour.price)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#ef4444" stroke="none" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
            </div>
          </div>
        `);

        // Event listeners for state management
        el.addEventListener("mouseenter", () => handleMarkerEnter(tour.id));
        el.addEventListener("mouseleave", handleMarkerLeave);
        
        // Click to scroll and zoom
        el.addEventListener("click", () => {
           scrollToCard(tour.id);
           
           map.flyTo({
             center: [lng, lat],
             zoom: 14,
             duration: 1500
           });
        });

        markersRef.current[tour.id] = marker;
        popupsRef.current[tour.id] = popup;
      }
    });

  }, [tours]);

  // Highlight marker and Show Popup on hover
  useEffect(() => {
    const map = mapInstanceRef.current;
    
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      const popup = popupsRef.current[id];
      
      if (id === hoveredTourId) {
        // Change to Pin Style (Blue/Primary)
        el.style.zIndex = "10";
        el.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#26b8ed" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin drop-shadow-xl transform -translate-y-1/2 transition-all duration-300"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
        `;
        
        // Show Popup ONLY if hover source is marker
        if (popup && map && hoverSource === 'marker') {
          popup.addTo(map);
          
          // Add listeners to popup element for grace period and click nav
          const popupEl = popup.getElement();
          if (popupEl) {
            popupEl.onmouseenter = () => clearHoverTimeout();
            popupEl.onmouseleave = handleMarkerLeave;
            popupEl.onclick = (e) => {
              e.stopPropagation();
              navigate(`/tour/${id}`);
            };
          }
        }
        
      } else {
        // Revert to Dot Style
        el.style.zIndex = "1";
        el.innerHTML = `
          <div class="marker-dot w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg transition-transform duration-300"></div>
        `;
        
        // Hide Popup
        if (popup) {
          popup.remove();
        }
      }
    });
  }, [hoveredTourId, hoverSource]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const scrollToCard = (tourId: string) => {
    const card = cardRefs.current[tourId];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCardHover = (tour: FeaturedTour) => {
    clearHoverTimeout();
    setHoveredTourId(tour.id);
    setHoverSource('card');
    if (tour.start_point?.lat && tour.start_point?.long && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [tour.start_point.long, tour.start_point.lat],
        zoom: 14,
        duration: 1500
      });
    }
  };

  // Custom styles to override Mapbox default popup styling
  const popupStyles = `
    .featured-tour-popup .mapboxgl-popup-content {
      background: transparent !important;
      box-shadow: none !important;
      padding: 0 !important;
      border-radius: 0 !important;
    }
    .featured-tour-popup .mapboxgl-popup-tip {
      border-top-color: white !important; /* Ensure tip matches card bg */
      margin-bottom: -1px; /* Fix slight gap */
    }
  `;

  return (
    <div className="fixed inset-0 z-[99999] bg-white/50 backdrop-blur-sm">
      <style>{popupStyles}</style>
      {/* Map Section - Full Screen Background */}
      <div className="absolute inset-0 z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 bg-white shadow-md hover:bg-gray-100 rounded-full w-10 h-10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Sidebar - Floating Card */}
      <div className="absolute left-0 top-0 bottom-0 md:left-4 md:top-4 md:bottom-4 w-full md:w-[400px] lg:w-[450px] z-10 bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-20">
          <h2 className="text-xl font-bold text-gray-800">Tour nổi bật</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {tours.map((tour) => (
            <div
              key={tour.id}
              ref={(el) => (cardRefs.current[tour.id] = el)}
              onMouseEnter={() => handleCardHover(tour)}
              onMouseLeave={() => setHoveredTourId(null)}
              className={cn(
                "group flex gap-4 p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200",
                (hoveredTourId === tour.id)
                  ? "bg-blue-50/50"
                  : "bg-white hover:bg-gray-50"
              )}
            >
              {/* Image */}
              <div className="w-24 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                <img
                  src={tour.image || "/placeholder-tour.jpg"}
                  alt={tour.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <h3 className={cn(
                  "font-medium text-gray-900 line-clamp-2 text-sm leading-snug transition-colors",
                  hoveredTourId === tour.id ? "text-primary" : ""
                )}>
                  {tour.name}
                </h3>
                
                <div className="mt-auto space-y-1">
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-0.5 text-yellow-500 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{tour.rating || 0}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{tour.review_count || 0} đánh giá</span>
                  </div>

                  {/* Price */}
                  <div className="font-bold text-primary text-sm">
                    {formatCurrency(tour.price)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading State */}
          {(isLoading || isFetchingNextPage) && (
            <div className="py-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          )}

          {/* Sentinel for Infinite Scroll */}
          <div ref={observerTarget} className="h-4" />
        </div>
      </div>
    </div>
  );
}

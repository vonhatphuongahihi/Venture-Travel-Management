import React, { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Star, MapPin } from "lucide-react";
import { useAttractionsInfinite } from "@/services/attraction/attractionHook";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Ensure Mapbox token is set
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

interface NearbyDestinationsSectionProps {
  provinceId: string;
  currentAttractionId: string;
  category: string;
  provinceCoordinates?: { lat: number; long: number } | null;
}

export default function NearbyDestinationsSection({
  provinceId,
  currentAttractionId,
  category,
  provinceCoordinates,
}: NearbyDestinationsSectionProps) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popupsRef = useRef<{ [key: string]: mapboxgl.Popup }>({});
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAttractionsInfinite({
      provinceId,
      limit: 10,
    });

  // Flatten data and filter out current attraction
  const attractions = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages
      .flatMap((page) => page.attractions)
      .filter((a) => a.id !== currentAttractionId);
  }, [data, currentAttractionId]);

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

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const defaultCenter: [number, number] = [105.8, 21.0];
    const center: [number, number] = provinceCoordinates
      ? [provinceCoordinates.long, provinceCoordinates.lat]
      : defaultCenter;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: center,
      zoom: 10,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || attractions.length === 0) return;

    // Clear existing markers that are not in the new list (or just clear all for simplicity to avoid sync issues)
    // For performance, we could diff, but for < 100 items, clearing is fine.
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    Object.values(popupsRef.current).forEach((popup) => popup.remove());
    markersRef.current = {};
    popupsRef.current = {};

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidCoordinates = false;

    attractions.forEach((attraction) => {
      if (attraction.coordinates) {
        hasValidCoordinates = true;
        const { lat, lon: lng } = attraction.coordinates;
        bounds.extend([lng, lat]);

        // Create marker element
        const el = document.createElement("div");
        el.className = "cursor-pointer"; // Removed transition-all to prevent drift
        el.innerHTML = `
          <div class="marker-content w-8 h-8 bg-white rounded-full border-2 border-primary shadow-lg flex items-center justify-center text-primary font-bold text-xs transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `;

        // Popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
          className: "nearby-popup",
        }).setHTML(`
          <div class="p-2 bg-white rounded-lg shadow-sm max-w-[200px] z-[9999]">
            <div class="h-24 rounded-md overflow-hidden mb-2">
              <img src="${
                attraction.images[0] || "/placeholder.svg"
              }" class="w-full h-full object-cover" />
            </div>
            <h3 class="font-bold text-sm text-gray-900 line-clamp-2 mb-1">${
              attraction.name
            }</h3>
            <div class="flex items-center gap-1 text-xs text-gray-500">
              <span class="text-yellow-500 font-bold flex items-center">
                ${attraction.rating || 0} ★
              </span>
              <span>(${attraction.reviewCount || 0})</span>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        // Events
        el.addEventListener("mouseenter", () => {
          setHoveredId(attraction.id);
          popup.addTo(map);
        });
        el.addEventListener("mouseleave", () => {
          setHoveredId(null);
          popup.remove();
        });
        el.addEventListener("click", () => {
          navigate(`/attraction/${attraction.id}`);
        });

        markersRef.current[attraction.id] = marker;
        popupsRef.current[attraction.id] = popup;
      }
    });

    // Fit bounds
    if (hasValidCoordinates && !bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }, [attractions, navigate]);

  // Handle hover from list
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const popup = popupsRef.current[id];
      const el = marker.getElement();
      const content = el.querySelector(".marker-content") as HTMLElement;

      if (id === hoveredId) {
        el.style.zIndex = "10";
        if (content) content.style.transform = "scale(1.2)";
        if (popup) popup.addTo(map);
      } else {
        el.style.zIndex = "1";
        if (content) content.style.transform = "scale(1)";
        if (popup) popup.remove();
      }
    });
  }, [hoveredId]);

  if (attractions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="py-8 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Địa điểm lân cận
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Column - Fixed height with scroll */}
        <div className="lg:col-span-1">
          <div className="h-[600px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {attractions.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex gap-3 p-3 rounded-lg border border-gray-100 cursor-pointer transition-all hover:shadow-md",
                  hoveredId === item.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white"
                )}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/attraction/${item.id}`)}
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  <img
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
                    {item.name}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900">
                        {item.rating || 0}
                      </span>
                      <span>({item.reviewCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{item.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading State */}
            {(isLoading || isFetchingNextPage) && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Sentinel for Infinite Scroll */}
            <div ref={observerTarget} className="h-4" />
          </div>
        </div>

        {/* Map Column */}
        <div className="lg:col-span-2 h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

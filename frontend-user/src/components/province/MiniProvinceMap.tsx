import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

interface MiniProvinceMapProps {
  lat: number;
  lng: number;
  onClick: () => void;
  className?: string;
}

export default function MiniProvinceMap({ lat, lng, onClick, className }: MiniProvinceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 9, // Zoom out a bit for context
      interactive: false, // Disable all interactions
      attributionControl: false,
    });

    // Add a simple marker for the province center
    const el = document.createElement("div");
    el.className = "marker-dot w-3 h-3 bg-primary rounded-full border-2 border-white shadow-md";
    
    new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [lat, lng]);

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer shadow-sm border border-gray-100 hover:shadow-md transition-shadow group", 
        className
      )}
      onClick={onClick}
    >
      <div ref={mapContainerRef} className="w-full h-full pointer-events-none" />
      
      {/* Overlay to ensure clicks are captured by the container and not consumed by map controls if any */}
      <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors" />
      
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded-full font-medium text-gray-600 shadow-sm">
        Nhấn để xem bản đồ
      </div>
    </div>
  );
}

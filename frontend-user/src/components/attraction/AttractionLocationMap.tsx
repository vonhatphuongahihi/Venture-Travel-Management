import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

interface AttractionLocationMapProps {
  lat: number;
  lng: number;
  name: string;
  address: string;
  image?: string;
  className?: string;
}

export default function AttractionLocationMap({
  lat,
  lng,
  name,
  address,
  image,
  className,
}: AttractionLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 15,
      attributionControl: false,
    });

    // Create custom marker element
    const el = document.createElement("div");
    el.className = "marker-location";
    el.innerHTML = `
      <div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5), 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `;

    // Popup content
    const popupContent = `
      <div style="font-family: 'Inter', sans-serif; padding: 0; margin: 0; max-width: 250px;">
        ${
          image
            ? `<div style="
            width: 100%;
            height: 120px;
            background: url(${image}) center/cover no-repeat;
            border-radius: 8px 8px 0 0;
          "></div>`
            : ""
        }
        <div style="padding: 12px;">
          <h3 style="
            color: #1f2937; 
            font-size: 16px; 
            font-weight: bold; 
            margin: 0 0 4px 0;
          ">${name}</h3>
          <p style="
            color: #6b7280; 
            font-size: 13px; 
            margin: 0;
            line-height: 1.4;
          ">${address}</p>
        </div>
      </div>
    `;

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
    }).setHTML(popupContent);

    new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    // Open popup by default
    popup.addTo(map);

    mapInstanceRef.current = map;

    // Resize map after a short delay to ensure container is ready (fix for Dialog)
    setTimeout(() => {
      map.resize();
    }, 200);

    return () => {
      map.remove();
    };
  }, [lat, lng, name, address, image]);

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden shadow-sm border border-gray-100",
        className
      )}
    >
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

import { useEffect, useRef } from "react";
import { TourType, DestinationType, EventType, HotelType } from "@/types";

interface InteractiveMapProps {
  area: string; // "north" | "centre" | "south" | "all"
  layer: string; // "tour" | "hotel" | "event" | "destination"
  destinations: DestinationType[]; // danh sách điểm đến
  events: EventType[]; // danh sách sự kiện
  hotels: HotelType[];
  tours: TourType[];
}

function InteractiveMap({
  area,
  layer,
  tours,
  destinations,
  events,
  hotels,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const layersRef = useRef<any[]>([]); // lưu các marker/polyline đã vẽ để clear

  useEffect(() => {
    const loadLeaflet = async () => {
      // load CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet/dist/leaflet.css";
      document.head.appendChild(link);

      // load JS
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
      script.async = true;
      // load JS
      if (!(window as any).L) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      const L = (window as any).L;
      if (!mapRef.current) return;

      // Nếu đã có map cũ thì remove
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }

      leafletMap.current = L.map(mapRef.current);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(leafletMap.current);

      // Mặc định zoom toàn bộ VN
      leafletMap.current.fitBounds([
        [8.5, 103.4],
        [23.5, 109.5],
      ]);

      renderLayers("tour"); // mặc định hiển thị tour
    };

    loadLeaflet();

    // Cleanup khi rời trang
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Khi area thay đổi thì zoom
  useEffect(() => {
    if (!leafletMap.current) return;
    const L = (window as any).L;

    if (area === "all") {
      // Fit toàn bộ Việt Nam
      leafletMap.current.fitBounds([
        [8.5, 103.4],
        [23.5, 109.5],
      ]);
    } else if (area === "north") {
      leafletMap.current.fitBounds([
        [20.0, 103.5],
        [23.5, 107.5],
      ]);
    } else if (area === "centre") {
      leafletMap.current.fitBounds([
        [14.0, 106.0],
        [17.5, 110.0],
      ]);
    } else if (area === "south") {
      leafletMap.current.fitBounds([
        [8.5, 104.0],
        [12.5, 107.5],
      ]);
    }
  }, [area]);

  const renderLayers = (layerType: string = layer) => {
    if (!leafletMap.current) return;
    const L = (window as any).L;
    // clear cũ
    layersRef.current.forEach((layer) => {
      leafletMap.current.removeLayer(layer);
    });
    layersRef.current = [];

    if (layerType === "tour") {
      tours.forEach((t) => {
        const popupContent = `<b>${t.name}</b><br>${t.description || ""}`;
        const polyline = L.polyline(t.coords, { color: "blue", weight: 2 })
          .bindPopup(popupContent)
          .addTo(leafletMap.current);
        layersRef.current.push(polyline);
      });
    } else if (layerType === "destination") {
      destinations.forEach((d) => {
        const popupContent = `<b>${d.name}</b><br>${d.description || ""}`;
        const marker = L.marker(d.coords)
          .bindPopup(popupContent)
          .addTo(leafletMap.current);
        layersRef.current.push(marker);
      });
    } else if (layerType === "event") {
      events.forEach((e) => {
        const popupContent = `<b>${e.name}</b><br>${e.description || ""}`;
        const marker = L.marker(e.coords)
          .bindPopup(popupContent)
          .addTo(leafletMap.current);
        layersRef.current.push(marker);
      });
    } else if (layerType === "hotel") {
      hotels.forEach((h) => {
        const popupContent = `<b>${h.name}</b><br>${h.description || ""}`;
        const marker = L.marker(h.coords)
          .bindPopup(popupContent)
          .addTo(leafletMap.current);
        layersRef.current.push(marker);
      });
    }
  };
  // Khi layer thay đổi thì vẽ lại
  useEffect(() => {
    if (!leafletMap.current) return;
    renderLayers();
  }, [layer, tours, destinations, events, hotels]);

  return (
    <div className="w-[900px] h-[600px] relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-gray-200">
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg"
        style={{ height: "600px" }}
      />
    </div>
  );
}

export default InteractiveMap;

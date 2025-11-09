import { TourRoute, TourStop } from "@/types/tourDetailType";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { BusFront } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

function StopDetail({
  stop,
  zoomStop,
}: {
  stop: TourStop;
  zoomStop: (geom: [number, number]) => void;
}) {
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  return (
    <div className="w-full min-h-14 flex items-start space-x-5">
      <div className="bg-primary flex items-center justify-center w-14 h-14 rounded-full text-white p-2">
        {stop.stopOrder}
      </div>
      <div className="w-[500px] cursor-pointer">
        <div
          className="flex items-center justify-between"
          onClick={() => zoomStop(stop.attractionGeom)}
        >
          <p className="font-semibold">{stop.attractionName}</p>
          <p>{stop.notes}</p>
        </div>
        <Collapsible open={openDetail} onOpenChange={setOpenDetail}>
          <CollapsibleContent>
            <div className="mb-5">
              <img
                src={stop.attractionImage}
                alt={stop.attractionName}
                className="w-full h-48 object-cover rounded-lg my-2"
              />
              <p className="text-gray-500">{stop.details}</p>
              <Button className="mt-2 bg-white outline outline-2 text-primary hover:bg-primary/80 hover:text-white">
                Tìm hiểu thêm về {stop.attractionName}
              </Button>
            </div>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <button className="hover:text-primary underline">
              {openDetail ? "Ẩn bớt" : "Xem chi tiết và hình ảnh"}
            </button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>
    </div>
  );
}

export default function Itinerary({
  tourStop,
  tourRoute,
  setPUOpen,
}: {
  tourStop: TourStop[];
  tourRoute: TourRoute;
  setPUOpen: (open: boolean) => void;
}) {
  
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<any>(null);
    const layersRef = useRef<any[]>([]);

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

        // Zoom
        if (tourStop && tourStop.length > 0) {
          const L = (window as any).L;
          const bounds = L.latLngBounds(
            tourStop.map((stop) => [
              stop.attractionGeom[1],
              stop.attractionGeom[0],
            ])
          );
          leafletMap.current.fitBounds(bounds, { padding: [30, 30] }); // padding để không bị sát mép
        } else {
          // fallback nếu không có điểm nào
          leafletMap.current.setView([16.047079, 108.20623], 6); // trung tâm VN
        }

        renderLayers(); // mặc định hiển thị tour
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
    const renderLayers = () => {
      if (!leafletMap.current) return;
      const L = (window as any).L;
      // clear cũ
      layersRef.current.forEach((layer) => {
        leafletMap.current.removeLayer(layer);
      });
      layersRef.current = [];

      // Thêm các điểm dừng
      tourStop.forEach((stop) => {
        const customIcon = L.divIcon({
          html: `
              <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: #2563eb; /* xanh dương */
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                font-size: 14px;
                border: 2px solid white;
                box-shadow: 0 0 5px rgba(0,0,0,0.3);
              ">
                ${stop.stopOrder}
              </div>
            `,
          className: "", // bỏ class mặc định của Leaflet để tránh style override
          iconSize: [32, 32],
          iconAnchor: [16, 16], // tâm icon nằm chính giữa
        });
        const popupContent = `<b>${stop.stopOrder}</b><br>${
          stop.attractionName || ""
        }`;
        const [lng, lat] = stop.attractionGeom;
        const marker = L.marker([lat, lng], { icon: customIcon })
          .bindPopup(popupContent)
          .addTo(leafletMap.current);
        layersRef.current.push(marker);
      });

      const coords = tourRoute.geom.map(([lng, lat]) => [lat, lng]); // Đổi thành [lat, lng]
      const routeLine = L.polyline(coords, {
        color: "blue",
        weight: 3,
        opacity: 0.8,
      }).addTo(leafletMap.current);
      layersRef.current.push(routeLine);
    };
    const zoomStop = (geom: [number, number]) => {
      if (!leafletMap.current) return;
      const L = (window as any).L;
      const [lng, lat] = geom;

      leafletMap.current.flyTo([lat, lng], 14, {
        animate: true,
        duration: 1.5, // thời gian bay (giây)
        easeLinearity: 0.25, // độ mượt của đường bay
      });
    };
    return (
      <div className="container mx-auto space-x-5 flex justify-between mt-5">
        {/* Itinerary List */}
        <div className="flex-col space-y-2 w-[560px]">
          <div className="w-full h-14 flex space-x-5">
            <div className="bg-black flex items-center justify-center w-14 h-14 rounded-full text-white p-2">
              <BusFront />
            </div>
            <div className="w-[500px]">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Bạn sẽ được đón</p>
              </div>
              <button
                className="hover:text-primary underline"
                onClick={() => {
                  const el = document.getElementById("pickUp");
                  if (el) {
                    const y =
                      el.getBoundingClientRect().top + window.scrollY - 80; // chừa cho navbar
                    window.scrollTo({ top: y, behavior: "smooth" });
                    setPUOpen(true);
                  }
                }}
              >
                Xem chi tiết khởi hành
              </button>
            </div>
          </div>
          {tourStop.map((stop) => {
            return (
              <StopDetail
                stop={stop}
                zoomStop={zoomStop}
                key={stop.stopOrder}
              />
            );
          })}
        </div>
        {/* Map */}
        <div className="w-[550px] h-[550px] bg-white rounded-lg outline z-0">
          <div ref={mapRef} style={{ height: "550px" }} />
        </div>
      </div>
    );
  
}

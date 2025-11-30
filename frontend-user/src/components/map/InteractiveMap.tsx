import { useEffect, useRef } from "react";
import { TourType, DestinationType, EventType, HotelType } from "@/types/mapType";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Custom CSS for Mapbox popups
const popupStyles = `
  .mapboxgl-popup-content {
    padding: 0 !important;
    border-radius: 12px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
    overflow: hidden;
  }
  .mapboxgl-popup-close-button {
    font-size: 24px;
    padding: 8px 12px;
    color: white;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8px;
    transition: all 0.2s;
  }
  .mapboxgl-popup-close-button:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: scale(1.1);
  }
  .mapboxgl-popup-tip {
    border-top-color: transparent !important;
  }
`;

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
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]); // lưu các marker đã vẽ để clear
  const currentPopupRef = useRef<mapboxgl.Popup | null>(null); // lưu popup hiện tại để đóng khi mở popup mới

  // Set Mapbox token
  mapboxgl.accessToken = MAPBOX_TOKEN;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [105.8, 16.0], // Center of Vietnam
      zoom: 6,
    });

    mapInstanceRef.current.on("load", () => {
      // Fit toàn bộ Việt Nam
      mapInstanceRef.current?.fitBounds(
        [
          [103.4, 8.5], // Southwest coordinates
          [109.5, 23.5], // Northeast coordinates
        ],
        { padding: 50 }
      );

      renderLayers();
    });

    // Cleanup khi rời trang
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Khi area thay đổi thì zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (area === "all") {
      // Fit toàn bộ Việt Nam
      mapInstanceRef.current.fitBounds(
        [
          [103.4, 8.5],
          [109.5, 23.5],
        ],
        { padding: 50 }
      );
    } else if (area === "north") {
      mapInstanceRef.current.fitBounds(
        [
          [103.5, 20.0],
          [107.5, 23.5],
        ],
        { padding: 50 }
      );
    } else if (area === "centre") {
      mapInstanceRef.current.fitBounds(
        [
          [106.0, 14.0],
          [110.0, 17.5],
        ],
        { padding: 50 }
      );
    } else if (area === "south") {
      mapInstanceRef.current.fitBounds(
        [
          [104.0, 8.5],
          [107.5, 12.5],
        ],
        { padding: 50 }
      );
    }
  }, [area]);

  const createCustomMarker = (
    color: string,
    gradientStart: string,
    gradientEnd: string,
    icon: string,
    shadowColor: string
  ) => {
    const el = document.createElement("div");
    el.style.cursor = "pointer";
    el.innerHTML = `
      <div class="custom-marker" style="
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px ${shadowColor}, 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      ">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `;

    // Add hover effect
    el.addEventListener("mouseenter", () => {
      const markerDiv = el.querySelector(".custom-marker") as HTMLElement;
      if (markerDiv && !markerDiv.classList.contains('active')) {
        markerDiv.style.transform = "scale(1.1)";
        markerDiv.style.boxShadow = `0 6px 16px ${shadowColor}, 0 4px 8px rgba(0,0,0,0.3)`;
      }
    });

    el.addEventListener("mouseleave", () => {
      const markerDiv = el.querySelector(".custom-marker") as HTMLElement;
      if (markerDiv && !markerDiv.classList.contains('active')) {
        markerDiv.style.transform = "scale(1)";
        markerDiv.style.boxShadow = `0 4px 12px ${shadowColor}, 0 2px 4px rgba(0,0,0,0.2)`;
      }
    });

    return el;
  };

  const renderLayers = (layerType: string = layer) => {
    if (!mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Close current popup if any
    if (currentPopupRef.current) {
      currentPopupRef.current.remove();
      currentPopupRef.current = null;
    }

    // Remove old route layers if exist
    if (mapInstanceRef.current.getLayer('tour-routes-glow')) {
      mapInstanceRef.current.removeLayer('tour-routes-glow');
    }
    if (mapInstanceRef.current.getLayer('tour-routes')) {
      mapInstanceRef.current.removeLayer('tour-routes');
    }
    if (mapInstanceRef.current.getSource('tour-routes')) {
      mapInstanceRef.current.removeSource('tour-routes');
    }

    if (layerType === "tour") {
      const routeFeatures = tours
        .filter(t => t.coords && t.coords.length > 1)
        .map(t => ({
          type: 'Feature' as const,
          properties: {
            tourId: t.tourId,
            tourName: t.name,
          },
          geometry: {
            type: 'LineString' as const,
            coordinates: t.coords.map(coord => [coord[1], coord[0]]), // [lng, lat]
          },
        }));

      if (routeFeatures.length > 0) {
        mapInstanceRef.current.addSource('tour-routes', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: routeFeatures,
          },
        });

        // Add glow effect
        mapInstanceRef.current.addLayer({
          id: 'tour-routes-glow',
          type: 'line',
          source: 'tour-routes',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#26B8ED',
            'line-width': 6,
            'line-opacity': 0.3,
          },
        });

        // Add main route line
        mapInstanceRef.current.addLayer({
          id: 'tour-routes',
          type: 'line',
          source: 'tour-routes',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#26B8ED',
            'line-width': 3,
            'line-opacity': 0.8,
          },
        });
      }

      // Vẽ markers sau (nằm trên routes)
      tours.forEach((t) => {
        // Hiển thị marker tại điểm đầu tiên của tour
        if (t.coords && t.coords.length > 0) {
          const [lat, lng] = t.coords[0];

          const el = createCustomMarker(
            "#26B8ED",
            "#26B8ED",
            "#0891B2",
            "✈️",
            "rgba(38, 184, 237, 0.5)"
          );

          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: true,
            maxWidth: "320px"
          })
            .on('open', () => {
              // Close previous popup when opening new one
              if (currentPopupRef.current && currentPopupRef.current !== popup) {
                currentPopupRef.current.remove();
              }
              currentPopupRef.current = popup;

              // Scale up marker when popup opens
              const markerDiv = el.querySelector(".custom-marker") as HTMLElement;
              if (markerDiv) {
                markerDiv.classList.add('active');
                markerDiv.style.transform = "scale(1.2)";
                markerDiv.style.boxShadow = `0 8px 20px rgba(38, 184, 237, 0.6), 0 4px 8px rgba(0,0,0,0.3)`;
              }
            })
            .on('close', () => {
              if (currentPopupRef.current === popup) {
                currentPopupRef.current = null;
              }

              // Scale down marker when popup closes
              const markerDiv = el.querySelector(".custom-marker") as HTMLElement;
              if (markerDiv) {
                markerDiv.classList.remove('active');
                markerDiv.style.transform = "scale(1)";
                markerDiv.style.boxShadow = `0 4px 12px rgba(38, 184, 237, 0.5), 0 2px 4px rgba(0,0,0,0.2)`;
              }
            })
            .setHTML(
              `<div style="font-family: 'Inter', sans-serif; padding: 0; margin: 0;">
              <div style="
                width: 100%;
                height: 180px;
                background: ${t.image
                ? `url(${t.image}) center/cover no-repeat`
                : 'linear-gradient(135deg, #26B8ED 0%, #0891B2 100%)'};
                border-radius: 8px 8px 0 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                position: relative;
              ">
                ${!t.image ? '✈️' : ''}
              </div>
              <div style="padding: 16px;">
                <h3 style="
                  color: #26B8ED; 
                  font-size: 18px; 
                  font-weight: bold; 
                  margin: 0 0 8px 0;
                  line-height: 1.4;
                ">${t.name}</h3>
                <p style="
                  color: #64748b; 
                  font-size: 13px; 
                  margin: 0 0 8px 0;
                  line-height: 1.5;
                ">${t.location || ''}</p>
                <p style="
                  color: #64748b; 
                  font-size: 13px; 
                  margin: 0 0 12px 0;
                  line-height: 1.5;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                ">${t.description || ""}</p>
                <a href="/tour/${t.tourId}" style="
                  display: inline-block;
                  color: white;
                  background: #26B8ED;
                  text-decoration: none;
                  font-weight: 600;
                  font-size: 14px;
                  padding: 8px 16px;
                  border-radius: 6px;
                  transition: all 0.3s ease;
                  cursor: pointer;
                  width: 100%;
                  text-align: center;
                " onmouseover="this.style.background='#0891B2'" onmouseout="this.style.background='#26B8ED'">Xem chi tiết →</a>
              </div>
            </div>`
            );

          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat]) // Mapbox uses [lng, lat]
            .setPopup(popup)
            .addTo(mapInstanceRef.current!);

          markersRef.current.push(marker);
        }
      });
    } else if (layerType === "destination") {
      destinations.forEach((d) => {
        const [lat, lng] = d.coords;

        const el = createCustomMarker(
          "#10b981",
          "#10b981",
          "#059669",
          "📍",
          "rgba(16, 185, 129, 0.5)"
        );

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: true,
          maxWidth: "320px"
        })
          .on('open', () => {
            // Close previous popup when opening new one
            if (currentPopupRef.current && currentPopupRef.current !== popup) {
              currentPopupRef.current.remove();
            }
            currentPopupRef.current = popup;

            // Scale up marker when popup opens
            const markerDiv = el.querySelector(".custom-marker") as HTMLElement;
            if (markerDiv) {
              markerDiv.classList.add('active');
              markerDiv.style.transform = "scale(1.2)";
              markerDiv.style.boxShadow = `0 8px 20px rgba(16, 185, 129, 0.6), 0 4px 8px rgba(0,0,0,0.3)`;
            }
          })
          .on('close', () => {
            if (currentPopupRef.current === popup) {
              currentPopupRef.current = null;
            }

            // Scale down marker when popup closes
            const markerDiv = el.querySelector(".custom-marker") as HTMLElement;
            if (markerDiv) {
              markerDiv.classList.remove('active');
              markerDiv.style.transform = "scale(1)";
              markerDiv.style.boxShadow = `0 4px 12px rgba(16, 185, 129, 0.5), 0 2px 4px rgba(0,0,0,0.2)`;
            }
          })
          .setHTML(
            `<div style="font-family: 'Inter', sans-serif; padding: 0; margin: 0;">
            <div style="
              width: 100%;
              height: 180px;
              background: ${d.image
              ? `url(${d.image}) center/cover no-repeat`
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
              border-radius: 8px 8px 0 0;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
            ">
              ${!d.image ? '📍' : ''}
            </div>
            <div style="padding: 16px;">
              <h3 style="
                color: #10b981; 
                font-size: 18px; 
                font-weight: bold; 
                margin: 0 0 8px 0;
                line-height: 1.4;
              ">${d.name}</h3>
              <p style="
                color: #64748b; 
                font-size: 13px; 
                margin: 0;
                line-height: 1.5;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
              ">${d.address || d.description || ""}</p>
            </div>
          </div>`
          );

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat]) // Mapbox uses [lng, lat]
          .setPopup(popup)
          .addTo(mapInstanceRef.current!);

        markersRef.current.push(marker);
      });
    } else if (layerType === "event") {
      events.forEach((e) => {
        const [lat, lng] = e.coords;

        const el = createCustomMarker(
          "#f59e0b",
          "#f59e0b",
          "#d97706",
          "🎉",
          "rgba(245, 158, 11, 0.5)"
        );

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: true,
          maxWidth: "320px"
        }).setHTML(
          `<div style="font-family: 'Inter', sans-serif; padding: 0; margin: 0;">
            <div style="
              width: 100%;
              height: 180px;
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              border-radius: 8px 8px 0 0;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
            ">
              🎉
            </div>
            <div style="padding: 16px;">
              <h3 style="
                color: #f59e0b; 
                font-size: 18px; 
                font-weight: bold; 
                margin: 0 0 8px 0;
                line-height: 1.4;
              ">${e.name}</h3>
              <p style="
                color: #64748b; 
                font-size: 13px; 
                margin: 0;
                line-height: 1.5;
              ">${e.description || ""}</p>
            </div>
          </div>`
        );

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat]) // Mapbox uses [lng, lat]
          .setPopup(popup)
          .addTo(mapInstanceRef.current!);

        markersRef.current.push(marker);
      });
    } else if (layerType === "hotel") {
      hotels.forEach((h) => {
        const [lat, lng] = h.coords;

        const el = createCustomMarker(
          "#8b5cf6",
          "#8b5cf6",
          "#7c3aed",
          "🏨",
          "rgba(139, 92, 246, 0.5)"
        );

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: true,
          maxWidth: "320px"
        }).setHTML(
          `<div style="font-family: 'Inter', sans-serif; padding: 0; margin: 0;">
            <div style="
              width: 100%;
              height: 180px;
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
              border-radius: 8px 8px 0 0;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
            ">
              🏨
            </div>
            <div style="padding: 16px;">
              <h3 style="
                color: #8b5cf6; 
                font-size: 18px; 
                font-weight: bold; 
                margin: 0 0 8px 0;
                line-height: 1.4;
              ">${h.name}</h3>
              <p style="
                color: #64748b; 
                font-size: 13px; 
                margin: 0;
                line-height: 1.5;
              ">${h.description || ""}</p>
            </div>
          </div>`
        );

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat]) // Mapbox uses [lng, lat]
          .setPopup(popup)
          .addTo(mapInstanceRef.current!);

        markersRef.current.push(marker);
      });
    }
  };

  // Khi layer thay đổi thì vẽ lại
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    renderLayers();
  }, [layer, tours, destinations, events, hotels]);

  return (
    <>
      <style>{popupStyles}</style>
      <div className="w-[900px] h-[600px] relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-gray-200">
        <div
          ref={mapRef}
          className="w-full h-full rounded-lg"
          style={{ height: "600px" }}
        />
      </div>
    </>
  );
}

export default InteractiveMap;

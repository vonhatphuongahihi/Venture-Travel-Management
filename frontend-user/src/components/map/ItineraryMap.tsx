import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Navigation } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TourRoute, TourStop } from "@/types/tourDetailType";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface ItineraryMapProps {
    tourStop: TourStop[];
    tourRoute: TourRoute | null;
    pickUpPoint?: string;
    pickUpGeom?: [number, number];
    endPoint?: string;
    endPointGeom?: [number, number];
    onStopClick?: (geom: [number, number]) => void;
}

export default function ItineraryMap({
    tourStop,
    tourRoute,
    pickUpPoint,
    pickUpGeom,
    endPoint,
    endPointGeom,
    onStopClick,
}: ItineraryMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Set Mapbox token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Handle stop click - zoom to stop and call callback
    const handleStopClick = (geom: [number, number]) => {
        if (!mapInstanceRef.current) return;
        const [lng, lat] = geom;

        mapInstanceRef.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 1500,
        });

        if (onStopClick) {
            onStopClick(geom);
        }
    };

    // Render map markers and route
    const renderMap = () => {
        if (!mapInstanceRef.current) return;

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        if (mapInstanceRef.current.getLayer('route-glow')) {
            mapInstanceRef.current.removeLayer('route-glow');
        }
        if (mapInstanceRef.current.getLayer('route')) {
            mapInstanceRef.current.removeLayer('route');
        }
        if (mapInstanceRef.current.getSource('route')) {
            mapInstanceRef.current.removeSource('route');
        }

        const allCoordinates: [number, number][] = [];

        // Add pickup point marker
        if (pickUpGeom && pickUpGeom[0] !== 0 && pickUpGeom[1] !== 0) {
            const el = document.createElement('div');
            el.className = 'start-end-marker';
            el.innerHTML = `
        <div style="
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5), 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #1a1a1a;
          font-size: 11px;
          letter-spacing: 0.5px;
        ">BĐ</div>
      `;

            const marker = new mapboxgl.Marker(el)
                .setLngLat([pickUpGeom[0], pickUpGeom[1]])
                .setPopup(new mapboxgl.Popup().setHTML(`<div class="p-2"><strong>Điểm khởi hành</strong><br/>${pickUpPoint || 'Điểm đón'}</div>`))
                .addTo(mapInstanceRef.current);

            markersRef.current.push(marker);
            allCoordinates.push([pickUpGeom[0], pickUpGeom[1]]);
        }

        // Add tour stop markers
        tourStop.forEach((stop) => {
            const [lng, lat] = stop.attractionGeom;
            if (lng === 0 && lat === 0) return;

            const el = document.createElement('div');
            el.className = 'stop-marker';
            el.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #26B8ED 0%, #1a9bc7 100%);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(38, 184, 237, 0.4), 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          ${stop.stopOrder}
        </div>
      `;

            // Add click handler to marker
            el.addEventListener('click', () => {
                handleStopClick([lng, lat]);
            });

            const marker = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<div class="p-2"><strong>Điểm dừng ${stop.stopOrder}</strong><br/>${stop.attractionName}</div>`
                    )
                )
                .addTo(mapInstanceRef.current);

            markersRef.current.push(marker);
            allCoordinates.push([lng, lat]);
        });

        // Add end point marker
        if (endPointGeom && endPointGeom[0] !== 0 && endPointGeom[1] !== 0) {
            const el = document.createElement('div');
            el.className = 'start-end-marker';
            el.innerHTML = `
        <div style="
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5), 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #1a1a1a;
          font-size: 11px;
          letter-spacing: 0.5px;
        ">KT</div>
      `;

            const marker = new mapboxgl.Marker(el)
                .setLngLat([endPointGeom[0], endPointGeom[1]])
                .setPopup(new mapboxgl.Popup().setHTML(`<div class="p-2"><strong>Điểm kết thúc</strong><br/>${endPoint || 'Điểm đến'}</div>`))
                .addTo(mapInstanceRef.current);

            markersRef.current.push(marker);
            allCoordinates.push([endPointGeom[0], endPointGeom[1]]);
        }

        // Add route line if available
        if (tourRoute && tourRoute.geom && tourRoute.geom.length > 0) {
            const routeCoordinates = tourRoute.geom.map(([lng, lat]) => [lng, lat]);

            mapInstanceRef.current.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: routeCoordinates,
                    },
                },
            });

            // Add a subtle glow effect for the route (background layer)
            mapInstanceRef.current.addLayer({
                id: 'route-glow',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#26B8ED',
                    'line-width': 8,
                    'line-opacity': 0.25,
                },
            });

            // Add main route line on top
            mapInstanceRef.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#26B8ED',
                    'line-width': 5,
                    'line-opacity': 0.95,
                },
            });
        }

        // Fit bounds to show all markers
        if (allCoordinates.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            allCoordinates.forEach(coord => {
                bounds.extend(coord as [number, number]);
            });

            mapInstanceRef.current.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                maxZoom: 15,
            });
        }
    };

    // Initialize map
    useEffect(() => {
        if (!mapRef.current) return;

        let isMounted = true;

        const initMap = () => {
            if (!mapRef.current) {
                console.error('Map container not found');
                return;
            }

            // Remove existing map if any
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }

            // Get initial center from first stop or default
            const initialCenter: [number, number] = tourStop.length > 0 && tourStop[0].attractionGeom[0] !== 0
                ? [tourStop[0].attractionGeom[0], tourStop[0].attractionGeom[1]]
                : [108.2772, 14.0583];
            try {
                mapInstanceRef.current = new mapboxgl.Map({
                    container: mapRef.current,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: initialCenter,
                    zoom: 10,
                    attributionControl: false,
                });

                mapInstanceRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

                mapInstanceRef.current.addControl(
                    new mapboxgl.AttributionControl({
                        compact: true,
                    }),
                    'bottom-right'
                );

                mapInstanceRef.current.on('load', () => {
                    if (isMounted) {
                        setMapLoaded(true);
                        renderMap();
                    }
                });

                mapInstanceRef.current.on('error', (e: any) => {
                    console.error('Mapbox error:', e);
                });
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        initMap();

        return () => {
            isMounted = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
        };
    }, []);

    // Re-render map when data changes
    useEffect(() => {
        if (mapLoaded && mapInstanceRef.current && mapInstanceRef.current.loaded()) {
            renderMap();
        }
    }, [tourStop, tourRoute, pickUpGeom, endPointGeom, pickUpPoint, endPoint, mapLoaded]);

    const recenterItinerary = () => {
        if (!mapInstanceRef.current || tourStop.length === 0) return;

        const allCoordinates: [number, number][] = [];

        if (pickUpGeom && pickUpGeom[0] !== 0 && pickUpGeom[1] !== 0) {
            allCoordinates.push([pickUpGeom[0], pickUpGeom[1]]);
        }

        tourStop.forEach(stop => {
            if (stop.attractionGeom[0] !== 0 && stop.attractionGeom[1] !== 0) {
                allCoordinates.push([stop.attractionGeom[0], stop.attractionGeom[1]]);
            }
        });

        if (endPointGeom && endPointGeom[0] !== 0 && endPointGeom[1] !== 0) {
            allCoordinates.push([endPointGeom[0], endPointGeom[1]]);
        }

        if (allCoordinates.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            allCoordinates.forEach(coord => {
                bounds.extend(coord as [number, number]);
            });

            mapInstanceRef.current.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                maxZoom: 15,
                duration: 1000,
            });
        }
    };

    return (
        <div className="w-full h-[600px] relative bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Button
                    onClick={recenterItinerary}
                    className="bg-white hover:bg-gray-50 text-gray-700 shadow-md border border-gray-200"
                    size="sm"
                >
                    <Navigation className="w-4 h-4 mr-2" />
                    Định vị lại hành trình
                </Button>
            </div>
            <div ref={mapRef} className="w-full h-full" style={{ minHeight: '600px' }} />
            {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải bản đồ...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

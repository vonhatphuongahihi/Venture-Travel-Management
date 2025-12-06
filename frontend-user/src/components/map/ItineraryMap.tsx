import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Navigation } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TourRoute, TourStop } from "@/types/tourDetailType";
import RouteAPI from "@/services/routeAPI";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface ItineraryMapProps {
    tourId?: string;
    tourStop: TourStop[];
    tourRoute: TourRoute | null;
    pickUpPoint?: string;
    pickUpGeom?: [number, number];
    endPoint?: string;
    endPointGeom?: [number, number];
    onStopClick?: (geom: [number, number]) => void;
}

export default function ItineraryMap({
    tourId,
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
    const markerElementsRef = useRef<Map<number, HTMLElement>>(new Map());
    const [mapLoaded, setMapLoaded] = useState(false);
    const [detailedRoute, setDetailedRoute] = useState<Array<{ longitude: number; latitude: number }> | null>(null);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const [activeMarker, setActiveMarker] = useState<number | null>(null);

    // Set Mapbox token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Fetch detailed route from API
    useEffect(() => {
        if (!tourId) {
            console.log('🔴 No tourId provided');
            setIsLoadingRoute(false);
            return;
        }

        const fetchDetailedRoute = async () => {
            setIsLoadingRoute(true);
            try {
                const response = await RouteAPI.getTourRoute(tourId);
                console.log('🟢 Route API Response:', response);

                if (response.success && response.data && response.data.fullRoute) {
                    console.log('✅ Route data received:');
                    console.log('  - Route points:', response.data.routePoints);
                    console.log('  - Route segments:', response.data.routeSegments);
                    console.log('  - Full route length:', response.data.fullRoute?.length);
                    console.log('  - Full route:', response.data.fullRoute);
                    console.log('🔧 Setting detailedRoute state...');
                    setDetailedRoute(response.data.fullRoute);
                    console.log('✅ DetailedRoute state set!');
                } else {
                    console.log('⚠️ Route API failed or no fullRoute:', response.message, response.data);
                    setDetailedRoute(null);
                }
            } catch (error) {
                console.error('🔴 Error fetching detailed route:', error);
                setDetailedRoute(null);
            } finally {
                setIsLoadingRoute(false);
            }
        };

        fetchDetailedRoute();
    }, [tourId]);

    // Handle stop click - zoom to stop and call callback
    const handleStopClick = (geom: [number, number]) => {
        if (!mapInstanceRef.current) return;
        const [lng, lat] = geom;

        mapInstanceRef.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 1500,
            essential: true,
        });

        if (onStopClick) {
            onStopClick(geom);
        }
    };

    // Render map markers and route
    const renderMap = () => {
        if (!mapInstanceRef.current) return;

        console.log('🗺️ renderMap called, detailedRoute:', detailedRoute?.length || 'null');

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
            el.className = 'pickup-marker';
            el.style.cursor = 'pointer';
            el.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5), 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div class="pickup-label" style="
            background: white;
            padding: 6px 12px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            font-weight: bold;
            color: #10b981;
            font-size: 14px;
            white-space: nowrap;
            pointer-events: none;
          ">
            ${pickUpPoint || 'Điểm đón'}
          </div>
        </div>
      `;

            // Add click handler to zoom to pickup point
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo({
                        center: [pickUpGeom[0], pickUpGeom[1]],
                        zoom: 14,
                        duration: 1500,
                    });
                }
            });

            const marker = new mapboxgl.Marker(el)
                .setLngLat([pickUpGeom[0], pickUpGeom[1]])
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
            const isActive = activeMarker === stop.stopOrder;

            el.innerHTML = `
        <div style="position: relative; display: inline-block;">
          <div class="marker-circle" data-stop-order="${stop.stopOrder}" style="
            width: 44px;
            height: 44px;
            background: ${isActive ? 'white' : '#26B8ED'};
            border-radius: 50%;
            border: 3px solid #26B8ED;
            box-shadow: 0 4px 12px rgba(38, 184, 237, 0.4), 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: ${isActive ? '#26B8ED' : 'white'};
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            transform: ${isActive ? 'scale(1.15)' : 'scale(1)'};
            position: relative;
            z-index: 2;
          ">
            ${stop.stopOrder}
          </div>
          <div class="marker-tooltip" data-stop-order="${stop.stopOrder}" style="
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-8px);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 10;
            margin-bottom: 4px;
          ">
            ${stop.attractionName}
            <div style="
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid rgba(0, 0, 0, 0.85);
            "></div>
          </div>
        </div>
      `;

            // Store element reference
            markerElementsRef.current.set(stop.stopOrder, el);

            // Add hover handlers to show/hide tooltip
            const tooltip = el.querySelector('.marker-tooltip') as HTMLElement;
            const circle = el.querySelector('.marker-circle') as HTMLElement;

            if (circle && tooltip) {
                circle.addEventListener('mouseenter', () => {
                    tooltip.style.opacity = '1';
                });

                circle.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                });
            }

            // Add click handler to marker
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveMarker(stop.stopOrder);
                handleStopClick([lng, lat]);
            });

            const marker = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
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
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5), 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 20px;
        ">🏁</div>
      `;

            const marker = new mapboxgl.Marker(el)
                .setLngLat([endPointGeom[0], endPointGeom[1]])
                .addTo(mapInstanceRef.current);

            markersRef.current.push(marker);
            allCoordinates.push([endPointGeom[0], endPointGeom[1]]);
        }

        // Add route line - ONLY use detailed route from API, don't show anything while loading
        let routeCoordinates: [number, number][] = [];

        if (!isLoadingRoute && detailedRoute && detailedRoute.length > 0) {
            // Use detailed route from database (arcs + arc_points)
            console.log('🟢 Using detailed route from API:', detailedRoute.length, 'points');
            console.log('🔍 First 5 points of detailedRoute:', detailedRoute.slice(0, 5));
            console.log('🔍 Last 5 points of detailedRoute:', detailedRoute.slice(-5));
            routeCoordinates = detailedRoute.map(coord => [coord.longitude, coord.latitude]);
            console.log('🔍 First 5 routeCoordinates:', routeCoordinates.slice(0, 5));
        } else if (isLoadingRoute) {
            console.log('⏳ Route is loading, not displaying anything yet...');
        } else {
            console.log('🔴 No route data available');
        }

        console.log('📍 Final route coordinates:', routeCoordinates.length, 'points');

        if (routeCoordinates.length > 0) {
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

        // Fit bounds to show all markers - only if map is not currently moving
        if (allCoordinates.length > 0) {
            // Check if map is currently animating/moving
            const isMoving = mapInstanceRef.current.isMoving();
            if (!isMoving) {
                const bounds = new mapboxgl.LngLatBounds();
                allCoordinates.forEach(coord => {
                    bounds.extend(coord as [number, number]);
                });

                mapInstanceRef.current.fitBounds(bounds, {
                    padding: { top: 50, bottom: 50, left: 50, right: 50 },
                    maxZoom: 15,
                    duration: 0, // Instant to prevent conflicts with click handlers
                });
            }
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

    // Update marker styles when activeMarker changes
    useEffect(() => {
        markerElementsRef.current.forEach((el, stopOrder) => {
            const circle = el.querySelector('.marker-circle') as HTMLElement;
            if (circle) {
                const isActive = activeMarker === stopOrder;
                circle.style.background = isActive ? 'white' : '#26B8ED';
                circle.style.color = isActive ? '#26B8ED' : 'white';
                circle.style.transform = isActive ? 'scale(1.15)' : 'scale(1)';
            }
        });
    }, [activeMarker]);

    // Re-render map when data changes
    useEffect(() => {
        if (mapLoaded && mapInstanceRef.current && mapInstanceRef.current.loaded()) {
            renderMap();
        }
    }, [tourStop, tourRoute, pickUpGeom, endPointGeom, pickUpPoint, endPoint, mapLoaded, detailedRoute]);

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

            {/* Map loading */}
            {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải bản đồ...</p>
                    </div>
                </div>
            )}

            {/* Route loading overlay */}
            {mapLoaded && isLoadingRoute && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="text-center bg-white p-6 rounded-lg shadow-lg">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                        <p className="text-gray-700 font-medium">Đang tải tuyến đường...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PickUpAreaMapProps {
    pickupPoint: [number, number]; // [lng, lat]
    pickupAreaCoordinates: [number, number][]; // array of [lng, lat]
}

export default function PickUpAreaMap({ pickupPoint, pickupAreaCoordinates }: PickUpAreaMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current || !pickupAreaCoordinates || pickupAreaCoordinates.length === 0) return;

        const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!MAPBOX_TOKEN) {
            console.error('Mapbox token not found');
            return;
        }

        mapboxgl.accessToken = MAPBOX_TOKEN;

        // Initialize map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: pickupPoint[0] !== 0 && pickupPoint[1] !== 0 ? pickupPoint : pickupAreaCoordinates[0],
            zoom: 13,
        });

        mapInstanceRef.current = map;

        map.on('load', () => {
            // Add polygon for pickup area
            if (pickupAreaCoordinates.length > 0) {
                // Create a closed polygon by adding the first point at the end
                const coordinates = [...pickupAreaCoordinates, pickupAreaCoordinates[0]];

                map.addSource('pickup-area', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Polygon',
                            coordinates: [coordinates],
                        },
                    },
                });

                // Add fill layer (green with transparency)
                map.addLayer({
                    id: 'pickup-area-fill',
                    type: 'fill',
                    source: 'pickup-area',
                    paint: {
                        'fill-color': '#10b981',
                        'fill-opacity': 0.3,
                    },
                });

                // Add border layer
                map.addLayer({
                    id: 'pickup-area-border',
                    type: 'line',
                    source: 'pickup-area',
                    paint: {
                        'line-color': '#059669',
                        'line-width': 3,
                    },
                });

                // Fit map to polygon bounds
                const bounds = new mapboxgl.LngLatBounds();
                pickupAreaCoordinates.forEach((coord) => {
                    bounds.extend(coord);
                });
                map.fitBounds(bounds, { padding: 50 });
            }

            // Add pickup point marker if available
            if (pickupPoint[0] !== 0 && pickupPoint[1] !== 0) {
                const el = document.createElement('div');
                el.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5), 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          ">
            📍
          </div>
        `;

                new mapboxgl.Marker(el)
                    .setLngLat(pickupPoint)
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }).setHTML(
                            `<div style="padding: 8px; font-family: 'Inter', sans-serif;">
                <p style="margin: 0; font-weight: 600; color: #10b981;">Điểm đón</p>
              </div>`
                        )
                    )
                    .addTo(map);
            }

        });

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [pickupPoint, pickupAreaCoordinates]);

    if (!pickupAreaCoordinates || pickupAreaCoordinates.length === 0) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                Không có thông tin vùng đón miễn phí
            </div>
        );
    }

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-64 rounded-lg shadow-md border border-gray-200"
        />
    );
}


import { Compass, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProvinceAPI from "@/services/provinceAPI";
import AttractionAPI, { Attraction } from "@/services/attractionAPI";
import { Button } from "@/components/ui/button";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Province {
  id: string;
  name: string;
  region: string;
  point?: {
    long: number;
    lat: number;
  };
}

const ProvinceMapSection = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Fetch provinces and attractions from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [provincesData, attractionsData] = await Promise.all([
          ProvinceAPI.getProvinces(),
          AttractionAPI.getAttractions({ limit: 1000 })
        ]);
        setProvinces(provincesData);
        setAttractions(attractionsData.attractions.filter(a => a.coordinates));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render map markers for attractions
  const renderMap = () => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    attractions.forEach((attraction) => {
      if (!attraction.coordinates) return;

      const { lat, lon } = attraction.coordinates;
      if (!lat || !lon) return;

      const el = document.createElement('div');
      el.className = 'attraction-marker';
      el.innerHTML = `
        <div style="
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #26B8ED 0%, #1a9bc7 100%);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(38, 184, 237, 0.4), 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `;

      const popupContent = `
        <div class="p-3" style="max-width: 320px;">
          ${attraction.image ? `
            <img src="${attraction.image}" alt="${attraction.name}" 
                 style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          ` : ''}
          <strong class="text-primary text-base font-bold">${attraction.name}</strong>
          <p class="text-sm text-gray-600 mt-1 mb-2">${attraction.address}</p>
          ${attraction.category ? `
            <span class="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full mb-2">
              ${attraction.category}
            </span>
          ` : ''}
          ${attraction.description ? `
            <p class="text-xs text-gray-500 mt-2 line-clamp-2">${attraction.description}</p>
          ` : ''}
          ${attraction.rating ? `
            <div class="flex items-center gap-1 mt-2">
              <span class="text-yellow-500 text-xs">★</span>
              <span class="text-xs text-gray-600">${attraction.rating.toFixed(1)}</span>
              ${attraction.reviewCount ? `<span class="text-xs text-gray-500">(${attraction.reviewCount})</span>` : ''}
            </div>
          ` : ''}
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lon, lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(mapInstanceRef.current);

      // Add click event to zoom in when marker is clicked
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mapInstanceRef.current) {
          // Close all other popups first
          markersRef.current.forEach(m => {
            const popup = m.getPopup();
            if (popup && popup.isOpen() && m !== marker) {
              popup.remove();
            }
          });

          // Fly to the marker location with zoom
          mapInstanceRef.current.flyTo({
            center: [lon, lat],
            zoom: 14,
            duration: 1500,
            essential: true
          });

          marker.togglePopup();
        }
      });

      markersRef.current.push(marker);
    });

    if (attractions.length > 0 && attractions.some(a => a.coordinates)) {
      const bounds = new mapboxgl.LngLatBounds();
      attractions.forEach((attraction) => {
        if (attraction.coordinates) {
          bounds.extend([attraction.coordinates.lon, attraction.coordinates.lat]);
        }
      });

      mapInstanceRef.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 10,
      });
    }
  };

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapRef.current || loading) return;

    let isMounted = true;

    // Set Mapbox token
    mapboxgl.accessToken = MAPBOX_TOKEN;

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

      try {
        mapInstanceRef.current = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [108.2772, 14.0583], // Vietnam center
          zoom: 5,
          attributionControl: false,
        });

        // Add navigation controls
        mapInstanceRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        // Add attribution
        mapInstanceRef.current.addControl(
          new mapboxgl.AttributionControl({
            compact: true,
          }),
          'bottom-right'
        );

        // Wait for map to load
        mapInstanceRef.current.on('load', () => {
          if (isMounted) {
            setMapLoaded(true);
            renderMap();
          }
        });

        // Close popup when clicking on the map
        mapInstanceRef.current.on('click', (e: any) => {
          // Close all popups when clicking on the map (not on a marker)
          markersRef.current.forEach(marker => {
            const popup = marker.getPopup();
            if (popup && popup.isOpen()) {
              popup.remove();
            }
          });
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
  }, [loading]);

  // Re-render markers when attractions change
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current) {
      renderMap();
    }
  }, [attractions, mapLoaded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Calculate center point for a province based on its attractions
  const getProvinceCenter = (provinceName: string): [number, number] | null => {
    const provinceAttractions = attractions.filter(
      a => a.provinceName === provinceName && a.coordinates
    );

    if (provinceAttractions.length === 0) {
      // Try to find province by ID
      const province = provinces.find(p => p.name === provinceName);
      if (province?.point && province.point.long !== 0 && province.point.lat !== 0) {
        return [province.point.long, province.point.lat];
      }
      return null;
    }

    // Calculate average coordinates
    const avgLon = provinceAttractions.reduce((sum, a) => sum + (a.coordinates?.lon || 0), 0) / provinceAttractions.length;
    const avgLat = provinceAttractions.reduce((sum, a) => sum + (a.coordinates?.lat || 0), 0) / provinceAttractions.length;

    return [avgLon, avgLat];
  };

  // Handle province click - fly to province
  const handleProvinceClick = (provinceName: string) => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    const center = getProvinceCenter(provinceName);
    if (!center) {
      console.warn(`No coordinates found for province: ${provinceName}`);
      return;
    }

    // Get all attractions for this province
    const provinceAttractions = attractions.filter(
      a => a.provinceName === provinceName && a.coordinates
    );

    if (provinceAttractions.length > 0) {
      // Fit bounds to show all attractions in the province
      const bounds = new mapboxgl.LngLatBounds();
      provinceAttractions.forEach((attraction) => {
        if (attraction.coordinates) {
          bounds.extend([attraction.coordinates.lon, attraction.coordinates.lat]);
        }
      });

      mapInstanceRef.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 12,
        duration: 1500,
      });
    } else {
      // Just fly to center if no attractions
      mapInstanceRef.current.flyTo({
        center: center,
        zoom: 10,
        duration: 1500,
        essential: true
      });
    }
  };

  // Group provinces by region with full province objects
  const regions = [
    {
      id: "north",
      name: "Miền Bắc",
      provinces: provinces
        .filter(p => p.region === "Bắc Bộ")
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    {
      id: "central",
      name: "Miền Trung",
      provinces: provinces
        .filter(p => p.region === "Trung Bộ")
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    {
      id: "south",
      name: "Miền Nam",
      provinces: provinces
        .filter(p => p.region === "Nam Bộ")
        .sort((a, b) => a.name.localeCompare(b.name))
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="container">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-yellow-200 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Compass className="h-4 w-4" />
            Khám phá
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ĐỊA ĐIỂM DU LỊCH 63 TỈNH THÀNH
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Trải nghiệm du lịch khắp 63 tỉnh thành Việt Nam, khám phá các địa danh đặc sắc và những nét văn hóa độc đáo của từng vùng miền
          </p>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Left Side - Map */}
            <div>
              <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-gray-200">
                <div className="relative w-full rounded-lg overflow-hidden" style={{ minHeight: '600px', height: '600px' }}>
                  <div ref={mapRef} className="w-full h-full" />
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải bản đồ...</p>
                      </div>
                    </div>
                  )}
                  {mapLoaded && (
                    <div className="absolute top-4 left-4 z-10">
                      <Button
                        onClick={() => {
                          if (mapInstanceRef.current && attractions.length > 0) {
                            const bounds = new mapboxgl.LngLatBounds();
                            attractions.forEach((attraction) => {
                              if (attraction.coordinates) {
                                bounds.extend([attraction.coordinates.lon, attraction.coordinates.lat]);
                              }
                            });
                            mapInstanceRef.current.fitBounds(bounds, {
                              padding: { top: 50, bottom: 50, left: 50, right: 50 },
                              maxZoom: 10,
                              duration: 1000,
                            });
                          }
                        }}
                        className="bg-white hover:bg-gray-50 text-gray-700 shadow-md border border-gray-200"
                        size="sm"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Hiển thị tất cả
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {attractions.length} điểm đến trên bản đồ
                </p>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Khám phá 3 miền Việt Nam
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Việt Nam mở ra như một bức tranh sống động trải dài khắp ba miền, mỗi miền sở hữu vẻ đẹp riêng biệt. Tất cả cùng dệt nên một câu chuyện tuyệt đẹp về thiên nhiên, văn hóa và những cuộc phiêu lưu.
                </p>
              </div>

              {/* Regions List */}
              <div className="space-y-6">
                {regions.map((region) => {
                  if (region.provinces.length === 0) return null;

                  return (
                    <div key={region.id}>
                      <h4 className="text-xl font-bold text-primary mb-3 relative">
                        {region.name}
                        <div className="absolute top-7 left-0 w-[60px] h-1 bg-primary mt-1"></div>
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {region.provinces.map((province, index) => {
                          const hasAttractions = attractions.some(a => a.provinceName === province.name);
                          return (
                            <div
                              key={province.id || index}
                              onClick={() => handleProvinceClick(province.name)}
                              className={`text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-200 ${hasAttractions
                                ? ''
                                : 'opacity-60 cursor-not-allowed'
                                }`}
                              title={hasAttractions ? `Xem ${province.name} trên bản đồ` : 'Chưa có điểm đến'}
                            >
                              {province.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProvinceMapSection;
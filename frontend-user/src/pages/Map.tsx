import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  LandPlot,
  Layers,
  MapPin,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import InteractiveMap from "@/components/map/InteractiveMap";
import {
  TourType,
  DestinationType,
} from "@/types/mapType";
import { tourService } from "@/services/tour.service";
import AttractionAPI from "@/services/attractionAPI";
import RouteAPI from "@/services/routeAPI";
import ProvinceAPI from "@/services/provinceAPI";
import { useTranslation } from "react-i18next";

type Layer = "tour" | "destination";
type Area = "all" | "north" | "centre" | "south";

type FilterData = Record<Layer, number>;
type FilterState = Record<Area, FilterData>;

const Map = () => {
  const { t } = useTranslation();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const [destinations, setDestinations] = useState<DestinationType[]>([]);
  const [tours, setTours] = useState<TourType[]>([]);
  const [filter, setFilter] = useState<FilterState>({
    all: { tour: 0, destination: 0 },
    north: { tour: 0, destination: 0 },
    centre: { tour: 0, destination: 0 },
    south: { tour: 0, destination: 0 },
  });

  const [currentLayer, setCurrentLayer] = useState("tour" as Layer);
  const [currentArea, setCurrentArea] = useState("all" as Area);

  const getRegionFromProvince = (provinceName: string): "north" | "centre" | "south" => {
    const northProvinces = ['Hà Nội', 'Hải Phòng', 'Quảng Ninh', 'Hạ Long', 'Ninh Bình', 'Sa Pa', 'Mộc Châu', 'Hà Giang', 'Bắc Kạn', 'Cao Bằng', 'Yên Bái', 'Lạng Sơn', 'Thái Nguyên', 'Hòa Bình'];
    const centreProvinces = ['Đà Nẵng', 'Hội An', 'Huế', 'Quảng Bình', 'Quảng Trị', 'Nha Trang', 'Đà Lạt'];

    if (northProvinces.some(p => provinceName.includes(p))) return 'north';
    if (centreProvinces.some(p => provinceName.includes(p))) return 'centre';
    return 'south';
  };

  const fetch = async () => {
    setLoading(true);
    try {
      // Fetch tours
      const toursResponse = await tourService.getAllTours({ limit: 1000 });
      const toursData = toursResponse.tours;

      // Fetch destinations/attractions
      const attractionsResponse = await AttractionAPI.getAttractions({ limit: 1000 });
      const attractionsData = attractionsResponse.attractions;

      // Fetch provinces để map region
      const provinces = await ProvinceAPI.getProvinces();

      // Fetch routes for tours và convert to TourType
      const resTours: TourType[] = await Promise.all(
        toursData.map(async (tour) => {
          try {
            const routeResponse = await RouteAPI.getTourRoute(tour.id);
            let coords: [number, number][] = [];
            let region: "north" | "centre" | "south" = 'south';
            let locationName = '';

            if (routeResponse.success && routeResponse.data?.fullRoute && routeResponse.data.fullRoute.length > 0) {
              // Lưu toàn bộ route để có thể vẽ trên map
              coords = routeResponse.data.fullRoute.map(point => [point.latitude, point.longitude] as [number, number]);

              // Lấy region từ routePoints (stops) thay vì tour.location
              if (routeResponse.data.routePoints && routeResponse.data.routePoints.length > 0) {
                // Lấy điểm stop đầu tiên (không phải pickup)
                const firstStop = routeResponse.data.routePoints.find(p => p.type === 'stop');
                if (firstStop && firstStop.attractionName) {
                  // Tìm attraction để lấy province
                  const attraction = attractionsData.find(a => a.name === firstStop.attractionName);
                  if (attraction) {
                    const province = provinces.find(p => p.id === attraction.provinceId);
                    if (province) {
                      region = getRegionFromProvince(province.name);
                      locationName = province.name;
                    }
                  }
                }
              }
            }

            // Fallback: nếu không tìm được region từ stops, dùng tour.location
            if (!locationName) {
              const province = provinces.find(p => p.id === tour.location);
              if (province) {
                region = getRegionFromProvince(province.name);
                locationName = province.name;
              }
            }

            return {
              tourId: tour.id,
              name: tour.title,
              description: tour.description || '',
              region,
              coords,
              image: tour.image || '',
              location: locationName,
            };
          } catch (error) {
            console.error(`Error fetching route for tour ${tour.id}:`, error);
            const province = provinces.find(p => p.id === tour.location);
            const region = province ? getRegionFromProvince(province.name) : 'south';
            return {
              tourId: tour.id,
              name: tour.title,
              description: tour.description || '',
              region,
              coords: [],
              image: tour.image || '',
              location: province?.name || '',
            };
          }
        })
      );

      // Convert attractions to destinations
      const resDest: DestinationType[] = attractionsData.map(attraction => {
        const province = provinces.find(p => p.id === attraction.provinceId);
        const region = province ? getRegionFromProvince(province.name) : 'south';

        // Get coordinates from attraction coordinates if available
        let coords: [number, number] = [0, 0];
        if (attraction.coordinates) {
          coords = [attraction.coordinates.lat, attraction.coordinates.lon];
        }

        return {
          name: attraction.name,
          description: attraction.description || attraction.address || '',
          region,
          coords,
          image: attraction.images?.[0] || '',
          address: attraction.address || '',
        };
      }).filter(dest => dest.coords[0] !== 0 && dest.coords[1] !== 0);

      setDestinations(resDest);
      setTours(resTours);
      setFilter(buildFilter(resTours, resDest));
      setIsPageLoaded(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching map data:', error);
      setLoading(false);
    }
  };

  const buildFilter = (
    tours: TourType[],
    destinations: DestinationType[],
  ): FilterState => {
    const count = (arr: { region: string }[], region: string) =>
      arr.filter((item) => item.region === region).length;
    const regions: Area[] = ["all", "north", "centre", "south"];
    const data: FilterState = {} as FilterState;
    regions.forEach((region) => {
      data[region] = {
        tour: region === "all" ? tours.length : count(tours, region),
        destination:
          region === "all" ? destinations.length : count(destinations, region),
      };
    });
    return data;
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="flex flex-col min-h-screen space-y-10">
      <Header />
      {/*Title*/}
      <div
        className={`flex flex-col text-center justify-center font-['Inter'] transition-all duration-1000 delay-200 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold">
          {t("map.title")}
        </h2>
        <p className="text-[#7b8b9d] text-lg mt-4">
          {t("map.description")}
        </p>
      </div>
      {/*Main*/}
      <div
        className={`flex self-center w-4/5 h-full justify-between transition-all duration-1000 delay-200 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <div className="flex flex-col space-y-4">
          {/*Ô chọn Lớp bản đồ*/}
          <div className="w-[300px] bg-white outline outline-1 outline-[#26B8ED] rounded-xl p-5 space-y-2">
            <div className="flex gap-4">
              <Layers className="w-4 h-4 mt-[4px] text-primary" />
              <p className="font-bold font-['Inter']">{t("map.mapLayers")}</p>
            </div>
            <Button
              className={`${currentLayer == "tour"
                ? "text-white bg-primary"
                : "text-black bg-white hover:bg-gray-200"
                } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentLayer("tour")}
            >
              <div className="flex space-x-2 justify-center align-center">
                <Send className="w-4 h-4 mt-[2px]" />
                <p className="font-['Inter']">{t("map.tours")}</p>
              </div>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter[currentArea]["tour"]}
                </div>
              </div>
            </Button>
            <Button
              className={`${currentLayer == "destination"
                ? "text-white bg-primary"
                : "text-black bg-white hover:bg-gray-200"
                } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentLayer("destination")}
            >
              <div className="flex space-x-2 justify-center align-center">
                <MapPin className="w-4 h-4 mt-[2px]" />
                <p className="font-normal font-['Inter']">{t("map.destinations")}</p>
              </div>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter[currentArea]["destination"]}
                </div>
              </div>
            </Button>
          </div>
          {/*Ô chọn Khu vực*/}
          <div className="w-[300px] bg-white outline outline-1 outline-[#26B8ED] rounded-xl p-5 space-y-2">
            <div className="flex gap-4">
              <LandPlot className="w-4 h-4 mt-[4px] text-primary" />
              <p className="font-bold font-['Inter']">{t("map.region")}</p>
            </div>
            <Button
              className={`${currentArea == "all"
                ? "text-white bg-primary"
                : "text-black bg-white hover:bg-gray-200"
                } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentArea("all")}
            >
              <p className="font-['Inter']">{t("map.all")}</p>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter["all"][currentLayer]}
                </div>
              </div>
            </Button>
            <Button
              className={`${currentArea == "north"
                ? "text-white bg-primary"
                : "text-black bg-white hover:bg-gray-200"
                } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentArea("north")}
            >
              <p className="font-normal font-['Inter']">{t("map.north")}</p>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter["north"][currentLayer]}
                </div>
              </div>
            </Button>
            <Button
              className={`${currentArea == "centre"
                ? "text-white bg-primary"
                : "text-black bg-white hover:bg-gray-200"
                } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentArea("centre")}
            >
              <p className="font-normal font-['Inter']">{t("map.central")}</p>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter["centre"][currentLayer]}
                </div>
              </div>
            </Button>
            <Button
              className={`${currentArea == "south"
                ? "text-white bg-primary"
                : "text-black bg-white hover:bg-gray-200"
                } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentArea("south")}
            >
              <p className="font-normal font-['Inter']">{t("map.south")}</p>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter["south"][currentLayer]}
                </div>
              </div>
            </Button>
          </div>
        </div>
        <div
          className={`w-[900px] h-[600px] rounded-[12px] ${isPageLoaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          <InteractiveMap
            area={currentArea}
            layer={currentLayer}
            tours={tours}
            destinations={destinations}
            events={[]}
            hotels={[]}
          />
        </div>
      </div>

      <div
        className={`transition-all duration-1000 delay-400 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Map;

import { Province } from "@/global.types";
import { MapPin, Map } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import WeatherForecast from "./WeatherForecast";
import FeaturedToursMap from "./FeaturedToursMap";
import MiniProvinceMap from "./MiniProvinceMap";
import { useNavigate, useSearchParams } from "react-router-dom";

interface WeatherCardProps {
  province: Province;
}

const WeatherSection = ({ province }: WeatherCardProps) => {
  // Use province coordinates or fallback to Ho Chi Minh City
  const coordinates = useMemo(() => {
    if (province.point && province.point.lat && province.point.long) {
      return province.point;
    }
    return { lat: 10.8231, long: 106.6297 }; // Ho Chi Minh City
  }, [province.point]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showMap, setShowMap] = useState(false);

  const openMap = () => {
    navigate(window.location.pathname + "?openMap=true");
  };

  return (
    <section>
      <div className="">
        <h2 className="text-2xl font-semibold mb-6">
          Thông tin ngắn về {province.name}
        </h2>

        <Card className="overflow-hidden rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Dự báo thời tiết 7 ngày tới
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <WeatherForecast
              className="md:col-span-3"
              lat={coordinates.lat}
              long={coordinates.long}
            />

            {/* Map Column */}
            <div className="bg-white px-5 rounded-2xl flex flex-col gap-3">
              <div className="h-[186px] w-full">
                <MiniProvinceMap
                  lat={coordinates.lat}
                  lng={coordinates.long}
                  onClick={openMap}
                  className="w-full h-full"
                />
              </div>

              <Button
                className="w-full bg-white border border-gray-200 text-primary hover:bg-gray-50 rounded-2xl group"
                onClick={openMap}
              >
                <Map className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Xem các tour nổi bật
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {searchParams.get("openMap") && Boolean(searchParams.get("openMap")) && (
        <FeaturedToursMap
          provinceId={province.id}
          center={coordinates}
          onClose={() => navigate(window.location.pathname)}
        />
      )}
    </section>
  );
};

export default WeatherSection;

import { Province } from "@/global.types";
import { MapPin } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface WeatherCardProps {
  province: Province;
}

// Weather data
const weatherSeasons = [
  {
    season: "THG 6 - THG 8",
    highTemp: "22°",
    lowTemp: "11°",
    description: "Mùa hè - thời tiết mát mẻ",
  },
  {
    season: "THG 9 - THG 11",
    highTemp: "19°",
    lowTemp: "11°",
    description: "Mùa thu - thời tiết mát mẻ",
  },
  {
    season: "THG 12 - THG 2",
    highTemp: "15°",
    lowTemp: "7°",
    description: "Mùa đông - có thể có tuyết rơi",
  },
  {
    season: "THG 3 - THG 5",
    highTemp: "16°",
    lowTemp: "20°",
    description: "Mùa xuân - mùa hoa ban Tây Bắc",
  },
];

const WeatherSection = ({ province }: WeatherCardProps) => {
  return (
    <section>
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-semibold mb-6">
            Thông tin ngắn về {province.name}
          </h2>

          <Card className="overflow-hidden rounded-2xl">
            <div className="pt-7 px-5 pb-5">
              <h2 className="text-lg font-semibold">Thời tiết địa phương</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4">
              {weatherSeasons.map((season, index) => (
                <div key={index} className="flex-1 p-6 border-gray-200">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900 font-medium">
                      {season.season}
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-semibold text-gray-900">
                        {season.highTemp}
                      </span>
                      <span className="text-xl font-semibold text-gray-400">
                        {season.lowTemp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {season.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Map */}
        <div className="bg-white p-5 rounded-2xl">
          <Card className="h-[186px] relative overflow-hidden border border-gray-200 rounded-2xl">
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm">Bản đồ {province.name}</p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </Card>
          <Button className="w-full mt-3 bg-white border border-gray-200 text-primary hover:bg-gray-50 rounded-2xl">
            Xem các hoạt động nổi bật
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WeatherSection;

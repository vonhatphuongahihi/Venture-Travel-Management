import { useProvinceForecast } from "@/services/province/provinceHook";
import { Card } from "../ui/card";
import {
  Loader2,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
} from "lucide-react";
import { useMemo } from "react";

interface WeatherForecastProps {
  lat: number;
  long: number;
  className?: string;
}

// WMO Weather interpretation codes (WW)
const getWeatherIcon = (code: number) => {
  if (code === 0) return <Sun className="w-8 h-8 text-yellow-500" />; // Clear sky
  if (code === 1 || code === 2 || code === 3)
    return <Cloud className="w-8 h-8 text-gray-400" />; // Mainly clear, partly cloudy, and overcast
  if (code === 45 || code === 48)
    return <CloudFog className="w-8 h-8 text-gray-400" />; // Fog
  if (code >= 51 && code <= 55)
    return <CloudDrizzle className="w-8 h-8 text-blue-300" />; // Drizzle
  if (code >= 61 && code <= 67)
    return <CloudRain className="w-8 h-8 text-blue-500" />; // Rain
  if (code >= 71 && code <= 77)
    return <CloudSnow className="w-8 h-8 text-blue-200" />; // Snow
  if (code >= 80 && code <= 82)
    return <CloudRain className="w-8 h-8 text-blue-600" />; // Rain showers
  if (code >= 85 && code <= 86)
    return <CloudSnow className="w-8 h-8 text-blue-300" />; // Snow showers
  if (code >= 95) return <CloudLightning className="w-8 h-8 text-yellow-600" />; // Thunderstorm
  return <Sun className="w-8 h-8 text-yellow-500" />;
};

const getWeatherDescription = (code: number) => {
  switch (code) {
    case 0:
      return "Trời quang";
    case 1:
      return "Ít mây";
    case 2:
      return "Mây rải rác";
    case 3:
      return "Nhiều mây";
    case 45:
    case 48:
      return "Sương mù";
    case 51:
    case 53:
    case 55:
      return "Mưa phùn";
    case 61:
    case 63:
    case 65:
      return "Mưa";
    case 66:
    case 67:
      return "Mưa băng";
    case 71:
    case 73:
    case 75:
      return "Tuyết rơi";
    case 77:
      return "Tuyết hạt";
    case 80:
    case 81:
    case 82:
      return "Mưa rào";
    case 85:
    case 86:
      return "Tuyết rào";
    case 95:
    case 96:
    case 99:
      return "Dông";
    default:
      return "Không xác định";
  }
};

const WeatherForecast = ({ lat, long, className }: WeatherForecastProps) => {
  const { data: forecastData, isLoading } = useProvinceForecast(lat, long);

  const dailyForecast = useMemo(() => {
    if (!forecastData || !forecastData.daily) return [];

    const {
      time,
      weathercode,
      temperature_2m_max,
      temperature_2m_min,
      precipitation_sum,
    } = forecastData.daily;

    return time.map((dateStr: string, index: number) => ({
      date: new Date(dateStr).toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "numeric",
        month: "numeric",
      }),
      code: weathercode[index],
      maxTemp: temperature_2m_max[index],
      minTemp: temperature_2m_min[index],
      precip: precipitation_sum[index],
    }));
  }, [forecastData]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!dailyForecast.length) return null;

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {dailyForecast.map((day: any, index: number) => (
          <Card
            key={index}
            className="p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <span className="text-sm font-medium text-gray-500 mb-2">
              {day.date}
            </span>
            <div className="mb-2">{getWeatherIcon(day.code)}</div>
            <span className="text-xs text-gray-500 mb-2 h-8 flex items-center justify-center">
              {getWeatherDescription(day.code)}
            </span>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">
                {Math.round(day.maxTemp)}°
              </span>
              <span className="text-sm text-gray-400">
                {Math.round(day.minTemp)}°
              </span>
            </div>
            {day.precip > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-500">
                <CloudRain className="w-3 h-3" />
                <span>{day.precip}mm</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;

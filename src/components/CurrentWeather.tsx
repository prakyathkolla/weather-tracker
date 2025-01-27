import { WeatherData } from "@/utils/weatherService";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { WeatherAnimation } from "./WeatherAnimation";

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'C' | 'F';
  onUnitToggle: () => void;
}

export const CurrentWeather = ({ data, unit, onUnitToggle }: CurrentWeatherProps) => {
  return (
    <>
      <WeatherAnimation condition={data.current.condition.text} />
      <div className="w-full bg-white/10 backdrop-blur-md rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <h1 className="text-2xl font-bold">{data.location.name}</h1>
            </div>
            <p className="text-sm text-gray-300">{data.location.region}, {data.location.country}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onUnitToggle}
            className="bg-white/10 hover:bg-white/20"
          >
            °{unit}
          </Button>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center">
            <img
              src={data.current.condition.icon}
              alt={data.current.condition.text}
              className="w-20 h-20"
            />
            <div className="ml-4">
              <span className="text-5xl font-bold">
                {unit === 'C'
                  ? `${Math.round(data.current.temp_c)}°C`
                  : `${Math.round(data.current.temp_f)}°F`}
              </span>
              <p className="text-lg">{data.current.condition.text}</p>
            </div>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <p className="text-sm">Humidity: {data.current.humidity}%</p>
            <p className="text-sm">Wind: {Math.round(data.current.wind_kph)} km/h</p>
          </div>
        </div>
      </div>
    </>
  );
};
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentLocation, getWeatherData, type WeatherData } from "@/utils/weatherService";
import { CurrentWeather } from "@/components/CurrentWeather";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast";
import { LocationSearch } from "@/components/LocationSearch";

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWeatherData = async (location: string) => {
    try {
      setLoading(true);
      const data = await getWeatherData(location);
      setWeatherData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const position = await getCurrentLocation();
      const location = `${position.coords.latitude},${position.coords.longitude}`;
      fetchWeatherData(location);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get your location. Please check your browser settings.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading weather data...</div>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <LocationSearch
          onSearch={fetchWeatherData}
          onUseCurrentLocation={handleUseCurrentLocation}
        />
        
        <CurrentWeather
          data={weatherData}
          unit={unit}
          onUnitToggle={() => setUnit(unit === 'C' ? 'F' : 'C')}
        />
        
        <HourlyForecast
          forecast={weatherData.forecast.forecastday[0].hour}
          unit={unit}
        />
        
        <DailyForecast
          forecast={weatherData.forecast.forecastday}
          unit={unit}
        />
      </div>
    </div>
  );
};

export default Index;
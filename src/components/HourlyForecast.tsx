import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { WeatherData } from "@/utils/weatherService";

interface HourlyForecastProps {
  forecast: WeatherData['forecast']['forecastday'][0]['hour'];
  unit: 'C' | 'F';
}

export const HourlyForecast = ({ forecast, unit }: HourlyForecastProps) => {
  const [scrollPosition, setScrollPosition] = useState([0]);
  const containerRef = useState<HTMLDivElement | null>(null);

  const handleSliderChange = (value: number[]) => {
    setScrollPosition(value);
    const scrollContainer = document.querySelector('.hourly-scroll-container');
    if (scrollContainer) {
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const newPosition = (maxScroll * value[0]) / 100;
      scrollContainer.scrollLeft = newPosition;
    }
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">24 Hour Forecast</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-4 p-4 hourly-scroll-container">
          {forecast.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-white/5 rounded-lg min-w-[100px]"
            >
              <span className="text-sm">
                {new Date(hour.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <img
                src={hour.condition.icon}
                alt={hour.condition.text}
                className="w-10 h-10 my-2"
              />
              <span className="text-lg font-semibold">
                {unit === 'C' ? `${Math.round(hour.temp_c)}°C` : `${Math.round(hour.temp_f)}°F`}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-4 px-4">
        <Slider
          value={scrollPosition}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
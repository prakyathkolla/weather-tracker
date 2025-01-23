import { useState, useRef, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { WeatherData } from "@/utils/weatherService";

interface HourlyForecastProps {
  forecast: WeatherData['forecast']['forecastday'][0]['hour'];
  unit: 'C' | 'F';
}

export const HourlyForecast = ({ forecast, unit }: HourlyForecastProps) => {
  const [scrollPosition, setScrollPosition] = useState([0]);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);

  const handleSliderChange = (value: number[]) => {
    if (!scrollViewportRef.current) return;
    
    isUserScrolling.current = true;
    setScrollPosition(value);
    
    const viewport = scrollViewportRef.current;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const newPosition = (maxScroll * value[0]) / 100;
    viewport.scrollLeft = newPosition;
    
    setTimeout(() => {
      isUserScrolling.current = false;
    }, 100);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isUserScrolling.current) return;
    
    const viewport = event.currentTarget;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const currentScroll = viewport.scrollLeft;
    const newPosition = (currentScroll / maxScroll) * 100;
    
    setScrollPosition([newPosition]);
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">24 Hour Forecast</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div 
          ref={scrollViewportRef}
          onScroll={handleScroll}
          className="flex space-x-4 p-4"
        >
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
        <ScrollBar orientation="horizontal" />
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
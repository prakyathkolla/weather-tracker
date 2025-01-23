import { WeatherData } from "@/utils/weatherService";

interface DailyForecastProps {
  forecast: WeatherData['forecast']['forecastday'];
  unit: 'C' | 'F';
}

export const DailyForecast = ({ forecast, unit }: DailyForecastProps) => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-md rounded-lg p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">10 Day Forecast</h2>
      <div className="space-y-2">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
          >
            <span className="text-sm">
              {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long' })}
            </span>
            <div className="flex items-center space-x-4">
              <img
                src={day.day.condition.icon}
                alt={day.day.condition.text}
                className="w-8 h-8"
              />
              <div className="flex space-x-2">
                <span className="text-sm font-semibold">
                  {unit === 'C'
                    ? `${Math.round(day.day.maxtemp_c)}°`
                    : `${Math.round(day.day.maxtemp_f)}°`}
                </span>
                <span className="text-sm text-gray-400">
                  {unit === 'C'
                    ? `${Math.round(day.day.mintemp_c)}°`
                    : `${Math.round(day.day.mintemp_f)}°`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
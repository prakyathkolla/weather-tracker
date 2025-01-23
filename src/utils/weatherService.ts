import axios from 'axios';

const WEATHER_API_URL = 'https://weatherapi-com.p.rapidapi.com';

const weatherApi = axios.create({
  baseURL: WEATHER_API_URL,
  headers: {
    'X-RapidAPI-Key': 'YOUR-API-KEY',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
  }
});

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        condition: {
          text: string;
          icon: string;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        temp_f: number;
        condition: {
          text: string;
          icon: string;
        };
      }>;
    }>;
  };
}

export const getWeatherData = async (location: string): Promise<WeatherData> => {
  try {
    const response = await weatherApi.get('/forecast.json', {
      params: {
        q: location,
        days: 10
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};
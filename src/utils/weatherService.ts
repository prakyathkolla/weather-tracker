import axios from 'axios';
import { supabase } from "@/integrations/supabase/client";

const WEATHER_API_URL = 'https://weatherapi-com.p.rapidapi.com';

const getWeatherApi = async () => {
  try {
    console.log('Fetching RapidAPI key from Supabase...');
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { name: 'RAPIDAPI_KEY' }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Failed to fetch API key: ${error.message}`);
    }
    
    if (!data?.RAPIDAPI_KEY) {
      console.error('No API key returned from Supabase');
      throw new Error('No API key returned from Supabase');
    }

    console.log('Successfully retrieved RapidAPI key');
    
    return axios.create({
      baseURL: WEATHER_API_URL,
      headers: {
        'X-RapidAPI-Key': data.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    });
  } catch (error) {
    console.error('Error in getWeatherApi:', error);
    throw error;
  }
};

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
    const weatherApi = await getWeatherApi();
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

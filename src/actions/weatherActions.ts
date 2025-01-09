// actions/fetchWeatherAction.ts
import axiosInstance from '@/lib/axios';
import {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  WeatherData,
  City,
} from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
interface ApiResponse {
  list: Array<{
    name: string;
    sys: { country: string };
    coord: { lat: number; lon: number };
  }>;
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    const [currentWeather, forecast, airPollution] = await Promise.all([
      // Current weather
      axiosInstance.get<CurrentWeatherResponse>(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY,
        },
      }),
      // Forecast
      axiosInstance.get<ForecastResponse>(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY,
        },
      }),
      // Air pollution
      axiosInstance.get<AirPollutionResponse>(`${BASE_URL}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
        },
      }),
    ]);

    return {
      currentWeather: currentWeather.data,
      forecast: forecast.data,
      airPollution: airPollution.data,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}

export async function searchCities(query: string): Promise<City[]> {
  try {
    const response = await axiosInstance.get<ApiResponse>(`${BASE_URL}/find`, {
      params: {
        q: query,
        type: 'like',
        sort: 'population',
        cnt: 5,
        appid: API_KEY,
      },
    });

    return response.data.list.map((city) => ({
      name: city.name,
      country: city.sys.country,
      lat: city.coord.lat,
      lon: city.coord.lon,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    throw new Error('Failed to search cities');
  }
}

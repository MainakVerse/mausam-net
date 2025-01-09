// types/weather.ts

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  '1h'?: number;
  '3h'?: number;
}

export interface Snow {
  '1h'?: number;
  '3h'?: number;
}

export interface Sys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  rain?: Rain;
  snow?: Snow;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  snow?: Snow;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface AirPollutionData {
  dt: number;
  main: {
    aqi: number;
  };
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

export interface AirPollutionResponse {
  coord: number[];
  list: AirPollutionData[];
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  currentWeather: CurrentWeatherResponse;
  forecast: ForecastResponse;
  airPollution: AirPollutionResponse;
}

export interface TemperatureMetric {
  temp: number; // in Celsius
  feels_like: number; // in Celsius
  temp_min: number; // in Celsius
  temp_max: number; // in Celsius
}

export interface TemperatureImperial {
  temp: number; // in Fahrenheit
  feels_like: number; // in Fahrenheit
  temp_min: number; // in Fahrenheit
  temp_max: number; // in Fahrenheit
}

export interface WindMetric {
  speed: number; // in meters/sec
  deg: number;
  gust?: number; // in meters/sec
}

export interface WindImperial {
  speed: number; // in miles/hour
  deg: number;
  gust?: number; // in miles/hour
}

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CloudRain, Wind, Droplets, Gauge } from 'lucide-react';
import { CurrentWeatherResponse, ForecastResponse } from '@/types/weather';
import { ClearSky, Cloudy, Rainy, Sunny } from '@/public/svgs/weather';

interface CurrentWeatherCardProps {
  currentWeather: CurrentWeatherResponse;
  forecast: ForecastResponse;
  unit: 'metric' | 'imperial';
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  currentWeather,
  forecast,
  unit,
}) => {
  const getWeatherIcon = (main: string) => {
    switch (main.toLowerCase()) {
      case 'clear':
        return (
          <Sunny className="w-32 h-32 text-yellow-500 transition-transform hover:scale-105" />
        );
      case 'clouds':
        return (
          <Cloudy className="w-32 h-32 text-gray-500 transition-transform hover:scale-105" />
        );
      case 'rain':
        return (
          <Rainy className="w-32 h-32 text-blue-500 transition-transform hover:scale-105" />
        );
      default:
        return (
          <ClearSky className="w-32 h-32 text-yellow-400 transition-transform hover:scale-105" />
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Location and Time Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
              {currentWeather.name}, {currentWeather.sys.country}
            </h2>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Today,{' '}
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <div className="transform transition-transform hover:scale-105 duration-300">
            {getWeatherIcon(currentWeather.weather[0].main)}
          </div>
        </div>

        {/* Temperature Section */}
        <div className="mb-10">
          <div className="flex items-end">
            <p className="text-8xl font-bold tracking-tighter">
              {Math.round(currentWeather.main.temp)}°
            </p>
            <p className="text-2xl font-bold mb-2 ml-1">
              {unit === 'metric' ? 'C' : 'F'}
            </p>
          </div>
          <div>
            <p className="text-xl font-semibold text-muted-foreground">
              {currentWeather.weather[0].main}
            </p>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Feels like {Math.round(currentWeather.main.feels_like)}°
              {unit === 'metric' ? 'C' : 'F'}
            </p>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex items-center ">
            <CloudRain className="w-5 h-5 mr-2 aspect-square text-blue-400" />
            <span className="text-xs sm:text-sm  md:text-md text-nowrap">
              Rain Chance: {Math.round(forecast.list[0].pop * 100)}%
            </span>
          </div>
          <div className="flex items-center">
            <Wind className="w-5 h-5 mr-2 aspect-square text-blue-400" />
            <span className="text-xs sm:text-sm  md:text-md text-nowrap">
              Wind Speed: {Math.round(currentWeather.wind.speed)}{' '}
              {unit === 'metric' ? 'km/h' : 'mph'}
            </span>
          </div>
          <div className="flex items-center">
            <Droplets className="w-5 h-5 mr-2 aspect-square text-blue-400" />
            <span className="text-xs sm:text-sm  md:text-md text-nowrap">
              Humidity: {currentWeather.main.humidity}%
            </span>
          </div>
          <div className="flex items-center">
            <Gauge className="w-5 h-5 mr-2 aspect-square text-red-400" />
            <span className="text-xs sm:text-sm  md:text-md text-nowrap">
              Pressure: {currentWeather.main.pressure} mb
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeatherCard;

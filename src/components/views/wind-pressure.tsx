import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, Compass, Gauge, Waves, Mountain } from 'lucide-react';
import { CurrentWeatherResponse } from '@/types/weather';

interface WindPressureCardProps {
  currentWeather: CurrentWeatherResponse;
  unit: 'metric' | 'imperial';
}

const WindPressureCard: React.FC<WindPressureCardProps> = ({ currentWeather, unit }) => {
  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <Card className="w-full mx-auto">
      <CardContent className="p-6">
        <h2 className="text-md font-semibold mb-4 flex items-center">
          <Wind className="w-6 h-6 mr-2" /> Wind & Pressure
        </h2>
        <div className="grid grid-cols-2 gap-0 md:gap-6">
          <div className="text-nowrap">
            <h3 className="text-sm sm:text-md font-semibold mb-2">Wind</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <Wind className="w-5 h-5 mr-2 aspect-square text-blue-400 dark:text-blue-300" />
                <span className="text-xs sm:text-sm  md:text-md text-nowrap">
                  {Math.round(currentWeather.wind.speed)}{' '}
                  {unit === 'metric' ? 'km/h' : 'mph'}
                </span>
              </p>
              <p className="flex items-center">
                <Compass className="w-5 h-5 mr-2 aspect-square text-gray-400 dark:text-gray-300" />
                <span className="text-xs sm:text-sm  md:text-md text-nowrap">
                  {getWindDirection(currentWeather.wind.deg)} ({currentWeather.wind.deg}°)
                </span>
              </p>
              {currentWeather.wind.gust && (
                <p className="flex items-center">
                  <Wind className="w-5 h-5 mr-2 aspect-square text-blue-400 dark:text-blue-300" />
                  <span className="text-xs sm:text-sm  md:text-md text-nowrap">
                    Gust: {Math.round(currentWeather.wind.gust)}{' '}
                    {unit === 'metric' ? 'km/h' : 'mph'}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div className="text-nowrap">
            <h3 className="text-sm sm:text-md font-semibold mb-2">Pressure</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <Gauge className="w-5 h-5 mr-2 aspect-square text-red-400 dark:text-red-300" />
                <span className="text-xs sm:text-sm  md:text-md text-nowrap">
                  {currentWeather.main.pressure} hPa
                </span>
              </p>
              {currentWeather.main.sea_level && (
                <p className="flex items-center">
                  <Waves className="w-5 h-5 mr-2 aspect-square text-blue-400 dark:text-blue-300" />
                  <span className="text-xs sm:text-sm  md:text-md text-nowrap">
                    Sea Level: {currentWeather.main.sea_level} hPa
                  </span>
                </p>
              )}
              {currentWeather.main.grnd_level && (
                <p className="flex items-center">
                  <Mountain className="w-5 h-5 mr-2 aspect-square text-green-400 dark:text-green-300" />
                  <span className="text-xs sm:text-sm  md:text-md text-nowrap">
                    Ground Level: {currentWeather.main.grnd_level} hPa
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WindPressureCard;

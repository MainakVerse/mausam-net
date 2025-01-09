import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CloudSnow } from 'lucide-react';
import { ClearSky, Cloudy, Rainy, Sunny } from '@/public/svgs/weather';

interface HourlyForecast {
  time: string;
  temperature: number;
  weather: string;
}

interface HourlyForecastProps {
  forecast: HourlyForecast[];
  unit: 'metric' | 'imperial';
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast, unit }) => {
  const getWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case 'clear':
        return <Sunny className="w-6 h-6" />;
      case 'clouds':
        return <Cloudy className="w-6 h-6" />;
      case 'rain':
        return <Rainy className="w-6 h-6" />;
      case 'snow':
        return <CloudSnow className="w-6 h-6" />;
      default:
        return <ClearSky className="w-6 h-6" />;
    }
  };

  return (
    <Card className="w-full h-full">
      <CardContent className="p-4 flex flex-col gap-6">
        <h2 className="text-md font-semibold flex items-center">
          <Clock className="w-5 h-5 mr-2" /> Hourly Forecast
        </h2>
        <div className="flex items-center justify-evenly w-full h-full">
          {forecast.slice(0, 5).map((hour, index) => (
            <div key={index} className="text-center flex flex-col items-center gap-2">
              <p className="text-xs sm:text-sm font-medium">{hour.time}</p>
              {getWeatherIcon(hour.weather)}
              <p className="mt-1 text-xs sm:text-sm">
                {Math.round(hour.temperature)}°{unit === 'metric' ? 'C' : 'F'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyForecast;

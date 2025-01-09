import React, { useState } from 'react';
import { WeatherData } from '@/types/weather';
import DayDuration from '@/components/views/day-duration';
import AirPollutionChart from '@/components/views/air-pollution';
import TemperatureHumidityChart from '@/components/views/temp-humidity';
import ClientMap from '@/components/views/client-map';
import CurrentWeatherCard from '@/components/views/current-weather';
import WindPressureCard from '@/components/views/wind-pressure';
import HourlyForecast from '@/components/views/hourly-forecast';

interface WeatherDashboardProps {
  weatherData: WeatherData;
  initialUnit?: 'metric' | 'imperial';
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  weatherData,
  initialUnit = 'metric',
}) => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>(initialUnit);
  const { currentWeather, forecast, airPollution } = weatherData;

  const convertTemp = (temp: number) =>
    unit === 'imperial' ? (temp * 9) / 5 + 32 : temp;

  const convertSpeed = (speed: number) =>
    unit === 'imperial' ? speed * 2.237 : speed;

  const convertPressure = (pressure: number) =>
    unit === 'imperial' ? pressure * 0.02953 : pressure;

  const hourlyForecastData = forecast.list.slice(0, 5).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    temperature: Math.round(convertTemp(item.main.temp)),
    weather: item.weather[0].main,
  }));

  const convertedWeatherData = {
    ...weatherData,
    currentWeather: {
      ...currentWeather,
      main: {
        ...currentWeather.main,
        temp: convertTemp(currentWeather.main.temp),
        feels_like: convertTemp(currentWeather.main.feels_like),
        pressure: convertPressure(currentWeather.main.pressure),
      },
      wind: {
        ...currentWeather.wind,
        speed: convertSpeed(currentWeather.wind.speed),
      },
    },
    forecast: {
      ...forecast,
      list: forecast.list.map((item) => ({
        ...item,
        main: {
          ...item.main,
          temp: convertTemp(item.main.temp),
          feels_like: convertTemp(item.main.feels_like),
          pressure: convertPressure(item.main.pressure),
        },
        wind: {
          ...item.wind,
          speed: convertSpeed(item.wind.speed),
        },
      })),
    },
  };

  return (
    <div className="bg-inherit min-h-screen flex flex-col">
      <div className="p-4 flex justify-end">
        <div className="relative">
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'metric' | 'imperial')}
            className="w-64 px-4 py-2 text-gray-700 bg-white rounded-lg shadow-md
                     appearance-none cursor-pointer
                     border border-gray-200 hover:border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition-colors duration-200"
          >
            <option value="metric">🌡️ Metric (°C, m/s)</option>
            <option value="imperial">🌡️ Imperial (°F, mph)</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <CurrentWeatherCard
          currentWeather={convertedWeatherData.currentWeather}
          forecast={convertedWeatherData.forecast}
          unit={unit}
        />
        <div className="grid grid-rows-2 gap-4">
          <WindPressureCard
            currentWeather={convertedWeatherData.currentWeather}
            unit={unit}
          />
          <HourlyForecast forecast={hourlyForecastData} unit={unit} />
        </div>
        <AirPollutionChart data={airPollution} />
        <TemperatureHumidityChart data={convertedWeatherData.forecast} unit={unit} />
        <DayDuration data={currentWeather} />
        <ClientMap
          center={[currentWeather.coord.lat, currentWeather.coord.lon]}
          zoom={10}
          markerPosition={[currentWeather.coord.lat, currentWeather.coord.lon]}
          popupContent={`${currentWeather.name}, ${currentWeather.sys.country}`}
        />
      </div>
    </div>
  );
};

export default WeatherDashboard;

'use client';

import { useEffect, useState } from 'react';
import { WeatherData } from '@/types/weather';
import { fetchWeatherData } from '@/actions/weatherActions';

export const useWeatherData = (
  coordinates: { lat: number; lon: number },
  locationLoading: boolean,
  hasInitialLoad: boolean,
) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!coordinates || (locationLoading && !hasInitialLoad)) return;

    const controller = new AbortController();
    setIsLoading(true);

    fetchWeatherData(coordinates.lat, coordinates.lon)
      .then((data) => {
        if (!controller.signal.aborted) {
          setWeatherData(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
          setWeatherData(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [coordinates, locationLoading, hasInitialLoad]);

  return { weatherData, error, isLoading, setError };
};

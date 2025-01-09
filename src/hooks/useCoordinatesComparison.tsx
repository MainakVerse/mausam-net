// Custom hooks
import { useCallback } from 'react';

export const useCoordinatesComparison = () => {
  return useCallback(
    (prev: { lat: number; lon: number }, next: { lat: number; lon: number }): boolean => {
      return (
        Math.abs(prev.lat - next.lat) < 0.000001 &&
        Math.abs(prev.lon - next.lon) < 0.000001
      );
    },
    [],
  );
};

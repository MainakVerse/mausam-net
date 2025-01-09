'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_COORDINATES } from '@/constants';

interface GeolocationState {
  latitude: number;
  longitude: number;
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
}

interface GeolocationOptions {
  timeout?: number;
  enabled?: boolean;
}

/**
 * A custom hook that provides geolocation functionality with real-time updates
 * @param options Configuration options for the geolocation hook
 * @returns Current geolocation state including coordinates, loading status, and errors
 */
export function useGeolocation(options: GeolocationOptions = {}) {
  // Initialize state with default coordinates and loading status
  const [state, setState] = useState<GeolocationState>(() => ({
    latitude: DEFAULT_COORDINATES.lat,
    longitude: DEFAULT_COORDINATES.lon,
    loading: true,
    error: null,
    hasPermission: false,
  }));

  // Refs to store watch ID and component mount status
  const watchId = useRef<number | null>(null);
  const isMounted = useRef(true);

  // Reset isMounted on each render to prevent race conditions
  isMounted.current = true;

  // Handler for successful geolocation updates
  const handleSuccess = useCallback((position: GeolocationPosition) => {
    if (!isMounted.current) return;

    const { latitude, longitude } = position.coords;
    setState({
      latitude,
      longitude,
      loading: false,
      error: null,
      hasPermission: true,
    });
  }, []);

  // Handler for geolocation errors with descriptive messages
  const handleError = useCallback((error: GeolocationPositionError) => {
    if (!isMounted.current) return;

    let errorMessage = 'Unable to retrieve your location';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
      default:
        errorMessage = `Unknown geolocation error: ${error.code}`;
    }

    setState((prev) => ({
      ...prev,
      loading: false,
      error: errorMessage,
      hasPermission: false,
    }));
  }, []);

  // Main effect to handle geolocation setup and cleanup
  useEffect(() => {
    // Clear existing watch if options change
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    // Handle disabled state
    if (!options.enabled) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    // Check browser support for geolocation
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
        hasPermission: false,
      }));
      return;
    }

    // Configure geolocation options
    const geolocationOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: options.timeout ?? 5000,
      maximumAge: 0,
    };

    // Set loading state while fetching position
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        geolocationOptions,
      );

      // Set up continuous position watching
      watchId.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geolocationOptions,
      );
    } catch (error) {
      console.error('Error setting up geolocation:', error);
    }

    // Cleanup function to clear watch on unmount or options change
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [options.enabled, options.timeout, handleSuccess, handleError]);

  // Effect to handle component unmounting
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return state;
}

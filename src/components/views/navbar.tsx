'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/theme-toggle';
import { Search, MapPin } from 'lucide-react';
import { City } from '@/types/weather';
import { useDebounce } from '@/hooks/useDebounce';
import LogoSvg from '@/public/svgs/logo';
import { searchCities } from '@/actions/weatherActions';
import { useRouter } from 'next/navigation';

interface NavBarProps {
  onLocationChange: (lat: number, lon: number) => void;
  onUseCurrentLocation: () => void;
  isUsingCurrentLocation: boolean;
}

// Memoize the logo component since it doesn't change
const Logo = memo(({ onClick }: { onClick: () => void }) => (
  <div
    className="flex-shrink-0 flex flex-row items-center justify-between gap-2 cursor-pointer hover:opacity-80 transition-opacity mr-4 md:mr-0"
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    aria-label="logo"
  >
    <LogoSvg className="w-8 h-8" fill="currentColor" />
    <span className="text-md md:text-2xl font-bold md:font-bold ">MausamNet</span>
  </div>
));
Logo.displayName = 'Logo';

// Memoize the search suggestions list
const SearchSuggestions = memo(
  ({
    suggestions,
    selectedIndex,
    onSelect,
    onMouseEnter,
  }: {
    suggestions: City[];
    selectedIndex: number;
    onSelect: (city: City) => void;
    onMouseEnter: (index: number) => void;
  }) => (
    <div className="absolute left-0 right-0 top-full mt-1">
      <ul
        className="w-full bg-background shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        role="listbox"
        aria-label="City suggestions"
        tabIndex={-1}
      >
        {suggestions.map((city, index) => (
          <li
            key={`${city.name}-${city.lat}-${city.lon}`}
            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
              index === selectedIndex ? 'bg-primary/10' : ''
            }`}
            onClick={() => onSelect(city)}
            onMouseEnter={() => onMouseEnter(index)}
            role="option"
            aria-selected={index === selectedIndex}
            tabIndex={-1}
            id={`city-option-${index}`}
          >
            <span className="flex items-center">
              <span className="ml-3 block truncate">
                {city.name}, {city.country}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  ),
);
SearchSuggestions.displayName = 'SearchSuggestions';

const NavBar = ({
  onLocationChange,
  onUseCurrentLocation,
  isUsingCurrentLocation,
}: NavBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Memoize handlers
  const handleLogoClick = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleCitySelect = useCallback(
    async (city: City) => {
      try {
        onLocationChange(city.lat, city.lon);
        setSearchQuery(`${city.name}, ${city.country}`);
        setIsOpen(false);
        setSelectedIndex(-1);
        setError(null);
        inputRef.current?.blur();
      } catch (err) {
        console.error('Error selecting city:', err);
        setError('Failed to fetch weather data. Please try again.');
      }
    },
    [onLocationChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < citySuggestions.length - 1 ? prev + 1 : prev,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleCitySelect(citySuggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [citySuggestions, selectedIndex, handleCitySelect],
  );

  // Clear search when switching to current location
  useEffect(() => {
    if (isUsingCurrentLocation) {
      setSearchQuery('');
      setCitySuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [isUsingCurrentLocation]);

  // Fetch cities effect
  useEffect(() => {
    let isMounted = true;

    const fetchCities = async () => {
      if (debouncedSearchQuery.length > 2) {
        setIsSearching(true);
        try {
          const cities = await searchCities(debouncedSearchQuery);
          if (isMounted) {
            setCitySuggestions(cities);
            setIsOpen(true);
            setError(null);
          }
        } catch (err) {
          if (isMounted) {
            console.error('Error fetching cities:', err);
            setError('Failed to fetch city suggestions. Please try again.');
            setIsOpen(false);
          }
        } finally {
          if (isMounted) {
            setIsSearching(false);
          }
        }
      } else {
        setIsOpen(false);
        setCitySuggestions([]);
      }
    };

    fetchCities();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchQuery]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className="bg-background sticky top-0 z-50 border-b"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo onClick={handleLogoClick} />

          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs" ref={dropdownRef}>
              <div className="relative">
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <label htmlFor="city-search" className="sr-only">
                      Search for a city
                    </label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search
                        className="h-5 w-5 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <Input
                      ref={inputRef}
                      id="city-search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-input rounded-md leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Search for a city..."
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsOpen(true)}
                      onKeyDown={handleKeyDown}
                      aria-expanded={isOpen}
                      aria-autocomplete="list"
                      aria-controls="city-suggestions"
                      aria-activedescendant={
                        selectedIndex >= 0 ? `city-option-${selectedIndex}` : undefined
                      }
                      aria-busy={isSearching}
                      aria-label="Search for a city"
                    />
                  </div>
                  <button
                    onClick={onUseCurrentLocation}
                    className={`p-2 rounded-md hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary ${
                      isUsingCurrentLocation ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    aria-label={`${isUsingCurrentLocation ? 'Using current location' : 'Use current location'}`}
                    aria-pressed={isUsingCurrentLocation}
                  >
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Position dropdown absolutely relative to search container */}
                {isOpen && citySuggestions.length > 0 && (
                  <div className="relative">
                    <SearchSuggestions
                      suggestions={citySuggestions}
                      selectedIndex={selectedIndex}
                      onSelect={handleCitySelect}
                      onMouseEnter={setSelectedIndex}
                    />
                  </div>
                )}

                {error && (
                  <div
                    className="absolute left-0 right-0 top-full mt-1 text-red-500 bg-background p-2 rounded-md shadow-lg"
                    role="alert"
                    aria-live="polite"
                  >
                    {error}
                  </div>
                )}

                {isSearching && (
                  <div
                    className="absolute left-0 right-0 top-full mt-1 text-muted-foreground bg-background p-2 rounded-md shadow-lg"
                    aria-live="polite"
                  >
                    Searching...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default memo(NavBar);

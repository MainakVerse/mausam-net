import { useEffect, useState } from 'react';

export const useDebounceWithComparison = <T,>(
  value: T,
  delay: number,
  compareFunc: (prev: T, next: T) => boolean,
): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!compareFunc(debouncedValue, value)) {
        setDebouncedValue(value);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, compareFunc, debouncedValue]);

  return debouncedValue;
};

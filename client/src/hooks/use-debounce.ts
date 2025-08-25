import { useRef } from 'react';

export const useDebounce = (delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return (callback: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  };
}; 
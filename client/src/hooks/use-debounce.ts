import { useRef, useCallback } from "react";

export const useDebounce = (delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const callbackRef = useRef<(() => void) | undefined>(undefined);

  const debounced = useCallback(
    (callback: () => void) => {
      callbackRef.current = callback;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (callbackRef.current) {
          callbackRef.current();
          callbackRef.current = undefined;
        }
      }, delay);
    },
    [delay],
  );

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (callbackRef.current) {
      callbackRef.current();
      callbackRef.current = undefined;
    }
  }, []);

  return { debounced, flush };
};

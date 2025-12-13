import { useRef, useCallback } from "react";

export const useThrottle = (delay: number) => {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const throttled = useCallback(
    (callback: () => void) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunRef.current;

      if (timeSinceLastRun >= delay) {
        callback();
        lastRunRef.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          callback();
          lastRunRef.current = Date.now();
        }, delay - timeSinceLastRun);
      }
    },
    [delay],
  );

  return { throttled };
};

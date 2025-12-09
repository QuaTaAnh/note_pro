import { useRef, useCallback } from "react";

export const useDebounce = (delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const callbackRef = useRef<(() => void) | undefined>(undefined);
  const pendingChangesRef = useRef<Map<string, () => void>>(new Map());
  const isFlushingRef = useRef(false);

  const debounced = useCallback(
    (callback: () => void, key?: string) => {
      if (key) {
        pendingChangesRef.current.set(key, callback);
      }
      
      callbackRef.current = callback;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (!isFlushingRef.current && callbackRef.current) {
          isFlushingRef.current = true;
          try {
            callbackRef.current();
            if (key) {
              pendingChangesRef.current.delete(key);
            }
          } finally {
            isFlushingRef.current = false;
            callbackRef.current = undefined;
          }
        }
      }, delay);
    },
    [delay],
  );

  const flush = useCallback(() => {
    if (isFlushingRef.current) return;
    
    isFlushingRef.current = true;
    
    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      
      // Execute all pending changes in order
      const pendingCallbacks = Array.from(pendingChangesRef.current.values());
      pendingChangesRef.current.clear();
      
      if (callbackRef.current) {
        callbackRef.current();
        callbackRef.current = undefined;
      }
      
      // Execute any remaining queued callbacks
      pendingCallbacks.forEach(cb => {
        try {
          cb();
        } catch (error) {
          console.error("Error executing pending callback:", error);
        }
      });
    } finally {
      isFlushingRef.current = false;
    }
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    callbackRef.current = undefined;
    pendingChangesRef.current.clear();
  }, []);

  return { debounced, flush, cancel };
};

import { useRef, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';

export const useDebounce = (delay: number) => {
    const pendingChangesRef = useRef<Map<string, () => void>>(new Map());
    const isFlushingRef = useRef(false);

    const debouncedFn = useMemo(
        () =>
            debounce((callback: () => void) => {
                if (!isFlushingRef.current) {
                    isFlushingRef.current = true;
                    try {
                        callback();
                    } finally {
                        isFlushingRef.current = false;
                    }
                }
            }, delay),
        [delay]
    );

    const debounced = useCallback(
        (callback: () => void, key?: string) => {
            if (key) {
                pendingChangesRef.current.set(key, callback);
            }
            debouncedFn(callback);
        },
        [debouncedFn]
    );

    const flush = useCallback(async () => {
        if (isFlushingRef.current) return;

        isFlushingRef.current = true;

        try {
            debouncedFn.flush();

            // Execute all pending changes and wait for them to complete
            const pendingCallbacks = Array.from(
                pendingChangesRef.current.values()
            );
            pendingChangesRef.current.clear();

            // Wait for all async callbacks to complete
            await Promise.all(
                pendingCallbacks.map(async (cb) => {
                    try {
                        await cb();
                    } catch (error) {
                        console.error(
                            'Error executing pending callback:',
                            error
                        );
                    }
                })
            );
        } finally {
            isFlushingRef.current = false;
        }
    }, [debouncedFn]);

    const cancel = useCallback(() => {
        debouncedFn.cancel();
        pendingChangesRef.current.clear();
    }, [debouncedFn]);

    return { debounced, flush, cancel };
};

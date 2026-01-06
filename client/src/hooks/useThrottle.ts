import { useCallback, useMemo } from 'react';
import throttle from 'lodash/throttle';

export const useThrottle = (delay: number) => {
    const throttledFn = useMemo(
        () =>
            throttle((callback: () => void) => {
                callback();
            }, delay),
        [delay]
    );

    const throttled = useCallback(
        (callback: () => void) => {
            throttledFn(callback);
        },
        [throttledFn]
    );

    return { throttled };
};
